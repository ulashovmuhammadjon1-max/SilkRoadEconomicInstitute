import type { Metadata } from "next";
import { BriefList } from "@/components/BriefList";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { PageHeader } from "@/components/PageHeader";
import { features, turnstileSiteKey } from "@/lib/features";
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
      <PageHeader
        section="05"
        eyebrow="Weekly briefs"
        title="Small observations. Bigger economic questions."
        aside={features.newsletter ? <NewsletterForm id="briefs-newsletter" turnstileSiteKey={features.turnstile ? turnstileSiteKey : ""} /> : undefined}
      >
        Short, data-driven notes on remittances, exchange rates, labor migration and household economics in Central Asia.
      </PageHeader>
      <BriefList briefs={all} all={all} />
    </>
  );
}
