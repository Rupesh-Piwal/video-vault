"use client";

import React, { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  FileVideo,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDuration,
  formatSize,
  type VideoCardProps,
} from "@/lib/metadata-utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

let currentlyPlayingVideo: HTMLVideoElement | null = null;

export const VideoCard = React.memo(function VideoCard({
  id,
  filename,
  size,
  duration,
  status,
  videoUrl,
  onDelete,
}: VideoCardProps & { videoUrl?: string; onDelete?: (id: string) => void }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (status !== "READY") return;

    const base = "https://video-vault-rp.s3.ap-south-1.amazonaws.com";
    setPosterUrl(`${base}/thumbnails/${id}/thumb-3.jpg`);
  }, [id, status]);

  useEffect(() => {
    if (!videoUrl || isTouchDevice || status !== "READY") return;

    const video = videoPreviewRef.current;
    if (!video) return;

    if (isHovering) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);

        if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
          currentlyPlayingVideo.pause();
          currentlyPlayingVideo.currentTime = 0;
        }

        video.currentTime = 0;

        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              currentlyPlayingVideo = video;
            })
            .catch(() => {});
        }
      }, 200);
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      setShowPreview(false);

      video.pause();
      video.currentTime = 0;

      if (currentlyPlayingVideo === video) {
        currentlyPlayingVideo = null;
      }
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovering, videoUrl, isTouchDevice, status]);

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete video");

      toast.success("Video deleted successfully");
      onDelete(id);
    } catch (err) {
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCardClick = () => {
    if (status === "READY" && videoUrl) {
      router.push(`/videos/${id}`);
    }
  };

  const statusConfig = {
    READY: {
      text: "READY",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    PROCESSING: {
      text: "PROCESSING",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <Clock className="h-3 w-3" />,
    },
    UPLOADING: {
      text: "UPLOADING",
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    FAILED: {
      text: "FAILED",
      className: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: <XCircle className="h-3 w-3" />,
    },
  }[status] ?? {
    text: "UNKNOWN",
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    icon: <Clock className="h-3 w-3" />,
  };

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-lg bg-black border border-[#1c1c1c] hover:border-gray-800/40 transition-all duration-300 hover:shadow-xl cursor-pointer"
        onMouseEnter={() => !isTouchDevice && setIsHovering(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovering(false)}
        onClick={handleCardClick}
      >
        <div className="relative aspect-video overflow-hidden bg-black">
          {status === "READY" && posterUrl && (
            <img
              src={posterUrl}
              alt={filename}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                showPreview ? "opacity-0" : "opacity-100",
              )}
            />
          )}

          {status === "READY" && videoUrl && !isTouchDevice && (
            <video
              ref={videoPreviewRef}
              src={videoUrl}
              muted
              preload="metadata"
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                showPreview ? "opacity-100" : "opacity-0",
              )}
            />
          )}

          {status !== "READY" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="flex flex-col items-center gap-3">
                {status === "PROCESSING" || status === "UPLOADING" ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                    <p className="text-sm text-gray-400">
                      {status === "UPLOADING"
                        ? "Uploading..."
                        : "Processing..."}
                    </p>
                  </>
                ) : (
                  <FileVideo className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 z-10">
            <Badge
              className={cn(
                "text-xs font-semibold px-3 py-1 rounded-md border backdrop-blur-md",
                statusConfig.className,
              )}
            >
              <span className="mr-1.5">{statusConfig.icon}</span>
              {statusConfig.text}
            </Badge>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3 bg-black/80 backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-white truncate">
              {filename}
            </h3>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-3 flex-wrap">
            <span className="font-medium text-gray-300">
              {formatSize(size)}
            </span>

            {duration && (
              <>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(duration)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#18191A] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              Delete Video
            </h3>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{filename}"?
            </p>

            <div className="flex gap-3 justify-end">
              <Button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
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
});
