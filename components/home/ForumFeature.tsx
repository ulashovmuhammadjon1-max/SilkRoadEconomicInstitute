import Link from "next/link";
import type { CSSProperties } from "react";
import { getForum } from "@/lib/content";
import { isPlaceholder, site } from "@/lib/site";
import { Glyph } from "../ornaments/Glyph";
import { WithPlaceholders } from "../Placeholder";

const STATUS_LABEL = { upcoming: "Planned", open: "Applications open", closed: "Closed" } as const;

export function SubmitButton({ light = false }: { light?: boolean }) {
  const { current } = getForum();
  if (current.registrationMode === "site" && current.registrationOpen) {
    return (
      <Link href="/forum/register" className={`btn ${light ? "btn-primary" : "btn-accent"}`}>
        Submit Your Research <Glyph name="arrow" className="arrow" />
      </Link>
    );
  }
  if (isPlaceholder(site.submissionFormUrl) || current.status !== "open") {
    return (
      <p className={`inline-flex min-h-12 items-center gap-3 rounded-full border border-dashed px-6 font-mono text-[0.72rem] uppercase tracking-[0.14em] ${light ? "border-turquoise-ink text-turquoise-ink" : "border-turquoise-light/60 text-turquoise-light"}`}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-turquoise opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-turquoise" />
        </span>
        Applications opening soon
      </p>
    );
  }
  return (
    <a href={site.submissionFormUrl} target="_blank" rel="noopener noreferrer" className={`btn ${light ? "btn-primary" : "btn-accent"}`}>
      Submit Your Research <Glyph name="external" className="arrow" />
    </a>
  );
}

export function ForumFeature() {
  const { current } = getForum();
  const max = Math.max(...current.rubric.map((r) => r.points));
  const total = current.rubric.reduce((s, r) => s + r.points, 0);
  const facts: [string, string][] = [
    ["Edition", current.edition ?? "First edition"],
    ["Season", current.season ?? current.name],
    ["Dates", current.dates],
    ["Format", "Online"],
    ["Eligibility", "High school and university students"],
    ["Status", STATUS_LABEL[current.status]],
  ];
  return (
    <section aria-labelledby="forum-title" className="on-dark relative overflow-hidden bg-deep py-24 text-cream lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[-20%] h-[40rem] w-[40rem] rounded-full border border-turquoise/15" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-4%] top-[-8%] h-[28rem] w-[28rem] rounded-full border border-turquoise/10" />
      <div className="page relative">
        <div className="grid-12 gap-y-6">
          <p className="col-span-12 font-mono text-label uppercase text-turquoise-light lg:col-span-3">03 / Research Forum</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="forum-title" className="max-w-[16ch] font-serif text-h1 text-cream" data-reveal="up">
              Your research deserves <em className="text-turquoise-light">an audience.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-lead text-cream/80" data-reveal="up" style={{ "--d": "120ms" } as CSSProperties}>
              SREI Research Forums provide high school and university students with an opportunity to present original research on migration and economic development.
            </p>
          </div>
        </div>

        {/* Edition card */}
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <div className="rounded-[28px] border border-white/10 bg-midnight/50 p-7 backdrop-blur lg:col-span-7" data-reveal="up">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-label uppercase text-turquoise-light">{current.edition ?? "First edition"}</p>
              <span className="rounded-full bg-gold/15 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">Forthcoming · {STATUS_LABEL[current.status]}</span>
            </div>
            <p className="mt-4 font-serif text-[clamp(2.6rem,6vw,4.5rem)] leading-none text-cream">{current.season ?? current.name}</p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {facts.slice(2).map(([k, v]) => (
                <div key={k} className="border-t border-white/10 pt-3">
                  <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-cream/55">{k}</dt>
                  <dd className="mt-1 text-cream">
                    <WithPlaceholders text={v} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-midnight/30 p-7 lg:col-span-5" data-reveal="up" style={{ "--d": "120ms" } as CSSProperties}>
            <p className="font-mono text-label uppercase text-turquoise-light">Research themes</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {(current.tags ?? current.themes).map((t, i) => (
                <li key={t} data-reveal="fade" style={{ "--d": `${200 + i * 70}ms` } as CSSProperties}>
                  <Link
                    href="/forum#themes"
                    className="inline-flex min-h-10 items-center rounded-full border border-turquoise/40 px-4 text-sm text-cream transition-colors duration-300 hover:border-turquoise hover:bg-turquoise hover:text-midnight focus-visible:bg-turquoise focus-visible:text-midnight"
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        {current.steps && current.steps.length > 0 && (
          <div className="mt-20">
            <p className="font-mono text-label uppercase text-turquoise-light">How it works</p>
            <ol className="relative mt-8 grid gap-6 md:grid-cols-4">
              <span aria-hidden="true" className="absolute left-0 right-0 top-[19px] hidden h-px origin-left bg-turquoise/40 md:block" data-reveal="bar" />
              {current.steps.map((s, i) => (
                <li key={s.title} className="relative" data-reveal="up" style={{ "--d": `${150 + i * 150}ms` } as CSSProperties}>
                  <span className="relative z-10 inline-flex h-10 items-center rounded-full border border-turquoise bg-deep px-4 font-mono text-xs text-turquoise-light">Step 0{i + 1}</span>
                  <p className="mt-5 font-serif text-h3 text-cream">{s.title}</p>
                  <p className="mt-2 text-cream/75">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Rubric + awards */}
        <div className="mt-20 grid gap-6 lg:grid-cols-12">
          <div className="rounded-[28px] border border-white/10 p-7 lg:col-span-7" data-reveal="up">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-label uppercase text-turquoise-light">Judging rubric</p>
              <p className="font-mono text-xs text-cream/60">Total · {total} points</p>
            </div>
            <ul className="mt-6 space-y-5">
              {current.rubric.map((r, i) => (
                <li key={r.criterion}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-cream">{r.criterion}</span>
                    <span className="font-mono text-sm text-turquoise-light tnum">{r.points} pts</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10" aria-hidden="true">
                    <div className="h-full rounded-full bg-gradient-to-r from-turquoise to-turquoise-light" data-reveal="bar" style={{ width: `${(r.points / max) * 100}%`, "--d": `${i * 120}ms` } as CSSProperties} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-[28px] border border-white/10 p-7" data-reveal="up" style={{ "--d": "100ms" } as CSSProperties}>
              <p className="font-mono text-label uppercase text-gold">Awards</p>
              <ul className="mt-5 space-y-3">
                {current.awards.map((a) => (
                  <li key={a} className="flex gap-3 text-cream/90">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] border border-dashed border-lavender/50 p-7" data-reveal="up" style={{ "--d": "200ms" } as CSSProperties}>
              <p className="font-mono text-label uppercase text-lavender-light">Academic reviewers</p>
              <p className="mt-4 text-cream/85">SREI welcomes economics professors and researchers interested in supporting its student research forums.</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-cream/70">
                <WithPlaceholders text="[Academic reviewer information — to be announced]" />
              </p>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm text-lavender-light hover:text-cream">
                Get in touch about reviewing <Glyph name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SubmitButton />
          <Link href="/forum" className="btn border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-midnight">
            Full forum details <Glyph name="arrow" className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
