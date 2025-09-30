import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const supabase = await createClient();
  const { id } = await params;

  const { error } = await supabase.from("videos").delete().eq("id", id); 

  if (error) {
    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
