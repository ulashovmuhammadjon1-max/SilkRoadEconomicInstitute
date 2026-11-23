import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import type { Brief } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { tagToSlug } from "@/lib/tags";
import { WithPlaceholders } from "./Placeholder";

type Props = { brief: Brief; variant?: "lead" | "compact" | "list"; headingLevel?: "h2" | "h3"; delay?: number };

/** Brief teaser. "lead": large cover, used once per section. "compact"/"list": smaller. */
export function BriefCard({ brief, variant = "compact", headingLevel = "h3", delay = 0 }: Props) {
  const Heading = headingLevel;
  const lead = variant === "lead";
  return (
    <article className="group flex h-full flex-col" data-reveal="up" style={{ "--d": `${delay}ms` } as CSSProperties}>
      {brief.coverImage && (
        <Link
          href={`/briefs/${brief.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className={`relative block overflow-hidden bg-cream-200 [--wipe-bg:theme(colors.cream.50)] ${lead ? "aspect-[4/3] lg:aspect-[16/10]" : "aspect-[1200/630]"}`}
          data-reveal="wipe"
          style={{ "--d": `${delay + 120}ms` } as CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brief.coverImage}
            alt=""
            loading="lazy"
            className="settle h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </Link>
      )}
      <div className={`flex flex-1 flex-col ${brief.coverImage ? "pt-5" : ""}`}>
        <p className="dateline flex flex-wrap items-center gap-x-3">
          <time dateTime={brief.date}>{formatDate(brief.date)}</time>
          {brief.tags[0] && (
            <>
              <span aria-hidden="true" className="text-gold">◆</span>
              <span>{brief.tags[0]}</span>
            </>
          )}
        </p>
        <Heading className={`mt-3 font-serif text-navy ${lead ? "text-h2" : "text-h3"}`}>
          <Link href={`/briefs/${brief.slug}`} className="bg-[linear-gradient(theme(colors.gold.DEFAULT),theme(colors.gold.DEFAULT))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-out group-hover:bg-[length:100%_1px]">
            <ViewTransition name={`brief-title-${brief.slug}`}>
              <span>
                <WithPlaceholders text={brief.title} />
              </span>
            </ViewTransition>
          </Link>
        </Heading>
        <p className={`mt-3 flex-1 text-ink-soft ${lead ? "text-lead" : ""}`}>
          <WithPlaceholders text={brief.summary} />
        </p>
        {variant !== "lead" && brief.tags.length > 1 && (
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
    </article>
  );
}
