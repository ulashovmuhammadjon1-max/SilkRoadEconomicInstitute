import "server-only";

/** Verifies a Cloudflare Turnstile token. Returns true when Turnstile isn't configured. */
export async function verifyTurnstile(token: string | null | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return true;
  if (!token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    const data = (await r.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}
