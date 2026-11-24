import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PasswordForm } from "@/components/account/PasswordForm";
import { SignInForm } from "@/components/account/SignInForm";
import { features, turnstileSiteKey } from "@/lib/features";
import { getUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (!features.accounts) notFound();
  const { next, error } = await searchParams;
  if (await getUser()) redirect(safeNext(next));
  const ts = features.turnstile ? turnstileSiteKey : "";
  return (
    <section className="page grid-12 gap-y-10 py-16 md:py-24">
      <div className="col-span-12 lg:col-span-5 lg:col-start-2">
        <p className="label">Account</p>
        <h1 className="mt-4 font-serif text-h1 text-midnight">Sign in</h1>
        <p className="mt-5 text-lead text-ink-soft">For forum participants and authors: register for forums, follow your submission and manage your details.</p>
        {!features.magicLink && (
          <p className="mt-6 text-sm text-ink-muted">
            Forgot your password? Write to us from the Contact page and we&rsquo;ll help you get back in.
          </p>
        )}
      </div>
      <div className="col-span-12 space-y-8 lg:col-span-4 lg:col-start-8">
        {error && (
          <p role="alert" className="border-l-2 border-rust pl-4 text-sm text-rust">
            That sign-in link has expired or was already used. Please sign in again.
          </p>
        )}
        <div className="rounded-[28px] border border-cream-300 bg-paper p-6 md:p-8">
          <PasswordForm mode="signin" next={safeNext(next)} turnstileSiteKey={ts} />
        </div>
        {features.magicLink && (
          <details className="rounded-[28px] border border-cream-300 bg-paper p-6 md:p-8">
            <summary className="cursor-pointer text-ui font-medium text-midnight">Forgot your password? Email me a sign-in link</summary>
            <div className="mt-6">
              <SignInForm next={safeNext(next)} google={false} turnstileSiteKey={ts} />
            </div>
          </details>
        )}
        <p className="text-xs text-ink-muted">
          <Link href="/terms" className="link">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="link">
            Privacy
          </Link>
        </p>
      </div>
    </section>
  );
}
