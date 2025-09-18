"use client";

import { useState } from "react";
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

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  videoId: string;
}

export function CreateShareLinkModal({ open, onOpenChange, videoId }: Props) {
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [emails, setEmails] = useState("");
  const [expiryPreset, setExpiryPreset] = useState("1d");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibility,
          emails:
            visibility === "PRIVATE"
              ? emails.split(",").map((e) => e.trim())
              : [],
          expiryPreset,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create link");

      toast.success("✅ Share link created!");
      navigator.clipboard.writeText(data.url);
      console.log("Link copied:----", data.url);
      toast("🔗 Link copied to clipboard", { icon: "📋" });

      onOpenChange(false); // close modal
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
          <div>
            <Label>Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(v) => setVisibility(v as "PUBLIC" | "PRIVATE")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visibility === "PRIVATE" && (
            <div>
              <Label>Emails (comma separated)</Label>
              <Input
                placeholder="user1@example.com, user2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label>Expiry</Label>
            <Select
              value={expiryPreset}
              onValueChange={(v) => setExpiryPreset(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="12h">12 hours</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
