import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TimelineMarker } from "@/components/forum/TimelineMarker";
import { ThemesMap } from "@/components/forum/ThemesMap";
import { Countdown } from "@/components/home/Countdown";
import { MapDefs, MapSvg } from "@/components/map/MapSvg";
import { Glyph } from "@/components/ornaments/Glyph";
import { Waypoint } from "@/components/ornaments/Ornaments";
import { PageHeader } from "@/components/PageHeader";
import { WithPlaceholders } from "@/components/Placeholder";
import { getForum, parseIsoDate } from "@/lib/content";
import { isPlaceholder, site } from "@/lib/site";

const { current } = getForum();

export const metadata: Metadata = {
  title: `${current.name}: Call for Papers`,
  description:
    "SREI's seasonal online research forum: students present research on migration and remittances in Central Asia to economics professors. Open to high school and university students from any country.",
  alternates: { canonical: "/forum" },
  openGraph: { url: "/forum" },
};

function SectionHead({ no, title, id }: { no: string; title: string; id: string }) {
  return (
    <div className="grid-12 mb-10">
      <p className="label col-span-12 lg:col-span-2 lg:pt-3">§ {no}</p>
      <h2 id={id} className="col-span-12 font-serif text-h2 text-navy lg:col-span-8" data-reveal="up">
        {title}
      </h2>
    </div>
  );
}

export default function ForumPage() {
  const { current, pastEditions } = getForum();
  const total = current.rubric.reduce((s, r) => s + r.points, 0);
  const max = Math.max(...current.rubric.map((r) => r.points));
  const deadline = parseIsoDate(current.submissionDeadline);
  const siteRegistration = current.registrationMode === "site" && current.registrationOpen;

  return (
    <>
      <PageHeader
        section="06"
        eyebrow={current.status === "open" ? "Call for papers open" : "Research forum"}
        title={current.name}
        aside={
          deadline ? (
            <div className="bg-navy p-5">
              <p className="dateline mb-3 text-cream/60">Submissions close in</p>
              <Countdown iso={deadline.toISOString()} />
            </div>
          ) : undefined
        }
      >
        Students present original research on migration and remittances in Central Asia. Economics professors judge it.
      </PageHeader>

      {/* Key facts */}
      <section aria-label="Key facts" className="page py-12">
        <dl className="grid border-y-2 border-navy sm:grid-cols-3">
          {[
            ["Dates", current.dates],
            ["Format", current.format],
            ["Who can apply", current.eligibility],
          ].map(([k, v], i) => (
            <div key={k} className="load-in border-cream-300 py-6 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0" style={{ "--d": `${500 + i * 100}ms` } as CSSProperties}>
              <dt className="dateline">{k}</dt>
              <dd className="mt-2 font-serif text-lg leading-snug text-navy">
                <WithPlaceholders text={v} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Themes */}
      <section aria-labelledby="themes" className="page py-16">
        <MapDefs />
        <SectionHead no="06.1" title="Suggested themes" id="themes" />
        <p className="mb-8 max-w-measure text-ink-soft lg:ml-[calc((100%+var(--gutter))/6)]">
          Any rigorous research on migration economics in Central Asia is welcome. These themes are a starting point.
        </p>
        <ThemesMap themes={current.themes} map={<MapSvg variant="mini" className="h-auto w-full" />} />
      </section>

      {/* Steps */}
      {current.steps && current.steps.length > 0 && (
        <section aria-labelledby="steps" className="page py-16">
          <SectionHead no="06.2" title="How to apply" id="steps" />
          <ol className="grid gap-6 md:grid-cols-2 lg:ml-[calc((100%+var(--gutter))/6)] lg:grid-cols-4">
            {current.steps.map((st, i) => (
              <li key={st.title} className="rounded-[24px] border border-cream-300 bg-paper p-6" data-reveal="up" style={{ "--d": `${i * 120}ms` } as CSSProperties}>
                <span className="font-mono text-xs text-turquoise-ink">Step 0{i + 1}</span>
                <p className="mt-3 font-serif text-h3 text-midnight">{st.title}</p>
                <p className="mt-2 text-ink-soft">{st.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Timeline */}
      <section aria-labelledby="timeline" className="page py-16">
        <SectionHead no="06.3" title="Timeline" id="timeline" />
        <div className="grid-12">
          <div className="relative col-span-12 lg:col-span-8 lg:col-start-3">
            <div aria-hidden="true" className="absolute bottom-3 left-0 top-3 w-px bg-gold" data-reveal="spine" />
            <TimelineMarker isoDates={current.timeline.map((t) => t.isoDate)} />
            <ol className="relative space-y-10">
              {current.timeline.map((item, i) => (
                <li key={item.label} className="relative pl-10" data-reveal="left" style={{ "--d": `${200 + i * 220}ms` } as CSSProperties}>
                  <span aria-hidden="true" className="absolute -left-[7px] top-2 h-[15px] w-[15px] rounded-full border-2 border-gold bg-cream" />
                  <p className="dateline">Step {i + 1}</p>
                  <p className="mt-1 font-serif text-h3 text-navy">{item.label}</p>
                  <p className="mt-1 text-ink-soft">
                    <WithPlaceholders text={item.date} />
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* How to submit */}
      <section aria-labelledby="submit" className="on-dark bg-deep py-20 text-cream">
        <div className="page grid-12 gap-y-6">
          <p className="col-span-12 font-mono text-label uppercase text-turquoise-light lg:col-span-2 lg:pt-3">§ 06.4</p>
          <div className="col-span-12 lg:col-span-7">
            <h2 id="submit" className="font-serif text-h2" data-reveal="up">
              How to submit
            </h2>
            <p className="mt-4 max-w-measure text-lead text-cream/85">{current.howToSubmit}</p>
            <div className="mt-8">
              {siteRegistration ? (
                <Link href="/forum/register" className="btn btn-light">
                  Register and submit <Glyph name="arrow" className="arrow" />
                </Link>
              ) : isPlaceholder(site.submissionFormUrl) ? (
                <p className="inline-block border border-dashed border-gold-light px-4 py-3 text-sm">
                  Submission form: <WithPlaceholders text={site.submissionFormUrl} />
                </p>
              ) : (
                <a href={site.submissionFormUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                  Open the submission form <Glyph name="external" className="arrow" />
                </a>
              )}
            </div>
            <p className="mt-6 text-sm text-cream/75">
              Questions?{" "}
              <Link href="/contact" className="underline decoration-gold-light underline-offset-4">
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Rubric */}
      <section aria-labelledby="rubric-title" id="rubric" className="page py-20">
        <SectionHead no="06.5" title="Judging rubric" id="rubric-title" />
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-9 lg:col-start-3">
            <p className="max-w-measure text-ink-soft">Finalists are scored out of {total} points by a panel of economics professors.</p>
            <table className="mt-8 w-full border-collapse text-left">
              <caption className="sr-only">Judging rubric with points per criterion</caption>
              <thead>
                <tr className="border-b-2 border-navy">
                  <th scope="col" className="dateline py-3 pr-4 font-normal">Criterion</th>
                  <th scope="col" className="dateline hidden py-3 pr-4 font-normal md:table-cell">What judges look for</th>
                  <th scope="col" className="dateline py-3 text-right font-normal">Points</th>
                </tr>
              </thead>
              <tbody>
                {current.rubric.map((r, i) => (
                  <tr key={r.criterion} className="border-b border-cream-300 align-top">
                    <th scope="row" className="py-5 pr-4 font-serif text-lg font-normal text-navy">
                      {r.criterion}
                      <span className="mt-1 block font-sans text-sm text-ink-soft md:hidden">{r.description}</span>
                      <span className="mt-3 block h-1.5 w-full max-w-[16rem] bg-cream-200" aria-hidden="true">
                        <span className="block h-full bg-gold" data-reveal="bar" style={{ width: `${(r.points / max) * 100}%`, "--d": `${i * 150}ms` } as CSSProperties} />
                      </span>
                    </th>
                    <td className="hidden py-5 pr-4 text-ink-soft md:table-cell">{r.description}</td>
                    <td className="py-5 text-right font-serif text-h3 text-navy tnum">{r.points}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gold">
                  <th scope="row" className="py-4 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-navy">Total</th>
                  <td className="hidden md:table-cell" />
                  <td className="py-4 text-right font-serif text-h3 font-semibold text-navy tnum">{total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section aria-labelledby="awards" className="page py-16">
        <SectionHead no="06.6" title="Awards" id="awards" />
        <ol className="grid gap-x-[var(--gutter)] gap-y-8 md:grid-cols-3 lg:ml-[calc((100%+var(--gutter))/6)]">
          {current.awards.map((a, i) => (
            <li key={a} className="border-t border-gold pt-5" data-reveal="up" style={{ "--d": `${i * 120}ms` } as CSSProperties}>
              <span className="section-no text-sm">{["i.", "ii.", "iii.", "iv.", "v."][i] ?? `${i + 1}.`}</span>
              <p className="mt-2 font-serif text-lg text-navy">{a}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Past editions */}
      <section aria-labelledby="past" className="page py-16">
        <SectionHead no="06.7" title="Past editions" id="past" />
        <div className="lg:ml-[calc((100%+var(--gutter))/6)]">
          {pastEditions.length === 0 ? (
            <p className="flex items-start gap-3 border-y border-cream-300 py-8 text-ink-soft">
              <Waypoint className="mt-1 shrink-0 text-gold" />
              The {current.name} is our first edition. Results, winners and recordings will be published here afterwards.
            </p>
          ) : (
            <div className="space-y-10">
              {pastEditions.map((ed) => (
                <article key={ed.name} className="border-t-2 border-navy pt-6">
                  <h3 className="font-serif text-h3 text-navy">{ed.name}</h3>
                  <p className="dateline mt-1">{ed.dates}</p>
                  {ed.summary && <p className="mt-3 max-w-measure text-ink-soft">{ed.summary}</p>}
                  {ed.winners && ed.winners.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {ed.winners.map((w) => (
                        <li key={`${w.place}-${w.name}`}>
                          <span className="font-semibold text-navy">{w.place}:</span> {w.name},{" "}
                          {w.paperSlug ? (
                            <Link href={`/papers/${w.paperSlug}`} className="link italic">
                              {w.title}
                            </Link>
                          ) : (
                            <span className="italic">{w.title}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-wrap gap-5 text-sm font-medium">
                    {ed.resultsUrl && <a href={ed.resultsUrl} className="link">Full results</a>}
                    {ed.recordingUrl && (
                      <a href={ed.recordingUrl} target="_blank" rel="noopener noreferrer" className="link">
                        Watch the recording
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
