import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const randomToken = () => randomBytes(32).toString("base64url");

const secret = () => {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s) throw new Error("BETTER_AUTH_SECRET is not set");
  return s;
};

/** Stable, unguessable unsubscribe token for an email address (no storage needed). */
export function unsubscribeToken(email: string) {
  return createHmac("sha256", secret()).update(`unsubscribe:${email.toLowerCase()}`).digest("base64url");
}

export function checkUnsubscribeToken(email: string, token: string) {
  const a = Buffer.from(unsubscribeToken(email));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
