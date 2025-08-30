import { NextResponse } from "../../../../client/node_modules/next/server";
import { supabase } from "../../../../server/lib/supabase";
import { videoQueue } from "@/lib/bullmq";

export async function POST(req: Request) {
  try {
    const {
      s3Key,
      originalFileName,
      sizeBytes,
      mimeType,
      userId,
      durationSeconds,
    } = await req.json();

    // Insert video record
    const { data, error } = await supabase
      .from("videos")
      .insert([
        {
          user_id: userId,
          storage_key: s3Key,
          original_file_name: originalFileName,
          size_bytes: sizeBytes,
          mime_type: mimeType,
          duration_seconds: durationSeconds,
          status: "uploaded",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Enqueue thumbnail job
    await videoQueue.add("generate-thumbnails", {
      videoId: data.id,
      s3Key,
      userId,
      durationSeconds,
    });

    return NextResponse.json({ success: true, video: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
