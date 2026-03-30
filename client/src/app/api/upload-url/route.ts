import {
  S3Client,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  UploadPartCommand,
  CompletedPart,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";
import axios from "axios";

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

    const body = await req.json();

    const { action, fileName, fileType, fileSize, key, uploadId, parts } = body;

    console.log("UPLOAD ACTION:", action);

    /**
     * START MULTIPART UPLOAD
     */
    if (action === "start") {
      if (!fileType?.startsWith("video/")) {
        return NextResponse.json(
          { error: "Only video uploads allowed" },
          { status: 400 },
        );
      }

      const objectKey = `uploads/${user.id}/${Date.now()}-${fileName}`;

      const { data: video, error: insertError } = await supabase
        .from("videos")
        .insert([
          {
            owner_id: user.id,
            storage_key: objectKey,
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
          { status: 500 },
        );
      }

      const command = new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: objectKey,
        ContentType: fileType,
      });

      const { UploadId } = await s3.send(command);

      return NextResponse.json({
        uploadId: UploadId,
        key: objectKey,
        videoId: video.id,
      });
    }

    /**
     * SIGN MULTIPLE PARTS
     */
    if (action === "signParts") {
      if (!key || !uploadId || !Array.isArray(parts)) {
        return NextResponse.json(
          { error: "key, uploadId, and parts[] are required" },
          { status: 400 },
        );
      }

      const urls = await Promise.all(
        parts.map(async (partNumber: number) => {
          const command = new UploadPartCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber,
          });

          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

          return {
            partNumber,
            url,
          };
        }),
      );

      return NextResponse.json({ urls });
    }

    /**
     * COMPLETE MULTIPART UPLOAD
     */
    if (action === "complete") {
      if (!key || !uploadId || !parts) {
        return NextResponse.json(
          { error: "key, uploadId, and parts are required" },
          { status: 400 },
        );
      }

      const validParts = parts.map((part: CompletedPart) => ({
        ETag: part.ETag!,
        PartNumber: part.PartNumber!,
      }));

      const command = new CompleteMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: validParts,
        },
      });

      const result = await s3.send(command);

      console.log("UPLOAD COMPLETE:", result.Location);

      const { data: video, error: updateError } = await supabase
        .from("videos")
        .update({ status: "PROCESSING" })
        .eq("storage_key", key)
        .select("id")
        .single();

      if (updateError) {
        console.error("Supabase update error:", updateError);
      }

      // Trigger video processing in Express server
      if (video?.id) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_EXPRESS_URL}/jobs/video-process`,
            {
              videoId: video.id,
              s3Key: key,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
              },
            }
          );
          console.log("✅ Video process job triggered for:", video.id);
        } catch (expressError) {
          console.error("❌ Failed to trigger Express worker:", expressError);
          // We don't throw here to avoid failing the whole complete request
        }
      }

      return NextResponse.json({
        success: true,
        location: result.Location,
      });
    }

    /**
     * ABORT UPLOAD
     */
    if (action === "abort") {
      if (!key || !uploadId) {
        return NextResponse.json(
          { error: "key and uploadId are required" },
          { status: 400 },
        );
      }

      const command = new AbortMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
      });

      await s3.send(command);

      await supabase
        .from("videos")
        .update({ status: "FAILED" })
        .eq("storage_key", key);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Multipart upload error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
