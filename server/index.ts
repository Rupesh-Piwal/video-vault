import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { videoQueue } from "./queue/videoQueue";
import cors from "cors";
import { emailQueue } from "./queue/emailQueue";

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

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
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    res.json({ success: true, message: "Job queued successfully" });
  } catch (err) {
    console.error("Queue error:", err);
    res.status(500).json({ error: "Failed to queue job" });
  }
});

app.post("/jobs/send-email", async (req, res) => {
  console.log("📧 [EXPRESS] Received email request:", req.body);
  try {
    const { to, videoId, token } = req.body;

    if (!to || !videoId || !token) {
      console.log("❌ [EXPRESS] Missing fields");
      return res.status(400).json({ error: "Missing fields" });
    }

    console.log("📧 [EXPRESS] Adding to email queue...");
    await emailQueue.add(
      "send-email",
      { to, videoId, token },
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    console.log("✅ [EXPRESS] Email job queued successfully");

    res.json({ success: true, message: "Email job queued" });
  } catch (err) {
    console.error("Email queue error:", err);
    res.status(500).json({ error: "Failed to queue email job" });
  }
});

const PORT = process.env.EXPRESS_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});
