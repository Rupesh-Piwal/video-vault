"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/supabase/client";
import {
  RawShareLink,
  ShareLink,
  ShareLinkStatus,
  UseShareLinksReturn,
} from "@/types/share";

export function useShareLinks(
  initialShareLinks: RawShareLink[] = [],
  videoId?: string
): UseShareLinksReturn {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const normalizeStatus = useCallback((raw: RawShareLink): ShareLinkStatus => {
    if (raw.revoked) return "Revoked";
    if (raw.expiry && new Date(raw.expiry) < new Date()) return "Expired";
    return "Active";
  }, []);

  const toTyped = useCallback(
    (raw: RawShareLink[]): ShareLink[] =>
      (raw ?? []).map((r) => ({
        id: r.id,
        url: r.url || `${APP_URL}/share/${r.id}`,
        visibility: r.visibility,
        expiry: r.expiry,
        last_viewed_at: r.last_viewed_at,
        status: normalizeStatus(r),
      })),
    [APP_URL, normalizeStatus]
  );

  const [links, setLinks] = useState<ShareLink[]>(() =>
    toTyped(initialShareLinks)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShareLinks = useCallback(async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("share_links")
        .select("*")
        .eq("video_id", videoId)
        .order("created_at", { ascending: false });

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
  }, [videoId, toTyped]);

  useEffect(() => {
    if (videoId) {
      fetchShareLinks();
    } else {
      setLinks(toTyped(initialShareLinks));
    }
  }, [videoId, initialShareLinks, fetchShareLinks, toTyped]);

  useEffect(() => {
    const supabase = createClient();
    let filter = videoId ? `video_id=eq.${videoId}` : "";

    const channel = supabase
      .channel("share-links-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "share_links",
          ...(filter && { filter }),
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newLink = payload.new as RawShareLink;
            if (!videoId || newLink.video_id === videoId) {
              setLinks((prev) => {
                if (prev.some((link) => link.id === newLink.id)) return prev;
                return [toTyped([newLink])[0], ...prev];
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedLink = payload.new as RawShareLink;
            if (!videoId || updatedLink.video_id === videoId) {
              setLinks((prev) =>
                prev.map((l) =>
                  l.id === updatedLink.id ? toTyped([updatedLink])[0] : l
                )
              );
            } else {
              setLinks((prev) => prev.filter((l) => l.id !== updatedLink.id));
            }
          } else if (payload.eventType === "DELETE") {
            setLinks((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [videoId, toTyped]);

  const disableLink = async (id: string): Promise<void> => {
    try {
      setLinks((prev) =>
        prev.map((link) =>
          link.id === id ? { ...link, status: "Revoked" } : link
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
          link.id === id ? { ...link, status: "Active" } : link
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
