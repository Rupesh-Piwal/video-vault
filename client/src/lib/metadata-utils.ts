export interface VideoMetadataProps {
  filename: string;
  type: string;
  size: number;
  duration: number | null;
  uploadDate: string;
  readyDate: string | null;
}
export interface VideoCardProps {
  id: string;
  filename: string;
  type: string;
  size: number;
  duration: number | null;
  uploadDate: string;
  readyDate: string | null;
  status: string;
  storage_key: string;
}

export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDuration = (seconds: number | null): string => {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const formatted = `${d.getDate()}-${
    d.getMonth() + 1
  }-${d.getFullYear()}, ${d.toLocaleTimeString()}`;
  return formatted;
};
