"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="page py-24 md:py-32">
      <p className="label">Something went wrong</p>
      <h1 className="mt-4 max-w-[18ch] font-serif text-h1 text-navy">This page couldn&rsquo;t be displayed</h1>
      <p className="mt-5 max-w-measure text-lead text-ink-soft">
        An unexpected error occurred while showing this page. Trying again usually helps. If it keeps happening, please tell us via the Contact page.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to the start
        </Link>
      </div>
    </section>
  );
}
