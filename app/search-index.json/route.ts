import { getAllBriefs, getAllPapers } from "@/lib/content";

export const dynamic = "force-static";

/** Build-time search index for the site search dialog. */
export function GET() {
  const docs = [
    ...getAllPapers().map((p) => ({
      id: `p-${p.slug}`,
      kind: "Working Paper",
      url: `/papers/${p.slug}`,
      title: p.title,
      meta: `No. ${p.paperNumber} · ${p.authors.join(", ")}`,
      text: `${p.abstract} ${p.keywords.join(" ")} ${p.authors.join(" ")}`,
    })),
    ...getAllBriefs().map((b) => ({
      id: `b-${b.slug}`,
      kind: "Brief",
      url: `/briefs/${b.slug}`,
      title: b.title,
      meta: `${b.date} · ${b.author}`,
      text: `${b.summary} ${b.tags.join(" ")} ${b.author}`,
    })),
  ];
  return Response.json(docs);
}
