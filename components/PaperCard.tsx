import Link from "next/link";
import type { Paper } from "@/lib/content";
import { formatDate, joinNames } from "@/lib/format";
import { WithPlaceholders } from "./Placeholder";

export function PaperCard({ paper, headingLevel = "h3", compact = false }: { paper: Paper; headingLevel?: "h2" | "h3"; compact?: boolean }) {
  const Heading = headingLevel;
  const abstract = paper.abstract.length > 280 ? `${paper.abstract.slice(0, 280).trimEnd()}…` : paper.abstract;
  return (
    <article className="flex h-full flex-col rounded-sm border border-cream-300 bg-cream-50 p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">SREI Working Paper No. {paper.paperNumber}</p>
      <Heading className="mt-2 font-serif text-xl leading-snug text-navy md:text-[1.35rem]">
        <Link href={`/papers/${paper.slug}`} className="hover:underline decoration-gold underline-offset-4">
          <WithPlaceholders text={paper.title} />
        </Link>
      </Heading>
      <p className="mt-2 text-sm text-ink/80">
        {joinNames(paper.authors)} · <WithPlaceholders text={formatDate(paper.date)} />
      </p>
      {!compact && (
        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/80">
          <WithPlaceholders text={abstract} />
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
        <Link href={`/papers/${paper.slug}`} className="text-navy underline decoration-gold underline-offset-4 hover:decoration-2">
          Read<span className="sr-only">: {paper.title}</span>
        </Link>
        {paper.pdfExists ? (
          <a href={paper.pdfPath} download className="text-navy underline decoration-gold underline-offset-4 hover:decoration-2">
            Download PDF<span className="sr-only"> of Working Paper No. {paper.paperNumber}</span>
          </a>
        ) : (
          <span className="text-ink/60">PDF coming soon</span>
        )}
      </div>
    </article>
  );
}
