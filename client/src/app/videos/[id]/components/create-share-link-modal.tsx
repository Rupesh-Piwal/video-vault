"use client";

import { useState, useEffect, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { createClient } from "@/supabase/client";
import { TextShimmer } from "../../../../../components/motion-primitives/text-shimmer";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  videoId: string;
}

interface EmailMultiSelectProps {
  emails: string[];
  onChange: (emails: string[]) => void;
}

function EmailMultiSelect({ emails, onChange }: EmailMultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && validateEmail(trimmed) && !emails.includes(trimmed)) {
      onChange([...emails, trimmed]);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[2.5rem] bg-background">
        {emails.map((email) => (
          <Badge key={email} variant="secondary" className="gap-1">
            {email}
            <button onClick={() => onChange(emails.filter((e) => e !== email))}>
              <X size={12} />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="email"
          value={inputValue}
          placeholder="Add emails…"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addEmail(inputValue);
            }
          }}
          className="flex-1 border-none shadow-none focus-visible:ring-0"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Only these users will be able to open the link.
      </p>
    </div>
  );
}

export function CreateShareLinkModal({ open, onOpenChange, videoId }: Props) {
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [emails, setEmails] = useState<string[]>([]);
  const [expiryPreset, setExpiryPreset] = useState("1d");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (visibility === "PUBLIC") setEmails([]);
  }, [visibility]);

  const handleCreate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please log in first");
      return;
    }

    if (visibility === "PRIVATE" && emails.length === 0) {
      toast.error("Add at least one email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibility,
          emails,
          expiryPreset,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        toast.success("Share link created & copied!");
      }

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Share Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(v) => setVisibility(v as any)}
            >
              <SelectTrigger>
                <SelectValue />
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
              <EmailMultiSelect emails={emails} onChange={setEmails} />
            </div>
          )}

          <div>
            <Label>Expiry</Label>
            <Select value={expiryPreset} onValueChange={setExpiryPreset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
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
            {loading ? <TextShimmer>Creating…</TextShimmer> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
