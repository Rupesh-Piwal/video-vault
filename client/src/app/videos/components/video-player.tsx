"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface VideoPlayerProps {
  id?: string;
  status?: string;
  videoUrl: string;
  thumbnails: { id: string; storage_key: string }[];
  type: string;
  filename: string;
}

export function VideoPlayer({
  videoUrl,
  type,
  filename,
  id,
  status,
}: VideoPlayerProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "READY" || !id) return;

    let isMounted = true;

    async function fetchThumbnails() {
      try {
        const res = await fetch(`/api/thumbnail-url/${id}`);
        if (!res.ok) throw new Error("Failed to fetch thumbnails");
        const data = await res.json();

        if (isMounted && data.urls?.length) {
          const midIndex = Math.floor(data.urls.length / 2);
          setPosterUrl(data.urls[midIndex]);
        }
      } catch (err) {
        console.error("Failed to fetch thumbnails", err);
      }
    }

    fetchThumbnails();

    return () => {
      isMounted = false;
    };
  }, [id, status]);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-video bg-black rounded-lg overflow-hidden ">
          <video
            controls
            className="w-full h-full"
            poster={posterUrl || undefined}
            preload="metadata"
            aria-label={`Video player for ${filename}`}
          >
            <source src={videoUrl} type={type} />
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
    </Card>
  );
}
