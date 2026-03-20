"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { VideoCardProps } from "@/lib/metadata-utils";
import { FileVideo, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "./video-card";
import type { VideoRow } from "@/types/video";

interface VideoListProps {
  onUploadClick?: () => void;
  input: string;
}

interface Cursor {
  created_at: string;
  id: string;
}

export function VideoList({ onUploadClick, input }: VideoListProps) {
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: readyKeys }),
    });

    const { urls } = await res.json();

    setVideoUrls((prev) => ({ ...prev, ...urls }));
  }, []);

  const loadVideos = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;
      if (loading && !reset) return;

      try {
        setLoading(true);

        const search = input.trim();
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (cursor && !reset) {
          params.append("cursor", JSON.stringify(cursor));
        }
        params.append("limit", "10");

        const res = await fetch(`/api/pagination?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Failed to fetch videos");
        }

        const { videos: data, nextCursor } = await res.json();

        if (reset) {
          setVideos(data.map(mapVideoRow));
        } else {
          setVideos((prev) => {
            const map = new Map<string, VideoCardProps>();

            [...prev, ...data.map(mapVideoRow)].forEach((v) => {
              map.set(v.id, v);
            });

            return Array.from(map.values());
          });
        }

        await fetchVideoUrls(data);

        setCursor(nextCursor ?? null);
        setHasMore(Boolean(nextCursor));
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setLoading(false);
      }
    },
    [cursor, input, hasMore, fetchVideoUrls, loading],
  );

  useEffect(() => {
    setLoading(true);
    setCursor(null);
    setHasMore(true);
    loadVideos(true);
  }, [input]);

  const lastVideoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadVideos();
          }
        },
        { threshold: 1 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadVideos],
  );

  if (loading && videos.length === 0) {
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
          <Button onClick={onUploadClick}>
            <Upload className="h-5 w-5 mr-2" />
            Upload Video
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-black">
      {videos.map((video, index) => {
        if (videos.length === index + 1) {
          return (
            <div ref={lastVideoRef} key={video.id}>
              <VideoCard
                {...video}
                videoUrl={videoUrls[video.storage_key]}
                onDelete={(id) =>
                  setVideos((prev) => prev.filter((v) => v.id !== id))
                }
              />
            </div>
          );
        }

        return (
          <VideoCard
            key={video.id}
            {...video}
            videoUrl={videoUrls[video.storage_key]}
            onDelete={(id) =>
              setVideos((prev) => prev.filter((v) => v.id !== id))
            }
          />
        );
      })}
    </div>
  );
}
