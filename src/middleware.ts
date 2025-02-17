import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { env } from "process";

export async function middleware(request: NextRequest) {
  const cookie = await cookies();
  const sessionCookieValue = cookie.get(
    env.NODE_ENV === "production"
      ? "__Secure-better-auth.session_token"
      : "better-auth.session_token"
  )?.value;
  if (!sessionCookieValue) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"], // Specify the routes the middleware applies to
};
