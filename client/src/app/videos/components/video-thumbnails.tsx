"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoThumbnailsProps {
  thumbnails: { id: string; storage_key: string }[];
  filename?: string;
}

export function VideoThumbnails({
  thumbnails,
  filename,
}: VideoThumbnailsProps) {
  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thumbnails</CardTitle>
      </CardHeader>
      <CardContent>
        {thumbnails.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {thumbnails.map((t, i) => (
              <div
                key={t.id}
                className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={`https://${bucketName}.s3.amazonaws.com/${t.storage_key}`}
                  alt={`${filename} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
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
