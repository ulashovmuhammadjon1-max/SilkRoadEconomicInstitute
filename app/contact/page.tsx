import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WithPlaceholders } from "@/components/Placeholder";
import { isPlaceholder, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Silk Road Economic Institute by email, Telegram or Instagram.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  const emailReady = !isPlaceholder(site.email);
  const instagramReady = !isPlaceholder(site.instagramUrl);
  const mailto = emailReady ? `mailto:${site.email}?subject=${encodeURIComponent("Hello SREI")}` : "";

  const linkCls = "font-medium text-navy underline decoration-gold underline-offset-4 break-all";

  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch">
        Questions about the forum, an idea for a brief, or interested in judging? We&rsquo;d like to hear from you.
      </PageHeader>
      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <dl className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-sm border border-cream-300 bg-cream-50 p-6">
            <dt className="eyebrow">Email</dt>
            <dd className="mt-3">
              {emailReady ? (
                <a href={`mailto:${site.email}`} className={linkCls}>
                  {site.email}
                </a>
              ) : (
                <WithPlaceholders text={site.email} />
              )}
            </dd>
          </div>
          <div className="rounded-sm border border-cream-300 bg-cream-50 p-6">
            <dt className="eyebrow">Telegram</dt>
            <dd className="mt-3">
              <a href={site.telegramUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {site.telegramHandle}
              </a>
            </dd>
          </div>
          <div className="rounded-sm border border-cream-300 bg-cream-50 p-6">
            <dt className="eyebrow">Instagram</dt>
            <dd className="mt-3">
              {instagramReady ? (
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {site.instagramHandle}
                </a>
              ) : (
                <WithPlaceholders text={site.instagramHandle} />
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-10">
          {emailReady ? (
            <a
              href={mailto}
              className="inline-flex min-h-11 items-center rounded-sm bg-navy px-6 text-sm font-medium text-cream hover:bg-navy-700"
            >
              Write us an email
            </a>
          ) : (
            <p className="text-sm text-ink/70">
              The &ldquo;Write us an email&rdquo; button appears once the email address is set in <code>lib/site.ts</code>.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
