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
  return (
    <>
      <PageHeader eyebrow="Weekly briefs" title="Briefs">
        One chart and about 250 words on remittances, exchange rates and labor migration in Central Asia.
      </PageHeader>
      <BriefList briefs={getAllBriefs()} />
    </>
  );
}
