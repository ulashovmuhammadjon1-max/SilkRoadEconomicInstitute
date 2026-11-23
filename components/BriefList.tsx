import type { Brief } from "@/lib/content";
import { BriefCard } from "./BriefCard";
import { TagFilter } from "./TagFilter";

export function BriefList({ briefs, activeTag }: { briefs: Brief[]; activeTag?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:py-12">
      <TagFilter active={activeTag} />
      {briefs.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {briefs.map((b) => (
            <BriefCard key={b.slug} brief={b} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-ink/70">{activeTag ? `No briefs tagged “${activeTag}” yet.` : "No briefs have been published yet."}</p>
      )}
    </section>
  );
}
