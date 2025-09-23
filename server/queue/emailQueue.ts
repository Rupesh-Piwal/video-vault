import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL!);

export const emailQueue = new Queue("emails", { connection });
