"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { Thumbnail, UseVideoDataReturn, VideoData } from "@/types/videoData";
import { ShareLink } from "@/types/share";

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

      const { data: videoData, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

      if (videoError) throw videoError;
      setVideo(videoData);

      const { data: thumbs, error: thumbsError } = await supabase
        .from("thumbnails")
        .select("*")
        .eq("video_id", videoId);

      if (thumbsError) throw thumbsError;
      setThumbnails(thumbs || []);

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
