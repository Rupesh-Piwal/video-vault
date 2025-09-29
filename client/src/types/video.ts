export interface VideoRow {
  id: string;
  original_filename?: string;
  filename?: string;
  mime_type?: string;
  type?: string;
  size_bytes?: number;
  duration_seconds?: number | null;
  created_at: string;
  ready_at?: string | null;
  status: string;
  storage_key: string;
}

export type Video = {
  id: string;
  original_filename: string;
  storage_key: string;
  playback_url?: string;
  description?: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number;
  created_at: string;
  ready_at: string | null;
};

export type ShareResponse =
  | { requireEmail: true }
  | { requireEmail: false; video: Video }
  | { error: string };
