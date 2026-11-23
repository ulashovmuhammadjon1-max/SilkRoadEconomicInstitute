"use client";

import MiniSearch from "minisearch";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Glyph } from "../ornaments/Glyph";

type Doc = { id: string; kind: string; url: string; title: string; meta: string; text: string };

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    const close = () => onClose();
    d.addEventListener("close", close);
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setDocs)
      .catch(() => setDocs([]));
    return () => d.removeEventListener("close", close);
  }, [onClose]);

  const index = useMemo(() => {
    if (!docs) return null;
    const ms = new MiniSearch<Doc>({ fields: ["title", "text", "meta"], storeFields: ["kind", "url", "title", "meta"], searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.2 } });
    ms.addAll(docs);
    return ms;
  }, [docs]);

  const results = useMemo(() => {
    if (!index || q.trim().length < 2) return [];
    return index.search(q).slice(0, 8) as unknown as (Doc & { score: number })[];
  }, [index, q]);

  useEffect(() => setActive(0), [q]);

  return (
    <dialog
      ref={ref}
      aria-label="Search the site"
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-navy-950/40 open:animate-[fadein_200ms_ease-out] md:mx-auto md:mt-[12vh] md:h-auto md:max-w-2xl"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className="flex h-full flex-col bg-cream-50 md:h-auto md:border md:border-cream-300">
        <div className="flex items-center gap-3 border-b border-cream-300 px-5">
          <Glyph name="search" size={20} className="text-gold-dark" />
          <label htmlFor="site-search" className="sr-only">
            Search briefs and working papers
          </label>
          <input
            id="site-search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === "Enter" && results[active]) { window.location.assign(results[active].url); }
            }}
            placeholder="Search briefs and working papers"
            autoComplete="off"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active].id}` : undefined}
            className="h-16 flex-1 bg-transparent font-serif text-xl text-navy outline-none placeholder:text-ink-muted"
          />
          <button type="button" onClick={() => ref.current?.close()} className="inline-flex h-11 w-11 items-center justify-center text-ink-soft">
            <span className="sr-only">Close search</span>
            <Glyph name="close" />
          </button>
        </div>
        <ul id="search-results" role="listbox" className="max-h-[60vh] overflow-y-auto">
          {results.map((r, i) => (
            <li key={r.id} id={`sr-${r.id}`} role="option" aria-selected={i === active}>
              <Link
                href={r.url}
                onClick={() => ref.current?.close()}
                onMouseEnter={() => setActive(i)}
                className={`block border-b border-cream-200 px-5 py-4 transition-colors ${i === active ? "bg-cream-200/60" : ""}`}
              >
                <span className="label">{r.kind}</span>
                <span className="mt-1 block font-serif text-lg leading-snug text-navy">{r.title}</span>
                <span className="mt-1 block text-sm text-ink-muted">{r.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="px-5 py-3 text-xs text-ink-muted" aria-live="polite">
          {docs === null ? "Loading…" : q.trim().length < 2 ? "Type at least two letters." : `${results.length} result${results.length === 1 ? "" : "s"}`}
        </p>
      </div>
    </dialog>
  );
}
