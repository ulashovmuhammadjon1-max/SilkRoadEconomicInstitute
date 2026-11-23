import Link from "next/link";
import { BRIEF_TAGS, tagToSlug } from "@/lib/tags";

export function TagFilter({ active, counts }: { active?: string; counts: Record<string, number> }) {
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  const item = (href: string, label: string, n: number, on: boolean) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={on ? "page" : undefined}
        className={`group inline-flex min-h-11 items-baseline gap-2 border-b-2 px-1 text-ui transition-colors ${
          on ? "border-navy text-navy" : "border-transparent text-ink-soft hover:border-gold hover:text-navy"
        }`}
      >
        {label}
        <span className="text-xs text-ink-muted tnum">{n}</span>
      </Link>
    </li>
  );
  return (
    <nav aria-label="Filter briefs by topic" className="border-b border-cream-300">
      <ul className="-mb-px flex flex-wrap gap-x-6 gap-y-1">
        {item("/briefs", "All", all, !active)}
        {BRIEF_TAGS.map((t) => item(`/briefs/tag/${tagToSlug(t)}`, t, counts[t] ?? 0, active === t))}
      </ul>
    </nav>
  );
}
