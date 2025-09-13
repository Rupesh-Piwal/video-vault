"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CheckCircle, AlertCircle, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/client";
import axios from "axios";
import toast from "react-hot-toast";

interface UploadFile {
  id: string;
  file?: File | null; // ✅ allow null for realtime inserts
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

  // ✅ memoize supabase client
  const supabase = useMemo(() => createClient(), []);

  // ✅ helper: format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // ✅ file validation
  const validateFile = (file: File): string | null => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) return "File size exceeds 500MB limit";

    const allowedExtensions = [
      "mp4",
      "webm",
      "ogg",
      "avi",
      "mov",
      "mkv",
      "hevc",
      "ts",
      "m4v",
    ];

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (file.type?.startsWith("video/")) return null;
    if (ext && allowedExtensions.includes(ext)) return null;

    return "Only video files are allowed";
  };

  // ✅ upload to S3
  const uploadToS3 = async (uploadFile: UploadFile) => {
    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadFile.file?.name,
          fileType: uploadFile.file?.type,
          fileSize: uploadFile.file?.size,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { url, key, videoId } = await res.json();

      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, videoId } : f))
      );

      // ✅ upload to S3
      await axios.put(url, uploadFile.file!, {
        headers: {
          "Content-Type": uploadFile.file?.type || "application/octet-stream",
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

      // mark as processing
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

  // ✅ handle new files
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

  // ✅ drag/drop
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

  // ✅ supabase realtime
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
      channel.unsubscribe(); // ✅ proper cleanup
    };
  }, [supabase]);

  // ✅ auto close (only if all ready and none failed)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Upload Videos</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              isDragOver
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drop your videos here</h3>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl"
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Max 500MB. Formats: MP4, WebM, OGG, AVI, MOV, MKV
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((uploadFile) => (
                <div key={uploadFile.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {uploadFile.file?.name || "Unknown file"}
                        </p>
                        {uploadFile.file && (
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(uploadFile.file.size)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadFile.status === "READY" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {uploadFile.status === "FAILED" && (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {uploadFile.status === "UPLOADING" && (
                    <div className="space-y-2">
                      <Progress value={uploadFile.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        Uploading... {Math.round(uploadFile.progress)}%
                      </p>
                    </div>
                  )}

                  {uploadFile.status === "PROCESSING" && (
                    <div className="space-y-2">
                      <Progress value={100} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        Processing video...
                      </p>
                    </div>
                  )}

                  {uploadFile.status === "READY" && (
                    <p className="text-sm text-green-600 font-medium">
                      Upload complete!
                    </p>
                  )}

                  {uploadFile.status === "FAILED" && uploadFile.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{uploadFile.error}</AlertDescription>
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
