"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

interface UploadFile {
  id: string;
  file: File;
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
  const supabase = createClient();

  // ✅ format file size helper
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
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
    ];
    if (file.size > maxSize) return "File size exceeds 500MB limit";
    if (!allowedTypes.includes(file.type))
      return "Only video files are allowed";
    return null;
  };

  // ✅ Upload to S3
  const uploadToS3 = async (uploadFile: UploadFile) => {
    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadFile.file.name,
          fileType: uploadFile.file.type,
          fileSize: uploadFile.file.size,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { url, key, videoId } = await res.json();

      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, videoId } : f))
      );

      // ✅ Upload with axios + progress tracking
      await axios.put(url, uploadFile.file, {
        headers: {
          "Content-Type": uploadFile.file.type,
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

      // ✅ After upload success
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "PROCESSING", progress: 100 }
            : f
        )
      );

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
    }
  };

  // ✅ handle new files
  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    fileArray.forEach((file) => {
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

  // ✅ Supabase realtime → update video status
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
                  file: null as any,
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
                  ? {
                      ...f,
                      status: payload.new.status as UploadFile["status"],
                    }
                  : f
              );
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setFiles]);

  // ✅ Auto close modal when all uploads are READY
  useEffect(() => {
    if (files.length > 0 && files.every((f) => f.status === "READY")) {
      if (onUploadComplete) onUploadComplete(files);
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
          {/* Drag Drop Zone */}
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
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
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
              Maximum file size: 500MB. Supported formats: MP4, WebM, OGG, AVI,
              MOV
            </p>
          </div>

          {/* Files List */}
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
