import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/supabase/server";
import { createAdminClient } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Supabase clients
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();

    // Auth check (RLS-compatible)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // ✅ FIX: params must be awaited
    const { id: videoId } = await params;

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

    const expiresAt =
      expiryMap[expiryPreset] !== null
        ? new Date(Date.now() + expiryMap[expiryPreset]! * 1000).toISOString()
        : null;

    // Token generation
    const token = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    // ✅ FIX: visibility normalized for DB + RLS
    const { data: link, error } = await supabase
      .from("share_links")
      .insert({
        video_id: videoId,
        user_id: user.id,
        hashed_token: hashed,
        visibility: visibility,
        expiry: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    // PRIVATE link handling
    if (visibility === "PRIVATE" && emails.length > 0) {
      for (const email of emails) {
        const trimmedEmail = email.trim().toLowerCase();

        // ✅ FIX: use admin client to bypass RLS safely
        await supabaseAdmin.from("share_link_whitelist").insert({
          share_link_id: link.id,
          email: trimmedEmail,
        });
      }
    }

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`,
      message: "Share link created successfully",
    });
  } catch (err) {
    console.error("Share link creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
