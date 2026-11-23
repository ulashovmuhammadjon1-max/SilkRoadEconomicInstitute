import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { CiteBox } from "@/components/CiteBox";
import { Mdx } from "@/components/Mdx";
import { RevealLines } from "@/components/motion/RevealLines";
import { Glyph } from "@/components/ornaments/Glyph";
import { EmblemPapers } from "@/components/ornaments/Ornaments";
import { WithPlaceholders } from "@/components/Placeholder";
import { citeApa, citeBibtex, citeChicago, citeSimple } from "@/lib/cite";
import { getAllPapers, getPaper } from "@/lib/content";
import { formatDate, joinNames } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paper = getPaper((await params).slug);
  if (!paper) return {};
  const description = paper.abstract.startsWith("[")
    ? `SREI Working Paper No. ${paper.paperNumber} by ${joinNames(paper.authors)}.`
    : paper.abstract.slice(0, 160);
  return {
    title: `${paper.title} (Working Paper No. ${paper.paperNumber})`,
    description,
    authors: paper.authors.map((name) => ({ name })),
    keywords: paper.keywords,
    alternates: { canonical: `/papers/${paper.slug}` },
    openGraph: { type: "article", url: `/papers/${paper.slug}`, title: paper.title, description, authors: paper.authors },
    other: {
      // Google Scholar indexing tags
      citation_title: paper.title,
      citation_author: paper.authors,
      citation_publication_date: paper.date,
      citation_technical_report_institution: site.name,
      citation_technical_report_number: String(paper.paperNumber),
      ...(paper.pdfExists ? { citation_pdf_url: absoluteUrl(paper.pdfPath) } : {}),
    },
  };
}

export default async function PaperPage({ params }: Props) {
  const paper = getPaper((await params).slug);
  if (!paper) notFound();

  const meta: [string, React.ReactNode][] = [
    [paper.authors.length > 1 ? "Authors" : "Author", joinNames(paper.authors)],
    ["Date", <WithPlaceholders key="d" text={formatDate(paper.date)} />],
    ...(paper.forumEdition ? [["Forum edition", <WithPlaceholders key="f" text={paper.forumEdition} />] as [string, React.ReactNode]] : []),
    ...(paper.originalPublication ? [["Original publication", paper.originalPublication] as [string, React.ReactNode]] : paper.note ? [["Note", <WithPlaceholders key="n" text={paper.note} />] as [string, React.ReactNode]] : []),
    ...(paper.researchPeriod ? [["Research period", paper.researchPeriod] as [string, React.ReactNode]] : []),
  ];

  return (
    <article>
      <header className="page grid-12 gap-y-8 pb-12 pt-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="col-span-12 lg:col-span-2">
          <Link href="/papers" className="inline-flex items-center gap-2 text-ui text-ink-soft hover:text-navy">
            <Glyph name="arrowLeft" size={18} /> Working Papers
          </Link>
        </nav>
        <div className="col-span-12 lg:col-span-7">
          <ViewTransition name={`paper-number-${paper.paperNumber}`}>
            <p className="flex items-baseline gap-4">
              <span className="dateline">SREI Working Paper</span>
              <span className="font-serif text-h1 leading-none text-gold-dark tnum">No.&nbsp;{paper.paperNumber}</span>
            </p>
          </ViewTransition>
          <RevealLines as="h1" text={paper.title} className="mt-6 font-serif text-h2 text-navy md:text-[clamp(2rem,1.4rem+2vw,3.1rem)] md:leading-[1.1]" delay={100} />
        </div>
        <aside className="col-span-12 lg:col-span-3" aria-label="Paper details">
          <div className="rule-strong load-draw" />
          <dl className="divide-y divide-cream-300">
            {meta.map(([k, v], i) => (
              <div key={k} className="load-left py-3" style={{ "--d": `${200 + i * 80}ms` } as CSSProperties}>
                <dt className="dateline">{k}</dt>
                <dd className="mt-1 font-serif text-navy">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="load-in mt-5 flex flex-wrap gap-3" style={{ "--d": "500ms" } as CSSProperties}>
            {paper.pdfExists && (
              <>
                <a href={paper.pdfPath} download className="btn btn-primary min-h-11 px-5">
                  <Glyph name="download" size={18} /> Download PDF
                </a>
                <a href={paper.pdfPath} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-2 text-ui text-navy hover:underline">
                  <Glyph name="external" size={18} /> Open
                </a>
              </>
            )}
            {paper.originalUrl && !paper.originalUrl.startsWith("[") && (
              <a href={paper.originalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-11 px-5">
                <Glyph name="external" size={18} /> Original publication
              </a>
            )}
            {!paper.pdfExists && (
              <p className="rounded-xl border border-dashed border-gold px-4 py-2.5 text-sm text-ink-soft">
                PDF coming soon <span className="placeholder">[add file at /public{paper.pdfPath}]</span>
              </p>
            )}
          </div>
        </aside>
      </header>

      <div className="page grid-12 gap-y-16 pb-8">
        <section aria-labelledby="abstract" className="col-span-12 lg:col-span-7 lg:col-start-3">
          <h2 id="abstract" className="label">
            Abstract
          </h2>
          <p className="mt-4 text-lead leading-relaxed text-ink" data-reveal="up">
            <WithPlaceholders text={paper.abstract} />
          </p>
          {paper.keywords.length > 0 && (
            <p className="mt-6 text-sm">
              <span className="dateline mr-2">Keywords</span>
              <span className="smcp text-ink-soft">{paper.keywords.join(" · ")}</span>
            </p>
          )}
        </section>
        {paper.findings.length > 0 && (
          <section aria-labelledby="findings" className="col-span-12 lg:col-span-9 lg:col-start-3">
            <h2 id="findings" className="label">
              Key findings · as reported in the paper
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {paper.findings.map((f, i) => (
                <div key={f.country} className={`rounded-2xl border p-6 ${i % 2 === 0 ? "border-coral/40 bg-[#FBE9E3]" : "border-turquoise/40 bg-[#E6F4F3]"}`} data-reveal="up" style={{ "--d": `${i * 120}ms` } as CSSProperties}>
                  <h3 className={`font-mono text-label uppercase ${i % 2 === 0 ? "text-coral-ink" : "text-turquoise-ink"}`}>{f.country}</h3>
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
          </section>
        )}
        <div className="col-span-2 col-start-11 row-start-1 hidden self-start text-gold-dark lg:block">
          <EmblemPapers className="w-full" />
        </div>

        {paper.body.trim() && (
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <Mdx source={paper.body} variant="article" />
          </div>
        )}

        {paper.pdfExists && (
          <section aria-labelledby="pdf-viewer" className="col-span-12 lg:col-span-10 lg:col-start-2">
            <h2 id="pdf-viewer" className="label">
              Read the paper
            </h2>
            <div className="mt-4 overflow-hidden border border-cream-300 bg-white" data-reveal="wipe-up">
              <object data={`${paper.pdfPath}#view=FitH`} type="application/pdf" className="hidden h-[85vh] w-full md:block" aria-label={`PDF of ${paper.title}`}>
                <p className="p-6 text-sm">
                  Your browser can&rsquo;t display the PDF here.{" "}
                  <a href={paper.pdfPath} className="link">
                    Download it instead
                  </a>
                  .
                </p>
              </object>
              <p className="p-6 text-sm md:hidden">
                On a phone, the PDF reads best in your device&rsquo;s viewer.{" "}
                <a href={paper.pdfPath} target="_blank" rel="noopener noreferrer" className="link font-medium">
                  Open the PDF
                </a>
                .
              </p>
            </div>
          </section>
        )}

        <div className="col-span-12 lg:col-span-7 lg:col-start-3">
          <CiteBox
            slug={paper.slug}
            paperNumber={paper.paperNumber}
            formats={[
              { key: "simple", label: "Suggested", text: `${citeSimple(paper)} ${absoluteUrl(`/papers/${paper.slug}`)}` },
              { key: "apa", label: "APA", text: citeApa(paper) },
              { key: "chicago", label: "Chicago", text: citeChicago(paper) },
              { key: "bibtex", label: "BibTeX", text: citeBibtex(paper), mono: true },
            ]}
          />
        </div>
      </div>
    </article>
  );
}
