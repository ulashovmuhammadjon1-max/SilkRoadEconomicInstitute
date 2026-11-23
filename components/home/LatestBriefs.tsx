import Link from "next/link";
import { getAllBriefs } from "@/lib/content";
import { BriefCard } from "../BriefCard";
import { Glyph } from "../ornaments/Glyph";
import { Waypoint } from "../ornaments/Ornaments";

export function LatestBriefs() {
  const briefs = getAllBriefs().slice(0, 3);
  const [lead, ...rest] = briefs;
  return (
    <section aria-labelledby="briefs-title" className="border-y border-cream-300 bg-cream-50 py-20 lg:py-28">
      <div className="page">
        <div className="grid-12 items-end gap-y-4">
          <div className="col-span-12 lg:col-span-8">
            <p className="label">§ 04 · Weekly briefs</p>
            <h2 id="briefs-title" className="mt-3 font-serif text-h1 text-navy" data-reveal="up">
              One chart, two hundred and fifty words
            </h2>
          </div>
          <Link href="/briefs" className="col-span-12 inline-flex items-center gap-2 text-ui font-medium text-navy lg:col-span-4 lg:justify-self-end">
            <span className="link">All briefs</span> <Glyph name="arrow" />
          </Link>
        </div>

        {!lead ? (
          <p className="mt-12 flex items-center gap-3 text-ink-muted">
            <Waypoint className="text-gold" /> The first brief is on its way.
          </p>
        ) : (
          <div className="-mx-[var(--margin)] mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--margin)] pb-4 lg:mx-0 lg:grid lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:overflow-visible lg:px-0 lg:pb-0">
            <div className="w-[85%] shrink-0 snap-start lg:col-span-7 lg:w-auto">
              <BriefCard brief={lead} variant="lead" />
            </div>
            {rest.length === 0 && (
              <aside className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-cream-300 lg:pl-[var(--gutter)]" data-reveal="up" style={{ "--d": "200ms" } as React.CSSProperties}>
                <p className="dateline">How a brief works</p>
                <ol className="mt-6 space-y-5 font-serif text-h3 text-navy">
                  <li><span className="section-no mr-3 text-base">i.</span>One question</li>
                  <li><span className="section-no mr-3 text-base">ii.</span>One chart, with its source</li>
                  <li><span className="section-no mr-3 text-base">iii.</span>About 250 words</li>
                </ol>
                <p className="mt-6 text-ink-soft">On remittances, exchange rates and labor migration, written by SREI contributors.</p>
              </aside>
            )}
            {rest.length > 0 && (
              <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:gap-12 lg:border-l lg:border-cream-300 lg:pl-[var(--gutter)]">
                {rest.map((b, i) => (
                  <div key={b.slug} className="w-[85%] shrink-0 snap-start lg:w-auto">
                    <BriefCard brief={b} delay={150 + i * 120} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
