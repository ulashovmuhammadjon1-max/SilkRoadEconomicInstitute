import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { Mdx } from "@/components/Mdx";
import { WithPlaceholders } from "@/components/Placeholder";
import { getAllPapers, getPaper } from "@/lib/content";
import { formatDate, joinNames, yearOf } from "@/lib/format";
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
    openGraph: {
      type: "article",
      url: `/papers/${paper.slug}`,
      title: paper.title,
      description,
      authors: paper.authors,
    },
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

  const citation = `${joinNames(paper.authors)} (${yearOf(paper.date)}). ${paper.title}. SREI Working Paper No. ${paper.paperNumber}. ${site.name}. ${absoluteUrl(`/papers/${paper.slug}`)}`;

  return (
    <article>
      <header className="border-b border-cream-300 bg-cream-50">
        <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm">
            <Link href="/papers" className="text-navy underline decoration-gold underline-offset-4">
              Working Papers
            </Link>
          </nav>
          <p className="eyebrow mt-6">SREI Working Paper No. {paper.paperNumber}</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-navy md:text-[2.6rem]">
            <WithPlaceholders text={paper.title} />
          </h1>
          <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold text-navy">{paper.authors.length > 1 ? "Authors" : "Author"}</dt>
            <dd>{joinNames(paper.authors)}</dd>
            <dt className="font-semibold text-navy">Date</dt>
            <dd>
              <WithPlaceholders text={formatDate(paper.date)} />
            </dd>
            {paper.forumEdition && (
              <>
                <dt className="font-semibold text-navy">Forum edition</dt>
                <dd>
                  <WithPlaceholders text={paper.forumEdition} />
                </dd>
              </>
            )}
            {paper.note && (
              <>
                <dt className="font-semibold text-navy">Note</dt>
                <dd>
                  <WithPlaceholders text={paper.note} />
                </dd>
              </>
            )}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            {paper.pdfExists ? (
              <>
                <Button href={paper.pdfPath} download>
                  Download PDF
                </Button>
                <Button href={paper.pdfPath} variant="secondary" external>
                  Open in new tab
                </Button>
              </>
            ) : (
              <p className="rounded-sm border border-dashed border-gold px-4 py-2.5 text-sm text-ink/80">
                PDF coming soon <span className="placeholder">[add file at /public{paper.pdfPath}]</span>
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-12 px-5 py-12">
        <section aria-labelledby="abstract">
          <h2 id="abstract" className="section-title">
            Abstract
          </h2>
          <p className="mt-4 text-lg leading-relaxed">
            <WithPlaceholders text={paper.abstract} />
          </p>
          {paper.keywords.length > 0 && (
            <p className="mt-6 text-sm">
              <span className="font-semibold text-navy">Keywords: </span>
              {paper.keywords.join(", ")}
            </p>
          )}
        </section>

        {paper.body.trim() && <Mdx source={paper.body} />}

        {paper.pdfExists && (
          <section aria-labelledby="pdf-viewer">
            <h2 id="pdf-viewer" className="section-title">
              Read the paper
            </h2>
            <div className="mt-4 overflow-hidden rounded-sm border border-cream-300 bg-white">
              <object data={`${paper.pdfPath}#view=FitH`} type="application/pdf" className="hidden h-[80vh] w-full md:block" aria-label={`PDF of ${paper.title}`}>
                <p className="p-6 text-sm">
                  Your browser can&rsquo;t display the PDF here.{" "}
                  <a href={paper.pdfPath} className="underline">
                    Download it instead
                  </a>
                  .
                </p>
              </object>
              <p className="p-6 text-sm md:hidden">
                On a phone, the PDF reads best in your device&rsquo;s viewer.{" "}
                <a href={paper.pdfPath} target="_blank" rel="noopener noreferrer" className="font-medium text-navy underline decoration-gold underline-offset-4">
                  Open the PDF
                </a>
                .
              </p>
            </div>
          </section>
        )}

        <section aria-labelledby="cite" className="rounded-sm border border-cream-300 bg-cream-50 p-6">
          <h2 id="cite" className="font-serif text-xl text-navy">
            Suggested citation
          </h2>
          <p className="mt-3 break-words font-serif text-[1.05rem] leading-relaxed">{citation}</p>
          <div className="mt-4">
            <CopyButton text={citation} />
          </div>
        </section>
      </div>
    </article>
  );
}
