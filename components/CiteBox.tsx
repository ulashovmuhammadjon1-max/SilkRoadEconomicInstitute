"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { Glyph } from "./ornaments/Glyph";

type Format = { key: string; label: string; text: string; mono?: boolean };

/** Citation panel with APA / Chicago / BibTeX tabs, copy and file downloads. */
export function CiteBox({ formats, slug, paperNumber }: { formats: Format[]; slug: string; paperNumber: number }) {
  const [active, setActive] = useState(0);
  const f = formats[active];
  return (
    <section aria-labelledby="cite" className="border-t-2 border-navy pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="cite" className="font-serif text-h3 text-navy">
          Cite this paper
        </h2>
        <div role="tablist" aria-label="Citation format" className="flex gap-1">
          {formats.map((x, i) => (
            <button
              key={x.key}
              id={`tab-${x.key}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="cite-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setActive((a) => (a + 1) % formats.length);
                if (e.key === "ArrowLeft") setActive((a) => (a - 1 + formats.length) % formats.length);
              }}
              className={`min-h-11 border-b-2 px-3 text-ui transition-colors ${i === active ? "border-gold text-navy" : "border-transparent text-ink-muted hover:text-navy"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <div id="cite-panel" role="tabpanel" aria-labelledby={`tab-${f.key}`} className="mt-5 rounded-2xl bg-cream-50 p-5" tabIndex={0}>
        {f.mono ? (
          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[0.8rem] leading-relaxed text-ink">{f.text}</pre>
        ) : (
          <p className="break-words text-[1rem] leading-relaxed">{f.text}</p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <CopyButton text={f.text} label={`Copy ${f.label}`} />
        <a href={`/papers/${slug}/cite.bib`} className="inline-flex min-h-11 items-center gap-2 px-2 text-ui text-navy hover:underline" download={`srei-wp-${paperNumber}.bib`}>
          <Glyph name="download" size={18} /> .bib
        </a>
        <a href={`/papers/${slug}/cite.ris`} className="inline-flex min-h-11 items-center gap-2 px-2 text-ui text-navy hover:underline" download={`srei-wp-${paperNumber}.ris`}>
          <Glyph name="download" size={18} /> .ris
        </a>
      </div>
    </section>
  );
}
