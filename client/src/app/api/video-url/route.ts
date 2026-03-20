import { getSignedS3Url, s3 } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key)
      return NextResponse.json({ error: "Missing key" }, { status: 400 });

    const url = await getSignedS3Url(key);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Video signed URL error:", err);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 },
    );
  }
}
