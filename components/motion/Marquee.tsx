"use client";

import { useState, type CSSProperties } from "react";

/**
 * Slow typographic marquee. Pauses on hover/focus, has a visible pause button
 * (WCAG 2.2.2) and stops entirely under reduced motion (CSS). The duplicate
 * copy needed for the loop is hidden from assistive technology.
 */
export function Marquee({ items, label, duration = 70 }: { items: string[]; label: string; duration?: number }) {
  const [paused, setPaused] = useState(false);
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap font-serif text-h2 text-cream">
          <span className="px-6 md:px-10">{t}</span>
          <span aria-hidden="true" className="text-gold">
            ◆
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-wrap relative overflow-hidden" data-paused={paused || undefined}>
      <p className="sr-only">{label}</p>
      <div className="marquee motion-reduce:!w-full motion-reduce:flex-wrap" style={{ "--marquee-dur": `${duration}s` } as CSSProperties}>
        {row(false)}
        <div className="flex motion-reduce:hidden">{row(true)}</div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute bottom-1 right-2 z-10 inline-flex min-h-11 min-w-11 items-center justify-center text-xs text-cream/80 hover:text-cream motion-reduce:hidden"
      >
        {paused ? "Play" : "Pause"}
        <span className="sr-only"> scrolling themes</span>
      </button>
    </div>
  );
}
