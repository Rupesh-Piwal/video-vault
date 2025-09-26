"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DownloadButton } from "@/components/download-button";
import { Lock, AlertCircle, Clock } from "lucide-react";
import { formatDuration, formatSize } from "@/lib/metadata-utils";
import SVGLogo from "@/components/svg-logo";

type Video = {
  id: string;
  original_filename: string;
  storage_key: string;
  playback_url?: string;
  description?: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number;
  created_at: string;
  ready_at: string | null;
};

type ShareResponse =
  | { requireEmail: true }
  | { requireEmail: false; video: Video }
  | { error: string };

const fetcher = async (url: string): Promise<ShareResponse> => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    if (data?.error === "email_required") return { requireEmail: true };
    return { error: data?.error || "Video not found or link expired" };
  }

  if (!data?.video) return { error: "Video not found" };

  const videoData: Video = data.video;

  if (videoData.storage_key) {
    const signedRes = await fetch(
      `/api/video-url?key=${encodeURIComponent(videoData.storage_key)}`
    );
    const signedData = await signedRes.json();

    if (!signedRes.ok || !signedData?.url) {
      return { error: signedData?.error || "Failed to fetch video URL" };
    }

    videoData.playback_url = signedData.url;
  }

  return { requireEmail: false, video: videoData };
};

export default function SharedVideoPage() {
  const { token } = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [userEmail, setUserEmail] = useState(initialEmail);

  const url = useMemo(() => {
    if (!token) return null;
    const qp = userEmail ? `?email=${encodeURIComponent(userEmail)}` : "";
    return `/api/share/${token}${qp}`;
  }, [token, userEmail]);

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const onSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setUserEmail(email);
    mutate();
  };

  const video = data && "video" in data ? data.video : null;
  const title = video?.original_filename || "Shared Video";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B0D0E] to-[#18191A]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header Section */}
        {!isLoading && video && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <SVGLogo />
                  <h1 className="text-2xl md:text-3xl font-bold text-white truncate">
                    {title}
                  </h1>
                </div>

                {video?.description && (
                  <p className="text-gray-400 mt-2 text-lg">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1 bg-[#2B2C2D] px-3 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {formatDuration(video.duration_seconds)}
                  </span>
                  <span className="flex items-center gap-1 bg-[#2B2C2D] px-3 py-1 rounded-full">
                    {formatSize(video.size_bytes)}
                  </span>
                  <span className="flex items-center gap-1 bg-[#2B2C2D] px-3 py-1 rounded-full">
                    {video.mime_type}
                  </span>
                </div>
              </div>

              {video.playback_url && (
                <div className="ml-4 flex-shrink-0">
                  <DownloadButton
                    videoUrl={video.playback_url}
                    filename={video.original_filename}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="border-[#2B2C2D] bg-[#18191A] shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                Preparing your video
              </CardTitle>
              <CardDescription className="text-gray-400">
                This will just take a moment...
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Error State */}
        {!isLoading && (error || (data && "error" in data)) && (
          <Card className="border-[#2B2C2D] bg-[#18191A] shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                Unable to load video
              </CardTitle>
              <CardDescription className="text-red-400">
                {error?.message ||
                  (data && "error" in data && data.error) ||
                  "Something went wrong"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-4">
                Please check your link or try again later.
              </p>
              <Button
                onClick={() => mutate()}
                variant="outline"
                className="border-[#2B2C2D] text-gray-300 hover:bg-[#2B2C2D] hover:text-white"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Email Gate */}
        {!isLoading && data && "requireEmail" in data && data.requireEmail && (
          <Card className="border-[#2B2C2D] bg-[#18191A] shadow-2xl max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Lock className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                Private Video
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter your email to access this content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmitEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#2B2C2D] bg-[#0B0D0E] text-white placeholder-gray-500 focus:border-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Access Video
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Video Player */}
        {!isLoading && video && video.playback_url && (
          <section className="space-y-6">
            <div
              className={cn(
                "overflow-hidden rounded-xl border-2 border-[#2B2C2D]",
                "bg-black shadow-2xl"
              )}
            >
              <video
                src={video.playback_url}
                controls
                className="w-full aspect-video"
                poster={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" fill="%2318191A"><rect width="1920" height="1080" fill="%230B0D0E"/><text x="50%" y="50%" font-family="system-ui" font-size="48" fill="%232B2C2D" text-anchor="middle" dy=".3em">${encodeURIComponent(
                  title
                )}</text></svg>`}
              />
            </div>

            {/* Quick Info Bar */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="bg-[#2B2C2D] px-4 py-2 rounded-lg">
                Shared via VideoVault
              </span>
            </div>
          </section>
        )}

        {/* Video Unavailable */}
        {!isLoading && video && !video.playback_url && (
          <Card className="border-[#2B2C2D] bg-[#18191A] shadow-2xl text-center">
            <CardContent className="py-16">
              <div className="p-3 bg-[#2B2C2D] rounded-full w-fit mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Video Unavailable
              </h3>
              <p className="text-gray-400">
                This video is currently not available for playback.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
