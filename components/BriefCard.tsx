import Link from "next/link";
import type { Brief } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { tagToSlug } from "@/lib/tags";
import { WithPlaceholders } from "./Placeholder";

export function BriefCard({ brief, headingLevel = "h3" }: { brief: Brief; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-cream-300 bg-cream-50 transition-shadow hover:shadow-md">
      {brief.coverImage && (
        <Link href={`/briefs/${brief.slug}`} tabIndex={-1} aria-hidden="true" className="block aspect-[1200/630] overflow-hidden bg-cream-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brief.coverImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-gold-dark">
          <time dateTime={brief.date}>{formatDate(brief.date)}</time>
        </p>
        <Heading className="mt-2 font-serif text-xl leading-snug text-navy">
          <Link href={`/briefs/${brief.slug}`} className="hover:underline decoration-gold underline-offset-4">
            <WithPlaceholders text={brief.title} />
          </Link>
        </Heading>
        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/80">
          <WithPlaceholders text={brief.summary} />
        </p>
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
    </article>
  );
}
