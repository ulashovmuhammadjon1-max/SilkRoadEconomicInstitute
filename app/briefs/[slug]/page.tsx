import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/Mdx";
import { WithPlaceholders } from "@/components/Placeholder";
import { getAdjacentBriefs, getAllBriefs, getBrief } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { tagToSlug } from "@/lib/tags";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBriefs().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brief = getBrief((await params).slug);
  if (!brief) return {};
  return {
    title: brief.title,
    description: brief.summary,
    authors: [{ name: brief.author }],
    keywords: brief.tags,
    alternates: { canonical: `/briefs/${brief.slug}` },
    openGraph: {
      type: "article",
      url: `/briefs/${brief.slug}`,
      title: brief.title,
      description: brief.summary,
      publishedTime: brief.date,
      authors: [brief.author],
      tags: brief.tags,
    },
  };
}

export default async function BriefPage({ params }: Props) {
  const brief = getBrief((await params).slug);
  if (!brief) notFound();
  const { older, newer } = getAdjacentBriefs(brief.slug);
  const url = absoluteUrl(`/briefs/${brief.slug}`);
  const telegramShare = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(brief.title)}`;

  return (
    <article>
      <header className="border-b border-cream-300 bg-cream-50">
        <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm">
            <Link href="/briefs" className="text-navy underline decoration-gold underline-offset-4">
              Briefs
            </Link>
          </nav>
          <h1 className="mt-6 font-serif text-3xl leading-tight text-navy md:text-5xl">
            <WithPlaceholders text={brief.title} />
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            <WithPlaceholders text={brief.summary} />
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/80">
            <span>{brief.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={brief.date}>{formatDate(brief.date)}</time>
          </div>
          {brief.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {brief.tags.map((t) => (
                <li key={t}>
                  <Link href={`/briefs/tag/${tagToSlug(t)}`} className="tag">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10 md:py-12">
        {brief.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brief.coverImage} alt={brief.coverAlt ?? ""} className="mb-10 w-full rounded-sm border border-cream-300" />
        )}

        <Mdx source={brief.body} />

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-cream-300 pt-8">
          <a
            href={telegramShare}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-navy px-5 text-sm font-medium text-cream hover:bg-navy-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.1 1.8 11.6c-1-.3-1-1 .2-1.5L20.6 3c.8-.3 1.6.2 1.3 1.3Z" />
            </svg>
            Share to Telegram
          </a>
        </div>

        {(older || newer) && (
          <nav aria-label="More briefs" className="mt-10 grid gap-4 sm:grid-cols-2">
            {older ? (
              <Link href={`/briefs/${older.slug}`} className="rounded-sm border border-cream-300 bg-cream-50 p-5 hover:border-gold">
                <span className="text-xs uppercase tracking-[0.14em] text-gold-dark">← Previous brief</span>
                <span className="mt-2 block font-serif text-lg text-navy">
                  <WithPlaceholders text={older.title} />
                </span>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link href={`/briefs/${newer.slug}`} className="rounded-sm border border-cream-300 bg-cream-50 p-5 text-right hover:border-gold">
                <span className="text-xs uppercase tracking-[0.14em] text-gold-dark">Next brief →</span>
                <span className="mt-2 block font-serif text-lg text-navy">
                  <WithPlaceholders text={newer.title} />
                </span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
