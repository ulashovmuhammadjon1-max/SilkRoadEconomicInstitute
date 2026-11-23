import { getAllBriefs, getBrief } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "SREI Brief";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBriefs().map((b) => ({ slug: b.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const brief = getBrief((await params).slug);
  return ogImage({
    eyebrow: `SREI Brief${brief?.tags[0] ? ` · ${brief.tags[0]}` : ""}`,
    title: brief?.title ?? "Brief",
    footer: brief ? formatDate(brief.date) : undefined,
  });
}
