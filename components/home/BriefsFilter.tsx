"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useState } from "react";
import { ease } from "@/lib/motion";

type Item = { slug: string; title: string; date: string; summary: string; tags: string[]; cover?: string };

/** Category filter for the latest briefs on the home page (all filtering happens in the browser). */
export function BriefsFilter({ briefs, categories }: { briefs: Item[]; categories: string[] }) {
  const [active, setActive] = useState("All");
  const shown = briefs.filter((b) => active === "All" || b.tags.includes(active)).slice(0, 3);
  return (
    <div>
      <div role="group" aria-label="Filter briefs by category" className="flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`min-h-10 rounded-full border px-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
              active === c ? "border-midnight bg-midnight text-cream" : "border-midnight/20 text-ink hover:border-midnight"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-8 min-h-[12rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.length === 0 ? (
            <m.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[24px] border border-dashed border-midnight/25 p-8 text-ink-soft">
              No briefs in {active} yet. New briefs are published weekly.
            </m.p>
          ) : (
            shown.map((b, i) => (
              <m.article
                key={b.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: ease.out }}
                className="mb-4 rounded-[24px] bg-paper p-6 shadow-[0_1px_0_rgba(16,27,51,0.08)] transition-shadow hover:shadow-lg"
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-coral-ink">
                  {b.tags[0] ?? "Brief"} · {b.date}
                </p>
                <h3 className="mt-2 font-serif text-h3 text-midnight">
                  <Link href={`/briefs/${b.slug}`} className="hover:text-deep">
                    {b.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-ink-soft">{b.summary}</p>
              </m.article>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
