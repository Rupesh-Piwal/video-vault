"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/supabase/client";
import type { VideoCardProps } from "@/lib/metadata-utils";
import { FileVideo, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "./video-card";
import type { VideoRow } from "@/types/video";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface VideoListProps {
  onUploadClick?: () => void;
  input: string;
}

export function VideoList({ onUploadClick, input }: VideoListProps) {
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const mapVideoRow = (row: VideoRow): VideoCardProps => ({
    id: row.id,
    filename: row.original_filename || row.filename || "Unknown",
    type: row.mime_type || row.type || "unknown",
    size: row.size_bytes ?? 0,
    duration: row.duration_seconds ?? null,
    uploadDate: row.created_at,
    readyDate: row.ready_at ?? null,
    status: row.status,
    storage_key: row.storage_key,
  });

  const fetchVideoUrls = useCallback(async (videos: VideoRow[]) => {
    const readyKeys = videos
      .filter((v) => v.status === "READY")
      .map((v) => v.storage_key);

    if (!readyKeys.length) return;

    const res = await fetch("/api/video-url/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keys: readyKeys }),
    });

    const { urls } = await res.json();

    setVideoUrls((prev) => ({ ...prev, ...urls }));
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);

      const search = input.trim();

      let query = supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.ilike("original_filename", `%${search}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        setVideos(data.map(mapVideoRow));
        await fetchVideoUrls(data);
      }

      setLoading(false);
    };

    fetchVideos();

    const channel = supabase
      .channel("video-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        async (payload: RealtimePostgresChangesPayload<VideoRow>) => {
          setVideos((prev) => {
            if (payload.eventType === "INSERT" && payload.new) {
              fetchVideoUrls([payload.new]);
              return [...prev, mapVideoRow(payload.new)];
            }

            if (payload.eventType === "UPDATE" && payload.new) {
              fetchVideoUrls([payload.new]);
              return prev.map((v) =>
                v.id === payload.new!.id ? mapVideoRow(payload.new!) : v,
              );
            }

            if (payload.eventType === "DELETE" && payload.old) {
              return prev.filter((v) => v.id !== payload.old.id);
            }

            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [input, fetchVideoUrls]);

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

  if (videos.length === 0 && input.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="h-16 w-16 text-gray-500 mb-6" />
        <h3 className="text-2xl font-semibold text-white mb-3">
          No results found
        </h3>
        <p className="text-gray-400 text-lg">
          No videos match "<span className="text-white">{input}</span>"
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-black">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          {...video}
          videoUrl={videoUrls[video.storage_key]}
          onDelete={(id) =>
            setVideos((prev) => prev.filter((v) => v.id !== id))
          }
        />
      ))}
    </div>
  );
}
