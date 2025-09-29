
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, fileType, fileSize } = await req.json();

    if (!fileType.startsWith("video/")) {
      return NextResponse.json(
        { error: "Only video uploads allowed" },
        { status: 400 }
      );
    }

    // ----- UNIQUE KEY PER USER -----
    const key = `uploads/${user.id}/${Date.now()}-${fileName}`;

    const { data: video, error: insertError } = await supabase
      .from("videos")
      .insert([
        {
          owner_id: user.id,
          storage_key: key,
          original_filename: fileName,
          mime_type: fileType,
          size_bytes: fileSize,
          status: "UPLOADING",
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create video record" },
        { status: 500 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ url, key, videoId: video.id });
  } catch (err) {
    console.error("Upload URL error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
