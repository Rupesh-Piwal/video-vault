import { getSignedS3Url } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keys } = await req.json();

    if (!Array.isArray(keys) || keys.length === 0 || keys.length > 50) {
      return NextResponse.json(
        { error: "keys must be a non-empty array of max 50 items" },
        { status: 400 },
      );
    }

    const entries = await Promise.all(
      keys.map(async (key: string) => {
        const signedUrl = await getSignedS3Url(key);

        return [key, signedUrl];

        // urls[key] = signedUrl;
      }),
    );
    // No auth check on single route — any key can be requested
    // No limit on batch keys array — vulnerable to abuse
    // Promise.all fails entirely if one key fails — Promise.allSettled would be better
    // No caching — Redis TTL cache would eliminate redundant URL generation

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
