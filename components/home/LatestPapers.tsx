import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { getAllPapers } from "@/lib/content";
import { formatDate, joinNames } from "@/lib/format";
import { Glyph } from "../ornaments/Glyph";
import { Waypoint } from "../ornaments/Ornaments";
import { WithPlaceholders } from "../Placeholder";

/** Latest working papers, set like a journal's table of contents. */
export function LatestPapers() {
  const papers = getAllPapers().slice(0, 4);
  return (
    <section aria-labelledby="papers-title" className="page py-20 lg:py-28">
      <div className="grid-12 items-end gap-y-4">
        <div className="col-span-12 lg:col-span-8">
          <p className="label">§ 05 · Working paper series</p>
          <h2 id="papers-title" className="mt-3 font-serif text-h1 text-navy" data-reveal="up">
            Contents
          </h2>
        </div>
        <Link href="/papers" className="col-span-12 inline-flex items-center gap-2 text-ui font-medium text-navy lg:col-span-4 lg:justify-self-end">
          <span className="link">All working papers</span> <Glyph name="arrow" />
        </Link>
      </div>
      {papers.length === 0 ? (
        <p className="mt-12 flex items-center gap-3 text-ink-muted">
          <Waypoint className="text-gold" /> The first papers will be published after the Winter 2026 forum.
        </p>
      ) : (
        <ol className="mt-12 border-t-2 border-navy">
          {papers.map((p, i) => <PaperTocRow key={p.slug} paper={p} delay={i * 100} />)}
        </ol>
      )}
    </section>
  );
}

export function PaperTocRow({ paper, delay = 0, headingLevel = "h3" }: { paper: ReturnType<typeof getAllPapers>[number]; delay?: number; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <li className="group relative border-b border-cream-300" data-reveal="up" style={{ "--d": `${delay}ms` } as CSSProperties}>
      <div className="grid-12 items-baseline gap-y-2 py-7">
        <p className="col-span-12 font-serif text-h2 leading-none text-gold-dark tnum sm:col-span-2">
          <span className="sr-only">Working Paper </span>
          <span className="dateline mr-2 align-middle text-[0.65rem] sm:block sm:mr-0 sm:mb-2">No.</span>
          <ViewTransition name={`paper-number-${paper.paperNumber}`}>
            <span>{paper.paperNumber}</span>
          </ViewTransition>
        </p>
        <div className="relative col-span-12 sm:col-span-8">
          <span aria-hidden="true" className="grow-line absolute -left-[var(--gutter)] top-[0.85em] hidden h-px w-[var(--gutter)] bg-gold sm:block" style={{ "--from": 0 } as CSSProperties} />
          <H className="font-serif text-h3 text-navy">
            <Link href={`/papers/${paper.slug}`} className="after:absolute after:inset-0 after:content-['']">
              <WithPlaceholders text={paper.title} />
            </Link>
          </H>
          <p className="smcp mt-2 text-ink-soft">
            {joinNames(paper.authors)} · <WithPlaceholders text={formatDate(paper.date)} />
          </p>
        </div>
        <div className="relative z-10 col-span-12 sm:col-span-2 sm:justify-self-end">
          {paper.pdfExists ? (
            <a
              href={paper.pdfPath}
              download
              className="inline-flex min-h-11 items-center gap-2 border border-navy px-3 text-xs font-medium uppercase tracking-[0.14em] text-navy transition-[transform,background-color,color] duration-500 ease-out hover:bg-navy hover:text-cream sm:translate-x-2 sm:group-hover:translate-x-0"
            >
              <Glyph name="pdf" size={16} /> PDF<span className="sr-only"> of Working Paper No. {paper.paperNumber}</span>
            </a>
          ) : (
            <span className="dateline">PDF soon</span>
          )}
        </div>
      </div>
    </li>
  );
}
