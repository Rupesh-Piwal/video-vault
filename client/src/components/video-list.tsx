"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { VideoCard } from "./video-card";
import { VideoCardProps } from "@/lib/metadata-utils";

interface VideoRow {
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

export function VideoList() {
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const supabase = createClient();

  // ✅ Map DB row → VideoCardProps
  function mapVideoRow(row: VideoRow): VideoCardProps {
    return {
      id: row.id,
      filename: row.original_filename || row.filename || "Unknown",
      type: row.mime_type || row.type || "unknown",
      size: row.size_bytes ?? 0,
      duration: row.duration_seconds ?? null,
      uploadDate: row.created_at,
      readyDate: row.ready_at ?? null,
      status: row.status,
      storage_key: row.storage_key,
    };
  }

  useEffect(() => {
    // Fetch initial videos
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setVideos(data.map(mapVideoRow));
      }
    };

    fetchVideos();

    // Realtime subscription for all events
    const channel = supabase
      .channel("video-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        (payload: any) => {
          setVideos((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, mapVideoRow(payload.new)];
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((v) =>
                v.id === payload.new.id ? mapVideoRow(payload.new) : v
              );
            }

            if (payload.eventType === "DELETE") {
              return prev.filter((v) => v.id !== payload.old.id);
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video.id} {...video} />)
      ) : (
        <p className="text-muted-foreground">No videos uploaded yet.</p>
      )}
    </div>
  );
}
