import type { Metadata } from "next";
import { BriefList } from "@/components/BriefList";
import { PageHeader } from "@/components/PageHeader";
import { getAllBriefs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weekly Briefs",
  description: "Short, data-driven briefs on remittances, exchange rates and labor migration in Central Asia: one chart, about 250 words.",
  alternates: { canonical: "/briefs" },
  openGraph: { url: "/briefs" },
};

export default function BriefsPage() {
  const all = getAllBriefs();
  return (
    <>
      <PageHeader section="04" eyebrow="Weekly briefs" title="One chart, two hundred and fifty words">
        Short, data-driven notes on remittances, exchange rates and labor migration in Central Asia.
      </PageHeader>
      <BriefList briefs={all} all={all} />
    </>
  );
}
