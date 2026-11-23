import type { SVGProps } from "react";

/**
 * Hand-drawn line glyphs in the SREI line style (1.4px, round caps).
 * Decorative by default; pass a `title` to make one meaningful.
 */
const paths = {
  arrow: "M4 12h15M14 7l5 5-5 5",
  arrowLeft: "M20 12H5M10 7l-5 5 5 5",
  download: "M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14",
  external: "M10 5H5.5v13.5H19V14M13.5 4.5H19.5V10.5M19 5l-8 8",
  share: "M12 15V4.5M8 8l4-4 4 4M6 12.5v6.5h12v-6.5",
  copy: "M8.5 8.5h10v11h-10zM15.5 8.5V4.5h-10v11h3",
  menu: "M3.5 8h17M3.5 16h11",
  close: "M6 6l12 12M18 6 6 18",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5",
  telegram: "M20.5 4.5 3.5 11l6 2 2 6 3-4 4.5 3.5 1.5-14ZM9.5 13l7-5",
  mail: "M3.5 6h17v12h-17zM3.5 6.5l8.5 6.5 8.5-6.5",
  pdf: "M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 14h5M9.5 17h3",
} as const;

export type GlyphName = keyof typeof paths;

export function Glyph({ name, title, size = 20, ...rest }: { name: GlyphName; title?: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={paths[name]} />
    </svg>
  );
}

/** Ink-stamp check used for "Copied" feedback. */
export function StampCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <circle cx="12" cy="12" r="9.5" strokeDasharray="2 1.5" />
      <path d="M7.5 12.5l3 3 6-6.5" />
    </svg>
  );
}
