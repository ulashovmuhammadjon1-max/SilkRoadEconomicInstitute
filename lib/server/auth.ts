import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { captcha } from "better-auth/plugins/captcha";
import { magicLink } from "better-auth/plugins/magic-link";
import { pool } from "./db";
import { sendEmail } from "./email";
import { emails } from "./email-templates";

export const AUTH_BASE_PATH = "/api/member-auth";

function baseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_ENV === "production") return "https://silkroadecon.asia";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : undefined;

export const auth = betterAuth({
  appName: "Silk Road Economic Institute",
  baseURL: baseURL(),
  basePath: AUTH_BASE_PATH,
  // While accounts are switched off (no secret yet) every auth endpoint returns 404,
  // so this inert placeholder is never used to sign anything.
  secret: process.env.BETTER_AUTH_SECRET || "accounts-disabled-placeholder-secret-0000000000",
  database: pool,
  trustedOrigins: ["https://silkroadecon.asia", "https://www.silkroadecon.asia", ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])],
  emailAndPassword: { enabled: false },
  socialProviders: google,
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  // Per-IP limits. Schools may share one IP, so the general limit is generous;
  // sending sign-in emails is the expensive/abusable action and is limited tightly.
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 120,
    customRules: {
      "/get-session": false,
      "/sign-in/magic-link": { window: 60, max: 10 },
      "/magic-link/verify": { window: 60, max: 30 },
    },
  },
  advanced: { cookiePrefix: "srei", useSecureCookies: process.env.NODE_ENV === "production" },
  plugins: [
    magicLink({
      expiresIn: 600,
      sendMagicLink: async ({ email, url }) => {
        const m = emails.magicLink(url);
        await sendEmail({ to: email, ...m });
      },
    }),
    ...(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      ? [captcha({ provider: "cloudflare-turnstile", secretKey: process.env.TURNSTILE_SECRET_KEY, endpoints: ["/sign-in/magic-link"] })]
      : []),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
