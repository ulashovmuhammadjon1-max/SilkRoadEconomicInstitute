import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { Mdx } from "@/components/Mdx";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Glyph } from "@/components/ornaments/Glyph";
import { RouteLine } from "@/components/ornaments/Ornaments";
import { WithPlaceholders } from "@/components/Placeholder";
import { ShareBar } from "@/components/ShareBar";
import { getAdjacentBriefs, getAllBriefs, getBrief } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import { tagToSlug } from "@/lib/tags";

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
  const words = brief.body.split(/\s+/).filter(Boolean).length;

  return (
    <article id="article">
      <ScrollProgress targetId="article" />
      <header className="page grid-12 gap-y-6 pb-10 pt-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="col-span-12 lg:col-span-2">
          <Link href="/briefs" className="inline-flex items-center gap-2 text-ui text-ink-soft hover:text-navy">
            <Glyph name="arrowLeft" size={18} /> Briefs
          </Link>
        </nav>
        <div className="col-span-12 lg:col-span-8">
          <p className="dateline load-fade flex flex-wrap items-center gap-x-3 gap-y-1">
            <time dateTime={brief.date}>{formatDate(brief.date)}</time>
            <span aria-hidden="true" className="text-gold">◆</span>
            <span>{brief.author}</span>
            <span aria-hidden="true" className="text-gold">◆</span>
            <span>{Math.max(1, Math.round(words / 220))} min read</span>
          </p>
          <h1 className="mt-5 font-serif text-h1 text-navy">
            <ViewTransition name={`brief-title-${brief.slug}`}>
              <span>
                <WithPlaceholders text={brief.title} />
              </span>
            </ViewTransition>
          </h1>
          <p className="load-in mt-6 max-w-measure text-lead text-ink-soft" style={{ "--d": "200ms" } as CSSProperties}>
            <WithPlaceholders text={brief.summary} />
          </p>
          {brief.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
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

      {brief.coverImage && (
        <div className="page">
          <div className="overflow-hidden" data-reveal="wipe">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brief.coverImage} alt={brief.coverAlt ?? ""} className="settle aspect-[1200/630] w-full object-cover" />
          </div>
        </div>
      )}

      <div className="page grid-12 pt-12 md:pt-16">
        <div className="col-span-12 lg:col-span-7 lg:col-start-3 xl:col-span-6 xl:col-start-3">
          <Mdx source={brief.body} variant="article" />

          <div className="mt-16 border-t border-cream-300 pt-8">
            <ShareBar url={url} title={brief.title} />
          </div>
        </div>
      </div>

      <div className="page mt-20" aria-hidden="true">
        <RouteLine className="h-6 w-full" />
      </div>

      {(older || newer) && (
        <nav aria-label="More briefs" className="page mt-6 grid gap-6 sm:grid-cols-2">
          {older ? (
            <Link href={`/briefs/${older.slug}`} className="group border-t-2 border-navy pt-5">
              <span className="dateline inline-flex items-center gap-2">
                <Glyph name="arrowLeft" size={16} className="transition-transform duration-500 group-hover:-translate-x-1" /> Previous brief
              </span>
              <span className="mt-3 block font-serif text-h3 text-navy">
                <WithPlaceholders text={older.title} />
              </span>
              <span className="mt-2 block max-h-0 overflow-hidden text-ink-soft opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
                <WithPlaceholders text={older.summary} />
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/briefs/${newer.slug}`} className="group border-t-2 border-navy pt-5 text-right">
              <span className="dateline inline-flex items-center gap-2">
                Next brief <Glyph name="arrow" size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
              <span className="mt-3 block font-serif text-h3 text-navy">
                <WithPlaceholders text={newer.title} />
              </span>
              <span className="mt-2 block max-h-0 overflow-hidden text-ink-soft opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
                <WithPlaceholders text={newer.summary} />
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
