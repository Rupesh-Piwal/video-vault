"use client";

import type React from "react";

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
    if (!video) return;

    if (isOpen) {
      // Reset video state when modal opens
      video.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);

      // Attempt to play with proper error handling
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay was prevented, user needs to interact first
          console.log("Autoplay prevented, waiting for user interaction");
          setIsPlaying(false);
        });
      }
    } else {
      // Pause and reset when modal closes
      video.pause();
      setIsPlaying(false);
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
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gray-800/90 backdrop-blur-sm rounded-full p-2 sm:p-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 z-10 border border-gray-600/50 hover:scale-110"
          aria-label="Close video"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-2xl ring-1 ring-gray-600/50 group/modal">
          <video
            ref={videoRef}
            src={videoUrl || ""}
            poster={posterUrl || undefined}
            className="w-full h-full object-cover"
            preload="metadata"
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={handlePlayPause}
          />

          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/modal:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none">
            <button
              onClick={handlePlayPause}
              className="bg-white/90 hover:bg-white backdrop-blur-md rounded-full p-5 sm:p-6 shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer pointer-events-auto border border-gray-300/50"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause
                  className="h-8 w-8 sm:h-10 sm:w-10 text-black"
                  fill="currentColor"
                />
              ) : (
                <Play
                  className="h-8 w-8 sm:h-10 sm:w-10 text-black ml-1"
                  fill="currentColor"
                />
              )}
            </button>
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 bg-gradient-to-t from-black via-black/95 to-transparent opacity-100 md:opacity-0 md:group-hover/modal:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-full cursor-pointer group/progress mb-3 sm:mb-4 overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full relative transition-all duration-150 shadow-lg shadow-white/30"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg ring-2 ring-gray-600" />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={handlePlayPause}
                  className="hover:bg-white/10 rounded-full p-1.5 sm:p-2 transition-all duration-200 hover:scale-110 text-white"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="currentColor"
                    />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="hover:bg-white/10 rounded-full p-1.5 sm:p-2 transition-all duration-200 hover:scale-110 text-white"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
                <span className="text-white text-xs sm:text-sm font-medium tabular-nums tracking-tight hidden xs:block">
                  {formatDuration(currentTime)} /{" "}
                  {formatDuration(videoDuration)}
                </span>
                <span className="text-white text-[10px] sm:text-xs font-medium tabular-nums tracking-tight xs:hidden">
                  {formatDuration(currentTime)}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleFullScreen}
                  className="hover:bg-white/10 rounded-full p-1.5 sm:p-2 transition-all duration-200 hover:scale-110 text-white"
                  aria-label="Fullscreen"
                >
                  <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
