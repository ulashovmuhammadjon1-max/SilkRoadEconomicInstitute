import { createElement, type CSSProperties } from "react";

type Props = {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  /** Delay before the first word starts, in ms. */
  delay?: number;
  id?: string;
  /** Words (exact, case-sensitive) to set in italic with the accent color. */
  accent?: string[];
  accentClass?: string;
};

/**
 * Headline reveal that needs no JavaScript: each word rises out of its own
 * mask with a small stagger, so lines appear in reading order as a wave.
 * Pure CSS (globals.css → .rw), so it starts at first paint and never delays
 * the largest contentful paint. Screen readers get the plain text.
 */
export function RevealLines({ text, as = "h1", className = "", delay = 0, id, accent = [], accentClass = "italic text-turquoise-light" }: Props) {
  const words = text.split(/\s+/).filter(Boolean);
  return createElement(
    as,
    { id, className, "aria-label": text },
    words.map((w, i) => (
      <span key={i} aria-hidden="true">
        <span className="rw" style={{ "--d": `${delay + i * 35}ms` } as CSSProperties}>
          <span className={`rw-in ${accent.includes(w.replace(/[.,;:!?]$/, "")) ? accentClass : ""}`}>{w}</span>
        </span>
        {i < words.length - 1 ? " " : ""}
      </span>
    )),
  );
}
