"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useState } from "react";
import { subscribe, type SubscribeState } from "@/app/newsletter/actions";
import { Turnstile } from "../account/Turnstile";
import { Glyph } from "../ornaments/Glyph";

/** Newsletter sign-up (double opt-in). `tone="dark"` for navy sections. */
export function NewsletterForm({ tone = "light", turnstileSiteKey = "", id = "newsletter" }: { tone?: "light" | "dark"; turnstileSiteKey?: string; id?: string }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { status: "idle" });
  const [token, setToken] = useState<string | null>(null);
  const onToken = useCallback((t: string | null) => setToken(t), []);
  useEffect(() => {
    if (state.status === "ok") track("newsletter_signup");
  }, [state.status]);
  const dark = tone === "dark";

  if (state.status === "ok") {
    return (
      <p role="status" className={`rounded-2xl border p-5 ${dark ? "border-turquoise/40 text-cream" : "border-turquoise/40 bg-[#E6F4F3] text-ink"}`}>
        <strong className="font-medium">Check your inbox.</strong> Click the link in our email to confirm your subscription.
      </p>
    );
  }
  return (
    <form action={action} className="space-y-3" noValidate>
      <label htmlFor={`${id}-email`} className={`block font-mono text-label uppercase ${dark ? "text-turquoise-light" : "text-turquoise-ink"}`}>
        Get new briefs by email
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state.status === "error" || undefined}
          aria-describedby={state.status === "error" ? `${id}-error` : `${id}-note`}
          className={`min-h-12 flex-1 rounded-full border px-5 outline-none transition-colors ${
            dark ? "border-white/20 bg-white/5 text-cream placeholder:text-cream/40 focus:border-turquoise" : "border-ink/20 bg-paper text-ink focus:border-midnight"
          }`}
        />
        {/* honeypot: hidden from people, tempting to bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        {token && <input type="hidden" name="cf-turnstile-response" value={token} />}
        <button type="submit" disabled={pending} className={`btn ${dark ? "btn-accent" : "btn-primary"} justify-center disabled:opacity-60`}>
          {pending ? "Sending…" : "Subscribe"} <Glyph name="arrow" className="arrow" />
        </button>
      </div>
      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} onToken={onToken} action="newsletter" />}
      {state.status === "error" && (
        <p id={`${id}-error`} role="alert" className={`text-sm font-medium ${dark ? "text-coral-light" : "text-rust"}`}>
          {state.message}
        </p>
      )}
      <p id={`${id}-note`} className={`text-xs ${dark ? "text-cream/60" : "text-ink-muted"}`}>
        One email per new brief. Unsubscribe with one click.{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy
        </Link>
      </p>
    </form>
  );
}
