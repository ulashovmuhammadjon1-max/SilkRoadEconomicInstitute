import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Newsletter", robots: { index: false } };

const MESSAGES: Record<string, { title: string; text: string }> = {
  confirmed: { title: "You're subscribed", text: "Thank you for confirming. New SREI briefs will arrive in your inbox." },
  unsubscribed: { title: "You've been unsubscribed", text: "You won't receive any more newsletter emails from SREI." },
  invalid: { title: "That link didn't work", text: "It may have expired or already been used. Please sign up again from any brief." },
  closed: { title: "The newsletter isn't open yet", text: "Follow us on Telegram for new briefs in the meantime." },
};

export default async function NewsletterPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const m = MESSAGES[(await searchParams).status ?? ""] ?? MESSAGES.invalid;
  return (
    <section className="page py-24 md:py-32">
      <p className="label">Newsletter</p>
      <h1 className="mt-4 font-serif text-h1 text-midnight">{m.title}</h1>
      <p className="mt-5 max-w-measure text-lead text-ink-soft">{m.text}</p>
      <Link href="/briefs" className="btn btn-primary mt-10">
        Read the briefs
      </Link>
    </section>
  );
}
