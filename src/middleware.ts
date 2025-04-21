import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { environment } from "@/lib/environment";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(environment.JWT_SECRET), {
      algorithms: ["HS256"],
    });

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/yuri/:path*"],
};
