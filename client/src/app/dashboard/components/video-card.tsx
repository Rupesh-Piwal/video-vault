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
  Play,
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
      icon: <CheckCircle className="h-2 w-2" />,
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
        className={cn(
          "group relative overflow-hidden aspect-video rounded-lg bg-black border border-[#1c1c1c]",
          "hover:border-gray-800/40 hover:shadow-xl cursor-pointer",
          "transition-all duration-300 hover:-translate-y-1",
        )}
        onMouseEnter={() => !isTouchDevice && setIsHovering(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovering(false)}
        onClick={handleCardClick}
      >
        {/* VIDEO / IMAGE */}
        <div className="relative aspect-video overflow-hidden bg-black">
          {/* Poster */}
          {status === "READY" && posterUrl && (
            <img
              src={posterUrl}
              alt={filename}
              className={cn(
                "absolute inset-0 w-full h-full object-cover",
                "transition-opacity duration-300",
                showPreview ? "opacity-0" : "opacity-100",
              )}
            />
          )}

          {/* Video Preview */}
          {status === "READY" && videoUrl && !isTouchDevice && (
            <video
              ref={videoPreviewRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className={cn(
                "absolute inset-0 w-full h-full object-cover",
                "transition-opacity duration-300",
                showPreview ? "opacity-100" : "opacity-0",
              )}
            />
          )}

          {/* PROCESSING / UPLOADING */}
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

          {/* TOP GRADIENT */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent z-10" />

          {/* STATUS BADGE */}
          <div className="absolute top-3 left-3 z-20">
            <Badge
              className={cn(
                "text-[8px] font-semibold px-1.5 py-1 rounded-lg border backdrop-blur-md",
                statusConfig.className,
              )}
            >
              <span className="mr-1.5">{statusConfig.icon}</span>
              {statusConfig.text}
            </Badge>
          </div>

          {/* PLAY BUTTON (center) */}
          {status === "READY" && (
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center z-20",
                "transition-opacity duration-300",
                "opacity-0 group-hover:opacity-100",
              )}
            >
              <div className="bg-black/60 backdrop-blur-md p-3 rounded-full">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          )}

          {/* DURATION BADGE */}
          {duration && status === "READY" && (
            <div className="absolute bottom-3 right-3 z-20 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>

        {/* 🔥 HOVER REVEAL PANEL */}
        <div
          className={cn(
            "absolute bottom-0 w-full p-3 flex flex-col gap-2 z-20",
            "bg-gradient-to-t from-black/90 via-black/70 to-transparent",
            "backdrop-blur-md",
            "transform transition-all duration-300 ease-out",
            "translate-y-full opacity-0",
            "group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-75",
            isTouchDevice && "translate-y-0 opacity-100",
          )}
        >
          {/* Title + Delete */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-white truncate">
              {filename}
            </h3>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Meta Info */}
          <div className="flex items-center text-xs sm:text-sm text-gray-300 gap-3 flex-wrap">
            <span className="text-[12px] font-medium">{formatSize(size)}</span>

            {duration && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-[12px] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
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
