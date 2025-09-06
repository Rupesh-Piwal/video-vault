import "dotenv/config";
import { Worker } from "bullmq";
import Redis from "ioredis";
import os from "os";
import path from "path";
import fs from "fs";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { createClient } from "@supabase/supabase-js";
import { Readable } from "stream";
import { generateThumbnails, ThumbnailInfo } from "../utils/generateThumbnails";

// Redis connection
const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

// S3 client
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Supabase client (service role for server-side ops)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Download video from S3 to temp path
async function downloadFromS3(bucket: string, key: string, destPath: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);
  const bodyStream = response.Body as Readable;

  const fileStream = fs.createWriteStream(destPath);

  return new Promise<void>((resolve, reject) => {
    bodyStream.pipe(fileStream);
    bodyStream.on("error", reject);
    fileStream.on("finish", resolve);
  });
}

// ✅ Upload file (thumbnail) to S3
async function uploadToS3(bucket: string, key: string, filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileStream,
    ContentType: "image/jpeg",
  });
  await s3.send(command);
}

// ✅ BullMQ Worker for video-processing queue
export const worker = new Worker(
  "video-processing",
  async (job) => {
    const { videoId, s3Key } = job.data as { videoId: string; s3Key: string };
    console.log(`🎬 Processing video: ${videoId}`);

    const tempDir = os.tmpdir();
    console.log("===tempDir===", tempDir);
    const videoPath = path.join(tempDir, `${videoId}.mp4`);
    const thumbsDir = path.join(tempDir, `thumbs-${videoId}`);

    try {
      // 1️⃣ Download video from S3
      await downloadFromS3(process.env.AWS_BUCKET_NAME!, s3Key, videoPath);

      // 2️⃣ Generate thumbnails (returns {file, position})
      const thumbnails: ThumbnailInfo[] = await generateThumbnails(
        videoPath,
        thumbsDir,
        3 // number of thumbnails
      );

      console.log("thumbnails------>", thumbnails);

      // 3️⃣ Upload each thumbnail → S3 + Insert into Supabase
      for (let i = 0; i < thumbnails.length; i++) {
        const thumb = thumbnails[i];
        const thumbKey = `thumbnails/${videoId}/thumb-${i + 1}.jpg`;

        // Upload to S3
        await uploadToS3(process.env.AWS_BUCKET_NAME!, thumbKey, thumb.file);

        // Insert record in Supabase
        const { error } = await supabase.from("thumbnails").insert([
          {
            video_id: videoId,
            storage_key: thumbKey,
            position_seconds: thumb.position, // ✅ use calculated position
            width: 320, // TODO: dynamically detect via ffprobe if needed
            height: 180,
          },
        ]);

        if (error) console.error("Supabase insert error:", error);
      }

      // 4️⃣ Update video status in Supabase
      await supabase
        .from("videos")
        .update({ status: "ready" }) // ✅ change to ready
        .eq("id", videoId);

      console.log(`✅ Thumbnails generated for video ${videoId}`);
    } catch (err) {
      console.error("❌ Worker error:", err);

      // mark video as failed
      await supabase
        .from("videos")
        .update({ status: "failed" })
        .eq("id", videoId);
    } finally {
      // 5️⃣ Cleanup temp files
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(thumbsDir)) fs.rmSync(thumbsDir, { recursive: true });
    }
  },
  { connection }
);
