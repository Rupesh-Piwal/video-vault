"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  Download,
  ExternalLink,
  MoreHorizontal,
  Play,
  FileVideo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatDateOnly,
  formatDuration,
  formatSize,
  VideoCardProps,
} from "@/lib/metadata-utils";

export function VideoCard({
  filename,
  size,
  uploadDate,
  duration,
  status,
  storage_key,
}: VideoCardProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    if (status === "READY") {
      setLoadingUrl(true);
      fetch(`/api/video-url?key=${encodeURIComponent(storage_key)}`)
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
  }, [status, storage_key]);

  const getStatusConfig = () => {
    switch (status) {
      case "UPLOADING":
        return {
          text: "UPLOADING",
          className: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          bgGradient: "from-blue-400/20 to-cyan-400/20",
        };
      case "PROCESSING":
        return {
          text: "PROCESSING",
          className: "bg-amber-100 text-amber-700 border-amber-200",
          icon: <Clock className="h-3 w-3" />,
          bgGradient: "from-amber-400/20 to-orange-400/20",
        };
      case "READY":
        return {
          text: "READY",
          className: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="h-3 w-3" />,
          bgGradient: "from-emerald-400/20 to-green-400/20",
        };
      case "FAILED":
        return {
          text: "FAILED",
          className: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="h-3 w-3" />,
          bgGradient: "from-red-400/20 to-pink-400/20",
        };
      default:
        return {
          text: "UNKNOWN",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Clock className="h-3 w-3" />,
          bgGradient: "from-gray-400/20 to-slate-400/20",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      {/* Video Thumbnail/Preview Area */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        {/* Status Badge - Positioned absolutely */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full border",
              statusConfig.className
            )}
          >
            {statusConfig.text}
          </Badge>
        </div>

        {status === "READY" && videoUrl && !loadingUrl && !urlError ? (
          <div className="relative w-full h-full group/video">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/video:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Play
                  className="h-6 w-6 text-gray-800 ml-0.5"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br flex items-center justify-center",
              statusConfig.bgGradient
            )}
          >
            {loadingUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Loading...</p>
              </div>
            ) : urlError ? (
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-4">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Failed to load
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-4">
                  {status === "PROCESSING" ||
                  status === "UPLOADING" ? (
                    statusConfig.icon
                  ) : (
                    <FileVideo className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                {(status === "PROCESSING" ||
                  status === "UPLOADING") && (
                  <p className="text-sm font-medium text-gray-700">
                    {status === "UPLOADING"
                      ? "Uploading..."
                      : "Processing..."}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <CardContent className="p-6 space-y-4">
        {/* Video Title */}
        {loadingUrl ? (
          <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
            {filename}
          </h3>
        )}

        {/* Video Metadata */}
        {loadingUrl ? (
          <div className="flex items-center justify-between">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">{formatSize(size)}</span>
            <span>{formatDuration(duration)}</span>
            <span>{formatDateOnly(uploadDate)}</span>
          </div>
        )}

        {/* Action Buttons - Only show for READY videos */}
        {status === "READY" && !loadingUrl && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-gray-50 hover:bg-gray-100 border-gray-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-gray-50 hover:bg-gray-100 border-gray-200"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button variant="ghost" size="sm" className="px-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
