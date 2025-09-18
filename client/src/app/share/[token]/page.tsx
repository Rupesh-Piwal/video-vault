"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface Video {
  id: string;
  original_filename?: string;
  storage_key: string; // S3 key
  playback_url?: string; // S3 signed URL
  description?: string;
}

export default function SharedVideoPage() {
  const { token } = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1️⃣ Fetch video metadata from your API
        const res = await fetch(
          `/api/share/${token}${email ? `?email=${email}` : ""}`
        );
        const data = await res.json();

        if (!res.ok || !data.video) {
          setError(data.error || "Video not found or link expired");
          return;
        }

        const videoData: Video = data.video;

        // 2️⃣ Fetch signed URL from your S3 API
        if (videoData.storage_key) {
          const signedRes = await fetch(
            `/api/video-url?key=${encodeURIComponent(videoData.storage_key)}`
          );
          const signedData = await signedRes.json();

          if (!signedRes.ok || !signedData.url) {
            throw new Error(
              signedData.error || "Failed to fetch S3 signed URL"
            );
          }

          videoData.playback_url = signedData.url;
        }

        setVideo(videoData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, email]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-600">❌ {error}</p>;
  if (!video) return <p className="p-6 text-center">No video found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {video.original_filename || "Shared Video"}
      </h1>
      {video.description && (
        <p className="mb-4 text-muted-foreground">{video.description}</p>
      )}
      {video.playback_url ? (
        <video
          src={video.playback_url}
          controls
          className="w-full rounded-lg border"
        />
      ) : (
        <p className="text-center text-gray-500">Video not available</p>
      )}
    </div>
  );
}
