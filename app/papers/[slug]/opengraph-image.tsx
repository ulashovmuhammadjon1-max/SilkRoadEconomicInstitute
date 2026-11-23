import { getAllPapers, getPaper } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "SREI Working Paper";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const paper = getPaper((await params).slug);
  return ogImage({
    eyebrow: `SREI Working Paper No. ${paper?.paperNumber ?? ""}`,
    title: paper?.title ?? "Working Paper",
    footer: paper?.authors.join(", "),
  });
}
