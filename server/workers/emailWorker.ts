import { Worker } from "bullmq";
import Redis from "ioredis";
import { resend } from "../utils/resend";

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

new Worker(
  "emails",
  async (job) => {
    const { to, token } = job.data;

    await resend.emails.send({
      from: "no-reply@yourapp.com",
      to,
      subject: "📹 You’ve got a video link",
      html: `
        <p>Hello,</p>
        <p>You’ve been invited to view a video.</p>
        <p><a href="${process.env.APP_URL}/s/${token}">Watch Now</a></p>
      `,
    });

    console.log("📨 Email sent to", to);
    return { delivered: true };
  },
  { connection }
);

console.log("📨 Email worker running...");
