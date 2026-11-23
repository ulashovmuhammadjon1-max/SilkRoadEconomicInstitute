import type { CSSProperties } from "react";

/**
 * A typographic numeral that rolls through the digits to its value when its
 * parent [data-reveal] element is revealed. Decorative (aria-hidden); the
 * real value is provided for screen readers. Not a statistic.
 */
export function CountThrough({ value, delay = 0 }: { value: number; delay?: number }) {
  const digits = String(value).padStart(2, "0").split("").map(Number);
  return (
    <span data-reveal="fade" style={{ "--d": `${delay}ms`, "--rv-dur": "1ms" } as CSSProperties}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {digits.map((d, i) => (
          <span key={i} className="ct">
            <span className="ct-col" style={{ transform: `translateY(-${d}em)`, transitionDelay: `${delay + i * 120}ms` }}>
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} className="block h-[1em]">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
