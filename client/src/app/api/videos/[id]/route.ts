import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient(); // 👈 await here

  const { error } = await supabase.from("videos").delete().eq("id", params.id);

  if (error) {
    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
