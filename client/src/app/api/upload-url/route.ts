import {
  S3Client,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
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

    // Read the request body once and store it
    const body = await req.json();
    const {
      action,
      fileName,
      fileType,
      fileSize,
      key,
      uploadId,
      parts,
      partNumber,
    } = body;

    // ----- Start Multipart Upload -----
    if (action === "start") {
      if (!fileType.startsWith("video/")) {
        return NextResponse.json(
          { error: "Only video uploads allowed" },
          { status: 400 }
        );
      }

      const objectKey = `uploads/${user.id}/${Date.now()}-${fileName}`;

      // Create DB record
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
          { status: 500 }
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

    // ----- Generate Presigned URL for Part -----
    if (action === "signPart") {
      if (!partNumber || !key || !uploadId) {
        return NextResponse.json(
          { error: "partNumber, key, and uploadId are required" },
          { status: 400 }
        );
      }

      const command = new UploadPartCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      return NextResponse.json({ url });
    }

    // ----- Complete Multipart Upload -----
    if (action === "complete") {
      if (!key || !uploadId || !parts) {
        return NextResponse.json(
          { error: "key, uploadId, and parts are required" },
          { status: 400 }
        );
      }

      // Validate parts structure
      const validParts = parts.map((part: any) => ({
        ETag: part.ETag,
        PartNumber: part.PartNumber,
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
      console.log(result);

      // Update DB
      await supabase
        .from("videos")
        .update({ status: "UPLOADED" })
        .eq("storage_key", key);

      return NextResponse.json({
        success: true,
        location: result.Location,
      });
    }

    // ----- Abort Multipart Upload -----
    if (action === "abort") {
      if (!key || !uploadId) {
        return NextResponse.json(
          { error: "key and uploadId are required" },
          { status: 400 }
        );
      }

      const command = new AbortMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
      });

      await s3.send(command);

      // Update DB
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
      { status: 500 }
    );
  }
}
