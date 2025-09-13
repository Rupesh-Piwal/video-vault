"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileVideo, Calendar } from "lucide-react";
import {
  VideoMetadataProps,
  formatSize,
  formatDate,
  formatDuration,
} from "@/lib/metadata-utils";

export function VideoMetadata({
  filename,
  type,
  size,
  uploadDate,
  duration,
  readyDate,
}: VideoMetadataProps) {
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
            <p className="text-sm">{formatDuration(duration)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Upload Date
            </p>
            <p className="text-sm flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(uploadDate)}
            </p>
          </div>
          {readyDate && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ready Date
              </p>
              <p className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(readyDate)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
