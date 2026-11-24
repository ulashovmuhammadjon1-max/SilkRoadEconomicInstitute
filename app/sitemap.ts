import type { MetadataRoute } from "next";
import { getAllBriefs, getAllPapers } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { BRIEF_TAGS, tagToSlug } from "@/lib/tags";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["/", "/papers", "/briefs", "/forum", "/about", "/contact", "/privacy", "/terms"].map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
  }));
  const papers = getAllPapers().map((p) => ({
    url: absoluteUrl(`/papers/${p.slug}`),
    lastModified: /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? new Date(p.date) : now,
  }));
  const briefs = getAllBriefs().map((b) => ({ url: absoluteUrl(`/briefs/${b.slug}`), lastModified: new Date(b.date) }));
  const tags = BRIEF_TAGS.map((t) => ({ url: absoluteUrl(`/briefs/tag/${tagToSlug(t)}`), lastModified: now }));
  return [...staticPages, ...papers, ...briefs, ...tags];
}
