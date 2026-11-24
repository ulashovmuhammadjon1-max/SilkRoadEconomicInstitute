"use server";

import { features } from "@/lib/features";
import { newsletterSchema } from "@/lib/schemas";
import { query } from "@/lib/server/db";
import { sendEmail } from "@/lib/server/email";
import { emails } from "@/lib/server/email-templates";
import { rateLimit } from "@/lib/server/ratelimit";
import { randomToken, sha256 } from "@/lib/server/tokens";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { absoluteUrl } from "@/lib/site";

export type SubscribeState = { status: "idle" | "ok" | "error"; message?: string };

/**
 * Double opt-in: stores the address as "pending" and emails a confirmation
 * link. Always answers the same way whether or not the address is already
 * subscribed, so the form can't be used to discover who subscribes.
 */
export async function subscribe(_: SubscribeState, formData: FormData): Promise<SubscribeState> {
  if (!features.newsletter) return { status: "error", message: "The newsletter isn't open yet." };
  if (String(formData.get("website") ?? "") !== "") return { status: "ok" }; // honeypot: silently accept bots
  if (!(await rateLimit("newsletter", 5, 60))) return { status: "error", message: "Too many attempts. Please wait a minute and try again." };
  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? "")))) return { status: "error", message: "Please complete the check and try again." };

  const parsed = newsletterSchema.safeParse({ email: String(formData.get("email") ?? "") });
  if (!parsed.success) return { status: "error", message: "Please enter a valid email address." };
  const email = parsed.data.email;

  const existing = (await query<{ status: string }>("select status from newsletter_subscribers where email = $1", [email]))[0];
  if (existing?.status !== "confirmed") {
    const token = randomToken();
    await query(
      `insert into newsletter_subscribers (email, status, confirm_token_hash) values ($1, 'pending', $2)
       on conflict (email) do update set status = 'pending', confirm_token_hash = $2, created_at = now(), unsubscribed_at = null`,
      [email, sha256(token)],
    );
    try {
      await sendEmail({ to: email, ...emails.newsletterConfirm(absoluteUrl(`/newsletter/confirm?token=${token}`)) });
    } catch {
      return { status: "error", message: "We couldn't send the confirmation email. Please try again later." };
    }
  }
  return { status: "ok" };
}
