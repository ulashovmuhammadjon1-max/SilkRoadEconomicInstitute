import type { Paper } from "./content";
import { yearOf } from "./format";
import { absoluteUrl, site } from "./site";

/** "Muhammadjon Ulashov" → { family: "Ulashov", given: "Muhammadjon" } */
function split(name: string) {
  const parts = name.trim().split(/\s+/);
  const family = parts.pop() ?? name;
  return { family, given: parts.join(" ") };
}
const initials = (given: string) => given.split(/[\s-]+/).filter(Boolean).map((g) => `${g[0]}.`).join(" ");

export function citeApa(p: Paper) {
  const names = p.authors.map((a) => {
    const { family, given } = split(a);
    return given ? `${family}, ${initials(given)}` : family;
  });
  const authors = names.length <= 2 ? names.join(" & ") : `${names.slice(0, -1).join(", ")}, & ${names[names.length - 1]}`;
  return `${authors} (${yearOf(p.date)}). ${p.title} (SREI Working Paper No. ${p.paperNumber}). ${site.name}. ${absoluteUrl(`/papers/${p.slug}`)}`;
}

export function citeChicago(p: Paper) {
  const [first, ...rest] = p.authors;
  const f = split(first);
  const lead = f.given ? `${f.family}, ${f.given}` : f.family;
  const authors = rest.length === 0 ? lead : `${lead}, ${rest.slice(0, -1).join(", ")}${rest.length > 1 ? "," : ""} and ${rest[rest.length - 1]}`;
  return `${authors}. ${yearOf(p.date)}. “${p.title}.” SREI Working Paper No. ${p.paperNumber}. ${site.name}. ${absoluteUrl(`/papers/${p.slug}`)}.`;
}

export function citeSimple(p: Paper) {
  const a = p.authors.length > 1 ? `${p.authors.slice(0, -1).join(", ")} and ${p.authors[p.authors.length - 1]}` : p.authors[0];
  return `${a} (${yearOf(p.date)}). ${p.title}. SREI Working Paper No. ${p.paperNumber}. ${site.name}.`;
}

const bibKey = (p: Paper) => `${split(p.authors[0]).family.toLowerCase().replace(/[^a-z]/g, "")}${yearOf(p.date)}srei${p.paperNumber}`;

export function citeBibtex(p: Paper) {
  return `@techreport{${bibKey(p)},
  author      = {${p.authors.map((a) => { const s = split(a); return s.given ? `${s.family}, ${s.given}` : s.family; }).join(" and ")}},
  title       = {{${p.title}}},
  institution = {${site.name}},
  type        = {SREI Working Paper},
  number      = {${p.paperNumber}},
  year        = {${yearOf(p.date)}},
  url         = {${absoluteUrl(`/papers/${p.slug}`)}}${p.keywords.length ? `,\n  keywords    = {${p.keywords.join(", ")}}` : ""}
}
`;
}

export function citeRis(p: Paper) {
  const lines = [
    "TY  - RPRT",
    ...p.authors.map((a) => { const s = split(a); return `AU  - ${s.given ? `${s.family}, ${s.given}` : s.family}`; }),
    `TI  - ${p.title}`,
    `PY  - ${yearOf(p.date)}`,
    `PB  - ${site.name}`,
    `T3  - SREI Working Paper`,
    `IS  - ${p.paperNumber}`,
    `UR  - ${absoluteUrl(`/papers/${p.slug}`)}`,
    ...p.keywords.map((k) => `KW  - ${k}`),
    ...(p.abstract.startsWith("[") ? [] : [`AB  - ${p.abstract}`]),
    "ER  - ",
  ];
  return lines.join("\r\n") + "\r\n";
}
