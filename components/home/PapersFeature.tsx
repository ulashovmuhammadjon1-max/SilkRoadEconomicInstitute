import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { getAllPapers } from "@/lib/content";
import { joinNames } from "@/lib/format";
import { isPlaceholder } from "@/lib/site";
import { Glyph } from "../ornaments/Glyph";
import { WithPlaceholders } from "../Placeholder";

export function PapersFeature() {
  const papers = getAllPapers();
  const featured = papers.find((p) => p.paperNumber === 0) ?? papers[papers.length - 1];
  const others = papers.filter((p) => p !== featured).slice(0, 2);
  const forthcoming = Math.max(0, 2 - others.length);

  return (
    <section aria-labelledby="papers-title" className="bg-paper py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 gap-y-6">
          <p className="label col-span-12 lg:col-span-3">04 / Research publications</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="papers-title" className="max-w-[18ch] font-serif text-h1 text-midnight" data-reveal="up">
              Research that goes <em className="text-gold-dark">beyond the classroom.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-lead text-ink-soft" data-reveal="up" style={{ "--d": "120ms" } as CSSProperties}>
              SREI Working Papers showcase student-led research on migration, remittances, and the economic transformation of Central Asia.
            </p>
          </div>
        </div>

        {featured && (
          <article className="mt-16 overflow-hidden rounded-[32px] border border-ink/10 bg-cream-50 lg:mt-20" data-reveal="rise">
            <div className="grid lg:grid-cols-12">
              {/* Cover */}
              <div className="relative flex flex-col justify-between bg-midnight p-8 text-cream lg:col-span-4 lg:p-10">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_80%_20%,rgba(216,166,74,0.35),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(22,166,161,0.3),transparent_50%)]" />
                <div className="relative">
                  <ViewTransition name={`paper-number-${featured.paperNumber}`}>
                    <p className="font-mono text-label uppercase text-gold">SREI Working Paper No. {featured.paperNumber}</p>
                  </ViewTransition>
                  <p className="mt-10 font-serif text-[clamp(5rem,12vw,9rem)] leading-[0.8] text-cream/95">
                    №&thinsp;{featured.paperNumber}
                  </p>
                </div>
                <dl className="relative mt-10 space-y-4 text-sm">
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-cream/55">Author</dt>
                    <dd className="mt-1">{joinNames(featured.authors)}</dd>
                  </div>
                  {featured.originalPublication && (
                    <div>
                      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-cream/55">Original publication</dt>
                      <dd className="mt-1">{featured.originalPublication}</dd>
                    </div>
                  )}
                  {featured.researchPeriod && (
                    <div>
                      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-cream/55">Research period</dt>
                      <dd className="mt-1">{featured.researchPeriod}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Body */}
              <div className="p-8 lg:col-span-8 lg:p-12">
                <p className="font-mono text-label uppercase text-gold-dark">Featured publication · published</p>
                <h3 className="mt-4 font-serif text-h2 leading-[1.1] text-midnight">
                  <Link href={`/papers/${featured.slug}`} className="hover:text-deep">
                    <WithPlaceholders text={featured.title} />
                  </Link>
                </h3>
                <p className="mt-6 text-lead text-ink-soft">
                  <WithPlaceholders text={featured.abstract} />
                </p>

                {featured.findings.length > 0 && (
                  <div className="mt-10">
                    <p className="font-mono text-label uppercase text-ink-muted">Research insight · as reported in the paper</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {featured.findings.map((f, i) => (
                        <div key={f.country} className={`rounded-2xl border p-5 ${i === 0 ? "border-coral/40 bg-[#FBE9E3]" : "border-turquoise/40 bg-[#E6F4F3]"}`} data-reveal="up" style={{ "--d": `${i * 140}ms` } as CSSProperties}>
                          <p className={`font-mono text-label uppercase ${i === 0 ? "text-coral-ink" : "text-turquoise-ink"}`}>{f.country}</p>
                          <dl className="mt-3 space-y-3">
                            {f.rows.map((r, k) => (
                              <div key={r.label}>
                                <dt className="text-xs text-ink-muted">{r.label}</dt>
                                <dd className={k === 0 ? "font-serif text-h3 text-midnight tnum" : "text-ink"}>{r.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link href={`/papers/${featured.slug}`} className="btn btn-primary">
                    Read Research <Glyph name="arrow" className="arrow" />
                  </Link>
                  {featured.originalUrl && !isPlaceholder(featured.originalUrl) ? (
                    <a href={featured.originalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                      View Original Publication <Glyph name="external" className="arrow" />
                    </a>
                  ) : (
                    featured.originalPublication && (
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Original publication link: coming soon</span>
                    )
                  )}
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Other papers or forthcoming slots */}
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/papers/${p.slug}`} className="group flex h-full flex-col rounded-[28px] border border-ink/10 bg-cream-50 p-7 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="font-mono text-label uppercase text-gold-dark">SREI Working Paper No. {p.paperNumber}</span>
                <span className="mt-3 font-serif text-h3 text-midnight">{p.title}</span>
                <span className="mt-3 text-sm text-ink-muted">{joinNames(p.authors)}</span>
              </Link>
            </li>
          ))}
          {Array.from({ length: forthcoming }, (_, i) => (
            <li key={`f${i}`} className="flex min-h-[11rem] flex-col justify-between rounded-[28px] border border-dashed border-ink/20 p-7" data-reveal="up" style={{ "--d": `${i * 120}ms` } as CSSProperties}>
              <span className="font-mono text-label uppercase text-ink-muted">SREI Working Paper No. {papers.length + i}</span>
              <span className="font-serif text-h3 text-ink-muted">Future Working Paper — Forthcoming</span>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted">Selected from forum research</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
