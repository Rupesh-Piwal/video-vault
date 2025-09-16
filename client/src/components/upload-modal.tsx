"use client";

import type React from "react";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, CheckCircle, AlertCircle, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/client";
import axios from "axios";
import toast from "react-hot-toast";

interface UploadFile {
  id: string;
  file?: File | null;
  progress: number;
  status: "UPLOADING" | "PROCESSING" | "READY" | "FAILED";
  error: string | null;
  videoId?: string;
}

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (files: UploadFile[]) => void;
}

export function UploadModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = useMemo(() => createClient(), []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) return "File size exceeds 500MB limit";

    // Debug logging - check what we're getting
    console.log("=== FILE DEBUG INFO ===");
    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);
    console.log("=======================");

    // Method 1: Check MIME type - allow any video MIME type
    if (file.type && file.type.startsWith("video/")) {
      console.log("✅ Passed MIME type check");
      return null;
    }

    // Method 2: Check file extension - comprehensive list of video formats
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = [
      // Common video formats
      "mp4",
      "avi",
      "mov",
      "wmv",
      "flv",
      "webm",
      "mkv",
      "m4v",
      "3gp",
      "3g2",
      // MPEG formats
      "mpg",
      "mpeg",
      "m1v",
      "m2v",
      "m4p",
      "m4v",
      // Advanced codecs
      "hevc",
      "h264",
      "h265",
      "x264",
      "x265",
      // Streaming formats
      "ts",
      "m2ts",
      "mts",
      "m3u8",
      "f4v",
      "f4p",
      "f4a",
      "f4b",
      // Professional formats
      "mxf",
      "r3d",
      "braw",
      "prores",
      "dnxhd",
      "avchd",
      // Container formats
      "ogv",
      "ogg",
      "dv",
      "divx",
      "xvid",
      // Mobile formats
      "3gpp",
      "3gp2",
      // Less common formats
      "asf",
      "rm",
      "rmvb",
      "vob",
      "dat",
      "amv",
      "mpv",
      "qt",
      // Proprietary formats
      "swf",
      "nsv",
      "fla",
      "flr",
      "sol",
      // Raw formats
      "yuv",
      "mjpeg",
      "mjpg",
      // Additional formats that might be video containers
      "mobi",
      "epub",
      "azw",
      "azw3", // e-book formats that could potentially contain video
    ];

    if (ext && allowedExtensions.includes(ext)) {
      console.log("✅ Passed extension check:", ext);
      return null;
    }

    // Method 3: Check filename content for video indicators
    const fileName = file.name.toLowerCase();
    const videoIndicators = [
      // Format indicators
      "mkv",
      "mp4",
      "avi",
      "mov",
      "hevc",
      "x264",
      "x265",
      "h264",
      "h265",
      // Quality indicators
      "1080p",
      "720p",
      "480p",
      "360p",
      "240p",
      "4k",
      "2k",
      "uhd",
      "hd",
      "sd",
      // Source indicators
      "bd",
      "bluray",
      "dvd",
      "webrip",
      "webdl",
      "hdtv",
      "pdtv",
      "cam",
      "ts",
      "tc",
      // Codec indicators
      "avc",
      "hevc",
      "vp9",
      "av1",
      "divx",
      "xvid",
      // Audio indicators
      "ac3",
      "dts",
      "aac",
      "mp3",
      "flac",
      // Release indicators
      "rarbg",
      "yts",
      "eztv",
      "ettv",
      "torrent",
      "scene",
      "internal",
      // Anime/TV indicators
      "episode",
      "ep",
      "season",
      "s01",
      "s02",
      "batch",
      "complete",
      // Language indicators
      "dual",
      "audio",
      "english",
      "japanese",
      "korean",
      "chinese",
      "hindi",
      // Subtitle indicators
      "sub",
      "dub",
      "subbed",
      "dubbed",
      "hardsub",
      "softsub",
    ];

    const hasVideoIndicator = videoIndicators.some((indicator) =>
      fileName.includes(indicator)
    );

    if (hasVideoIndicator) {
      console.log("✅ Passed video indicator check");
      return null;
    }

    // Method 4: File size heuristic - videos are typically large
    if (file.size > 10 * 1024 * 1024) {
      // If file is larger than 10MB, likely a video
      console.log("✅ Passed size-based check (large file, likely video)");
      return null;
    }

    // Method 5: Allow files with no extension if they have video-like characteristics
    if (!ext && file.size > 1024 * 1024) {
      // No extension but >1MB
      console.log(
        "✅ Passed no-extension check (large file without extension)"
      );
      return null;
    }

    // Method 6: Very permissive fallback - if filename suggests media content
    const mediaKeywords = [
      "video",
      "movie",
      "film",
      "show",
      "series",
      "anime",
      "drama",
      "documentary",
      "clip",
      "trailer",
      "teaser",
      "preview",
      "episode",
      "season",
      "part",
    ];

    const hasMediaKeyword = mediaKeywords.some((keyword) =>
      fileName.includes(keyword)
    );

    if (hasMediaKeyword) {
      console.log("✅ Passed media keyword check");
      return null;
    }

    console.log("❌ Failed all checks");
    return "File doesn't appear to be a video. If this is a video file, please ensure it has a proper extension or video-related content in the filename.";
  };

  const uploadToS3 = async (uploadFile: UploadFile) => {
    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadFile.file?.name,
          fileType: uploadFile.file?.type || "video/mp4", // Default to mp4 if no type
          fileSize: uploadFile.file?.size,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { url, key, videoId } = await res.json();

      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, videoId } : f))
      );

      await axios.put(url, uploadFile.file!, {
        headers: {
          "Content-Type": uploadFile.file?.type || "video/mp4",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setFiles((prev) =>
              prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f))
            );
          }
        },
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "PROCESSING", progress: 100 }
            : f
        )
      );

      toast.success(`${uploadFile.file?.name} uploaded successfully!`);

      if (videoId) {
        const { error } = await supabase
          .from("videos")
          .update({ status: "PROCESSING" })
          .eq("id", videoId);
        if (error) console.error("DB update error:", error.message);
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/video-process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, s3Key: key }),
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "FAILED", error: err.message }
            : f
        )
      );
      toast.error(`${uploadFile.file?.name} failed to upload.`);
    }
  };

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    Array.from(newFiles).forEach((file) => {
      const error = validateFile(file);
      const uploadFile: UploadFile = {
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: error ? "FAILED" : "UPLOADING",
        error,
      };
      setFiles((prev) => [...prev, uploadFile]);
      if (!error) uploadToS3(uploadFile);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  useEffect(() => {
    const channel = supabase
      .channel("video-status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        (payload) => {
          setFiles((prev) => {
            if (payload.eventType === "INSERT") {
              const newVid = payload.new as { id: string; status: string };
              return [
                ...prev,
                {
                  id: newVid.id,
                  file: null,
                  progress: 100,
                  error: null,
                  videoId: newVid.id,
                  status: newVid.status as UploadFile["status"],
                },
              ];
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((f) =>
                f.videoId === payload.new.id
                  ? { ...f, status: payload.new.status as UploadFile["status"] }
                  : f
              );
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (
      files.length > 0 &&
      files.every((f) => f.status === "READY") &&
      files.every((f) => !f.error)
    ) {
      onUploadComplete?.(files);
      setTimeout(() => {
        setFiles([]);
        onOpenChange(false);
      }, 1000);
    }
  }, [files, onUploadComplete, onOpenChange]);

  const getFileIcon = () => {
    return "🎥";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-[6px]" />
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 bg-[#18191A] border-[#2B2C2D] text-white"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#2B2C2D]">
          <DialogTitle className="text-xl font-semibold text-white">
            Upload Videos
          </DialogTitle>
          <p className="text-sm text-[#8C8C8C] mt-1">
            Select and upload video files in any format
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 px-6 pb-6">
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-[#2B2C2D]/30",
              isDragOver
                ? "border-white bg-white/5"
                : "border-[#383838] hover:border-[#606060]"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#383838] flex items-center justify-center border border-[#606060]">
              <CloudUpload className="h-8 w-8 text-[#8C8C8C]" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">
              Choose a video or drag & drop it here
            </h3>
            <p className="text-[#8C8C8C] mb-6">
              Any video format supported - MP4, MKV, AVI, MOV, HEVC, and more,
              up to 500MB
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg px-6 bg-white text-black hover:bg-[#8C8C8C] hover:text-white cursor-pointer"
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="*/*" // Accept all file types instead of just "video/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="border border-[#2B2C2D] rounded-lg p-4 bg-[#2B2C2D]/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl">{getFileIcon()}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-white">
                          {uploadFile.file?.name || "Unknown file"}
                        </p>
                        {uploadFile.file && (
                          <div className="flex items-center gap-2 text-sm text-[#8C8C8C] mt-1">
                            <span>{formatFileSize(uploadFile.file.size)}</span>
                            {uploadFile.status === "UPLOADING" && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                  Uploading...
                                </span>
                              </>
                            )}
                            {uploadFile.status === "PROCESSING" && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                  Processing...
                                </span>
                              </>
                            )}
                            {uploadFile.status === "READY" && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-green-400">
                                  <CheckCircle className="h-3 w-3" />
                                  Completed
                                </span>
                              </>
                            )}
                            {uploadFile.status === "FAILED" && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-red-400">
                                  <AlertCircle className="h-3 w-3" />
                                  Failed
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                      className="h-8 w-8 p-0 rounded-full hover:bg-[#383838] text-[#8C8C8C] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {uploadFile.status === "UPLOADING" && (
                    <div className="space-y-2">
                      <Progress
                        value={uploadFile.progress}
                        className="h-2 bg-[#383838]"
                      />
                      <div className="flex justify-between text-xs text-[#8C8C8C]">
                        <span>{Math.round(uploadFile.progress)}%</span>
                        <span>
                          {formatFileSize(
                            (uploadFile.progress / 100) *
                              (uploadFile.file?.size || 0)
                          )}{" "}
                          of {formatFileSize(uploadFile.file?.size || 0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {uploadFile.status === "PROCESSING" && (
                    <div className="space-y-2">
                      <Progress value={100} className="h-2 bg-[#383838]" />
                      <p className="text-sm text-[#8C8C8C]">
                        Processing video...
                      </p>
                    </div>
                  )}

                  {uploadFile.status === "FAILED" && uploadFile.error && (
                    <Alert
                      variant="destructive"
                      className="mt-2 py-2 bg-red-500/10 border-red-500/30"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm text-red-400">
                        {uploadFile.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
