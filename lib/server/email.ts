import "server-only";
import fs from "node:fs";
import { Resend } from "resend";

export type Email = { to: string; subject: string; html: string; text: string; headers?: Record<string, string> };

const from = process.env.EMAIL_FROM || "SREI <hello@silkroadecon.asia>";
const replyTo = process.env.EMAIL_REPLY_TO || undefined;

/**
 * Sends an email through Resend. In local development without a Resend key,
 * set EMAIL_DEV_OUTBOX=/path/file.jsonl and emails are appended there instead
 * (the end-to-end tests read links from it).
 */
export async function sendEmail(msg: Email) {
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({ from, to: msg.to, subject: msg.subject, html: msg.html, text: msg.text, replyTo, headers: msg.headers });
    if (error) {
      console.error("[email] send failed:", error.name);
      throw new Error("Email could not be sent");
    }
    return;
  }
  const outbox = process.env.EMAIL_DEV_OUTBOX;
  if (outbox && (process.env.NODE_ENV !== "production" || process.env.SREI_ALLOW_DEV_OUTBOX === "1")) {
    fs.appendFileSync(outbox, JSON.stringify({ at: new Date().toISOString(), ...msg }) + "\n");
    return;
  }
  throw new Error("No email provider configured");
}
