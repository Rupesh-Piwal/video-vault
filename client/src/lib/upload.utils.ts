import { VIDEO_INDICATORS } from "./constants";
import { MEDIA_KEYWORDS } from "./constants";
import { ALLOWED_EXTENSIONS } from "./constants";
import { MAX_FILE_SIZE } from "./constants";


export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) return "File size exceeds 500MB limit";

  if (file.type?.startsWith("video/")) return null;

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && ALLOWED_EXTENSIONS.includes(ext)) return null;

  const fileName = file.name.toLowerCase();
  if (VIDEO_INDICATORS.some((indicator) => fileName.includes(indicator))) return null;

  if (file.size > 10 * 1024 * 1024) return null;
  if (!ext && file.size > 1024 * 1024) return null;
  if (MEDIA_KEYWORDS.some((keyword) => fileName.includes(keyword))) return null;

  return "File doesn't appear to be a video. Please ensure it has a proper extension or video-related content.";
}
