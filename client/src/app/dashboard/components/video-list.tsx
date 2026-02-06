"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import type { VideoCardProps } from "@/lib/metadata-utils";
import { FileVideo, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "./video-card";
import type { VideoRow } from "@/types/video";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface VideoListProps {
  onUploadClick?: () => void;
}

export function VideoList({ onUploadClick }: VideoListProps) {
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

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

    const channel = supabase
      .channel("video-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        (payload: RealtimePostgresChangesPayload<VideoRow>) => {
          setVideos((prev) => {
            if (payload.eventType === "INSERT" && payload.new) {
              return [...prev, mapVideoRow(payload.new)];
            }

            if (payload.eventType === "UPDATE" && payload.new) {
              return prev.map((v) =>
                v.id === payload.new!.id ? mapVideoRow(payload.new!) : v
              );
            }

            if (payload.eventType === "DELETE" && payload.old) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-400/20 overflow-hidden bg-[#18191A]"
          >
            <div className="aspect-video bg-black animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse" />
              <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-[#18191A] rounded-full p-8 mb-6 border border-gray-400/20">
            <FileVideo className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            No videos yet
          </h3>
          <p className="text-gray-400 max-w-md text-lg leading-relaxed mb-6">
            Upload your first video to get started
          </p>
          {onUploadClick && (
            <Button
              onClick={onUploadClick}
              className="rounded-lg px-8 py-3 bg-[#E5E5E8] text-[#0E0E10] font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer tracking-wider hover:scale-105"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
