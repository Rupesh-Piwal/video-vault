import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedS3Url(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_REGION!,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 }); 
}
