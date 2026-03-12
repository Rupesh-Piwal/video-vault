import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: Request) {
    try {
        const { keys } = await req.json();
        console.log(keys)

        if (!Array.isArray(keys) || keys.length === 0) {
            return NextResponse.json(
                { error: "keys array required" },
                { status: 400 }
            );
        }

        // CONCEPT: Objects / Key-Value pairs
        // initialize an empty object to store our final list of URLs (e.g., { "video1.mp4": "https://..." }).
        // const urls: Record<string, string> = {};

        // CONCEPT: Promise.all & .map (The Superpower for Speed)
        // Instead of waiting for one URL to generate before starting the next, we start ALL of them at the same time.
        // 'Promise.all' waits until every single "promise" (future value) inside the array is finished.
        const entries = await Promise.all(
            keys.map(async (key: string) => {
                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: key,
                });

                const signedUrl = await getSignedUrl(s3, command, {
                    expiresIn: 3600,
                });

                return [key, signedUrl]

                // urls[key] = signedUrl;
            })
        );

        const urls = Object.fromEntries(entries);
        console.log("URLS", urls)


        return NextResponse.json({ urls });
    } catch (err) {
        console.error("Batch signed URL error:", err);

        return NextResponse.json(
            { error: "Failed to generate signed URLs" },
            { status: 500 }
        );
    }
}