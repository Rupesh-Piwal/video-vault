"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileVideo, Clock, Calendar } from "lucide-react";

export interface VideoMetadataProps {
  filename: string;
  type: string;
  size: number;
  duration: number;
  uploadDate: string;
  readyDate: string | null;
}

export function VideoMetadata({
  filename,
  type,
  size,
  duration,
  uploadDate,
  readyDate,
}: VideoMetadataProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileVideo className="h-5 w-5" />
          Video Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Filename
            </p>
            <p className="text-sm">{filename}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <p className="text-sm">{type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Size</p>
            <p className="text-sm">{formatSize(size)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Duration
            </p>
            <p className="text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(duration)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Upload Date
            </p>
            <p className="text-sm flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(uploadDate).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Ready Date
            </p>
            <p className="text-sm flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {readyDate ? new Date(readyDate).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
