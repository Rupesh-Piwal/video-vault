import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Internal server error";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { error } = await supabase
      .from("share_links")
      .update({
        revoked: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
