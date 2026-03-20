import { getSignedS3Url, s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keys } = await req.json();
    console.log(keys);

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: "keys array required" },
        { status: 400 },
      );
    }

    const entries = await Promise.all(
      keys.map(async (key: string) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        });

        const signedUrl = await getSignedS3Url(key);

        return [key, signedUrl];

        // urls[key] = signedUrl;
      }),
    );
    // No auth check on single route — any key can be requested
    // No limit on batch keys array — vulnerable to abuse
    // Promise.all fails entirely if one key fails — Promise.allSettled would be better
    // No caching — Redis TTL cache would eliminate redundant URL generation
    // S3Client duplicated in both files — should be a shared singleton in a lib file

    const urls = Object.fromEntries(entries);
    console.log("URLS", urls);

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Batch signed URL error:", err);

    return NextResponse.json(
      { error: "Failed to generate signed URLs" },
      { status: 500 },
    );
  }
}
