"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";


type ShareLinkStatus = "Active" | "Expired" | "Revoked";

interface RawShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status?: string | null;
}

interface ShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status: ShareLinkStatus;
}

interface Props {
  shareLinks: RawShareLink[];
  onCreateLink: () => void;
  onLinksUpdated?: (links: ShareLink[]) => void;
}

function normalizeStatus(s?: string | null): ShareLinkStatus {
  if (!s) return "Active";
  const st = s.toLowerCase();
  if (st === "revoked") return "Revoked";
  if (st === "expired") return "Expired";
  return "Active";
}

function formatDateTime(isoString: string | null) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ShareLinksSection({
  shareLinks: rawShareLinks,
  onCreateLink,
  onLinksUpdated,
}: Props) {
  const toTyped = (raw: RawShareLink[]): ShareLink[] =>
    (raw ?? []).map((r) => ({
      id: r.id,
      url: r.url,
      visibility: r.visibility,
      expiry: r.expiry,
      last_viewed_at: r.last_viewed_at,
      status: normalizeStatus(r.status),
    }));

  const [links, setLinks] = useState<ShareLink[]>(() => toTyped(rawShareLinks));

  // 🔄 keep state in sync when parent props change
  useEffect(() => {
    setLinks(toTyped(rawShareLinks));
  }, [rawShareLinks]);

  // 🔔 subscribe to realtime changes in "share_links" table
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
  }, []);

  async function disableLink(id: string) {
    try {
      const res = await fetch(`/api/share-links/${id}/disable`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to disable");
      toast.success("🚫 Link disabled");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to disable link");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Share Links</h2>
        <Button onClick={onCreateLink}>+ New Link</Button>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">No links yet.</p>
      ) : (
        <ScrollArea className="w-full h-[240px] rounded-md border">
          <Table className="w-full min-w-[650px]">
            <TableHeader>
              <TableRow>
                <TableHead>Visibility</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Viewed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.visibility}</TableCell>
                  <TableCell>
                    {link.expiry ? formatDateTime(link.expiry) : "Forever"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        link.status === "Expired" || link.status === "Revoked"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(link.last_viewed_at)}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(link.url);
                        toast.success("📋 Link copied to clipboard!");
                      }}
                    >
                      Copy
                    </Button>
                    {link.status === "Active" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => disableLink(link.id)}
                      >
                        Disable
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
