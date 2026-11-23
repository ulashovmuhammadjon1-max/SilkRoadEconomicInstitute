import { NextResponse, type NextRequest } from "next/server";

/**
 * Step 2 of the /admin login: GitHub sends the editor back here with a code,
 * which is exchanged for a token and handed to the admin window.
 */
export const dynamic = "force-dynamic";

/** JSON that is safe to place inside a <script> tag. */
function js(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function reply(status: "success" | "error", content: Record<string, string>, origin: string) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  // The admin window (opener) and this popup share the same origin.
  const html = `<!doctype html><html><body><p>${status === "success" ? "Logged in. You can close this window." : "Login failed."}</p>
<script>
(function () {
  var target = ${js(origin)};
  var message = ${js(message)};
  function receive(e) {
    if (e.origin !== target) return;
    window.opener.postMessage(message, target);
    window.removeEventListener("message", receive);
  }
  if (!window.opener) { document.body.textContent = "Please start the login from the /admin page."; return; }
  window.addEventListener("message", receive);
  window.opener.postMessage("authorizing:github", target);
})();
</script></body></html>`;
  const res = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
  res.cookies.delete({ name: "srei_oauth_state", path: "/api/callback" });
  return res;
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expected = request.cookies.get("srei_oauth_state")?.value;

  if (!code || !state || !expected || state !== expected) {
    return reply("error", { error: "Invalid login state. Please try again." }, origin);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return reply("error", { error: "GitHub login is not configured on the server." }, origin);
  }

  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: `${origin}/api/callback` }),
      cache: "no-store",
    });
    const data = (await r.json()) as { access_token?: string; error_description?: string };
    if (!data.access_token) {
      return reply("error", { error: data.error_description || "GitHub did not return a token." }, origin);
    }
    return reply("success", { token: data.access_token, provider: "github" }, origin);
  } catch {
    return reply("error", { error: "Could not reach GitHub. Please try again." }, origin);
  }
}
