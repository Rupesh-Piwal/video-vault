import { buildShareUrl, isExpired } from "@/lib/dayUtils";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function requireUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const userId = requireUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("share_links")
      .select(
        "id, video_id, hashed_token, visibility, expiry, revoked, last_viewed_at, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (data ?? []).map((r: any) => ({
      id: r.id,
      video_id: r.video_id,
      url: buildShareUrl(r.hashed_token),
      visibility: r.visibility,
      expiry: r.expiry,
      status: r.revoked
        ? "Revoked"
        : isExpired(r.expiry)
        ? "Expired"
        : "Active",
      last_viewed_at: r.last_viewed_at,
      created_at: r.created_at,
    }));

    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("Share links fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
