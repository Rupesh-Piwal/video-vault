import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    // 1. Fetch video to get storage_key
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("storage_key")
      .eq("id", id)
      .single();

    if (fetchError || !video) {
      console.error("Failed to fetch video:", fetchError);
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    const bucketName = process.env.AWS_BUCKET_NAME!;

    // 2. Delete video file from S3
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: video.storage_key,
        })
      );
      console.log(`✅ Deleted video file from S3: ${video.storage_key}`);
    } catch (s3Error) {
      console.error("S3 video delete error:", s3Error);
      // Continue with cleanup even if S3 delete fails
    }

    // 3. Delete all thumbnails from S3 (under thumbnails/{videoId}/)
    try {
      const thumbnailPrefix = `thumbnails/${id}/`;

      // List all objects under the thumbnail prefix
      const listResponse = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: thumbnailPrefix,
        })
      );

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        const objectsToDelete = listResponse.Contents.map((obj) => ({
          Key: obj.Key!,
        }));

        await s3.send(
          new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: { Objects: objectsToDelete },
          })
        );
        console.log(
          `✅ Deleted ${objectsToDelete.length} thumbnails from S3`
        );
      }
    } catch (s3Error) {
      console.error("S3 thumbnails delete error:", s3Error);
      // Continue with cleanup even if S3 delete fails
    }

    // 4. Delete thumbnails from database
    const { error: thumbDeleteError } = await supabase
      .from("thumbnails")
      .delete()
      .eq("video_id", id);

    if (thumbDeleteError) {
      console.error("Supabase thumbnail delete error:", thumbDeleteError);
      // Continue - video deletion is more important
    }

    // 5. Delete video from database
    const { error: videoDeleteError } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (videoDeleteError) {
      console.error("Supabase video delete error:", videoDeleteError);
      return NextResponse.json(
        { error: videoDeleteError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully deleted video ${id} from S3 and database`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
