import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CompassRose } from "@/components/ornaments/Ornaments";
import { PageHeader } from "@/components/PageHeader";
import { DuotoneFilter, PersonCard } from "@/components/PersonCard";
import { WithPlaceholders } from "@/components/Placeholder";
import { getJudges, getTeam } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Why the Silk Road Economic Institute exists, and the people behind it.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  const team = getTeam();
  const judges = getJudges();
  return (
    <>
      <DuotoneFilter />
      <PageHeader section="07" eyebrow="About SREI" title="Research on migration, by the generation it shapes" />

      <section aria-labelledby="mission" className="page grid-12 gap-y-6 py-16">
        <h2 id="mission" className="label col-span-12 lg:col-span-2 lg:pt-2">
          Mission
        </h2>
        <div className="col-span-12 space-y-6 lg:col-span-7">
          <p className="font-serif text-h3 leading-snug text-navy" data-reveal="up">
            Millions of Central Asian families depend on remittances: money sent home by relatives working in Russia, Korea, the Gulf and Europe.
            Young people in the region rarely get to study how migration and remittances shape their own economies.
          </p>
          <p className="max-w-measure text-lead text-ink-soft" data-reveal="up" style={{ "--d": "150ms" } as CSSProperties}>
            The Silk Road Economic Institute gives students a place to research these questions, present their work to economics professors, and
            publish it, through seasonal research forums, a working paper series and weekly data briefs.
          </p>
        </div>
        <CompassRose className="col-span-2 col-start-11 hidden w-full text-gold/60 lg:block" draw />
      </section>

      {site.founderStory.trim() && (
        <section aria-labelledby="story" className="border-y border-cream-300 bg-cream-50 py-20">
          <div className="page grid-12 gap-y-6">
            <h2 id="story" className="label col-span-12 lg:col-span-2 lg:pt-4">
              Why we started
            </h2>
            <figure className="relative col-span-12 lg:col-span-8">
              <span aria-hidden="true" className="absolute -left-2 -top-10 font-serif text-[8rem] leading-none text-gold/40 lg:-left-14">
                “
              </span>
              <blockquote className="relative font-serif text-h2 leading-[1.3] text-navy" data-reveal="up">
                <WithPlaceholders text={site.founderStory} />
              </blockquote>
              {team[0] && (
                <figcaption className="dateline mt-6">
                  {team[0].name} · {team[0].role}
                </figcaption>
              )}
            </figure>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section aria-labelledby="team" className="page grid-12 gap-y-10 py-20">
          <h2 id="team" className="label col-span-12 lg:col-span-2 lg:pt-1">
            Team
          </h2>
          <div className="col-span-12 grid gap-x-[var(--gutter)] gap-y-14 sm:grid-cols-2 lg:col-span-10 lg:grid-cols-3">
            {team.map((p, i) => (
              <PersonCard key={p.name} person={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {judges.length > 0 && (
        <section aria-labelledby="judges" className="page grid-12 gap-y-10 py-20">
          <h2 id="judges" className="label col-span-12 lg:col-span-2 lg:pt-1">
            Judges &amp; advisors
          </h2>
          <div className="col-span-12 grid gap-x-[var(--gutter)] gap-y-14 sm:grid-cols-2 lg:col-span-10 lg:grid-cols-3">
            {judges.map((p, i) => (
              <PersonCard key={p.name} person={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
