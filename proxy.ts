import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * First line of defense for private pages: no session cookie → sign-in page.
 * Every protected page ALSO checks the session on the server.
 */
export function proxy(request: NextRequest) {
  const cookie = getSessionCookie(request, { cookiePrefix: "srei" });
  if (!cookie) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account/setup", "/dashboard/:path*", "/forum/register"],
};
