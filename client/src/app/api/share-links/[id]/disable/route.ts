import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function requireUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = requireUserId(req);
    if (!userId)
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    const { data: link } = await supabaseAdmin
      .from("share_links")
      .select("user_id")
      .eq("id", params.id)
      .maybeSingle();

    if (!link)
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    if (link.user_id !== userId)
      return NextResponse.json({ error: "forbidden" }, { status: 403 });

    await supabaseAdmin
      .from("share_links")
      .update({ expiry: dayjs().subtract(1, "minute").toISOString() })
      .eq("id", params.id);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
