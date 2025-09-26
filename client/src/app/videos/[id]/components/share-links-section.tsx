// components/share-links-section.tsx
"use client";

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
import { ShareLink, useShareLinks, type RawShareLink } from "@/hooks/useShareLinks";
import { useEffect } from "react";
import { formatDate, formatDateTime } from "@/lib/metadata-utils";

interface Props {
  shareLinks?: RawShareLink[];
  videoId?: string;
  onCreateLink: () => void;
  onLinksUpdated?: (links: ShareLink[]) => void;
   
}

export function ShareLinksSection({
  shareLinks = [],
  videoId,
  onCreateLink,
  onLinksUpdated,
}: Props) {
  const { links, loading, error, disableLink } = useShareLinks(shareLinks, videoId);

  // Notify parent when links are updated
  useEffect(() => {
    onLinksUpdated?.(links);
  }, [links, onLinksUpdated]);

  const handleDisableLink = async (id: string) => {
    try {
      await disableLink(id);
      toast.success("🚫 Link disabled");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to disable link");
    }
  };

  const handleCopyLink = (url: string) => {
    if (!url) {
      toast.error("❌ No link available to copy");
      return;
    }
    navigator.clipboard.writeText(url);
    toast.success("📋 Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Share Links</h2>
          <Button disabled>+ New Link</Button>
        </div>
        <div className="flex items-center justify-center h-[240px]">
          <p className="text-sm text-muted-foreground">Loading share links...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Share Links</h2>
          <Button onClick={onCreateLink}>+ New Link</Button>
        </div>
        <div className="flex items-center justify-center h-[240px]">
          <p className="text-sm text-red-500">Error: {error}</p>
        </div>
      </div>
    );
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
                    {link.expiry ? formatDate(link.expiry) : "Forever"}
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
                      onClick={() => handleCopyLink(link.url)}
                    >
                      Copy
                    </Button>

                    {link.status === "Active" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDisableLink(link.id)}
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