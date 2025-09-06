"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  original_filename: string;
  status: string;
  storage_key: string;
  created_at: string;
}

export function VideoCard({ video }: { video: Video }) {
  const getStatusIcon = () => {
    switch (video.status) {
      case "UPLOADING":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "PROCESSING":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "READY":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  // ✅ Temporary: construct S3 public URL (replace with CloudFront/signed URL in prod)
  const videoUrl = `https://YOUR_BUCKET_NAME.s3.amazonaws.com/${video.storage_key}`;

  return (
    <Card className="rounded-xl shadow-md overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="truncate">{video.original_filename}</CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-sm font-medium mb-2",
            video.status === "READY" && "text-green-600",
            video.status === "FAILED" && "text-red-600",
            video.status === "PROCESSING" && "text-orange-500"
          )}
        >
          {video.status}
        </p>

        {/* ✅ Show video preview only when READY */}
        {video.status === "READY" && (
          <video src={videoUrl} controls className="w-full rounded-lg" />
        )}
      </CardContent>
    </Card>
  );
}
