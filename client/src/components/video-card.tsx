"use client";

import { useEffect, useRef, useState } from "react";
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
  Pause,
  Maximize,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDateOnly,
  formatDuration,
  formatSize,
  VideoCardProps,
} from "@/lib/metadata-utils";
import toast from "react-hot-toast"; // Import react-hot-toast

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      setDownloading(true);

      // Show loading toast
      const toastId = toast.loading(
        <div className="flex flex-col">
          <span className="font-medium">Starting download</span>
          <span className="text-sm text-gray-500">{filename}</span>
        </div>,
        {
          duration: Infinity, // Keep until we manually dismiss
        }
      );

      // Fetch the video file
      const response = await fetch(videoUrl);

      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename || "video.mp4";

      // Trigger the download
      document.body.appendChild(a);
      a.click();

      // Update toast to success
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Download completed</span>
          <span className="text-sm text-gray-500">
            {filename} • {formatSize(blob.size)}
          </span>
        </div>,
        {
          id: toastId,
          duration: 4000,
        }
      );

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);

      // Show error toast
      toast.error(
        <div className="flex flex-col">
          <span className="font-medium">Download failed</span>
          <span className="text-sm text-gray-500">Please try again later</span>
        </div>,
        {
          duration: 4000,
        }
      );
    } finally {
      setDownloading(false);
    }
  };

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

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              preload="metadata"
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/video:opacity-100 transition-all duration-300">
              {/* Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-black" fill="currentColor" />
                  ) : (
                    <Play
                      className="h-6 w-6 text-black ml-0.5"
                      fill="currentColor"
                    />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-3 left-3 right-3">
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="w-full h-1 bg-white/30 rounded-full">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="bg-white/20 rounded-full p-1.5 hover:bg-white/30 transition-all duration-200"
                    >
                      {isMuted ? (
                        <VolumeX className="h-3 w-3 text-white" />
                      ) : (
                        <Volume2 className="h-3 w-3 text-white" />
                      )}
                    </button>
                    <span className="text-white text-xs font-medium">
                      {Math.floor(currentTime / 60)}:
                      {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
                      {Math.floor(videoDuration / 60)}:
                      {String(Math.floor(videoDuration % 60)).padStart(2, "0")}
                    </span>
                  </div>

                  <button className="bg-white/20 rounded-full p-1.5 hover:bg-white/30 transition-all duration-200">
                    <Maximize className="h-3 w-3 text-white" />
                  </button>
                </div>
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
                  {status === "PROCESSING" || status === "UPLOADING" ? (
                    statusConfig.icon
                  ) : (
                    <FileVideo className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                {(status === "PROCESSING" || status === "UPLOADING") && (
                  <p className="text-sm font-medium text-gray-700">
                    {status === "UPLOADING" ? "Uploading..." : "Processing..."}
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
              onClick={handleDownload}
              disabled={downloading || !videoUrl}
              variant="outline"
              size="sm"
              className="flex-1 bg-gray-50 hover:bg-gray-100 border-gray-200"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {downloading ? "Downloading..." : "Download"}
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
