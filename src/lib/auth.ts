import "server-only";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { authCookieName } from "@/constants";

import { environment } from "./environment";

export async function getUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(authCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(environment.JWT_SECRET),
      {
        algorithms: ["HS256"],
      },
    );

    const username = payload.username as string;

    return username;
  } catch (_) {
    cookieStore.delete(authCookieName);

    return null;
  }
}
