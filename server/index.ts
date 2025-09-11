import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { videoQueue } from "./queue/videoQueue";
import cors from "cors";

const app = express();

// ✅ Allow requests from your Next.js frontend
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

// Enqueue job after upload is completed
app.post("/jobs/video-process", async (req, res) => {
  try {
    const { videoId, s3Key } = req.body;

    if (!videoId || !s3Key) {
      return res.status(400).json({ error: "Missing videoId or s3Key" });
    }

    await videoQueue.add(
      "video-processing",
      { videoId, s3Key },
      {
        attempts: 5, // max retry attempts
        backoff: {
          type: "exponential", // or 'fixed'
          delay: 2000, // 2s initial, then 4s, 8s, etc
        },
      }
    );

    res.json({ success: true, message: "Job queued successfully" });
  } catch (err) {
    console.error("Queue error:", err);
    res.status(500).json({ error: "Failed to queue job" });
  }
});

const PORT = process.env.EXPRESS_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});
