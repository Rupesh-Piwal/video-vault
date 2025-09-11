"use client";

import { useEffect, useState } from "react";
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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    if (video.status === "READY") {
      setLoadingUrl(true);
      fetch(`/api/video-url?key=${encodeURIComponent(video.storage_key)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch signed URL");
          return res.json();
        })
        .then((data) => {
          setVideoUrl(data.url);
          console.log("VIDEO-URL----->", data.url);
          setLoadingUrl(false);
        })
        .catch((err) => {
          console.error("Error fetching signed URL:", err);
          setUrlError(true);
          setLoadingUrl(false);
        });
    }
  }, [video.status, video.storage_key]);

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
          <>
            {loadingUrl && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading video...</span>
              </div>
            )}
            {urlError && <p className="text-red-500">Failed to load video.</p>}
            {videoUrl && !loadingUrl && !urlError && (
              <video src={videoUrl} controls className="w-full rounded-lg" />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
