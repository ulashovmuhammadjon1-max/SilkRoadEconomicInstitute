import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Step 1 of the /admin login: sends the editor to GitHub to sign in.
 * Needs GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET set in Vercel (see README).
 */
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("GITHUB_CLIENT_ID is not set. See the README section 'Admin login'.", { status: 500 });
  }
  const state = randomBytes(16).toString("hex");
  const origin = request.nextUrl.origin;
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${origin}/api/callback`);
  authorize.searchParams.set("scope", process.env.GITHUB_OAUTH_SCOPE || "public_repo");
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize.toString());
  res.cookies.set("srei_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/callback",
    maxAge: 600,
  });
  return res;
}
