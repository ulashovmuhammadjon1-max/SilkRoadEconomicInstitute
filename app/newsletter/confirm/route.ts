import { NextResponse, type NextRequest } from "next/server";
import { features } from "@/lib/features";
import { query } from "@/lib/server/db";
import { sendEmail } from "@/lib/server/email";
import { emails } from "@/lib/server/email-templates";
import { sha256, unsubscribeToken } from "@/lib/server/tokens";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Confirms a pending subscription (links are valid for 7 days). */
export async function GET(req: NextRequest) {
  const to = (s: string) => NextResponse.redirect(new URL(`/newsletter?status=${s}`, req.url), 303);
  if (!features.newsletter) return to("closed");
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (token.length < 20) return to("invalid");
  const rows = await query<{ email: string }>(
    `update newsletter_subscribers set status = 'confirmed', confirmed_at = now(), confirm_token_hash = null
     where confirm_token_hash = $1 and status = 'pending' and created_at > now() - interval '7 days'
     returning email`,
    [sha256(token)],
  );
  if (!rows[0]) return to("invalid");
  const email = rows[0].email;
  try {
    const unsub = absoluteUrl(`/newsletter/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubscribeToken(email)}`);
    await sendEmail({ to: email, ...emails.newsletterWelcome(unsub), headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });
  } catch {}
  return to("confirmed");
}
