"use client";

import type React from "react";
import { useRef, useEffect, useMemo } from "react";
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
import { X, CheckCircle, AlertCircle, CloudUpload, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/client";
import { UploadModalProps } from "@/types/upload";
import { useUpload } from "@/hooks/useUpload";
import { formatFileSize } from "@/lib/upload.utils";

type VideoStatus = "UPLOADING" | "PROCESSING" | "READY" | "FAILED";

export function UploadModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const { files, setFiles, handleFiles, removeFile } = useUpload();

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
                  status: newVid.status as VideoStatus,
                },
              ];
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((f) =>
                f.videoId === payload.new.id
                  ? { ...f, status: payload.new.status as VideoStatus }
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
  }, [supabase, setFiles]);

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
  }, [files, onUploadComplete, onOpenChange, setFiles]);

  const getFileIcon = (status: VideoStatus) => {
    return <Video className="h-5 w-5" />;
  };

  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case "UPLOADING":
        return "text-violet-400";
      case "PROCESSING":
        return "text-amber-400";
      case "READY":
        return "text-emerald-400";
      case "FAILED":
        return "text-rose-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-[8px]" />
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 bg-gradient-to-b from-gray-900/90 to-black/90 border border-white/10 text-white shadow-2xl"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10 bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-white">
                Upload Videos
              </DialogTitle>
              <p className="text-sm text-slate-200 mt-1">
                Select and upload video files in any format
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
              "border-[#1F0D5D] bg-gradient-to-b from-gray-900/50 to-black/50",
              "hover:border-[#4E25F4] hover:bg-gray-900/70"
            )}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length)
                handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-900/90 to-black/90 flex items-center justify-center border border-white/10 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#210E66] to-[#4E25F4] flex items-center justify-center">
                <CloudUpload className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">
              Choose a video or drag & drop it here
            </h3>
            <p className="text-slate-200 mb-6 max-w-md mx-auto">
              Any video format supported - MP4, MKV, AVI, MOV, HEVC, and more,
              up to 300MB
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg px-6 bg-gradient-to-r from-[#210E66] to-[#4E25F4] hover:from-[#4E25F4] hover:to-[#210E66] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-900 cursor-pointer"
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-200 uppercase tracking-wider">
                Upload Queue ({files.length})
              </h4>
              <div className="space-y-3">
                {files.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="border border-white/10 rounded-xl p-4 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm shadow-lg hover:border-[#4E25F4] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900/90 to-black/90 border border-white/10 flex items-center justify-center">
                          {getFileIcon(uploadFile.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-white">
                            {uploadFile.file?.name || "Unknown file"}
                          </p>
                          {uploadFile.file && (
                            <div className="flex items-center gap-3 text-sm text-slate-200 mt-1">
                              <span>
                                {formatFileSize(uploadFile.file.size)}
                              </span>
                              <span className="text-white/30">•</span>
                              <span
                                className={cn(
                                  "flex items-center gap-1.5 font-medium",
                                  getStatusColor(uploadFile.status)
                                )}
                              >
                                 {uploadFile.status === "UPLOADING" && (
                                   <>
                                     <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    Uploading...
                                  </>
                                )}
                                {uploadFile.status === "PROCESSING" && (
                                  <>
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                    Processing...
                                  </>
                                )}
                                {uploadFile.status === "READY" && (
                                  <>
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Ready
                                  </>
                                )}
                                {uploadFile.status === "FAILED" && (
                                  <>
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Failed
                                  </>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-white/5 text-slate-200 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {uploadFile.status === "UPLOADING" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
                          <span>Uploading</span>
                          <span>{Math.round(uploadFile.progress)}%</span>
                        </div>
                        <Progress
                          value={uploadFile.progress}
                          className="h-2 bg-white/10"
                        />
                        <div className="flex justify-between text-xs text-white/50">
                          <span>
                            {formatFileSize(
                              (uploadFile.progress / 100) *
                                (uploadFile.file?.size || 0)
                            )}
                          </span>
                          <span>
                            {formatFileSize(uploadFile.file?.size || 0)}
                          </span>
                        </div>
                      </div>
                    )}

                    {uploadFile.status === "PROCESSING" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
                          <span>Processing video</span>
                          <span>100%</span>
                        </div>
                        <Progress
                          value={100}
                          className="h-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20"
                        />
                      </div>
                    )}

                    {uploadFile.status === "FAILED" && uploadFile.error && (
                      <Alert
                        variant="destructive"
                        className="mt-3 py-3 bg-gradient-to-r from-rose-900/20 to-rose-950/20 border-rose-800/30"
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5" />
                          <AlertDescription className="text-sm text-rose-300">
                            {uploadFile.error}
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-200">
                {files.filter((f) => f.status === "READY").length} of
                {files.length} completed
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setFiles([])}
                  className="text-slate-200 hover:text-white hover:bg-white/5"
                >
                  Clear All
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#210E66] to-[#4E25F4] hover:from-[#4E25F4] hover:to-[#210E66] text-white"
                  onClick={() => {
                    if (files.every((f) => f.status === "READY")) {
                      onUploadComplete?.(files);
                      setFiles([]);
                      onOpenChange(false);
                    }
                  }}
                  disabled={!files.every((f) => f.status === "READY")}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
