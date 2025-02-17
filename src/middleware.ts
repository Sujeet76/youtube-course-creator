import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookie = await cookies();
  const sessionCookieValue = cookie.get("better-auth.session_token")?.value;
  if (!sessionCookieValue) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Specify the routes the middleware applies to
};
