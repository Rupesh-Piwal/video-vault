// hooks/useShareLinks.ts
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";

export type ShareLinkStatus = "Active" | "Expired" | "Revoked";

export interface RawShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  revoked?: boolean;
  status: ShareLinkStatus;
  video_id?: string; // Add this field
}

export interface ShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status: ShareLinkStatus;
}

interface UseShareLinksReturn {
  links: ShareLink[];
  loading: boolean;
  error: string | null;
  disableLink: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useShareLinks(
  initialShareLinks: RawShareLink[] = [],
  videoId?: string
): UseShareLinksReturn {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const normalizeStatus = (raw: RawShareLink): ShareLinkStatus => {
    if (raw.revoked) return "Revoked";
    if (raw.expiry && new Date(raw.expiry) < new Date()) {
      return "Expired";
    }
    return "Active";
  };

  const toTyped = (raw: RawShareLink[]): ShareLink[] =>
    (raw ?? []).map((r) => ({
      id: r.id,
      url: r.url || `${APP_URL}/share/${r.id}`,
      visibility: r.visibility,
      expiry: r.expiry,
      last_viewed_at: r.last_viewed_at,
      status: normalizeStatus(r),
    }));

  const [links, setLinks] = useState<ShareLink[]>(() =>
    toTyped(initialShareLinks)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch share links if videoId is provided
  const fetchShareLinks = async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("share_links")
        .select("*")
        .eq("video_id", videoId)
        .order("created_at", { ascending: false }); // Order by newest first

      if (fetchError) throw fetchError;
      setLinks(toTyped(data || []));
    } catch (err) {
      console.error("Error fetching share links:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch share links"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initialize with provided data or fetch if videoId is provided
  useEffect(() => {
    if (videoId) {
      fetchShareLinks();
    } else {
      setLinks(toTyped(initialShareLinks));
    }
  }, [videoId, initialShareLinks]);

  // FIXED: Realtime subscription for share links
  useEffect(() => {
    const supabase = createClient();

    // If we have a videoId, subscribe to changes for that specific video
    // If no videoId, we might be in a context where we need to listen to all changes
    let filter = "";
    if (videoId) {
      filter = `video_id=eq.${videoId}`;
    }

    const channel = supabase
      .channel("share-links-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "share_links",
          ...(filter && { filter }), // Only add filter if it exists
        },
        (payload) => {
          console.log("Realtime event:", payload);

          // For INSERT events, check if the new link belongs to our current video
          if (payload.eventType === "INSERT") {
            const newLink = payload.new as RawShareLink;

            // If we have a videoId filter, only add if it matches
            // If no videoId, add all new links (for contexts like admin views)
            if (!videoId || newLink.video_id === videoId) {
              setLinks((prev) => {
                // Check if link already exists to avoid duplicates
                if (prev.some((link) => link.id === newLink.id)) {
                  return prev;
                }
                return [toTyped([newLink])[0], ...prev]; // Add to beginning
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedLink = payload.new as RawShareLink;

            // If we have a videoId filter, only update if it matches
            // If no videoId, update all matching links
            if (!videoId || updatedLink.video_id === videoId) {
              setLinks((prev) =>
                prev.map((l) =>
                  l.id === updatedLink.id ? toTyped([updatedLink])[0] : l
                )
              );
            } else {
              // If the updated link no longer belongs to our video, remove it
              setLinks((prev) => prev.filter((l) => l.id !== updatedLink.id));
            }
          } else if (payload.eventType === "DELETE") {
            // Always remove deleted links regardless of video_id
            setLinks((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [videoId]); // Re-subscribe when videoId changes

  const disableLink = async (id: string): Promise<void> => {
    try {
      setLinks((prev) =>
        prev.map((link) =>
          link.id === id
            ? { ...link, status: "Revoked" as ShareLinkStatus }
            : link
        )
      );

      const res = await fetch(`/api/share-links/${id}/disable`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to disable link");
      }
    } catch (err) {
      console.error("Error disabling link:", err);

      setLinks((prev) =>
        prev.map((link) =>
          link.id === id
            ? { ...link, status: "Active" as ShareLinkStatus }
            : link
        )
      );

      throw err;
    }
  };

  return {
    links,
    loading,
    error,
    disableLink,
    refetch: fetchShareLinks,
  };
}
