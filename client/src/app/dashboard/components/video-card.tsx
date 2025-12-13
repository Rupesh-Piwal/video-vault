"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  Play,
  FileVideo,
  Trash2,
  X,
  ExternalLink,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDuration,
  formatSize,
  type VideoCardProps,
} from "@/lib/metadata-utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TextShimmer } from "../../../../components/motion-primitives/text-shimmer";
import { VideoPlayerModal } from "./video-player-modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDownload = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download video");
    }
  };

  return (
    <>
      <div className="group relative z-0 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-800/50 hover:border-neutral-700 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.02]">
        {/* Video Image/Poster */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {status === "READY" ? (
            posterUrl ? (
              <img
                src={posterUrl || "/placeholder.svg"}
                alt={filename}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
              </div>
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              {loadingUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-neutral-700/50 rounded-full p-4 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                  <TextShimmer className="font-mono text-sm" duration={1}>
                    Loading...
                  </TextShimmer>
                </div>
              ) : urlError ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-red-500/10 rounded-full p-4 backdrop-blur-sm">
                    <XCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <p className="text-sm font-medium text-neutral-400">
                    Failed to load
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-neutral-700/50 rounded-full p-4 backdrop-blur-sm">
                    {status === "PROCESSING" || status === "UPLOADING" ? (
                      statusConfig.icon
                    ) : (
                      <FileVideo className="h-8 w-8 text-neutral-400" />
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

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md",
                statusConfig.className
              )}
            >
              <span className="mr-1.5">{statusConfig.icon}</span>
              {statusConfig.text}
            </Badge>
          </div>

          {/* Gradient Overlay at Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {/* Bottom Content Overlay - Matching Screenshot Style */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-end justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-white mb-2 truncate">
                  {filename}
                </h3>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <span>{formatSize(size)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="text-neutral-100" size={14} />
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>

              {/* Circular Play Button - Matching Screenshot */}
              {status === "READY" && videoUrl && !urlError && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-violet-950 flex items-center justify-center bg-violet-950/40 backdrop-blur-sm hover:bg-white/20 hover:border-white hover:scale-110 transition-all duration-300 ml-4"
                >
                  <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
                </button>
              )}
            </div>
          </div>

          {/* Hover Actions Overlay */}
          {status === "READY" && !loadingUrl && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center gap-2 px-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="relative flex flex-col items-center justify-center h-full">
                {/* Center Play Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-br from-purple-500/30 to-violet-600/30 hover:from-purple-500/50 hover:to-violet-600/50 backdrop-blur-md rounded-full p-3 sm:p-6 shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer pointer-events-auto border border-white/20 hover:border-white/40"
                  aria-label="Play"
                >
                  <Play
                    className="h-4 w-4 sm:h-10 sm:w-10 text-white ml-1 drop-shadow-lg"
                    fill="currentColor"
                  />
                </button>

                {/* Bottom Action Buttons - Fixed at bottom */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-row items-center justify-center gap-3 p-4">
                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 h-8 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 font-medium rounded-full border border-neutral-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-200 cursor-pointer "
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>

                  {/* View Button */}
                  <button
                    onClick={() => router.push(`/videos/${id}`)}
                    className="flex items-center gap-2 px-3 h-8 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 font-medium rounded-full border border-neutral-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-200 cursor-pointer "
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm">View</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="flex items-center justify-center p-1.5 cursor-pointer bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-full border border-red-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-200"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Delete Video</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-800 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-neutral-400 mb-6 leading-relaxed">
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
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 shadow-lg shadow-red-500/20"
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

      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoUrl}
        posterUrl={posterUrl}
      />
    </>
  );
}
