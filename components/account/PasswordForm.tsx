"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Glyph } from "../ornaments/Glyph";
import { Field, inputCls } from "./Field";
import { Turnstile } from "./Turnstile";

type Mode = "signin" | "signup";

/** Email + password sign-in / sign-up. Sign-up needs no email verification. */
export function PasswordForm({ mode, next, turnstileSiteKey }: { mode: Mode; next: string; turnstileSiteKey: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const onToken = useCallback((t: string | null) => setToken(t), []);
  const signup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (signup && name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) errs.email = "Please enter a valid email address.";
    if (password.length < 8) errs.password = signup ? "Use at least 8 characters." : "Please enter your password.";
    if (turnstileSiteKey && !token) errs.form = "Please complete the check below.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = ["name", "email", "password"].find((k) => errs[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setPending(true);
    const opts = token ? { headers: { "x-captcha-response": token } } : undefined;
    const res = signup
      ? await authClient.signUp.email({ name: name.trim(), email: email.trim().toLowerCase(), password }, opts)
      : await authClient.signIn.email({ email: email.trim().toLowerCase(), password }, opts);
    setPending(false);
    if (res.error) {
      const code = res.error.code ?? "";
      const msg =
        res.error.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : /ALREADY_EXISTS/i.test(code)
            ? "An account with this email already exists. Please sign in instead."
            : /INVALID_EMAIL_OR_PASSWORD|INVALID_PASSWORD|USER_NOT_FOUND/i.test(code) || res.error.status === 401
              ? "The email or password is incorrect."
              : /PASSWORD_TOO_SHORT/i.test(code)
                ? "Use at least 8 characters."
                : "Something went wrong. Please try again.";
      setErrors({ form: msg });
      return;
    }
    router.push(signup ? "/account/setup" : next);
    router.refresh();
  }

  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {signup && (
        <Field id="name" label="Full name" error={errors.name}>
          <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} {...err("name")} />
        </Field>
      )}
      <Field id="email" label="Email address" error={errors.email}>
        <input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} {...err("email")} />
      </Field>
      <Field id="password" label="Password" hint={signup ? "At least 8 characters." : undefined} error={errors.password}>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete={signup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputCls} pr-20`}
            {...err("password")}
            aria-describedby={errors.password ? "password-error" : signup ? "password-hint" : undefined}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 inline-flex min-h-9 -translate-y-1/2 items-center rounded-full px-3 text-xs font-medium text-ink-soft hover:text-midnight"
            aria-pressed={show}
          >
            {show ? "Hide" : "Show"}
            <span className="sr-only"> password</span>
          </button>
        </div>
      </Field>
      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} onToken={onToken} action={mode} />}
      {errors.form && (
        <p role="alert" className="text-sm font-medium text-rust">
          {errors.form}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary w-full justify-center disabled:opacity-60">
        {pending ? (signup ? "Creating your account…" : "Signing in…") : signup ? "Create account" : "Sign in"} <Glyph name="arrow" className="arrow" />
      </button>
      <p className="text-sm text-ink-soft">
        {signup ? (
          <>
            Already have an account?{" "}
            <Link href={`/signin${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="link">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="link">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
