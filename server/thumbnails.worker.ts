import { Worker } from "bullmq";
import { redis } from "./lib/redis.js";
import { supabase } from "./lib/supabase.js";
import { log } from "./lib/logger.js";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function downloadFromS3(bucket: string, key: string, dest: string) {
  const stream = await s3.send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  );
  const writeStream = fs.createWriteStream(dest);
  await new Promise<void>((resolve, reject) => {
    (stream.Body as any).pipe(writeStream);
    writeStream.on("finish", () => resolve());
    writeStream.on("error", (err) => reject(err));
  });
}

async function generateThumbnail(input: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    const ff = spawn("ffmpeg", [
      "-y",
      "-i",
      input,
      "-vf",
      "thumbnail,scale=320:180",
      "-frames:v",
      "1",
      output,
    ]);

    ff.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });

    ff.on("error", (err) => reject(err));
  });
}

async function uploadToS3(bucket: string, key: string, filePath: string) {
  const buffer = fs.readFileSync(filePath);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );
}

const worker = new Worker(
  "video-processing",
  async (job) => {
    log.info("Processing job", job.id);

    const { videoId, s3Key } = job.data;
    const tempFile = path.join("/tmp", `${videoId}.mp4`);

    // Download video
    await downloadFromS3(process.env.AWS_BUCKET!, s3Key, tempFile);

    // Generate 3 thumbnails
    const positions = ["10", "50", "90"];
    for (const pos of positions) {
      const outFile = path.join("/tmp", `${videoId}-${pos}.jpg`);
      await generateThumbnail(tempFile, outFile);

      const key = `thumbnails/${videoId}/thumb_${pos}.jpg`;
      await uploadToS3(process.env.AWS_BUCKET!, key, outFile);

      await supabase.from("thumbnails").insert([
        {
          video_id: videoId,
          storage_key: key,
          position_seconds: null,
          width: 320,
          height: 180,
        },
      ]);

      log.info(`Uploaded thumbnail ${key}`);
    }

    await supabase
      .from("videos")
      .update({ status: "thumbnails_ready" })
      .eq("id", videoId);

    log.info("Job finished", job.id);
  },
  { connection: redis }
);

worker.on("failed", (job, err) => {
  log.error("Job failed", job?.id, err);
});
