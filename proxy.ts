import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/profile", "/matches", "/applications"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const session = request.cookies.get("tustojobs_session");
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/matches/:path*", "/applications/:path*"],
};
