import Link from "next/link";
import { BRIEF_TAGS, tagToSlug } from "@/lib/tags";

export function TagFilter({ active }: { active?: string }) {
  const base = "inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors";
  const on = "border-navy bg-navy text-cream";
  const off = "border-cream-300 bg-cream-50 text-navy hover:border-gold";
  return (
    <nav aria-label="Filter briefs by topic">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/briefs" aria-current={!active ? "page" : undefined} className={`${base} ${!active ? on : off}`}>
            All
          </Link>
        </li>
        {BRIEF_TAGS.map((t) => (
          <li key={t}>
            <Link
              href={`/briefs/tag/${tagToSlug(t)}`}
              aria-current={active === t ? "page" : undefined}
              className={`${base} ${active === t ? on : off}`}
            >
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
