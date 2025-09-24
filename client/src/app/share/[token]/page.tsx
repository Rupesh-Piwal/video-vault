"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface Video {
  id: string;
  original_filename?: string;
  storage_key: string;
  playback_url?: string;
  description?: string;
}

export default function SharedVideoPage() {
  const { token } = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [userEmail, setUserEmail] = useState(searchParams.get("email") || "");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Build URL with email if available
        const url = `/api/share/${token}${
          userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""
        }`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          if (data.error === "email_required") {
            setShowEmailForm(true);
            setError(null);
            setLoading(false);
            return;
          }
          setError(data.error || "Video not found or link expired");
          return;
        }

        if (!data.video) {
          setError("Video not found");
          return;
        }

        const videoData: Video = data.video;

        // Fetch signed URL from S3
        if (videoData.storage_key) {
          const signedRes = await fetch(
            `/api/video-url?key=${encodeURIComponent(videoData.storage_key)}`
          );
          const signedData = await signedRes.json();

          if (!signedRes.ok || !signedData.url) {
            throw new Error(signedData.error || "Failed to fetch video URL");
          }

          videoData.playback_url = signedData.url;
        }

        setVideo(videoData);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      load();
    }
  }, [token, userEmail]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserEmail(email);
    setLoading(true);
    setShowEmailForm(false);
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  if (showEmailForm) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Private Video</h1>
        <p className="mb-4">
          This is a private video. Please enter your email to access it.
        </p>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
          >
            Access Video
          </button>
        </form>
      </div>
    );
  }

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
