import { absoluteUrl, site } from "./site";

type Entry = { id: string; title: string; url: string; updated: string; summary: string; authors: string[] };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const iso = (d: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : /^\d{4}$/.test(d) ? `${d}-01-01T00:00:00Z` : new Date().toISOString());

/** Builds an Atom 1.0 feed. */
export function atom({ title, path, entries }: { title: string; path: string; entries: Entry[] }) {
  const updated = entries.map((e) => iso(e.updated)).sort().pop() ?? new Date().toISOString();
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(title)}</title>
  <subtitle>${esc(site.tagline)}</subtitle>
  <link href="${absoluteUrl(path)}" rel="self"/>
  <link href="${site.url}"/>
  <id>${absoluteUrl(path)}</id>
  <updated>${updated}</updated>
  <icon>${absoluteUrl("/logo.png")}</icon>
${entries
  .map(
    (e) => `  <entry>
    <title>${esc(e.title)}</title>
    <link href="${e.url}"/>
    <id>${e.id}</id>
    <updated>${iso(e.updated)}</updated>
${e.authors.map((a) => `    <author><name>${esc(a)}</name></author>`).join("\n")}
    <summary>${esc(e.summary)}</summary>
  </entry>`,
  )
  .join("\n")}
</feed>
`;
}
