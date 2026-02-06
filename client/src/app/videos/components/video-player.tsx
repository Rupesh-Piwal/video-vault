"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  id?: string;
  status?: string;
  videoUrl: string;
  thumbnails: { id: string; storage_key: string }[];
  type: string;
  filename: string;
}

let currentlyPlayingVideo: HTMLVideoElement | null = null;

export function VideoPlayer({
  videoUrl,
  type,
  filename,
  id,
  status,
}: VideoPlayerProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (status !== "READY" || !id) return;

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

  return (
    <div className="relative group">
      {/* Glassmorphic container with gradient */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-bg-card-dark/80 via-bg-dark-base/90 to-black/95 backdrop-blur-xl border border-glass-border/20 shadow-2xl shadow-black/50">
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-accent/5 via-transparent to-electric-blue/5 pointer-events-none" />

        {/* Subtle top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-border/40 to-transparent" />

        {/* Video container with perfect aspect ratio */}
        <div
          className="relative aspect-video bg-black overflow-hidden"
          onMouseEnter={() => !isTouchDevice && setIsHovering(true)}
          onMouseLeave={() => !isTouchDevice && setIsHovering(false)}
        >
          {/* Premium video element */}
          <video
            ref={videoPreviewRef}
            controls
            className="w-full h-full object-contain bg-black"
            poster={posterUrl || undefined}
            src={videoUrl || ""}
            preload="metadata"
            aria-label={`Video player for ${filename}`}
            controlsList="nodownload"
          >
            <source src={videoUrl} type={type} />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Bottom gradient fade for premium look */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Outer glow on hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-violet-accent/0 via-violet-accent/0 to-electric-blue/0 group-hover:from-violet-accent/20 group-hover:via-neon-purple/10 group-hover:to-electric-blue/20 -z-10 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    </div>
  );
}
