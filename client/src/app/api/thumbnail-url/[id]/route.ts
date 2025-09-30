import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const videoId = id; 

    const keys = Array.from({ length: 4 }).map(
      (_, i) => `thumbnails/${videoId}/thumb-${i + 1}.jpg`
    );

    const urls = await Promise.all(
      keys.map(async (key) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        });
        return getSignedUrl(s3, command, { expiresIn: 900 });
      })
    );

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Thumbnail signed URL error:", err);
    return NextResponse.json(
      { error: "Failed to generate signed URLs" },
      { status: 500 }
    );
  }
}
