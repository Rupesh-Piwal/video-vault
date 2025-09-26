// hooks/useVideoData.ts
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";

interface VideoData {
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

interface Thumbnail {
  id: string;
  video_id: string;
  storage_key: string;
  created_at: string;
}


type ShareLinkStatus = "Active" | "Expired" | "Revoked";

export interface RawShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status?: string | null;
}

interface ShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status: ShareLinkStatus;
}



interface UseVideoDataReturn {
  video: VideoData | null;
  thumbnails: Thumbnail[];
  shareLinks: ShareLink[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVideoData(videoId: string): UseVideoDataReturn {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      // Fetch video data
      const { data: videoData, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

      if (videoError) throw videoError;
      setVideo(videoData);

      // Fetch thumbnails
      const { data: thumbs, error: thumbsError } = await supabase
        .from("thumbnails")
        .select("*")
        .eq("video_id", videoId);

      if (thumbsError) throw thumbsError;
      setThumbnails(thumbs || []);

      // Fetch share links
      const { data: links, error: linksError } = await supabase
        .from("share_links")
        .select("*")
        .eq("video_id", videoId);

      if (linksError) throw linksError;
      setShareLinks(links || []);
    } catch (err) {
      console.error("Error fetching video data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchData();
    }
  }, [videoId]);

  return {
    video,
    thumbnails,
    shareLinks,
    loading,
    error,
    refetch: fetchData,
  };
}
