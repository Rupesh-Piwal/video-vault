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

    const validationError = validateShareLinkInput(visibility, expiryPreset);
    if (validationError) {
      return validationError;
    }

    const expiresAt = calculateExpiry(expiryPreset);

    const { token, hashed } = generateShareToken();

    const link = await createShareLinkInDb(
      supabase,
      videoId,
      user.id,
      hashed,
      visibility,
      expiresAt
    );

    // PRIVATE link handling
    if (visibility === "PRIVATE" && emails.length > 0) {
      await whitelistEmailsForPrivateLink(supabaseAdmin, link.id, emails);
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

function validateShareLinkInput(
  visibility: string,
  expiryPreset: string
): NextResponse | null {
  if (!["PUBLIC", "PRIVATE"].includes(visibility)) {
    return NextResponse.json(
      { error: "Invalid visibility" },
      { status: 400 }
    );
  }

  const validExpiryPresets = ["1h", "12h", "1d", "30d", "forever"];
  if (!validExpiryPresets.includes(expiryPreset)) {
    return NextResponse.json(
      { error: "Invalid expiry preset" },
      { status: 400 }
    );
  }

  return null;
}

function calculateExpiry(expiryPreset: string): string | null {
  const expiryMap: Record<string, number | null> = {
    "1h": 3600,
    "12h": 43200,
    "1d": 86400,
    "30d": 2592000,
    forever: null,
  };

  return expiryMap[expiryPreset] !== null
    ? new Date(Date.now() + expiryMap[expiryPreset]! * 1000).toISOString()
    : null;
}

function generateShareToken(): { token: string; hashed: string } {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashed };
}

async function createShareLinkInDb(
  supabase: any, // TODO: Replace 'any' with proper SupabaseClient type
  videoId: string,
  userId: string,
  hashedToken: string,
  visibility: string,
  expiresAt: string | null
) {
  const { data: link, error } = await supabase
    .from("share_links")
    .insert({
      video_id: videoId,
      user_id: userId,
      hashed_token: hashedToken,
      visibility: visibility,
      expiry: expiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return link;
}

async function whitelistEmailsForPrivateLink(
  supabaseAdmin: any, // TODO: Replace 'any' with proper SupabaseClient type
  shareLinkId: string,
  emails: string[]
) {
  for (const email of emails) {
    const trimmedEmail = email.trim().toLowerCase();
    await supabaseAdmin.from("share_link_whitelist").insert({
      share_link_id: shareLinkId,
      email: trimmedEmail,
    });
  }
}
