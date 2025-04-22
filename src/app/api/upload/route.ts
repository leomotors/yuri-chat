import { PutObjectCommand } from "@aws-sdk/client-s3";

import { chatImagesFolderName } from "@/constants";
import { getUser } from "@/lib/auth";
import { environment } from "@/lib/environment";
import { s3 } from "@/lib/s3";

export async function POST(request: Request) {
  const username = await getUser();

  if (!username) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const roomId = formData.get("roomId") as string;
  const type = formData.get("type") as string;

  if (!file || !roomId || !type) {
    return new Response("Bad Request", { status: 400 });
  }

  // Upload Image to S3
  const key = `${chatImagesFolderName}/${roomId}/${file.name}-${Date.now()}.${file.type.split("/")[1]}`;

  const command = new PutObjectCommand({
    Bucket: environment.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error("Error uploading file to S3", error);
    return new Response("Error uploading file", { status: 500 });
  }

  return new Response(key);
}
