import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Reads briefs and papers from /content at build time.
 * If a file is missing a required field, the build fails with a message that
 * names the file and the field, so mistakes never reach the live site.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export type Brief = {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  tags: string[];
  coverImage?: string;
  coverAlt?: string;
  body: string;
};

export type Paper = {
  slug: string;
  title: string;
  paperNumber: number;
  authors: string[];
  date: string;
  abstract: string;
  pdfPath: string;
  pdfExists: boolean;
  keywords: string[];
  forumEdition?: string;
  note?: string;
  originalPublication?: string;
  originalUrl?: string;
  researchPeriod?: string;
  findings: { country: string; rows: { label: string; value: string }[] }[];
  body: string;
};

type Frontmatter = Record<string, unknown>;

function fail(file: string, message: string): never {
  throw new Error(`[content] ${file}: ${message}`);
}

function str(fm: Frontmatter, key: string, file: string, required = true): string | undefined {
  const v = fm[key];
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (v === undefined || v === null || v === "") {
    if (required) fail(file, `missing required frontmatter field "${key}"`);
    return undefined;
  }
  if (typeof v !== "string" && typeof v !== "number") fail(file, `"${key}" must be text`);
  return String(v).trim();
}

function list(fm: Frontmatter, key: string, file: string): string[] {
  const v = fm[key];
  if (v === undefined || v === null) return [];
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  fail(file, `"${key}" must be a list, e.g. ["A", "B"]`);
}

function readDir(sub: string): { slug: string; file: string; data: Frontmatter; body: string }[] {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      return { slug: f.replace(/\.mdx?$/, ""), file: `content/${sub}/${f}`, data, body: content };
    });
}

/** Accepts "/papers/x.pdf" or "/public/papers/x.pdf" and returns the public URL. */
function toPublicUrl(p: string): string {
  let url = p.replace(/^\/?public\//, "/");
  if (!url.startsWith("/") && !/^https?:\/\//.test(url)) url = `/${url}`;
  return url;
}

function publicFileExists(url: string): boolean {
  if (/^https?:\/\//.test(url)) return true;
  return fs.existsSync(path.join(PUBLIC_DIR, decodeURIComponent(url)));
}

let briefCache: Brief[] | null = null;
let paperCache: Paper[] | null = null;

/** All briefs, newest first. */
export function getAllBriefs(): Brief[] {
  if (briefCache) return briefCache;
  briefCache = readDir("briefs")
    .map(({ slug, file, data, body }) => {
      const date = str(data, "date", file)!;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(file, `"date" must look like 2026-12-01`);
      const cover = str(data, "coverImage", file, false);
      return {
        slug,
        title: str(data, "title", file)!,
        date,
        author: str(data, "author", file)!,
        summary: str(data, "summary", file)!,
        tags: list(data, "tags", file),
        coverImage: cover ? toPublicUrl(cover) : undefined,
        coverAlt: str(data, "coverAlt", file, false),
        body,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  return briefCache;
}

export function getBrief(slug: string): Brief | undefined {
  return getAllBriefs().find((b) => b.slug === slug);
}

/** Previous (older) and next (newer) brief relative to the given slug. */
export function getAdjacentBriefs(slug: string): { older?: Brief; newer?: Brief } {
  const all = getAllBriefs();
  const i = all.findIndex((b) => b.slug === slug);
  if (i === -1) return {};
  return { newer: all[i - 1], older: all[i + 1] };
}

/** All papers, highest paper number (newest) first. */
export function getAllPapers(): Paper[] {
  if (paperCache) return paperCache;
  const papers = readDir("papers").map(({ slug, file, data, body }) => {
    const num = Number(str(data, "paperNumber", file));
    if (!Number.isInteger(num) || num < 0) fail(file, `"paperNumber" must be a whole number`);
    const authors = list(data, "authors", file);
    if (authors.length === 0) fail(file, `"authors" needs at least one name`);
    const pdfPath = toPublicUrl(str(data, "pdfPath", file)!);
    return {
      slug,
      title: str(data, "title", file)!,
      paperNumber: num,
      authors,
      date: str(data, "date", file)!,
      abstract: str(data, "abstract", file)!,
      pdfPath,
      pdfExists: publicFileExists(pdfPath),
      keywords: list(data, "keywords", file),
      forumEdition: str(data, "forumEdition", file, false),
      note: str(data, "note", file, false),
      originalPublication: str(data, "originalPublication", file, false),
      originalUrl: str(data, "originalUrl", file, false),
      researchPeriod: str(data, "researchPeriod", file, false),
      findings: Array.isArray(data.findings)
        ? (data.findings as { country?: unknown; rows?: unknown }[])
            .filter((f) => f && typeof f.country === "string")
            .map((f) => ({
              country: String(f.country),
              rows: (Array.isArray(f.rows) ? f.rows : []).map((r: { label?: unknown; value?: unknown }) => ({ label: String(r.label ?? ""), value: String(r.value ?? "") })),
            }))
        : [],
      body,
    };
  });
  const seen = new Map<number, string>();
  for (const p of papers) {
    if (seen.has(p.paperNumber)) {
      throw new Error(
        `[content] Working Paper No. ${p.paperNumber} is used twice: ${seen.get(p.paperNumber)} and ${p.slug}`,
      );
    }
    seen.set(p.paperNumber, p.slug);
  }
  paperCache = papers.sort((a, b) => b.paperNumber - a.paperNumber);
  return paperCache;
}

export function getPaper(slug: string): Paper | undefined {
  return getAllPapers().find((p) => p.slug === slug);
}

/* ---------- JSON data files ---------- */

export type Person = {
  name: string;
  role: string;
  affiliation?: string;
  bio?: string;
  photo?: string;
  interests?: string[];
  links?: { label: string; url: string }[];
};

function readJson<T>(file: string, fallback: T): T {
  const full = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(full)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(full, "utf8")) as T;
  } catch (e) {
    throw new Error(`[content] content/${file} is not valid JSON: ${(e as Error).message}`);
  }
}

/** Accepts either a plain array or { "<key>": [...] } (the shape /admin saves). */
function readPeople(file: string, key: string): Person[] {
  const data = readJson<Person[] | Record<string, Person[]>>(file, []);
  const list = Array.isArray(data) ? data : (data[key] ?? []);
  return list.filter((p) => p && p.name);
}

export function getTeam(): Person[] {
  return readPeople("team.json", "members");
}

export function getJudges(): Person[] {
  return readPeople("judges.json", "judges");
}

export type TimelineItem = { label: string; date: string; /** Optional ISO date for the "you are here" marker. */ isoDate?: string };
export type RubricItem = { criterion: string; points: number; description: string };
export type PastEdition = {
  name: string;
  dates: string;
  summary?: string;
  winners?: { place: string; name: string; title: string; paperSlug?: string }[];
  recordingUrl?: string;
  resultsUrl?: string;
};
export type ForumData = {
  current: {
    name: string;
    status: "upcoming" | "open" | "closed";
    dates: string;
    format: string;
    eligibility: string;
    themes: string[];
    timeline: TimelineItem[];
    rubric: RubricItem[];
    awards: string[];
    howToSubmit: string;
    steps?: { title: string; text: string }[];
    /** Short theme tags for the home page. */
    tags?: string[];
    edition?: string;
    season?: string;
    /** ISO date/time of the submission deadline; drives the countdown. Empty = not set. */
    submissionDeadline?: string;
    /** ISO dates of the forum itself (machine-readable twin of `dates`). */
    forumDateStart?: string;
    forumDateEnd?: string;
    /** Where "Submit your research" points: the Google Form or the on-site form. */
    registrationMode?: "google_form" | "site";
    /** On-site registration switch (Phase 5). */
    registrationOpen?: boolean;
  };
  pastEditions: PastEdition[];
};

/** Parses an ISO date string; returns null for empty, placeholder or invalid values. */
export function parseIsoDate(value: string | undefined | null): Date | null {
  if (!value || value.trim().startsWith("[")) return null;
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return null;
  const d = new Date(value.length === 10 ? `${value}T23:59:59Z` : value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getForum(): ForumData {
  const data = readJson<ForumData | null>("forum.json", null);
  if (!data) throw new Error("[content] content/forum.json is missing");
  return { ...data, pastEditions: data.pastEditions ?? [] };
}
