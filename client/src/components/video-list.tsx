"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { VideoCard } from "./video-card";
import { VideoCardProps } from "@/lib/metadata-utils";

// interface Video {
//   id: string;
//   original_filename: string;
//   status: string;
//   storage_key: string;
//   created_at: string;
//   filename: string;
//   type: string;
//   size: number;
//   duration: number | null;
//   uploadDate: string;
// }

export function VideoList() {
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
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
        { event: "*", schema: "public", table: "videos" },
        (payload) => {
          console.log("Realtime payload:", payload);

          setVideos((prev) => {
            if (payload.eventType === "INSERT") {
              // naya video add karo
              return [...prev, payload.new as any];
            }

            if (payload.eventType === "UPDATE") {
              // status ya aur fields update karo
              return prev.map((v) =>
                v.id === payload.new.id ? { ...v, ...payload.new } : v
              );
            }

            if (payload.eventType === "DELETE") {
              // deleted video hatao
              return prev.filter((v) => v.id !== payload.old.id);
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe(); // ✅ latest supabase cleanup
    };
  }, [supabase]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video.id} {...video} />)
      ) : (
        <p className="text-muted-foreground">No videos uploaded yet.</p>
      )}
    </div>
  );
}
