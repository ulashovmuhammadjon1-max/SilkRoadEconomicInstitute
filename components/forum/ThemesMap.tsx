"use client";

import { useState, type ReactNode } from "react";

type Emph = "out" | "back" | "cities" | "all";

/** Picks which part of the map a theme relates to, from the theme's wording. */
function emphasisFor(theme: string): Emph {
  if (/russia|korea|gulf|europe|labou?r migration/i.test(theme)) return "out";
  if (/remittance|exchange|income|spending/i.test(theme)) return "back";
  if (/region|famil|left behind/i.test(theme)) return "cities";
  return "all";
}

/** Interactive themes list: hovering, focusing or tapping a theme highlights the related part of the mini map. */
export function ThemesMap({ themes, map }: { themes: string[]; map: ReactNode }) {
  const [active, setActive] = useState<number | null>(null);
  const emph = active === null ? undefined : emphasisFor(themes[active]);
  return (
    <div className="themes-map grid-12 gap-y-8">
      <ol className="col-span-12 lg:col-span-6">
        {themes.map((t, i) => (
          <li key={t} className="border-b border-cream-300 first:border-t">
            <button
              type="button"
              aria-pressed={active === i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((a) => (a === i ? null : i))}
              className="group flex w-full items-baseline gap-5 py-5 text-left"
            >
              <span className="section-no w-6 text-sm">{String(i + 1).padStart(2, "0")}</span>
              <span className={`font-serif text-h3 transition-colors ${active === i ? "text-navy" : "text-ink-soft group-hover:text-navy"}`}>{t}</span>
            </button>
          </li>
        ))}
      </ol>
      <figure className="col-span-12 lg:col-span-6 lg:pl-6">
        <div data-emph={emph}>{map}</div>
        <figcaption className="dateline mt-3">Illustration · not to scale, not data · select a theme to highlight it</figcaption>
      </figure>
    </div>
  );
}
