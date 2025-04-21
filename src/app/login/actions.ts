"use server";

import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { limits } from "@/constants";
import { environment } from "@/lib/environment";
import prisma from "@/lib/prisma";

export async function loginUser(_: unknown, formData: FormData) {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
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

  if (
    password.length < limits.password.min ||
    password.length > limits.password.max
  ) {
    return {
      error: `Password must be between ${limits.password.min} and ${limits.password.max} characters`,
    };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      error: "User not found",
    };
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return {
      error: "Invalid password",
    };
  }

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(environment.JWT_SECRET));

  (await cookies()).set("token", token, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
  });

  redirect("/home");
}
