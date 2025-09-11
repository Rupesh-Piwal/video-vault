"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { ArrowLeft, Download } from "lucide-react";
import { VideoPlayer } from "./components/video-player";
import { VideoThumbnails } from "./components/video-thumbnails";
import { VideoMetadata } from "./components/video-metadata";
import { ShareLinksSection } from "./components/share-links-section";
import { CreateShareLinkModal } from "./components/create-share-link-modal";


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

  if (!video) {
    return <div className="p-6">Loading...</div>;
  }

  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const videoUrl = `https://${bucketName}.s3.amazonaws.com/${video.storage_key}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                {video.original_filename}
              </h1>
              <p className="text-muted-foreground text-sm">Video Viewer</p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl bg-transparent"
              asChild
            >
              <a href={videoUrl} download>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              videoUrl={videoUrl}
              thumbnails={thumbnails}
              type={video.mime_type}
              filename={video.original_filename}
            />
            <VideoThumbnails thumbnails={thumbnails} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <VideoMetadata
              filename={video.original_filename}
              type={video.mime_type}
              size={video.size_bytes}
              duration={video.duration_seconds}
              uploadDate={video.created_at}
              readyDate={video.ready_at}
            />
            <ShareLinksSection
              shareLinks={shareLinks}
              onCreateLink={() => setCreateLinkModalOpen(true)}
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
