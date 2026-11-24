/**
 * Feature switches, evaluated on the server at build/request time.
 * Accounts switch on once a database is connected; the newsletter and email
 * sign-in links also need an email service. Both are connected in Vercel (see README → "Accounts and newsletter"). Until then the
 * public site shows no sign-in or subscribe UI at all.
 */
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const canEmail = Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_DEV_OUTBOX);

const hasDb = Boolean(dbUrl && process.env.BETTER_AUTH_SECRET);

export const features = {
  /** Name + email + password accounts. Need only the database (no email service). */
  accounts: hasDb,
  /** "Email me a sign-in link" — needs an email service too. */
  magicLink: hasDb && canEmail,
  newsletter: hasDb && canEmail,
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  turnstile: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY),
};

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
