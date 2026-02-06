"use client";

import { useEffect, useState, useRef } from "react";
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

export function VideoCard({
  id,
  filename,
  size,
  duration,
  status,
  storage_key,
  onDelete,
}: VideoCardProps & { onDelete?: (id: string) => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

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

  useEffect(() => {
    if (status !== "READY") return;
    const base = "https://video-vault-rp.s3.ap-south-1.amazonaws.com";
    setPosterUrl(`${base}/thumbnails/${id}/thumb-3.jpg`);
  }, [id, status]);

  // Handle hover preview
  useEffect(() => {
    if (!videoUrl || isTouchDevice || status !== "READY") return;

    const video = videoPreviewRef.current;
    if (!video) return;

    if (isHovering) {
      // Start 200ms delay before playing
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);

        // Pause any other playing video
        if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
          currentlyPlayingVideo.pause();
          currentlyPlayingVideo.currentTime = 0;
        }

        // Play this video
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              currentlyPlayingVideo = video;
            })
            .catch((error) => {
              console.log("Autoplay prevented:", error);
            });
        }
      }, 200);
    } else {
      // Clear timeout if hover ends before 200ms
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      // Pause and reset video
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
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Clock className="h-3 w-3" />,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleCardClick = () => {
    if (status === "READY" && !loadingUrl && !urlError) {
      router.push(`/videos/${id}`);
    }
  };

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-lg bg-[#000000] border border-gray-400/20 hover:border-gray-800/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 cursor-pointer"
        onMouseEnter={() => !isTouchDevice && setIsHovering(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovering(false)}
        onClick={handleCardClick}
      >
        {/* Video Container - 16:9 aspect ratio */}
        <div className="relative aspect-video overflow-hidden bg-black">
          {/* Thumbnail/Poster */}
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

          {/* Hover Preview Video */}
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

          {/* Loading/Processing States */}
          {status !== "READY" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              {loadingUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                  <p className="text-sm text-gray-400">Loading...</p>
                </div>
              ) : urlError ? (
                <div className="flex flex-col items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-400" />
                  <p className="text-sm text-gray-400">Failed to load</p>
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* Status Badge */}
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

          {/* Duration Badge */}
          {status === "READY" && duration && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-black/80 text-white border-0 backdrop-blur-md text-xs px-2 py-1">
                {formatDuration(duration)}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Footer - Title and Info */}
        <div className="p-4 bg-[#18191A]">
          <h3 className="text-base font-semibold text-white mb-2 truncate">
            {filename}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{formatSize(size)}</span>
            {duration && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(duration)}
                </span>
              </>
            )}
            {/* Delete Button - Bottom Right */}
            {status === "READY" && !loadingUrl && (
              <div className="absolute bottom-3 right-3 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  disabled={isDeleting}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-md border border-red-500/30 backdrop-blur-md hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(false);
          }}
        >
          <div
            className="bg-[#18191A] border border-gray-400/20 rounded-lg p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Delete Video</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                &quot;{filename}&quot;
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-6"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
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
