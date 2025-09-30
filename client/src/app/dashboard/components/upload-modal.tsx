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
import { X, CheckCircle, AlertCircle, CloudUpload } from "lucide-react";
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

  const getFileIcon = () => "🎥";

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
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-[#2B2C2D]/30"
            )}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length)
                handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
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
              accept="*/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

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
                              <span className="flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                Uploading...
                              </span>
                            )}
                            {uploadFile.status === "PROCESSING" && (
                              <span className="flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                Processing...
                              </span>
                            )}
                            {uploadFile.status === "READY" && (
                              <span className="flex items-center gap-1 text-green-400">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </span>
                            )}
                            {uploadFile.status === "FAILED" && (
                              <span className="flex items-center gap-1 text-red-400">
                                <AlertCircle className="h-3 w-3" />
                                Failed
                              </span>
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
