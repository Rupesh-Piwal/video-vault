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

interface User {
  id: string;
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
    const trimmedEmail = email.trim().toLowerCase();
    if (
      trimmedEmail &&
      validateEmail(trimmedEmail) &&
      !emails.includes(trimmedEmail)
    ) {
      onChange([...emails, trimmedEmail]);
      setInputValue("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) addEmail(inputValue);
    } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) addEmail(inputValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const emailList = pastedText.split(/[,;\s]+/).filter(Boolean);
    emailList.forEach(addEmail);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[2.5rem] bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {emails.map((email) => (
          <Badge
            key={email}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {email}
            <button
              type="button"
              onClick={() => removeEmail(email)}
              className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="email"
          placeholder={
            emails.length === 0 ? "Enter email addresses..." : "Add more..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          className="flex-1 min-w-[200px] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Type email addresses and press Enter or comma to add. Only these users
        will be able to open the link.
      </p>
    </div>
  );
}

export function CreateShareLinkModal({ open, onOpenChange, videoId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [emails, setEmails] = useState<string[]>([]);
  const [expiryPreset, setExpiryPreset] = useState<string>("1d");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (res.data.user) setUser({ id: res.data.user.id });
    });
  }, [supabase]);

  useEffect(() => {
    if (visibility === "PUBLIC") setEmails([]);
  }, [visibility]);

  const handleCreate = async () => {
    if (!user) {
      return toast.error("⚠️ Please log in first");
    }

    if (visibility === "PRIVATE" && emails.length === 0) {
      return toast.error("⚠️ Please add at least one email for private links");
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          visibility,
          emails: visibility === "PRIVATE" ? emails : [],
          expiryPreset,
        }),
      });

      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create link");

      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        toast.success("Share link created & copied to clipboard!");
      } else {
        toast.success("Share link created!");
      }

      onOpenChange(false);
      setEmails([]);
      setVisibility("PUBLIC");
      setExpiryPreset("1d");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`❌ ${err.message}`);
      } else {
        toast.error("❌ Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-md">
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
              <EmailMultiSelect emails={emails} onChange={setEmails} />
            </div>
          )}

          <div>
            <Label>Expiry</Label>
            <Select value={expiryPreset} onValueChange={setExpiryPreset}>
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
          <Button
            onClick={handleCreate}
            disabled={
              loading || (visibility === "PRIVATE" && emails.length === 0)
            }
          >
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
