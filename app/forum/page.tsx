import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { WithPlaceholders } from "@/components/Placeholder";
import { getForum } from "@/lib/content";
import { isPlaceholder, site } from "@/lib/site";

const { current } = getForum();

export const metadata: Metadata = {
  title: `${current.name}: Call for Papers`,
  description:
    "SREI's seasonal online research forum: students present research on migration and remittances in Central Asia to economics professors. Open to high school and university students from any country.",
  alternates: { canonical: "/forum" },
  openGraph: { url: "/forum" },
};

export default function ForumPage() {
  const { current, pastEditions } = getForum();
  const total = current.rubric.reduce((sum, r) => sum + r.points, 0);

  return (
    <>
      <PageHeader eyebrow={current.status === "open" ? "Call for papers open" : "Research forum"} title={current.name}>
        Students present original research on migration and remittances in Central Asia. Economics professors judge it.
      </PageHeader>

      <div className="mx-auto max-w-4xl space-y-16 px-5 py-12 md:py-16">
        {/* Key facts */}
        <section aria-labelledby="facts">
          <h2 id="facts" className="sr-only">
            Key facts
          </h2>
          <dl className="grid gap-px overflow-hidden rounded-sm border border-cream-300 bg-cream-300 sm:grid-cols-3">
            {[
              ["Dates", current.dates],
              ["Format", current.format],
              ["Who can apply", current.eligibility],
            ].map(([k, v]) => (
              <div key={k} className="bg-cream-50 p-5">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 leading-relaxed">
                  <WithPlaceholders text={v} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Themes */}
        <section aria-labelledby="themes">
          <h2 id="themes" className="section-title">
            Suggested themes
          </h2>
          <p className="mt-3 text-ink/80">Any rigorous research on migration economics in Central Asia is welcome. These themes are a starting point:</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {current.themes.map((t) => (
              <li key={t} className="flex gap-3 rounded-sm border border-cream-300 bg-cream-50 p-4">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline */}
        <section aria-labelledby="timeline">
          <h2 id="timeline" className="section-title">
            Timeline
          </h2>
          <ol className="mt-6 border-l-2 border-gold/60 pl-6">
            {current.timeline.map((item) => (
              <li key={item.label} className="relative pb-6 last:pb-0">
                <span aria-hidden="true" className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-gold bg-cream" />
                <p className="font-medium text-navy">{item.label}</p>
                <p className="text-ink/80">
                  <WithPlaceholders text={item.date} />
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* How to submit */}
        <section aria-labelledby="submit" className="rounded-sm bg-navy p-6 text-cream md:p-10">
          <h2 id="submit" className="font-serif text-2xl md:text-3xl">
            How to submit
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-cream/90">{current.howToSubmit}</p>
          <div className="mt-6">
            {isPlaceholder(site.submissionFormUrl) ? (
              <p className="inline-block rounded-sm border border-dashed border-gold-light px-4 py-2.5 text-sm">
                Submission form: <WithPlaceholders text={site.submissionFormUrl} />
              </p>
            ) : (
              <Button href={site.submissionFormUrl} variant="light" external>
                Open the submission form
              </Button>
            )}
          </div>
          <p className="mt-5 text-sm text-cream/80">
            Questions?{" "}
            <Link href="/contact" className="underline decoration-gold-light underline-offset-4">
              Contact us
            </Link>
            .
          </p>
        </section>

        {/* Rubric */}
        <section aria-labelledby="rubric">
          <h2 id="rubric" className="section-title">
            Judging rubric
          </h2>
          <p className="mt-3 text-ink/80">Finalists are scored out of {total} points by a panel of economics professors.</p>
          <div className="mt-6 overflow-x-auto rounded-sm border border-cream-300">
            <table className="w-full border-collapse bg-cream-50 text-left text-[0.95rem]">
              <caption className="sr-only">Judging rubric with points per criterion</caption>
              <thead className="bg-navy text-cream">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Criterion
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                    What judges look for
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {current.rubric.map((r) => (
                  <tr key={r.criterion} className="border-t border-cream-300 align-top">
                    <th scope="row" className="px-4 py-3 font-semibold text-navy">
                      {r.criterion}
                      <span className="mt-1 block font-normal text-ink/80 sm:hidden">{r.description}</span>
                    </th>
                    <td className="hidden px-4 py-3 text-ink/80 sm:table-cell">{r.description}</td>
                    <td className="px-4 py-3 text-right font-serif text-lg text-navy">{r.points}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gold">
                  <th scope="row" className="px-4 py-3 text-right font-semibold text-navy sm:hidden">
                    Total
                  </th>
                  <th scope="row" colSpan={2} className="hidden px-4 py-3 text-right font-semibold text-navy sm:table-cell">
                    Total
                  </th>
                  <td className="px-4 py-3 text-right font-serif text-lg font-semibold text-navy">{total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Awards */}
        <section aria-labelledby="awards">
          <h2 id="awards" className="section-title">
            Awards
          </h2>
          <ul className="mt-5 space-y-3">
            {current.awards.map((a) => (
              <li key={a} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Past editions */}
        <section aria-labelledby="past">
          <h2 id="past" className="section-title">
            Past editions
          </h2>
          {pastEditions.length === 0 ? (
            <p className="mt-4 rounded-sm border border-dashed border-cream-300 p-6 text-ink/70">
              The {current.name} is our first edition. Results, winners and recordings will be published here afterwards.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {pastEditions.map((ed) => (
                <article key={ed.name} className="rounded-sm border border-cream-300 bg-cream-50 p-6">
                  <h3 className="font-serif text-xl text-navy">{ed.name}</h3>
                  <p className="text-sm text-gold-dark">{ed.dates}</p>
                  {ed.summary && <p className="mt-3 text-ink/80">{ed.summary}</p>}
                  {ed.winners && ed.winners.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {ed.winners.map((w) => (
                        <li key={`${w.place}-${w.name}`}>
                          <span className="font-semibold text-navy">{w.place}:</span> {w.name},{" "}
                          {w.paperSlug ? (
                            <Link href={`/papers/${w.paperSlug}`} className="italic underline decoration-gold underline-offset-4">
                              {w.title}
                            </Link>
                          ) : (
                            <span className="italic">{w.title}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                    {ed.resultsUrl && (
                      <a href={ed.resultsUrl} className="text-navy underline decoration-gold underline-offset-4">
                        Full results
                      </a>
                    )}
                    {ed.recordingUrl && (
                      <a href={ed.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-navy underline decoration-gold underline-offset-4">
                        Watch the recording
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
