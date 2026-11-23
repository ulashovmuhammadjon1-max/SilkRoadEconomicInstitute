import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PaperCard } from "@/components/PaperCard";
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
      <PageHeader eyebrow="Publications" title="SREI Working Papers">
        The strongest student research presented at our forums, published with a permanent page, a PDF and a citable number.
      </PageHeader>
      <section className="mx-auto max-w-4xl px-5 py-12">
        {papers.length > 0 ? (
          <ol className="space-y-6">
            {papers.map((p) => (
              <li key={p.slug}>
                <PaperCard paper={p} headingLevel="h2" />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-ink/70">No working papers have been published yet.</p>
        )}
      </section>
    </>
  );
}
