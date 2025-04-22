import { NextRequest, NextResponse } from "next/server";

import { getUser } from "./lib/auth";
import { authCookieName } from "./constants";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const username = await getUser();

  if (!username) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/chat/:path*", "/settings/:path*"],
};
