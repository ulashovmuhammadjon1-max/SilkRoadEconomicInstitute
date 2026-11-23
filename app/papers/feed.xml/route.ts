import { getAllPapers } from "@/lib/content";
import { atom } from "@/lib/feed";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const xml = atom({
    title: "SREI Working Papers",
    path: "/papers/feed.xml",
    entries: getAllPapers().map((p) => ({
      id: absoluteUrl(`/papers/${p.slug}`),
      url: absoluteUrl(`/papers/${p.slug}`),
      title: `No. ${p.paperNumber}: ${p.title}`,
      updated: p.date,
      summary: p.abstract,
      authors: p.authors,
    })),
  });
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
