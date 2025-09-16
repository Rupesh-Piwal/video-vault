"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";
import { TextShimmer } from "../../../../components/motion-primitives/text-shimmer";

interface Thumbnail {
  id: string;
  storage_key: string;
}

interface VideoThumbnailsProps {
  thumbnails: Thumbnail[];
  filename?: string;
}

export function VideoThumbnails({
  thumbnails,
  filename,
}: VideoThumbnailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center flex-row gap-2">
          <Image size={20} /> Thumbnails
        </CardTitle>
      </CardHeader>
      <CardContent>
        {thumbnails.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {thumbnails.map((t, i) => (
              <ThumbnailItem
                key={t.id}
                thumbnail={t}
                index={i}
                filename={filename}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No thumbnails available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ThumbnailItem({
  thumbnail,
  index,
  filename,
}: {
  thumbnail: Thumbnail;
  index: number;
  filename?: string;
}) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThumbUrl() {
      try {
        const res = await fetch(
          `/api/thumbnail-url?key=${encodeURIComponent(thumbnail.storage_key)}`
        );
        if (!res.ok) throw new Error("Failed to fetch thumbnail URL");
        const data = await res.json();
        setThumbUrl(data.url);
      } catch (err) {
        console.error("Error fetching thumbnail URL:", err);
      }
    }
    fetchThumbUrl();
  }, [thumbnail.storage_key]);

  return (
    <div className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={`${filename} thumbnail ${index + 1}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <TextShimmer
          className="flex items-center justify-center h-full font-mono text-sm"
          duration={1}
        >
          Loading...
        </TextShimmer>
        // <div className="flex items-center justify-center h-full text-sm text-muted-foreground">

        // </div>
      )}
    </div>
  );
}
