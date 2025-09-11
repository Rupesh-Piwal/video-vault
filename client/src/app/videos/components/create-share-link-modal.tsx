"use client";

import { useState } from "react";
import { createClient } from "@/supabase/client"; // your supabase browser client
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, X } from "lucide-react";

interface CreateShareLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export function CreateShareLinkModal({
  open,
  onOpenChange,
  videoId,
}: CreateShareLinkModalProps) {
  const supabase = createClient();

  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [expiry, setExpiry] = useState("forever");
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const expiryOptions = [
    { value: "1h", label: "1 hour" },
    { value: "12h", label: "12 hours" },
    { value: "1d", label: "1 day" },
    { value: "30d", label: "30 days" },
    { value: "forever", label: "Forever" },
  ];

  const addEmail = () => {
    if (emailInput && !allowedEmails.includes(emailInput)) {
      setAllowedEmails((prev) => [...prev, emailInput]);
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setAllowedEmails((prev) => prev.filter((e) => e !== email));
  };

  const generateLink = async () => {
    try {
      setLoading(true);

      // generate unique token
      const token = Math.random().toString(36).substring(2, 10);

      // expiry timestamp
      let expiryTimestamp: string | null = null;
      if (expiry !== "forever") {
        const now = new Date();
        if (expiry === "1h") now.setHours(now.getHours() + 1);
        if (expiry === "12h") now.setHours(now.getHours() + 12);
        if (expiry === "1d") now.setDate(now.getDate() + 1);
        if (expiry === "30d") now.setDate(now.getDate() + 30);
        expiryTimestamp = now.toISOString();
      }

      // current user for created_by
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // insert into share_links
      const { data, error } = await supabase
        .from("share_links")
        .insert([
          {
            video_id: videoId,
            created_by: user?.id || null,
            visibility,
            token,
            emails: visibility === "private" ? allowedEmails : [],
            expires_at: expiryTimestamp,
          },
        ])
        .select("token")
        .single();

      if (error) throw error;

      // final link
      const link = `${window.location.origin}/s/${data.token}`;
      setGeneratedLink(link);
    } catch (err) {
      console.error("Error creating share link:", err);
      alert("Failed to create link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setVisibility("public");
    setExpiry("forever");
    setAllowedEmails([]);
    setEmailInput("");
    setGeneratedLink(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Share Link</DialogTitle>
        </DialogHeader>

        {!generatedLink ? (
          <div className="space-y-6">
            {/* Visibility */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Visibility</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{visibility}</p>
                  <p className="text-sm text-muted-foreground">
                    {visibility === "public"
                      ? "Anyone with the link can view"
                      : "Only specified people can view"}
                  </p>
                </div>
                <Switch
                  checked={visibility === "private"}
                  onCheckedChange={(checked) =>
                    setVisibility(checked ? "private" : "public")
                  }
                />
              </div>
            </div>

            {/* Expiry */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Expiry</Label>
              <RadioGroup value={expiry} onValueChange={setExpiry}>
                {expiryOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <Label htmlFor={opt.value} className="text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Allowed Emails */}
            {visibility === "private" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Allowed Emails</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addEmail()}
                  />
                  <Button onClick={addEmail} size="sm">
                    Add
                  </Button>
                </div>
                {allowedEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {allowedEmails.map((email) => (
                      <Badge
                        key={email}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {email}
                        <button onClick={() => removeEmail(email)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={generateLink}
              disabled={loading}
              className="w-full rounded-xl"
            >
              {loading ? "Generating..." : "Generate Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <Check className="h-12 w-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-medium mb-2">Link Created!</h3>
              <p className="text-sm text-muted-foreground">
                Your share link is ready
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
              <p className="text-sm font-mono truncate flex-1 mr-2">
                {generatedLink}
              </p>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button onClick={handleClose} className="w-full rounded-xl">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
