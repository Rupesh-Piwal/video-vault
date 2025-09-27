"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/supabase/client";
import { TextShimmer } from "../../../../../components/motion-primitives/text-shimmer";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  videoId: string;
}

export function CreateShareLinkModal({ open, onOpenChange, videoId }: Props) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [emails, setEmails] = useState("");
  const [expiryPreset, setExpiryPreset] = useState("1d");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // ✅ Fetch current logged-in user once
  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (res.data.user) setUser({ id: res.data.user.id });
    });
  }, [supabase]);

  async function handleCreate() {
    if (!user) {
      return toast.error("⚠️ Please log in first.");
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id, // ✅ attach user id
        },
        body: JSON.stringify({
          visibility,
          emails:
            visibility === "PRIVATE"
              ? emails
                  .split(",")
                  .map((e) => e.trim())
                  .filter(Boolean)
              : [],
          expiryPreset,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create link");
      // ✅ copy link to clipboard
      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        toast.success("Share link created & copied to clipboard!");
      } else {
        toast.success("Share link created!");
      }

      onOpenChange(false);
    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create Share Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Visibility */}
          <div>
            <Label>Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(v) => setVisibility(v as "PUBLIC" | "PRIVATE")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">🌍 Public</SelectItem>
                <SelectItem value="PRIVATE">🔒 Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visibility === "PRIVATE" && (
            <div>
              <Label>Allowed Emails</Label>
              <Input
                placeholder="user1@example.com, user2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only these users will be able to open the link.
              </p>
            </div>
          )}

          {/* Expiry */}
          <div>
            <Label>Expiry</Label>
            <Select
              value={expiryPreset}
              onValueChange={(v) => setExpiryPreset(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">⏳ 1 hour</SelectItem>
                <SelectItem value="12h">🕑 12 hours</SelectItem>
                <SelectItem value="1d">📅 1 day</SelectItem>
                <SelectItem value="30d">📆 30 days</SelectItem>
                <SelectItem value="forever">♾️ Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? (
              <TextShimmer duration={1.2}>Creating...</TextShimmer>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
