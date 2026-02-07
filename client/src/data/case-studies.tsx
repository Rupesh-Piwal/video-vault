export interface CaseStudySection {
  title?: string;
  content?: string[]; // Array of paragraphs
  list?: string[]; // Bullet points
  code?: string; // Code snippet
  image?: string; // Path to image (optional)
  type?: 'text' | 'list' | 'code' | 'image' | 'mixed';
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  metrics: { label: string; value: string }[];
  overview: string;
  sections: {
    heading: string;
    subsections: CaseStudySection[];
  }[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "multipart-video-upload",
    title: "Scalable Multipart Video Upload",
    subtitle: "Using AWS S3 Presigned URLs for GB-Scale Datasets",
    heroImage: "/Multi-Part Upload.png",
    metrics: [
      { label: "Upload Speed", value: "240x Faster" },
      { label: "Failure Rate", value: "< 0.1%" },
      { label: "Max File Size", value: "5TB" },
      { label: "Backend Load", value: "~0%" },
    ],
    overview: "A deep dive into architecting a resilient, high-concurrency multipart upload system that bypasses the backend to deliver massive files directly to S3, ensuring reliability even on unstable networks.",
    sections: [
      {
        heading: "1. Problem Statement",
        subsections: [
          {
            type: "text",
            content: [
              "In modern web applications, handling large file uploads (GB-scale) is a critical challenge. Traditional methods like single PUT uploads or backend-proxied streams fail catastrophically at scale.",
            ]
          },
          {
            title: "Why Single PUT Fails",
            type: "list",
            list: [
              "**Network Instability:** A single connection drop at 99% progress kills the entire upload.",
              "**Browser Limits:** Browsers often crash or freeze when holding massive files in memory.",
              "**Timeouts:** API gateways (like Nginx or AWS API Gateway) have strict timeout limits (e.g., 29 seconds), making long uploads impossible.",
            ]
          },
          {
            title: "Why Backend Proxying Doesn't Scale",
            type: "list",
            list: [
              "**Resource Exhaustion:** Streaming GBs of data through your backend consumes RAM, CPU, and file descriptors.",
              "**Bandwidth Bottleneck:** Your server becomes the bottleneck, doubling the bandwidth cost (Ingress + Egress).",
              "**Business Impact:** High infrastructure costs, poor user experience, and high drop-off rates due to failed uploads.",
            ]
          }
        ]
      },
      {
        heading: "2. High-Level Architecture",
        subsections: [
          {
            type: "text",
            content: [
              "To solve this, we move the heavy lifting to the client (Browser) and the storage provider (AWS S3), reducing the backend to a lightweight control plane.",
            ]
          },
          {
            title: "Architecture Components",
            type: "list",
            list: [
              "**Browser / Client:** Slices files, manages concurrency, retries, and orchestrates the upload.",
              "**Backend API:** Authenticates users and signs S3 requests. It never sees the file data.",
              "**AWS S3:** Receives the raw file parts directly.",
              "**Redis (Optional):** Tracks upload state for resumability across sessions.",
            ]
          },
          {
            title: "The Flow",
            type: "code",
            code: `Client -> Backend: "I want to upload video.mp4 (5GB)"
Backend -> S3: Initialize Multipart Upload
S3 -> Backend: Returns UploadID
Backend -> Client: Returns UploadID + Presigned URLs for chunks

Client -> S3: PUT Part 1 (URL 1)
Client -> S3: PUT Part 2 (URL 2)
...
Client -> S3: PUT Part N (URL N)

Client -> Backend: "Done. Here are the ETags."
Backend -> S3: Complete Multipart Upload`
          }
        ]
      },
      {
        heading: "3. Multipart Upload Deep Dive",
        subsections: [
          {
            type: "text",
            content: [
              "AWS S3 Multipart Upload allows you to upload a single object as a set of parts. Each part is a contiguous portion of the object's data.",
            ]
          },
          {
            title: "Key Concepts",
            type: "list",
            list: [
              "**UploadId:** A unique identifier returned by S3's `CreateMultipartUpload`. This ID links all the parts together.",
              "**Part Size:** S3 requires parts to be at least 5MB (except the last part). We typically use 5MB to 20MB chunks to balance concurrency and overhead.",
              "**Out-of-Order Uploads:** Parts can be uploaded in any order. S3 reassembles them based on Part Number.",
              "**Temporary Storage:** Parts are stored in a special 'staging' area in S3 until completed or aborted.",
            ]
          }
        ]
      },
      {
        heading: "4. Backend Responsibilities (Control Plane)",
        subsections: [
          {
            type: "text",
            content: [
              "The backend acts purely as a coordinator. It must remain stateless and idempotent.",
            ]
          },
          {
            title: "Core Responsibilities",
            type: "list",
            list: [
              "**Auth & Validation:** Verify user permissions and validate file metadata (size, type) before issuing an UploadId.",
              "**Presigning URLs:** Generate short-lived (e.g., 15-minute) URLs for specific operations (`UploadPart`). This grants the browser temporary permission to write to a specific S3 key.",
              "**Idempotency:** If a user refreshes the page, the backend should return the *existing* UploadId for the same file signature, enforcing resumability.",
              "**Security:** The backend is the gatekeeper. It ensures users can only upload to their own directories.",
            ]
          }
        ]
      },
      {
        heading: "5. Frontend Orchestration (The Brain)",
        subsections: [
          {
            type: "text",
            content: [
              "The frontend is where the complexity lives. It must transform a simple user action into a robust distributed process.",
            ]
          },
          {
            title: "Chunking Strategy",
            type: "list",
            list: [
              "**Slicing:** Use `File.slice(start, end)` to create Blob chunks without loading the whole file into RAM.",
              "**Concurrency:** Upload 3-5 parts in parallel. Too few = slow; too many = network congestion.",
              "**Retry Logic:** If a part fails (500/503/Network Error), retry it individually with exponential backoff. Do not restart the whole file.",
            ]
          },
          {
            title: "Progress Tracking",
            type: "text",
            content: [
              "Calculate aggregated progress by summing the `loaded` bytes of all active XHR requests plus the size of completed parts. Handle edge cases like tab refreshes by checking the local state or re-verifying with the backend.",
            ]
          }
        ]
      },
      {
        heading: "6. Failure Handling & Resumability",
        subsections: [
          {
            title: "Failure Modes",
            type: "list",
            list: [
              "**Single Part Fail:** Retry the specific part. The UploadId remains valid.",
              "**Network Offline:** Pause the queue. Listen for `window.ononline` to resume.",
              "**Browser Crash:** On restart, check for an existing UploadId (via localStorage or Backend). List uploaded parts from S3 (`ListParts`), and only upload the missing ones.",
            ]
          },
          {
            title: "Storage Cleanup",
            type: "text",
            content: [
              "Orphaned parts in S3 cost money. Use an S3 Lifecycle Policy to automatically abort incomplete multipart uploads after 1 or 7 days.",
            ]
          }
        ]
      },
      {
        heading: "7. Completing the Upload",
        subsections: [
          {
            type: "text",
            content: [
              "The `CompleteMultipartUpload` call is the atomic commit. You send S3 a list of `{ PartNumber, ETag }` for every uploaded part.",
            ]
          },
          {
            title: "Why Atomic?",
            type: "text",
            content: [
              "If any part is missing or an ETag doesn't match, S3 rejects the request. If successful, S3 concatenates the parts into a single object and becomes immediately consistent for reads.",
            ]
          }
        ]
      },
      {
        heading: "8. Performance & Scalability",
        subsections: [
          {
            title: "Optimization Stats",
            type: "list",
            list: [
              "**Throughput:** Parallel uploads saturate the user's upstream bandwidth more effectively than a single TCP stream.",
              "**Backend Load:** Near-zero. The backend handles tiny JSON payloads, while S3 ingests gigabytes.",
              "**Cost:** Reduced compute costs (no buffering instances). S3 transfer costs remain standard, but efficiency improves.",
            ]
          }
        ]
      },
      {
        heading: "9. Security Model",
        subsections: [
          {
            type: "text",
            content: [
              "Security relies on the principle of least privilege using Presigned URLs.",
            ]
          },
          {
            title: "Key Defenses",
            type: "list",
            list: [
              "**Scoped Access:** A presigned URL is valid only for a specific object key and operation (PUT).",
              "**Time-Limited:** URLs expire quickly (e.g., 15 mins). If an upload takes longer, the client requests a new batch of URLs.",
              "**Signature Validation:** Prevents tampering with the URL parameters.",
            ]
          }
        ]
      },
      {
        heading: "10. Observability",
        subsections: [
          {
            title: "Metrics to Watch",
            type: "list",
            list: [
              "**Upload Success Rate:** Completed vs. Started.",
              "**Retry Rate:** High retries indicate network issues or bad chunk sizes.",
              "**Stuck Uploads:** Uploads that haven't progressed in X minutes.",
            ]
          }
        ]
      },
      {
        heading: "11. Tradeoffs",
        subsections: [
          {
            title: "Pros",
            type: "list",
            list: [
              "Unmatched scalability for large files.",
              "Resumable and robust against network failures.",
              "Serverless-friendly.",
            ]
          },
          {
            title: "Cons",
            type: "list",
            list: [
              "High implementation complexity (frontend state machine).",
              "Minimum part size (5MB) means it's overkill for small images.",
              "Requires careful CORS configuration.",
            ]
          }
        ]
      },
      {
        heading: "12. Production Edge Cases",
        subsections: [
          {
            title: "Real World Scenarios",
            type: "list",
            list: [
              "**User uploads same file twice:** Backend should recognize the hash and potentially deduplicate or reject.",
              "**Background Tab Throttling:** Browsers throttle JS in background tabs. Use Web Workers to keep the upload alive.",
              "**Mobile Networks:** High latency and packet loss. Aggressive timeouts and smaller chunk sizes help.",
            ]
          }
        ]
      },
      {
        heading: "13. Engineering Impact",
        subsections: [
          {
            type: "text",
            content: [
              "This system demonstrates mastery of distributed systems principles: decoupling, resilience, and horizontal scalability. It transforms a fragile, server-dependent process into a robust, client-driven workflow capable of handling the largest datasets in production.",
            ]
          }
        ]
      }
    ]
  },
  {
    id: "thumbnail-generation",
    title: "Async Video Thumbnail Generation",
    subtitle: "Event-Driven Processing with Workers & Queues",
    heroImage: "/Thumbnail-System.png",
    metrics: [
      { label: "Processing Time", value: "< 800ms" },
      { label: "Backend Latency", value: "0ms Added" },
      { label: "Reliability", value: "99.99%" },
      { label: "Scale", value: "10k+ Concurrent" },
    ],
    overview: "A production-grade distributed system for generating video thumbnails asynchronously, ensuring zero impact on user upload latency while guaranteeing eventual consistency and fault tolerance.",
    sections: [
      {
        heading: "1. Problem Statement",
        subsections: [
          {
            type: "text",
            content: [
              "Generically generating thumbnails inside the HTTP request loop is a recipe for disaster. It blocks the event loop, consumes unpredictable CPU/Memory, and causes timeouts.",
            ]
          },
          {
            title: "Why Sync Processing Fails",
            type: "list",
            list: [
              "**Latency:** Users wait for processing instead of just upload confirmation.",
              "**Timeouts:** Large videos take longer than the 30s gateway timeout.",
              "**Resource Starvation:** A few large video uploads can crash the API server by exhausting RAM.",
              "**Business Impact:** Poor UX leads to abandoned uploads and 'server busy' errors."
            ]
          }
        ]
      },
      {
        heading: "2. High-Level Architecture",
        subsections: [
          {
            type: "text",
            content: [
              "We decouple the upload (Synchronous) from the processing (Asynchronous) using a durable message queue.",
            ]
          },
          {
            title: "System Components",
            type: "list",
            list: [
              "**Client:** Uploads video to S3, sends metadata to API.",
              "**API:** Records upload in DB, pushes 'GenerateThumbnail' job to Redis.",
              "**Queue (BullMQ/Redis):** Durable buffer holding jobs until workers are ready.",
              "**Worker Pool:** Node.js processes that pull jobs, fetch video, run FFmpeg, and upload results.",
              "**S3:** Stores raw video and generated thumbnails."
            ]
          },
          {
            title: "The Flow",
            type: "code",
            code: `Client -> S3: Upload Video
Client -> API: "Upload Complete"
API -> DB: Save Metadata (Status: PROCESSING)
API -> Redis: Enqueue Job { videoId, s3Key }
API -> Client: 200 OK (Immediate response)

... asynchronously ...

Worker -> Redis: Pop Job
Worker -> S3: Stream/Fetch Video Range
Worker -> FFmpeg: Extract Frame
Worker -> S3: Put Thumbnail.jpg
Worker -> DB: Update Metadata (Status: READY)
Worker -> Redis: Ack Job`
          }
        ]
      },
      {
        heading: "3. Job Lifecycle",
        subsections: [
          {
            type: "text",
            content: [
              "The lifecycle is designed for resilience. The job is the single source of truth for the task state.",
            ]
          },
          {
            title: "Stages",
            type: "list",
            list: [
              "**Enqueue:** API adds job with exponential backoff settings.",
              "**Processing:** Worker 'locks' the job. If the worker crashes, the lock expires (visibility timeout).",
              "**Completion:** Worker updates the database and acknowledges the job, removing it from the queue.",
              "**Failure:** If FFmpeg fails, the job moves to 'Delayed' or 'Failed' set based on retry count."
            ]
          }
        ]
      },
      {
        heading: "4. Queue Design & Semantics",
        subsections: [
          {
            title: "Why Redis/BullMQ?",
            type: "list",
            list: [
              "**At-Least-Once Delivery:** Ensures no thumbnail is skipped, even if a worker dies.",
              "**Backpressure:** If spikes occur, the queue grows, but the API and Workers remain stable.",
              "**Concurrency Control:** We limit workers to X jobs parallel to prevent OOM kills."
            ]
          }
        ]
      },
      {
        heading: "5. Worker Process Internals",
        subsections: [
          {
            type: "text",
            content: [
              "Workers run in isolation from the API. They are CPU-bound and can be scaled independently.",
            ]
          },
          {
            title: "Optimizations",
            type: "list",
            list: [
              "**Sandboxing:** FFmpeg runs in a child process. If it segfaults, it doesn't take down the worker node.",
              "**Streaming:** We don't download 5GB files. We stream the first few MBs from S3 directly into FFmpeg via pipes to get the thumbnail.",
              "**Cleanup:** `finally` blocks ensure temp files are deleted even on error."
            ]
          }
        ]
      },
      {
        heading: "6. Thumbnail Generation Pipeline",
        subsections: [
          {
            title: "Smart Extraction",
            type: "list",
            list: [
              "**Timestamp:** 0s is often black. We seek to 5% or 1s to get a meaningful frame.",
              "**Format:** WebP for modern browsers with JPEG fallback.",
              "**Resolution:** Resize to 720p immediately to save S3 storage and bandwidth."
            ]
          }
        ]
      },
      {
        heading: "7. Failure Handling & Retries",
        subsections: [
          {
            type: "text",
            content: [
              "Transient failures (S3 503s, Network blips) are common. We handle them gracefully.",
            ]
          },
          {
            title: "Strategy",
            type: "list",
            list: [
              "**Exponential Backoff:** Retry in 1s, 2s, 4s, 8s... gives systems time to recover.",
              "**Dead Letter Queue (DLQ):** After 5 retries, move to DLQ for manual inspection. Don't retry forever.",
              "**Idempotency:** Re-running a job just overwrites the S3 file. No duplicate records."
            ]
          }
        ]
      },
      {
        heading: "8. Performance & Scalability",
        subsections: [
          {
            title: "Scaling Characteristics",
            type: "list",
            list: [
              "**Horizontal Scaling:** Add more worker pods to drain the queue faster.",
              "**IO vs CPU:** FFmpeg is CPU heavy. We run workers on Compute-Optimized instances.",
              "**Autoscaling:** Scale based on Queue Length, not CPU usage."
            ]
          }
        ]
      },
      {
        heading: "9. Security & Isolation",
        subsections: [
          {
            type: "text",
            content: [
              "Video processing involves parsing untrusted binary data. Security is paramount.",
            ]
          },
          {
            title: "Defenses",
            type: "list",
            list: [
              "**Least Privilege:** Workers have S3 Read/Write but NO database delete access.",
              "**Network Isolation:** Workers cannot access the public internet, only AWS internal services.",
              "**Input Sanitization:** FFmpeg is notoriously exploitable. We keep it updated and run in simplified containers."
            ]
          }
        ]
      },
      {
        heading: "10. Real-World Edge Cases",
        subsections: [
          {
            title: "Handled Scenarios",
            type: "list",
            list: [
              "**Video < 1s:** seek(1s) fails. Fallback to seek(0s).",
              "**Corrupt Header:** FFmpeg exits with error. Job catches it and marks 'Processing Failed' in DB.",
              "**Worker OOM:** Limits concurrency per node. Orchestrator restarts pod. Queue redelivers job."
            ]
          }
        ]
      },
      {
        heading: "11. Tradeoffs",
        subsections: [
          {
            type: "mixed",
            content: [
              "**Why not Lambda?** Lambda has cold starts and 15m timeouts. Long queue processing is cheaper on spot instances.",
              "**Why not Client-side?** Browser FFmpeg (WASM) is slow and eats user battery. Quality is inconsistent."
            ]
          }
        ]
      },
      {
        heading: "12. Engineering Impact",
        subsections: [
          {
            type: "text",
            content: [
              "This architecture demonstrates a mastery of asynchronous system design. It prioritizes system stability and user experience over implementation simplicity, resulting in a platform that remains responsive even under massive load.",
            ]
          }
        ]
      }
    ]
  }
];
