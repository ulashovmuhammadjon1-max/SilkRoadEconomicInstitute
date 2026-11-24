import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PasswordForm } from "@/components/account/PasswordForm";
import { features, turnstileSiteKey } from "@/lib/features";
import { getUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

export default async function SignUpPage() {
  if (!features.accounts) notFound();
  if (await getUser()) redirect("/account");
  return (
    <section className="page grid-12 gap-y-10 py-16 md:py-24">
      <div className="col-span-12 lg:col-span-5 lg:col-start-2">
        <p className="label">Account · Step 1 of 2</p>
        <h1 className="mt-4 font-serif text-h1 text-midnight">Create an account</h1>
        <p className="mt-5 text-lead text-ink-soft">For students who want to take part in SREI research forums. It takes a minute; no email confirmation needed.</p>
        <p className="mt-6 text-sm text-ink-muted">Accounts are for students aged 13 and over. Under 18? You&rsquo;ll be asked to confirm a parent or guardian agrees.</p>
      </div>
      <div className="col-span-12 rounded-[28px] border border-cream-300 bg-paper p-6 md:p-8 lg:col-span-4 lg:col-start-8">
        <PasswordForm mode="signup" next="/account" turnstileSiteKey={features.turnstile ? turnstileSiteKey : ""} />
        <p className="mt-6 text-xs text-ink-muted">
          By creating an account you agree to the{" "}
          <Link href="/terms" className="link">
            terms of participation
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="link">
            privacy notice
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
