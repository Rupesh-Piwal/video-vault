"use client";

import { useState, useEffect } from "react";

interface UseSignedUrlReturn {
  url: string | null;
  loading: boolean;
  error: boolean;
}

export function useSignedUrl(
  storageKey: string | null,
  status: string
): UseSignedUrlReturn {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (storageKey && status === "READY") {
      setLoading(true);
      setError(false);

      fetch(`/api/video-url?key=${encodeURIComponent(storageKey)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch signed URL");
          return res.json();
        })
        .then((data) => {
          setUrl(data.url);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching signed URL:", err);
          setError(true);
          setLoading(false);
        });
    } else {
      setUrl(null);
      setLoading(false);
      setError(false);
    }
  }, [storageKey, status]);

  return { url, loading, error };
}
