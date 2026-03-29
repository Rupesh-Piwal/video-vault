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

    const entries = await Promise.allSettled(
      keys.map(async (key: string) => {
        const signedUrl = await getSignedS3Url(key);
        return [key, signedUrl];
      }),
    );

    //TODO: No caching — Redis TTL cache would eliminate redundant URL generation

    const urls = Object.fromEntries(
      entries
        .filter((result) => result.status === "fulfilled")
        .map(
          (result) =>
            (result as PromiseFulfilledResult<[string, string]>).value,
        ),
    );

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Batch signed URL error:", err);

    return NextResponse.json(
      { error: "Failed to generate signed URLs" },
      { status: 500 },
    );
  }
}
