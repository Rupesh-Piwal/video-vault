"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, X, Maximize } from "lucide-react";
import { formatDuration } from "@/lib/metadata-utils";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  posterUrl: string | null;
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  posterUrl,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (isOpen) {
      video
        ?.play()
        .catch((error) => console.error("Autoplay was prevented:", error));
    } else {
      video?.pause();
    }
  }, [isOpen]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
      setIsPlaying(!video.paused);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    videoRef.current.currentTime = videoRef.current.duration * percentage;
  };

  const toggleFullScreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black group/modal">
          <video
            ref={videoRef}
            src={videoUrl || ""}
            poster={posterUrl || undefined}
            className="w-full h-full"
            preload="metadata"
            autoPlay
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={handlePlayPause}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/modal:opacity-100 transition-opacity duration-300 bg-black/40 pointer-events-none">
            <button
              onClick={handlePlayPause}
              className="bg-white/20 hover:bg-white/30 rounded-full p-4 shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer pointer-events-auto"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" fill="currentColor" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
              )}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/modal:opacity-100 transition-opacity duration-300">
            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              className="w-full h-2.5 bg-white/20 rounded-full cursor-pointer group/progress"
            >
              <div
                className="h-full bg-red-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3.5 w-3.5 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <button onClick={handlePlayPause}>
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" fill="currentColor" />
                  ) : (
                    <Play className="h-5 w-5 text-white" fill="currentColor" />
                  )}
                </button>
                <button onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </button>
                <span className="text-white text-xs font-medium">
                  {formatDuration(currentTime)} /{" "}
                  {formatDuration(videoDuration)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={toggleFullScreen}>
                  <Maximize className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-800 rounded-full p-1.5 text-white hover:bg-gray-700 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
