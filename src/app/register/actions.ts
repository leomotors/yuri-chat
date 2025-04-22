"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authCookieName, limits, pfpBucketName } from "@/constants";
import { environment } from "@/lib/environment";
import prisma from "@/lib/prisma";
import { s3 } from "@/lib/s3";

export async function registerUser(_: unknown, formData: FormData) {
  const username = formData.get("username")?.toString();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();
  const profilePicture = formData.get("profilePicture") as File;

  if (!username || !name || !password || !profilePicture) {
    return {
      error: "Data is missing",
    };
  }

  if (
    username.length < limits.username.min ||
    username.length > limits.username.max
  ) {
    return {
      error: `Username must be between ${limits.username.min} and ${limits.username.max} characters`,
    };
  }

  if (name.length < limits.name.min || name.length > limits.name.max) {
    return {
      error: `Name must be between ${limits.name.min} and ${limits.name.max} characters`,
    };
  }

  if (
    password.length < limits.password.min ||
    password.length > limits.password.max
  ) {
    return {
      error: `Password must be between ${limits.password.min} and ${limits.password.max} characters`,
    };
  }

  if (profilePicture.size > 5 * 1024 * 1024) {
    return {
      error: "Profile picture must be less than 5MB",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return {
      error: "Username already exists",
    };
  }

  const key = await uploadProfilePicture(profilePicture, username);

  if (!key) {
    return {
      error: "Error uploading profile picture",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: {
      username,
      name,
      password: hashedPassword,
      profilePicture: key,
    },
  });

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(environment.JWT_SECRET));

  (await cookies()).set(authCookieName, token, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
  });

  redirect("/home");
}

async function uploadProfilePicture(file: File, username: string) {
  // Upload image to S3
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const key = `${pfpBucketName}/${username}-${Date.now()}.${file.type.split("/")[1]}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: environment.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    return key;
  } catch (error) {
    console.error("Error uploading file to S3", error);
    return null;
  }
}
