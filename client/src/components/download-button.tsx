"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import toast from "react-hot-toast";

interface DownloadButtonProps {
  videoUrl: string | null;
  filename: string;
}

export function DownloadButton({ videoUrl, filename }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      setDownloading(true);
      const toastId = toast.loading("Starting download...", {
        duration: Number.POSITIVE_INFINITY,
      });

      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename || "video.mp4";

      document.body.appendChild(a);
      a.click();

      toast.success("Download completed", { id: toastId, duration: 4000 });

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again later", {
        duration: 4000,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading || !videoUrl}
      variant="outline"
      size="sm"
      className="flex-1 bg-[#2B2C2D] hover:bg-[#383838] border-[#383838] 
                 text-[#8C8C8C] hover:text-white text-xs h-8 cursor-pointer"
    >
      {downloading ? (
        <Loader2 className="h-3 w-3 md:mr-1.5 animate-spin" />
      ) : (
        <Download className="h-3 w-3 md:mr-1.5" />
      )}
      <span className="hidden md:flex">
        {downloading ? "Downloading..." : "Download"}
      </span>
    </Button>
  );
}
