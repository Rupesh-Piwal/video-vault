// app/api/videos/[id]/share/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/supabase/server";

function requireUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const userId = requireUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { visibility, emails = [], expiryPreset } = await req.json();

    if (!["PUBLIC", "PRIVATE"].includes(visibility)) {
      return NextResponse.json(
        { error: "Invalid visibility" },
        { status: 400 }
      );
    }

    const expiryMap: Record<string, number | null> = {
      "1h": 3600,
      "12h": 43200,
      "1d": 86400,
      "30d": 2592000,
      forever: null,
    };

    if (!(expiryPreset in expiryMap)) {
      return NextResponse.json(
        { error: "Invalid expiry preset" },
        { status: 400 }
      );
    }

    const expiresAt = expiryMap[expiryPreset]
      ? new Date(Date.now() + expiryMap[expiryPreset]! * 1000).toISOString()
      : null;

    // Generate raw + hashed token
    const token = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const { data: link, error } = await supabase
      .from("share_links")
      .insert({
        video_id: params.id,
        user_id: userId,
        hashed_token: hashed,
        visibility,
        expiry: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    if (visibility === "PRIVATE" && emails.length > 0) {
      for (const email of emails) {
        await supabase.from("share_link_whitelist").insert({
          share_link_id: link.id,
          email: email.trim().toLowerCase(),
        });

        // enqueue email job
        await fetch(`${process.env.EXPRESS_URL}/jobs/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: email, videoId: params.id, token }),
        });
      }
    }

    return NextResponse.json({ url: `${process.env.APP_URL}/share/${token}` });
  } catch (err: any) {
    console.error("Share link creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
