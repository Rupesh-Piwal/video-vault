"use client";

import { Card, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnails: { id: string; storage_key: string }[];
  type: string;
  filename: string;
}

export function VideoPlayer({
  videoUrl,
  thumbnails,
  type,
  filename,
}: VideoPlayerProps) {
  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

  // Pehla thumbnail ko poster ke liye use karo
  const posterUrl =
    thumbnails.length > 0
      ? `https://${bucketName}.s3.amazonaws.com/${thumbnails[0].storage_key}`
      : "/placeholder.jpg";

  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            controls
            className="w-full h-full"
            poster={posterUrl}
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
