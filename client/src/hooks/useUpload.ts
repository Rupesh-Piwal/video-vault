import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { UploadFile } from "@/types/upload";
import { validateFile } from "@/lib/upload.utils";

export function useUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const supabase = createClient();

  const uploadToS3 = async (uploadFile: UploadFile) => {
    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadFile.file?.name,
          fileType: uploadFile.file?.type || "video/mp4",
          fileSize: uploadFile.file?.size,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { url, key, videoId } = await res.json();

      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, videoId } : f))
      );

      await axios.put(url, uploadFile.file!, {
        headers: { "Content-Type": uploadFile.file?.type || "video/mp4" },
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
        await supabase
          .from("videos")
          .update({ status: "PROCESSING" })
          .eq("id", videoId);
      }

      await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/jobs/video-process`, {
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

  const handleFiles = (newFiles: FileList | File[]) => {
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
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return { files, setFiles, handleFiles, removeFile, uploadToS3 };
}
