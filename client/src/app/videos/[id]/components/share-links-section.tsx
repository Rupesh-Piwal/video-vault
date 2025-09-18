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

interface Props {
  shareLinks: any[];
  onCreateLink: () => void;
}

export function ShareLinksSection({ shareLinks, onCreateLink }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Share Links</h2>
        <Button className="cursor-pointer" onClick={onCreateLink}>
          + New Link
        </Button>
      </div>

      {shareLinks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No links yet.</p>
      ) : (
        <ScrollArea className="w-full h-[200px] rounded-md border">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Visibility</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Viewed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shareLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.visibility}</TableCell>
                  <TableCell>
                    {link.expiry
                      ? new Date(link.expiry).toISOString().split("T")[0]
                      : "Forever"}
                  </TableCell>

                  <TableCell>
                    <Badge variant={link.expired ? "secondary" : "default"}>
                      {link.expired ? "Expired" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {link.last_viewed_at
                      ? new Date(link.last_viewed_at)
                          .toISOString()
                          .replace("T", " ")
                          .split(".")[0]
                      : "—"}
                  </TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      className="cursor-pointer"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(link.url);
                        toast.success("Copied to clipboard!");
                      }}
                    >
                      Copy
                    </Button>
                    {!link.expired && (
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `/api/share-links/${link.id}/disable`,
                              { method: "POST" }
                            );
                            if (!res.ok) throw new Error();
                            toast.success("Link disabled");
                            window.location.reload();
                          } catch (err) {
                            console.error(err);
                            toast.error("Failed to disable link");
                          }
                        }}
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
