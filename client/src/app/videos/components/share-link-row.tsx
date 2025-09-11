"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export interface ShareLink {
  id: string;
  visibility: "public" | "private";
  expires_at: string | null;
  last_viewed_at: string | null;
  disabled_at: string | null;
  token: string;
}

interface ShareLinkRowProps {
  link: ShareLink;
}

export function ShareLinkRow({ link }: ShareLinkRowProps) {
  const url = `${window.location.origin}/s/${link.token}`;
  const isActive = !link.disabled_at;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    // TODO: Replace with toast notification
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <Badge variant={link.visibility === "public" ? "default" : "secondary"}>
          {link.visibility}
        </Badge>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{url}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span>
              Expires:{" "}
              {link.expires_at
                ? new Date(link.expires_at).toLocaleString()
                : "Never"}
            </span>
            <span>
              Last viewed:{" "}
              {link.last_viewed_at
                ? new Date(link.last_viewed_at).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
          {isActive ? "Active" : "Disabled"}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
