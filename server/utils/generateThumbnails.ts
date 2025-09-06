import { exec } from "child_process";
import path from "path";
import fs from "fs";
import util from "util";

const execPromise = util.promisify(exec);

export interface ThumbnailInfo {
  file: string; // local file path
  position: number; // position in seconds
}

/**
 * Get video duration using ffprobe
 */
async function getVideoDuration(videoPath: string): Promise<number> {
  const { stdout } = await execPromise(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
  );
  return parseFloat(stdout);
}

/**
 * Generate evenly spaced thumbnails
 */
export async function generateThumbnails(
  videoPath: string,
  outputDir: string,
  count: number = 3
): Promise<ThumbnailInfo[]> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1️⃣ Get duration
  const duration = await getVideoDuration(videoPath);

  if (isNaN(duration) || duration <= 0) {
    throw new Error("Failed to fetch video duration");
  }

  // 2️⃣ Decide capture positions (skip 0s, spread across)
  const interval = duration / (count + 1);
  const positions = Array.from({ length: count }, (_, i) =>
    Math.floor((i + 1) * interval)
  );

  const thumbs: ThumbnailInfo[] = [];

  // 3️⃣ Extract each thumbnail
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const outFile = path.join(outputDir, `thumb-${i + 1}.jpg`);
    const cmd = `ffmpeg -ss ${pos} -i "${videoPath}" -vframes 1 -q:v 2 "${outFile}" -hide_banner -loglevel error`;

    await execPromise(cmd);

    thumbs.push({ file: outFile, position: pos });
  }

  return thumbs;
}
