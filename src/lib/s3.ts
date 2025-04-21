import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { environment } from "./environment";

export const s3 = new S3Client({
  endpoint: environment.AWS_ENDPOINT,
  region: environment.AWS_REGION,
  credentials: {
    accessKeyId: environment.AWS_ACCESS_KEY_ID,
    secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: !!environment.AWS_FORCE_PATH_STYLE,
});

export async function getURLFromKey(key: string) {
  const command = new GetObjectCommand({
    Bucket: environment.AWS_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 });
}
