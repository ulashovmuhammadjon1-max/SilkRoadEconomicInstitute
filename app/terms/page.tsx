import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WithPlaceholders } from "@/components/Placeholder";

export const metadata: Metadata = { title: "Terms of participation", description: "The rules for taking part in SREI research forums.", alternates: { canonical: "/terms" } };

const TERMS = [
  "SREI research forums are open to high school and university students from any country who are at least 13. Participants under 18 need the agreement of a parent or guardian.",
  "Submissions must be your own original work (or your team's). Cite every source and dataset you use. Plagiarism or fabricated data leads to disqualification.",
  "Submitting does not guarantee selection. Finalists are chosen by the SREI team and academic reviewers using the published rubric; decisions are final.",
  "If your research is selected for publication as an SREI Working Paper, it is published only with your consent. You keep the copyright to your work. [placeholder: legal review — licence granted to SREI for publication]",
  "Be respectful to other participants, reviewers and the SREI team during the forum and online. SREI may remove anyone who harasses others.",
  "Forum sessions may be recorded and published only with the presenters' consent. [placeholder: legal review — recording consent wording]",
  "SREI is an independent youth-led initiative and is not affiliated with any government, university or international organization.",
];

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Terms" title="Terms of participation">
        The ground rules for SREI research forums. Last updated: <WithPlaceholders text="[date of legal review]" />.
      </PageHeader>
      <div className="page grid-12 py-12">
        <ol className="col-span-12 space-y-6 lg:col-span-8 lg:col-start-3">
          {TERMS.map((t, i) => (
            <li key={i} className="flex gap-5 border-t border-cream-300 pt-6">
              <span className="font-mono text-sm text-turquoise-ink">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-lead text-ink-soft">
                <WithPlaceholders text={t} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
