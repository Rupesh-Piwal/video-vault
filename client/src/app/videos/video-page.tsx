"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { VideoPlayer } from "./components/video-player";
import { VideoThumbnails } from "./components/video-thumbnails";
import { VideoMetadata } from "./components/video-metadata";

import { DownloadButton } from "@/components/download-button";
import { TextShimmer } from "../../../components/motion-primitives/text-shimmer";
import { ShareLinksSection } from "./[id]/components/share-links-section";
import { CreateShareLinkModal } from "./[id]/components/create-share-link-modal";

interface VideoPageProps {
  videoId: string;
}

export default function VideoPage({ videoId }: VideoPageProps) {
  const router = useRouter();
  const supabase = createClient();

  const [video, setVideo] = useState<any>(null);
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [shareLinks, setShareLinks] = useState<any[]>([]);
  const [createLinkModalOpen, setCreateLinkModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: videoData } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

      setVideo(videoData);

      const { data: thumbs } = await supabase
        .from("thumbnails")
        .select("*")
        .eq("video_id", videoId);

      setThumbnails(thumbs || []);

      const { data: links } = await supabase
        .from("share_links")
        .select("*")
        .eq("video_id", videoId);

      setShareLinks(links || []);
    }

    fetchData();
  }, [supabase, videoId]);

  // Fetch signed URL when video data is available and status is READY
  useEffect(() => {
    if (video?.status === "READY") {
      setLoadingUrl(true);
      fetch(`/api/video-url?key=${encodeURIComponent(video.storage_key)}`)
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
  }, [video?.status, video?.storage_key]);

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <TextShimmer
            className="text-lg md:text-xl font-semibold"
            duration={1.2}
          >
            Loading video data...
          </TextShimmer>
          <Loader2 className="h-6 w-6 text-foreground animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[#2B2C2D] bg-[#18191A]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="rounded-xl cursor-pointer border"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="md:text-xl font-semibold text-foreground">
                {video.original_filename}
              </h1>
              <p className="text-muted-foreground text-[10px] md:text-sm">
                Video Viewer
              </p>
            </div>
            {videoUrl && (
              <div className="flex-shrink-0">
                <DownloadButton
                  videoUrl={videoUrl}
                  filename={video.original_filename}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <div className="lg:col-span-4 space-y-6">
            {loadingUrl && (
              <div className="flex items-center justify-center min-h-[16rem] md:min-h-[20rem] bg-muted rounded-lg w-full">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <TextShimmer className="font-mono text-sm" duration={1}>
                    Generating code...
                  </TextShimmer>
                </div>
              </div>
            )}

            {urlError && (
              <div className="flex items-center justify-center min-h-[16rem] md:min-h-[20rem] bg-muted rounded-lg w-full">
                <p className="text-red-500 text-center">
                  Failed to load video.
                </p>
              </div>
            )}

            {videoUrl && !loadingUrl && !urlError && (
              <VideoPlayer
                id={video.id}
                status={video.status}
                videoUrl={videoUrl}
                thumbnails={thumbnails}
                type={video.mime_type}
                filename={video.original_filename}
              />
            )}
            <ShareLinksSection
              shareLinks={shareLinks}
              onCreateLink={() => setCreateLinkModalOpen(true)}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6 ">
            <VideoThumbnails thumbnails={thumbnails} />

            <VideoMetadata
              filename={video.original_filename}
              type={video.mime_type}
              size={video.size_bytes}
              duration={video.duration_seconds}
              uploadDate={video.created_at}
              readyDate={video.ready_at}
            />
          </div>
        </div>
      </div>

      <CreateShareLinkModal
        open={createLinkModalOpen}
        onOpenChange={setCreateLinkModalOpen}
        videoId={videoId}
      />
    </div>
  );
}
