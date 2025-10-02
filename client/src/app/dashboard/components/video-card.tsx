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
  ExternalLink,
  Play,
  FileVideo,
  Pause,
  Volume2,
  VolumeX,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDateOnly,
  formatDuration,
  formatSize,
  type VideoCardProps,
} from "@/lib/metadata-utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TextShimmer } from "../../../../components/motion-primitives/text-shimmer";
import { DownloadButton } from "@/components/download-button";

export function VideoCard({
  id,
  filename,
  size,
  uploadDate,
  duration,
  status,
  storage_key,
  onDelete,
}: VideoCardProps & { onDelete?: (id: string) => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();

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
          setLoadingUrl(false);
        })
        .catch((err) => {
          console.error("Error fetching signed URL:", err);
          setUrlError(true);
          setLoadingUrl(false);
        });
    }
  }, [status, storage_key]);

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Video deleted successfully");
        onDelete(id);
      } else {
        throw new Error("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case "UPLOADING":
        return {
          text: "UPLOADING",
          className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
        };
      case "PROCESSING":
        return {
          text: "PROCESSING",
          className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          icon: <Clock className="h-3 w-3" />,
        };
      case "READY":
        return {
          text: "READY",
          className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "FAILED":
        return {
          text: "FAILED",
          className: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <XCircle className="h-3 w-3" />,
        };
      default:
        return {
          text: "UNKNOWN",
          className: "bg-[#606060]/20 text-[#8C8C8C] border-[#606060]/30",
          icon: <Clock className="h-3 w-3" />,
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

  useEffect(() => {
    if (status !== "READY") return;
    let isMounted = true;

    async function fetchThumbnails() {
      try {
        const res = await fetch(`/api/thumbnail-url/${id}`);
        if (!res.ok) throw new Error("Failed to fetch thumbnails");
        const data = await res.json();

        if (isMounted && data.urls?.length) {
          const midIndex = Math.floor(data.urls.length / 2);
          console.log("Setting poster URL:", data.urls[midIndex]);
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

  const statusConfig = getStatusConfig();

  return (
    <>
      <Card
        className="group relative z-0 overflow-hidden bg-[#18191A] border border-[#2B2C2D] rounded-xl hover:border-[#383838] transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute top-3 left-3 z-10">
            <Badge
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-md border backdrop-blur-sm",
                statusConfig.className
              )}
            >
              <span className="mr-1.5">{statusConfig.icon}</span>
              {statusConfig.text}
            </Badge>
          </div>

          {status === "READY" && videoUrl && !loadingUrl && !urlError ? (
            <div className="relative w-full h-full group/video hover:cursor-pointer">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl || undefined}
                className="w-full h-full object-cover bg-[#2B2C2D]"
                preload="metadata"
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              <div
                className={cn(
                  "absolute inset-0 bg-black/60 transition-all duration-300 flex items-center justify-center",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              >
                <button
                  onClick={handlePlayPause}
                  className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-black" fill="currentColor" />
                  ) : (
                    <Play
                      className="h-5 w-5 text-black ml-0.5"
                      fill="currentColor"
                    />
                  )}
                </button>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="mb-2">
                    <div className="w-full h-1 bg-white/20 rounded-full">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition-all duration-200"
                      >
                        {isMuted ? (
                          <VolumeX className="h-3 w-3 text-white" />
                        ) : (
                          <Volume2 className="h-3 w-3 text-white" />
                        )}
                      </button>
                      <span className="text-white text-xs font-medium">
                        {Math.floor(currentTime / 60)}:
                        {String(Math.floor(currentTime % 60)).padStart(2, "0")}/{" "}
                        {Math.floor(videoDuration / 60)}:
                        {String(Math.floor(videoDuration % 60)).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-[#2B2C2D] flex items-center justify-center">
              {loadingUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-[#383838] rounded-full p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-[#8C8C8C]" />
                  </div>

                  <TextShimmer className="font-mono text-sm" duration={1}>
                    Loading...
                  </TextShimmer>
                </div>
              ) : urlError ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-[#383838] rounded-full p-4">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <p className="text-sm font-medium text-[#8C8C8C]">
                    Failed to load
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-[#383838] rounded-full p-4">
                    {status === "PROCESSING" || status === "UPLOADING" ? (
                      statusConfig.icon
                    ) : (
                      <FileVideo className="h-6 w-6 text-[#8C8C8C]" />
                    )}
                  </div>
                  {(status === "PROCESSING" || status === "UPLOADING") && (
                    <TextShimmer className="font-mono text-sm" duration={1}>
                      {status === "UPLOADING"
                        ? "Uploading..."
                        : "Processing..."}
                    </TextShimmer>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-white text-sm leading-tight truncate">
            {filename}
          </h3>

          <div className="flex items-center justify-between text-xs text-[#8C8C8C]">
            <span>{formatSize(size)}</span>
            <span>{formatDuration(duration)}</span>
            <span>{formatDateOnly(uploadDate)}</span>
          </div>

          {status === "READY" && !loadingUrl && (
            <div className="flex items-center gap-2 pt-1">
              <DownloadButton videoUrl={videoUrl} filename={filename} />
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-[#2B2C2D] hover:bg-[#383838] border-[#383838] text-[#8C8C8C] hover:text-white text-xs h-8 cursor-pointer"
                onClick={() => router.push(`/videos/${id}`)}
              >
                <ExternalLink className="h-3 w-3 mr-1.5" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 h-8 text-[#8C8C8C] hover:text-white cursor-pointer transition-all duration-200 group/delete"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-3 w-3 transition-transform duration-200 group-hover/delete:scale-110" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover/delete:opacity-100 transition-opacity duration-200"></span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18191A] border border-[#2B2C2D] rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Delete Video</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-[#8C8C8C] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-[#8C8C8C] mb-6">
              Are you sure you want to delete &quot;{filename}&quot;? This
              action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-[#383838] text-[#8C8C8C] hover:text-white cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <TextShimmer className="font-mono text-sm" duration={1}>
                      Deleting...
                    </TextShimmer>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
