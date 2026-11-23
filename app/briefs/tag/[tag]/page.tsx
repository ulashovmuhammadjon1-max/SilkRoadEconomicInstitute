import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BriefList } from "@/components/BriefList";
import { PageHeader } from "@/components/PageHeader";
import { getAllBriefs } from "@/lib/content";
import { BRIEF_TAGS, slugToTag, tagToSlug } from "@/lib/tags";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BRIEF_TAGS.map((t) => ({ tag: tagToSlug(t) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = slugToTag((await params).tag);
  if (!tag) return {};
  return {
    title: `${tag} briefs`,
    description: `SREI weekly briefs on ${tag.toLowerCase()} in Central Asia.`,
    alternates: { canonical: `/briefs/tag/${tagToSlug(tag)}` },
    openGraph: { url: `/briefs/tag/${tagToSlug(tag)}` },
  };
}

export default async function TagPage({ params }: Props) {
  const tag = slugToTag((await params).tag);
  if (!tag) notFound();
  const all = getAllBriefs();
  const briefs = all.filter((b) => b.tags.some((t) => tagToSlug(t) === tagToSlug(tag)));
  return (
    <>
      <PageHeader section="04" eyebrow="Weekly briefs" title={`Briefs on ${tag}`} />
      <BriefList briefs={briefs} all={all} activeTag={tag} />
    </>
  );
}
