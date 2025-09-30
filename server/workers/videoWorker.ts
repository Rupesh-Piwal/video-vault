import "dotenv/config";
import { Worker } from "bullmq";
import Redis from "ioredis";
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
import ffmpeg from "fluent-ffmpeg"; 

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});


const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

// Get video duration using ffmpeg
function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
}

// BullMQ Worker
export const worker = new Worker(
  "video-processing",
  async (job) => {
    const { videoId, s3Key } = job.data as { videoId: string; s3Key: string };
    console.log(`🎬 Processing video: ${videoId}`);

    const projectTempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(projectTempDir))
      fs.mkdirSync(projectTempDir, { recursive: true });

    const videoPath = path.join(projectTempDir, `${videoId}.mp4`);
    const thumbsDir = path.join(projectTempDir, `thumbs-${videoId}`);

    try {
      // 1️⃣ Download video
      await downloadFromS3(process.env.AWS_BUCKET_NAME!, s3Key, videoPath);
      console.log("Bucket Name:", process.env.AWS_BUCKET_NAME);

      // 2️⃣ Generate thumbnails
      const thumbnails: ThumbnailInfo[] = await generateThumbnails(
        videoPath,
        thumbsDir,
        4
      );
      console.log("thumbnails------>", thumbnails);

      // 3️⃣ Upload thumbnails + insert into Supabase
      for (let i = 0; i < thumbnails.length; i++) {
        const thumb = thumbnails[i];
        const thumbKey = `thumbnails/${videoId}/thumb-${i + 1}.jpg`;

        await uploadToS3(process.env.AWS_BUCKET_NAME!, thumbKey, thumb.file);

        const { error } = await supabase.from("thumbnails").insert([
          {
            video_id: videoId,
            storage_key: thumbKey,
            position_seconds: thumb.position,
            width: 320,
            height: 180,
          },
        ]);

        if (error)
          console.error("❌ Supabase insert error (thumbnail):", error);
      }

      // 3.1️⃣ Get video duration
      const duration = await getVideoDuration(videoPath);

      // 4️⃣ Update video status → READY + duration
      const { error: updateError } = await supabase
        .from("videos")
        .update({
          status: "READY",
          duration_seconds: duration,
          ready_at: new Date().toISOString(),
        })
        .eq("id", videoId);

      if (updateError) {
        console.error("❌ Supabase update error (video ready):", updateError);
      } else {
        console.log(
          `✅ Video status updated to READY for ${videoId}, duration: ${duration}s`
        );
      }
    } catch (err) {
      console.error("❌ Worker error:", err);

      const { error: failError } = await supabase
        .from("videos")
        .update({ status: "FAILED" })
        .eq("id", videoId);

      if (failError)
        console.error("❌ Supabase update error (video failed):", failError);
      else console.log(`⚠️ Video status marked as FAILED for ${videoId}`);
    } finally {
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(thumbsDir)) fs.rmSync(thumbsDir, { recursive: true });
    }
  },
  { connection }
);
