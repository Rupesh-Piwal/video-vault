import "dotenv/config";
import { Worker } from "bullmq";
import Redis from "ioredis";
import { resend } from "../utils/resend";

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

new Worker(
  "send-email",
  async (job) => {
    try {
      console.log("👷 [EMAIL_WORKER] Picked up job:", job.id, job.data);

      const { to, token } = job.data;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) {
        throw new Error("NEXT_PUBLIC_APP_URL is not defined in worker");
      }

      const result = await resend.emails.send({
        from: "onboarding@resend.dev", 
        to,
        subject: "📹 You've been granted access to a video",
        html: `
          <h2>Video Shared With You</h2>
          <p>Hello,</p>
          <p>You've been granted access to a private video.</p>
          <a href="${appUrl}/share/${token}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
            Watch Video
          </a>
          <p><small>This link may have expiry restrictions.</small></p>
        `,
      });
      console.log("📦 Resend response:", result);

      console.log("✅ [EMAIL_WORKER] Email sent to", to, "Result:", result);
      return { delivered: true };
    } catch (error) {
      console.error("❌ [EMAIL_WORKER] Failed to send email:", error);
      throw error; 
    }
  },
  {
    connection,
  }
);

