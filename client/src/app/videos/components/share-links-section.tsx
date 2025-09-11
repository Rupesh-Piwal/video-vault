"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Plus, Eye } from "lucide-react";
import { ShareLinkRow } from "./share-link-row";

export interface ShareLink {
  id: string;
  visibility: "Public" | "Private"; // matches DB lowercase
  expires_at: string;
  last_viewed_at: string;
  disabled_at: string | null;
  token: string;
}

interface ShareLinksSectionProps {
  shareLinks: ShareLink[];
  onCreateLink: () => void;
}

export function ShareLinksSection({
  shareLinks,
  onCreateLink,
}: ShareLinksSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Links
          </CardTitle>
          <Button size="sm" onClick={onCreateLink} className="rounded-xl">
            <Plus className="h-4 w-4 mr-1" />
            Create Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {shareLinks.length > 0 ? (
            shareLinks.map((link) => (
              <ShareLinkRow
                key={link.id}
                link={{
                  ...link,
                  url: `${window.location.origin}/s/${link.token}`, // build URL from token
                  active: !link.disabled_at, // active if not disabled
                  expiry: link.expires_at,
                  lastViewed: link.last_viewed_at,
                }}
              />
            ))
          ) : (
            <div className="text-center py-6">
              <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                No share links yet
              </p>
              <Button size="sm" onClick={onCreateLink} className="rounded-xl">
                <Plus className="h-4 w-4 mr-1" />
                Create First Link
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
