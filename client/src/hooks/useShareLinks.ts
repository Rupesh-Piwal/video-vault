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
  status?: string | null;
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

  const normalizeStatus = (s?: string | null): ShareLinkStatus => {
    if (!s) return "Active";
    const st = s.toLowerCase();
    if (st === "revoked") return "Revoked";
    if (st === "expired") return "Expired";
    return "Active";
  };

  // Normalize raw share links to typed share links
  const toTyped = (raw: RawShareLink[]): ShareLink[] =>
    (raw ?? []).map((r) => ({
      id: r.id,
      url: r.url || `${APP_URL}/share/${r.id}`,
      visibility: r.visibility,
      expiry: r.expiry,
      last_viewed_at: r.last_viewed_at,
      status: normalizeStatus(r.status),
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
        .eq("video_id", videoId);

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

  // Realtime subscription for share links
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("share-links-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT | UPDATE | DELETE
          schema: "public",
          table: "share_links",
          ...(videoId && { filter: `video_id=eq.${videoId}` }),
        },
        (payload) => {
          console.log("Realtime event:", payload);

          if (payload.eventType === "INSERT") {
            setLinks((prev) => [
              ...prev,
              toTyped([payload.new as RawShareLink])[0],
            ]);
          }
          if (payload.eventType === "UPDATE") {
            setLinks((prev) =>
              prev.map((l) =>
                l.id === payload.new.id
                  ? toTyped([payload.new as RawShareLink])[0]
                  : l
              )
            );
          }
          if (payload.eventType === "DELETE") {
            setLinks((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [videoId]);

  // Disable link function
  const disableLink = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/share-links/${id}/disable`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to disable link");

      // Optimistic update
      setLinks((prev) =>
        prev.map((link) =>
          link.id === id
            ? { ...link, status: "Revoked" as ShareLinkStatus }
            : link
        )
      );
    } catch (err) {
      console.error("Error disabling link:", err);
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
