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
  size: number | null;
  duration: number | null;
  uploadDate: string;
  readyDate: string | null;
  status: string;
  storage_key: string;
}

export const formatSize = (bytes?: number | null): string => {
  if (bytes == null || isNaN(bytes)) return "—"; // safe fallback
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const formatDuration = (seconds: number | null) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
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
export const formatDateOnly = (dateStr: string)=> {
  const d = new Date(dateStr);
  // returns "day-month-year" only
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}
