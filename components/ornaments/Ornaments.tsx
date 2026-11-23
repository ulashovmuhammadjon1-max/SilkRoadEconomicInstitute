import { useId, type CSSProperties } from "react";

/**
 * The SREI ornament set: hand-built SVG in brand colors, 1.25px line weight.
 * All decorative (aria-hidden). Paths use pathLength="1" so the reveal
 * system can draw them (see [data-draw] in globals.css).
 */

type DrawProps = { className?: string; delay?: number; draw?: boolean };
const drawAttrs = (draw: boolean | undefined, delay = 0) =>
  draw ? ({ "data-draw": "", style: { "--d": `${delay}ms` } as CSSProperties } as const) : {};

/**
 * A dotted caravan route that can draw itself: the dotted path is revealed
 * through a mask whose solid stroke animates from 0 to full length.
 */
export function RouteLine({
  className = "",
  d = "M0 24 C 120 8, 220 34, 340 20 S 560 6, 680 22 S 880 34, 1000 16",
  viewBox = "0 0 1000 40",
  waypoints = [
    [120, 15],
    [340, 20],
    [680, 22],
    [880, 27],
  ],
  draw = true,
  delay = 0,
  duration = 1800,
}: DrawProps & { d?: string; viewBox?: string; waypoints?: number[][]; duration?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`text-gold ${className}`}
      fill="none"
      aria-hidden="true"
      {...drawAttrs(draw, delay)}
    >
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse">
          <path
            d={d}
            pathLength={1}
            className="draw"
            stroke="#fff"
            strokeWidth="14"
            style={{ "--draw-dur": `${duration}ms` } as CSSProperties}
            vectorEffect="non-scaling-stroke"
          />
        </mask>
      </defs>
      <path
        d={d}
        mask={`url(#m${id})`}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeDasharray="1 7"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {waypoints.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3.2"
          fill="currentColor"
          className="pop"
          style={{ "--dd": `${Math.round((x / 1000) * duration)}ms` } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/** Small waypoint: a dot inside a hairline ring, like a caravanserai on an old map. */
export function Waypoint({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} aria-hidden="true" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="2.2" fill="currentColor" />
    </svg>
  );
}

/** A restrained compass rose. */
export function CompassRose({ className = "", draw, delay }: DrawProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" {...drawAttrs(draw, delay)}>
      <circle className="draw" pathLength={1} cx="60" cy="60" r="52" />
      <circle className="draw" pathLength={1} cx="60" cy="60" r="44" strokeDasharray="1 4" style={{ "--dd": "200ms" } as CSSProperties} />
      <path className="draw" pathLength={1} d="M60 6 L67 53 L114 60 L67 67 L60 114 L53 67 L6 60 L53 53 Z" style={{ "--dd": "400ms" } as CSSProperties} />
      <path className="draw" pathLength={1} d="M60 26 L63 57 L94 60 L63 63 L60 94 L57 63 L26 60 L57 57 Z" style={{ "--dd": "700ms" } as CSSProperties} />
      <text x="60" y="4" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontFamily="var(--font-serif)">N</text>
    </svg>
  );
}

/** Pillar emblems, one per pillar, drawn on reveal. */
export function EmblemForum({ className = "", draw = true, delay = 0 }: DrawProps) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...drawAttrs(draw, delay)}>
      <path className="draw" pathLength={1} d="M48 30h24l-3 34H51z" />
      <path className="draw" pathLength={1} d="M44 30h32M60 64v12M50 76h20" style={{ "--dd": "250ms" } as CSSProperties} />
      <path className="draw" pathLength={1} d="M14 84c10-10 22-14 46-14s36 4 46 14" strokeDasharray="1 5" style={{ "--dd": "500ms" } as CSSProperties} />
      <circle className="pop" cx="60" cy="18" r="5" style={{ "--dd": "700ms" } as CSSProperties} />
    </svg>
  );
}

export function EmblemPapers({ className = "", draw = true, delay = 0 }: DrawProps) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...drawAttrs(draw, delay)}>
      <path className="draw" pathLength={1} d="M30 14h44l14 14v52H30z" />
      <path className="draw" pathLength={1} d="M74 14v14h14" style={{ "--dd": "200ms" } as CSSProperties} />
      <path className="draw" pathLength={1} d="M40 40h38M40 50h38M40 60h26" style={{ "--dd": "400ms" } as CSSProperties} />
      <path className="draw" pathLength={1} d="M22 22v66h52" strokeDasharray="1 5" style={{ "--dd": "600ms" } as CSSProperties} />
      <path className="draw" pathLength={1} d="M88 36h10v12H88" style={{ "--dd": "800ms" } as CSSProperties} />
    </svg>
  );
}

export function EmblemBriefs({ className = "", draw = true, delay = 0 }: DrawProps) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...drawAttrs(draw, delay)}>
      <path className="draw" pathLength={1} d="M18 78h84M18 78V14" />
      <path className="draw" pathLength={1} d="M30 78V58M46 78V44M62 78V50M78 78V30M94 78V38" strokeWidth="6" strokeLinecap="butt" style={{ "--dd": "300ms" } as CSSProperties} />
      <path className="draw" pathLength={1} d="M24 52 40 40l16 6 16-22 22 8" strokeDasharray="1 5" style={{ "--dd": "700ms" } as CSSProperties} />
    </svg>
  );
}
