import { isExpired } from "@/lib/dayUtils";
import { getSignedS3Url } from "@/lib/s3";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const rawToken = params.token;
    const email = req.nextUrl.searchParams.get("email")?.toLowerCase() ?? null;

    const supabase = await createClient();

    // ✅ Hash incoming token before lookup
    const crypto = await import("crypto");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // 1. Fetch share link
    const { data: link, error } = await supabase
      .from("share_links")
      .select("id, video_id, visibility, expiry, revoked")
      .eq("hashed_token", hashedToken)
      .maybeSingle();

    if (error) throw error;
    if (!link)
      return NextResponse.json({ error: "not_found" }, { status: 404 });

    if (link.revoked)
      return NextResponse.json({ error: "revoked" }, { status: 403 });

    // 2. Expiry check
    if (isExpired(link.expiry)) {
      return NextResponse.json({ error: "expired" }, { status: 410 });
    }

    // 3. Visibility check
    if (link.visibility === "PRIVATE") {
      if (!email) {
        return NextResponse.json({ error: "email_required" }, { status: 403 });
      }

      const { data: wl, error: wlError } = await supabase
        .from("share_link_whitelist")
        .select("email")
        .eq("share_link_id", link.id)
        .eq("email", email)
        .maybeSingle();

      if (wlError) throw wlError;
      if (!wl)
        return NextResponse.json({ error: "not_whitelisted" }, { status: 403 });
    }

    // 4. Update last viewed
    await supabase
      .from("share_links")
      .update({ last_viewed_at: new Date().toISOString() })
      .eq("id", link.id);

    // 5. Fetch video
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id, original_filename, storage_key, mime_type, size_bytes")
      .eq("id", link.video_id)
      .maybeSingle();

    if (videoError) throw videoError;
    if (!video)
      return NextResponse.json({ error: "video_not_found" }, { status: 404 });

    // 6. Generate signed URL
    const signedUrl = await getSignedS3Url(video.storage_key);

    return NextResponse.json({
      video: { ...video, url: signedUrl },
    });
  } catch (err: any) {
    console.error("Share link error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
