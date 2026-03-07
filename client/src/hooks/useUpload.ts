import { useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { UploadFile } from "@/types/upload";
import { validateFile } from "@/lib/upload.utils";

const CHUNK_SIZE = 10 * 1024 * 1024; // 8MB (better than 5MB)
const MAX_RETRIES = 3;
const CONCURRENCY = Math.min(6, navigator.hardwareConcurrency || 4);

export function useUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const uploadedBytesRef = useRef<Record<string, number>>({});
  const progressRef = useRef<Record<string, number>>({});

  const supabase = useRef(createClient()).current;

  const retry = async <T>(
    fn: () => Promise<T>,
    retries = MAX_RETRIES,
  ): Promise<T> => {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (err: unknown) {
        if (!navigator.onLine) {
          toast.error("No internet connection. Please check your network.");
          throw new Error("Network offline");
        }

        if (attempt >= retries) throw err;

        attempt++;

        const delay = Math.pow(2, attempt) * 500;
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  };

  /**
   Worker pool uploader
   Keeps N uploads active simultaneously
   */
  async function uploadPool<T>(
    tasks: (() => Promise<T | null>)[],
    limit: number,
  ): Promise<T[]> {
    const results: Promise<T | null>[] = [];
    const executing = new Set<Promise<T | null>>();

    for (const task of tasks) {
      const p = task().then((res) => {
        executing.delete(p);
        return res;
      });

      results.push(p);
      executing.add(p);

      if (executing.size >= limit) {
        await Promise.race(executing);
      }
    }

    const finished = await Promise.all(results);

    return finished.filter(Boolean) as T[];
  }

  const uploadMultipart = async (uploadFile: UploadFile) => {
    try {
      const startRes: AxiosResponse<{
        uploadId: string;
        key: string;
        videoId: string;
      }> = await retry(() =>
        axios.post("/api/upload-url", {
          action: "start",
          fileName: uploadFile.file?.name,
          fileType: uploadFile.file?.type,
          fileSize: uploadFile.file?.size,
        }),
      );

      const { uploadId, key, videoId } = startRes.data;

      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, videoId } : f)),
      );

      const file = uploadFile.file!;

      uploadedBytesRef.current[uploadFile.id] = 0;
      progressRef.current[uploadFile.id] = 0;

      const totalParts = Math.ceil(file.size / CHUNK_SIZE);

      /**
       Generate part numbers on CLIENT
       */
      const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1);

      /**
       Request signed URLs
       */
      const { data: signed } = await retry(() =>
        axios.post("/api/upload-url", {
          action: "signParts",
          key,
          uploadId,
          parts: partNumbers,
        }),
      );

      const signedUrls: { partNumber: number; url: string }[] = signed.urls;

      /**
       Create upload tasks
       */
      const tasks = signedUrls.map(({ partNumber, url }) => async () => {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        /**
         Prevent empty chunks
         */
        if (chunk.size === 0) return null;

        const uploadRes = await retry(() =>
          axios.put(url, chunk, {
            headers: {
              "Content-Type": "application/octet-stream",
            },
          }),
        );

        const ETag = uploadRes.headers["etag"];

        if (!ETag) throw new Error(`Missing ETag for part ${partNumber}`);

        /**
         Progress tracking
         */
        uploadedBytesRef.current[uploadFile.id] += chunk.size;

        const calculatedProgress =
          (uploadedBytesRef.current[uploadFile.id] / file.size) * 100;

        const nextProgress = Math.min(99, calculatedProgress);

        progressRef.current[uploadFile.id] = Math.max(
          progressRef.current[uploadFile.id],
          nextProgress,
        );

        const safeProgress = Number(
          progressRef.current[uploadFile.id].toFixed(2),
        );

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: safeProgress } : f,
          ),
        );

        return {
          ETag: ETag.replace(/^"|"$/g, ""),
          PartNumber: partNumber,
        };
      });

      /**
       Upload chunks
       */
      const uploadedParts = await uploadPool(tasks, CONCURRENCY);

      uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber);

      /**
       Complete upload
       */
      await retry(() =>
        axios.post("/api/upload-url", {
          action: "complete",
          key,
          uploadId,
          parts: uploadedParts,
        }),
      );

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "PROCESSING", progress: 100 }
            : f,
        ),
      );

      toast.success(`${file.name} uploaded successfully!`);

      delete uploadedBytesRef.current[uploadFile.id];
      delete progressRef.current[uploadFile.id];

      if (videoId) {
        await supabase
          .from("videos")
          .update({ status: "PROCESSING" })
          .eq("id", videoId);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_EXPRESS_URL}/jobs/video-process`,
        {
          videoId,
          s3Key: key,
        },
      );
    } catch (err: unknown) {
      let errorMessage = "Unknown error";

      if (err instanceof Error) errorMessage = err.message;

      console.error("Multipart upload error:", errorMessage);

      delete uploadedBytesRef.current[uploadFile.id];
      delete progressRef.current[uploadFile.id];

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "FAILED", error: errorMessage }
            : f,
        ),
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

      if (!error) uploadMultipart(uploadFile);
    });
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return { files, setFiles, handleFiles, removeFile, uploadMultipart };
}
