import type { Metadata } from "next";
import { PaperTocRow } from "@/components/home/LatestPapers";
import { Waypoint } from "@/components/ornaments/Ornaments";
import { PageHeader } from "@/components/PageHeader";
import { getAllPapers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Working Papers",
  description: "The SREI Working Paper series: student research on migration, remittances and exchange rates in Central Asia.",
  alternates: { canonical: "/papers" },
  openGraph: { url: "/papers" },
};

export default function PapersPage() {
  const papers = getAllPapers();
  return (
    <>
      <PageHeader section="05" eyebrow="Publications" title="SREI Working Papers">
        The strongest student research presented at our forums, published with a permanent page, a PDF and a citable number.
      </PageHeader>
      <section className="page py-10 md:py-14" aria-label="All working papers">
        {papers.length > 0 ? (
          <ol className="border-t-2 border-navy">
            {papers.map((p, i) => (
              <PaperTocRow key={p.slug} paper={p} delay={(i % 6) * 80} headingLevel="h2" />
            ))}
          </ol>
        ) : (
          <p className="flex items-center gap-3 py-20 text-ink-muted">
            <Waypoint className="text-gold" /> No working papers have been published yet.
          </p>
        )}
      </section>
    </>
  );
}
