/**
 * Feature switches, evaluated on the server at build/request time.
 * Accounts and the newsletter switch on automatically once the services are
 * connected in Vercel (see README → "Accounts and newsletter"). Until then the
 * public site shows no sign-in or subscribe UI at all.
 */
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const canEmail = Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_DEV_OUTBOX);

export const features = {
  accounts: Boolean(dbUrl && canEmail && process.env.BETTER_AUTH_SECRET),
  newsletter: Boolean(dbUrl && canEmail && process.env.BETTER_AUTH_SECRET),
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  turnstile: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY),
};

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
