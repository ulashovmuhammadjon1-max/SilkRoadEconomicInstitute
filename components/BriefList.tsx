import type { Brief } from "@/lib/content";
import { BRIEF_TAGS, tagToSlug } from "@/lib/tags";
import { BriefCard } from "./BriefCard";
import { Waypoint } from "./ornaments/Ornaments";
import { TagFilter } from "./TagFilter";

export function BriefList({ briefs, all, activeTag }: { briefs: Brief[]; all: Brief[]; activeTag?: string }) {
  const counts = Object.fromEntries(BRIEF_TAGS.map((t) => [t, all.filter((b) => b.tags.some((x) => tagToSlug(x) === tagToSlug(t))).length]));
  const [lead, ...rest] = briefs;
  return (
    <section className="page py-10 md:py-14">
      <TagFilter active={activeTag} counts={counts} />
      {!lead ? (
        <div className="flex flex-col items-start gap-4 py-24">
          <Waypoint className="text-gold" />
          <p className="font-serif text-h3 text-navy">{activeTag ? `No briefs on ${activeTag} yet.` : "No briefs have been published yet."}</p>
          <p className="text-ink-muted">New briefs appear here as soon as they are published.</p>
        </div>
      ) : (
        <>
          <div className="mt-12 grid-12 gap-y-12">
            <div className="col-span-12 lg:col-span-8">
              <BriefCard brief={lead} variant="lead" headingLevel="h2" />
            </div>
          </div>
          {rest.length > 0 && (
            <div className="mt-16 grid gap-x-[var(--gutter)] gap-y-14 border-t border-cream-300 pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((b, i) => (
                <BriefCard key={b.slug} brief={b} headingLevel="h2" delay={(i % 3) * 100} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
