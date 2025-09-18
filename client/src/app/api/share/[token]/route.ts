import { isExpired } from "@/lib/dayUtils";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const email = req.nextUrl.searchParams.get("email")?.toLowerCase() ?? null;
    const supabase = await createClient();

    const { data: link, error } = await supabase
      .from("share_links")
      .select("id, video_id, visibility, expiry")
      .eq("token", token)
      .maybeSingle();

    if (error) throw error;
    if (!link)
      return NextResponse.json({ error: "not_found" }, { status: 404 });

    if (isExpired(link.expiry)) {
      return NextResponse.json({ error: "expired" }, { status: 410 });
    }

    if (link.visibility === "PUBLIC") {
      await supabase
        .from("share_links")
        .update({ last_viewed_at: new Date().toISOString() })
        .eq("id", link.id);
    } else {
      // if (!email) {
      //   return NextResponse.json({ error: "email_required" }, { status: 403 });
      // }
      // const { data: wl } = await supabase
      //   .from("share_link_whitelist")
      //   .select("email")
      //   .eq("share_link_id", link.id)
      //   .eq("email", email)
      //   .maybeSingle();

      // if (!wl)
      //   return NextResponse.json({ error: "not_whitelisted" }, { status: 403 });
      await supabase
        .from("share_links")
        .update({ last_viewed_at: new Date().toISOString() })
        .eq("id", link.id);
    }

    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id, original_filename, storage_key") // only existing columns
      .eq("id", link.video_id)
      .maybeSingle();

    return NextResponse.json({ video });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
