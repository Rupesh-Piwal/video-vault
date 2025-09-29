export interface VideoData {
  id: string;
  original_filename: string;
  status: string;
  storage_key: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number;
  created_at: string;
  ready_at: string | null;
}

export interface Thumbnail {
  id: string;
  video_id: string;
  storage_key: string;
  created_at: string;
}

export type ShareLinkStatus = "Active" | "Expired" | "Revoked";

export interface RawShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status?: string | null;
}

export interface ShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status: ShareLinkStatus;
}

export interface UseVideoDataReturn {
  video: VideoData | null;
  thumbnails: Thumbnail[];
  shareLinks: ShareLink[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
