import Link from "next/link";
import type { CSSProperties } from "react";
import { getAllBriefs } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { BRIEF_TAGS } from "@/lib/tags";
import { LazyChart } from "../charts/LazyChart";
import { Glyph } from "../ornaments/Glyph";
import { BriefsFilter } from "./BriefsFilter";

/** Illustrative shape for the brief TEMPLATE only. Not data: axes and tooltips are hidden. */
const TEMPLATE_SHAPE = [3, 4, 3.6, 5, 5.4, 4.8, 6.2, 6.8, 6.1, 7.4, 7.9, 8.6].map((v, i) => ({ q: `t${i}`, a: v, b: v * 0.62 + (i % 3) * 0.4 }));

export function BriefsFeature() {
  const briefs = getAllBriefs().map((b) => ({ slug: b.slug, title: b.title, date: formatDate(b.date), summary: b.summary, tags: b.tags }));
  return (
    <section aria-labelledby="briefs-title" className="relative overflow-hidden bg-sand-soft py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 gap-y-6">
          <p className="label col-span-12 !text-coral-ink lg:col-span-3">05 / Economic briefs</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="briefs-title" className="max-w-[18ch] font-serif text-h1 text-midnight" data-reveal="up">
              Small observations. <em className="text-coral-ink">Bigger economic questions.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-lead text-ink-soft" data-reveal="up" style={{ "--d": "120ms" } as CSSProperties}>
              Our Weekly Briefs turn public economic data into accessible research insights on migration, remittances, and Central Asia.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12">
          {/* Template card */}
          <article className="relative rounded-[32px] bg-midnight p-7 text-cream lg:col-span-7 md:p-9" data-reveal="rise" aria-labelledby="tpl-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-label uppercase text-gold">Category · Remittances</p>
              <span className="rounded-full border border-dashed border-cream/40 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cream/75">Format template · not a real brief</span>
            </div>
            <h3 id="tpl-title" className="mt-5 font-serif text-h2 text-cream">
              <span className="placeholder">[Brief title]</span>
            </h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-cream/60">
              Date · <span className="placeholder">[Publication date]</span>
            </p>
            <div className="mt-6 rounded-2xl bg-cream p-4 text-ink">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-muted">
                  Chart · <span className="placeholder">[Verified data visualization]</span>
                </p>
              </div>
              <LazyChart
                type="area"
                data={TEMPLATE_SHAPE}
                x="q"
                series={[{ key: "a", label: "Series A" }, { key: "b", label: "Series B" }]}
                template
                height={200}
                summary="Template chart: an illustrative shape showing where a brief's chart goes. It contains no data."
              />
              <p className="mt-1 text-center font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-muted">Illustrative shape · not data</p>
            </div>
            <p className="mt-6 text-cream/80">
              Summary · <span className="placeholder">[Approximately 250 words]</span>
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-cream/60">
              Source · <span className="placeholder">[Data source]</span>
            </p>
            <ol className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
              {["Write the brief", "Publish on the site", "Share on Telegram", "Instagram carousel"].map((s, i) => (
                <li key={s} className="text-sm text-cream/80">
                  <span className="block font-mono text-[0.65rem] text-turquoise-light">0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </article>

          {/* Latest with filters */}
          <div className="lg:col-span-5" data-reveal="up" style={{ "--d": "150ms" } as CSSProperties}>
            <p className="font-mono text-label uppercase text-ink-muted">Latest briefs</p>
            <div className="mt-5">
              <BriefsFilter briefs={briefs} categories={[...BRIEF_TAGS]} />
            </div>
            <Link href="/briefs" className="btn btn-primary mt-4">
              Explore All Briefs <Glyph name="arrow" className="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
