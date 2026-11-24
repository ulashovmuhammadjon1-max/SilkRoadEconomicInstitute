import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account deleted", robots: { index: false } };

export default function DeletedPage() {
  return (
    <section className="page py-24 md:py-32">
      <p className="label">Account</p>
      <h1 className="mt-4 font-serif text-h1 text-midnight">Your account has been deleted</h1>
      <p className="mt-5 max-w-measure text-lead text-ink-soft">
        Your profile and everything linked to it have been removed. You can still read all of SREI&rsquo;s briefs and working papers.
      </p>
      <Link href="/" className="btn btn-primary mt-10">
        Back to the start
      </Link>
    </section>
  );
}
