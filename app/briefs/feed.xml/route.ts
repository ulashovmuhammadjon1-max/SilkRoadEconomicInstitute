import { getAllBriefs } from "@/lib/content";
import { atom } from "@/lib/feed";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const xml = atom({
    title: "SREI Weekly Briefs",
    path: "/briefs/feed.xml",
    entries: getAllBriefs().map((b) => ({ id: absoluteUrl(`/briefs/${b.slug}`), url: absoluteUrl(`/briefs/${b.slug}`), title: b.title, updated: b.date, summary: b.summary, authors: [b.author] })),
  });
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
