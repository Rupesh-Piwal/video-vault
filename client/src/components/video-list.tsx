"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { VideoCard } from "./video-card";


interface Video {
  id: string;
  original_filename: string;
  status: string;
  storage_key: string;
  created_at: string;
}

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const supabase = createClient();

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setVideos(data);
    };

    fetchVideos();

    // Realtime subscription for updates
    const channel = supabase
      .channel("video-list")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "videos" },
        (payload) => {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === payload.new.id ? { ...v, status: payload.new.status } : v
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video.id} video={video} />)
      ) : (
        <p className="text-muted-foreground">No videos uploaded yet.</p>
      )}
    </div>
  );
}
