import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SignInForm } from "@/components/account/SignInForm";
import { features, turnstileSiteKey } from "@/lib/features";
import { getUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (!features.accounts) notFound();
  const { next, error } = await searchParams;
  if (await getUser()) redirect(safeNext(next));
  return (
    <section className="page grid-12 gap-y-10 py-16 md:py-24">
      <div className="col-span-12 lg:col-span-5 lg:col-start-2">
        <p className="label">Account</p>
        <h1 className="mt-4 font-serif text-h1 text-navy">Sign in</h1>
        <p className="mt-5 text-lead text-ink-soft">For forum participants and authors: register for forums, follow your submission and manage your details.</p>
      </div>
      <div className="col-span-12 lg:col-span-4 lg:col-start-8">
        {error && (
          <p role="alert" className="mb-6 border-l-2 border-rust pl-4 text-sm text-rust">
            That sign-in link has expired or was already used. Please request a new one.
          </p>
        )}
        <SignInForm next={safeNext(next)} google={features.google} turnstileSiteKey={features.turnstile ? turnstileSiteKey : ""} />
        <p className="mt-8 text-xs text-ink-muted">
          By continuing you agree to the{" "}
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
