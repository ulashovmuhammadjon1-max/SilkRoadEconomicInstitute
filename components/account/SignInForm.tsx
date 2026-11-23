"use client";

import { useCallback, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Glyph } from "../ornaments/Glyph";
import { Field, inputCls } from "./Field";
import { Turnstile } from "./Turnstile";

export function SignInForm({ next, google, turnstileSiteKey }: { next: string; google: boolean; turnstileSiteKey: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const onToken = useCallback((t: string | null) => setToken(t), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      document.getElementById("email")?.focus();
      return;
    }
    if (turnstileSiteKey && !token) {
      setError("Please complete the check below.");
      return;
    }
    setState("sending");
    const { error } = await authClient.signIn.magicLink(
      { email: email.trim().toLowerCase(), callbackURL: next, newUserCallbackURL: "/account/setup", errorCallbackURL: "/signin?error=link" },
      token ? { headers: { "x-captcha-response": token } } : undefined,
    );
    if (error) {
      setState("error");
      setError(error.status === 429 ? "Too many attempts. Please wait a minute and try again." : "We couldn't send the link. Please try again in a moment.");
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div role="status" className="border-l-2 border-gold pl-5">
        <p className="font-serif text-h3 text-navy">Check your inbox</p>
        <p className="mt-2 text-ink-soft">
          We sent a sign-in link to <strong className="text-navy">{email}</strong>. It works once and expires in 10 minutes. You can close this tab.
        </p>
        <button type="button" onClick={() => setState("idle")} className="link mt-4 text-ui">
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field id="email" label="Email address" error={error ?? undefined}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "email-error" : undefined}
            className={inputCls}
          />
        </Field>
        {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} onToken={onToken} action="signin" />}
        <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Email me a sign-in link"} <Glyph name="arrow" className="arrow" />
        </button>
        <p className="text-sm text-ink-muted">No password needed. New here? The same link creates your account.</p>
      </form>
      {google && (
        <>
          <div className="flex items-center gap-4 text-sm text-ink-muted" aria-hidden="true">
            <span className="h-px flex-1 bg-cream-300" /> or <span className="h-px flex-1 bg-cream-300" />
          </div>
          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: next, newUserCallbackURL: "/account/setup" })}
            className="btn btn-ghost w-full justify-center"
          >
            Continue with Google
          </button>
        </>
      )}
    </div>
  );
}
