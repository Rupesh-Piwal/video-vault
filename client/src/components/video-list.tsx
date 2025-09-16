"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { VideoCard } from "./video-card";
import type { VideoCardProps } from "@/lib/metadata-utils";
import { FileVideo } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#18191A] rounded-xl border border-[#2B2C2D] overflow-hidden"
          >
            <div className="aspect-video bg-[#2B2C2D] animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[#2B2C2D] rounded animate-pulse" />
              <div className="flex justify-between">
                <div className="h-3 bg-[#2B2C2D] rounded w-16 animate-pulse" />
                <div className="h-3 bg-[#2B2C2D] rounded w-12 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
              onDelete={(id) =>
                setVideos((prev) => prev.filter((v) => v.id !== id))
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-[#18191A] rounded-full p-6 mb-4 border border-[#2B2C2D]">
            <FileVideo className="h-12 w-12 text-[#606060]" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No videos yet</h3>
          <p className="text-[#8C8C8C] max-w-md">
            Upload your first video to get started. Your videos will appear here
            once they're processed.
          </p>
        </div>
      )}
    </div>
  );
}
