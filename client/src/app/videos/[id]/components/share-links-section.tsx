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
import {
  
  useShareLinks,
   
} from "@/hooks/useShareLinks";
import { useEffect } from "react";
import { formatDate, formatDateTime } from "@/lib/metadata-utils";
import {
  Shield,
  Eye,
  Calendar,
  Clock,
  Zap,
  Ban,
} from "lucide-react";
import { RawShareLink, ShareLink } from "@/types/share";

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
  const { links, loading, error, disableLink } = useShareLinks(
    shareLinks,
    videoId
  );

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Expired":
        return "secondary";
      case "Revoked":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        );
      case "Expired":
        return <Clock className="w-3 h-3" />;
      case "Revoked":
        return <Ban className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Share Links</h2>
          <Button
            disabled
            variant="outline"
            className="border-[#2B2C2D] bg-white text-black cursor-pointer"
          >
            + New Link
          </Button>
        </div>
        <div className="flex items-center justify-center h-48 bg-[#18191A] rounded-lg border border-[#2B2C2D]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-400">Loading share links...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Share Links</h2>
          <Button
            onClick={onCreateLink}
            className="border-[#2B2C2D] bg-white text-black cursor-pointer"
          >
            + New Link
          </Button>
        </div>
        <div className="flex items-center justify-center h-48 bg-[#18191A] rounded-lg border border-[#2B2C2D]">
          <p className="text-sm text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Share Links</h2>
          <Badge
            variant="outline"
            className="bg-[#2B2C2D] text-gray-300 border-[#2B2C2D]"
          >
            {links.length}
          </Badge>
        </div>
        <Button
          onClick={onCreateLink}
          className="border-[#2B2C2D] bg-white text-black cursor-pointer"
        >
          + New Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12 bg-[#18191A] rounded-lg border border-[#2B2C2D]">
          <Eye className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No share links created yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Create your first share link to get started
          </p>
        </div>
      ) : (
        <ScrollArea className="w-full h-[280px] rounded-lg">
          <div className="border border-[#2B2C2D] rounded-lg bg-[#18191A]">
            <Table>
              <TableHeader className="border-b border-[#2B2C2D]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-gray-400 font-medium py-3">
                    Visibility
                  </TableHead>
                  <TableHead className="text-gray-400 font-medium py-3">
                    Expiry
                  </TableHead>
                  <TableHead className="text-gray-400 font-medium py-3">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-400 font-medium py-3">
                    Last Viewed
                  </TableHead>
                  <TableHead className="text-right text-gray-400 font-medium py-3">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow
                    key={link.id}
                    className="border-b border-[#2B2C2D] last:border-b-0 hover:bg-[#2B2C2D]/50"
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {link.visibility}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-300">
                          {link.expiry ? formatDate(link.expiry) : "Never"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant={getStatusVariant(link.status)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          link.status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : link.status === "Expired"
                            ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {getStatusIcon(link.status)}
                        {link.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-300 text-sm">
                          {link.last_viewed_at
                            ? formatDateTime(link.last_viewed_at)
                            : "Never"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">

                        {link.status === "Active" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDisableLink(link.id)}
                            className="h-8 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 cursor-pointer"
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Disable
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
