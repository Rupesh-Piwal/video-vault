"use client";

import React, { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  Trash2,
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
            .catch(() => { });
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
          "group relative overflow-hidden aspect-video rounded-2xl",
          "bg-gradient-to-b from-[#0f0f11] to-[#09090b]",
          "border border-white/5",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)]",
          "hover:border-white/10 cursor-pointer",
        )}
        onMouseEnter={() => !isTouchDevice && setIsHovering(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovering(false)}
        onClick={handleCardClick}
      >
        {/* MEDIA */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl">
          {/* Poster */}
          {status === "READY" && posterUrl && (
            <img
              src={posterUrl}
              alt={filename}
              className={cn(
                "absolute inset-0 w-full h-full object-cover",
                "transition-all duration-500 ease-out",
                showPreview ? "opacity-0 scale-105" : "opacity-100 scale-100",
              )}
            />
          )}

          {/* Video */}
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
                "transition-all duration-500 ease-out",
                showPreview ? "opacity-100 scale-100" : "opacity-0 scale-105",
              )}
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90" />

          {/* Status */}
          <div className="absolute top-3 left-3 z-20">
            <Badge
              className={cn(
                "text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-xl border",
                statusConfig.className,
              )}
            >
              {statusConfig.text}
            </Badge>
          </div>

          {/* Play Button */}
          {status === "READY" && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div
                className={cn(
                  "transition-all duration-300",
                  "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100",
                )}
              >
                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-full border border-white/20">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </div>
            </div>
          )}

          {/* Duration */}
          {duration && status === "READY" && (
            <div className="absolute bottom-3 right-3 z-20 text-[11px] bg-black/60 backdrop-blur px-2 py-0.5 rounded-md text-white">
              {formatDuration(duration)}
            </div>
          )}
        </div>

        {/* HOVER PANEL */}
        <div
          className={cn(
            "absolute bottom-0 w-full px-4 pb-4 pt-8 z-20",
            "bg-gradient-to-t from-black/90 via-black/70 to-transparent",
            "transition-all duration-300 ease-out",
            "translate-y-full opacity-0",
            "group-hover:translate-y-0 group-hover:opacity-100",
            isTouchDevice && "translate-y-0 opacity-100",
          )}
        >
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {filename}
            </h3>

            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center text-xs text-gray-400 mt-1 gap-2">
            <span>{formatSize(size)}</span>

            {duration && (
              <>
                <span className="opacity-40">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(duration)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Video
            </h3>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">{filename}</span>?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-300 hover:bg-white/5"
              >
                Cancel
              </Button>

              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 rounded-lg"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
