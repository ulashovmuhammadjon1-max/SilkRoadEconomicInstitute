import { NextResponse, type NextRequest } from "next/server";
import { features } from "@/lib/features";
import { query } from "@/lib/server/db";
import { checkUnsubscribeToken } from "@/lib/server/tokens";

export const dynamic = "force-dynamic";

/** One-click unsubscribe (GET from the email link, POST from mail clients' unsubscribe button). */
async function handle(req: NextRequest) {
  const to = (s: string) => NextResponse.redirect(new URL(`/newsletter?status=${s}`, req.url), 303);
  if (!features.newsletter) return to("closed");
  const email = (req.nextUrl.searchParams.get("e") ?? "").toLowerCase();
  const token = req.nextUrl.searchParams.get("t") ?? "";
  if (!email || !token || !checkUnsubscribeToken(email, token)) return to("invalid");
  await query(`update newsletter_subscribers set status = 'unsubscribed', unsubscribed_at = now() where email = $1`, [email]);
  return to("unsubscribed");
}
export const GET = handle;
export const POST = handle;
