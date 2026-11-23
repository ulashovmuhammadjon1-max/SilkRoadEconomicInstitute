import type { CSSProperties } from "react";
import { curve, project } from "@/lib/map-project";
import { focusCountries } from "../map/paths";

/**
 * Hero visual: an abstract research network over a dark map of Central Asia.
 * Routes and pulses are illustrative connections, NOT migration data.
 * Pure SVG + CSS/SMIL; moving pulses are hidden under reduced motion.
 * Requires <MapDefs /> on the page (shared country outlines).
 */
const NODES = {
  tashkent: { label: "TASHKENT", ...project(69.24, 41.31), hub: true },
  almaty: { label: "ALMATY", ...project(76.89, 43.24) },
  bishkek: { label: "BISHKEK", ...project(74.59, 42.87) },
  dushanbe: { label: "DUSHANBE", ...project(68.79, 38.56) },
  astana: { label: "ASTANA", ...project(71.43, 51.13) },
  moscow: { label: "MOSCOW", ...project(37.62, 55.75) },
  seoul: { label: "SEOUL", ...project(126.98, 37.57) },
  dubai: { label: "DUBAI", ...project(55.27, 25.2) },
  europe: { label: "EUROPE", ...project(13.4, 52.52) },
} as const;
type Key = keyof typeof NODES;

const ROUTES: { from: Key; to: Key; bend: number; tone: "turq" | "gold" }[] = [
  { from: "tashkent", to: "moscow", bend: -0.18, tone: "turq" },
  { from: "tashkent", to: "seoul", bend: -0.16, tone: "turq" },
  { from: "tashkent", to: "dubai", bend: 0.22, tone: "turq" },
  { from: "tashkent", to: "europe", bend: -0.14, tone: "turq" },
  { from: "almaty", to: "moscow", bend: 0.12, tone: "gold" },
  { from: "dubai", to: "dushanbe", bend: 0.14, tone: "gold" },
  { from: "seoul", to: "bishkek", bend: 0.1, tone: "gold" },
  { from: "europe", to: "astana", bend: 0.08, tone: "gold" },
  { from: "tashkent", to: "almaty", bend: -0.25, tone: "turq" },
  { from: "almaty", to: "astana", bend: 0.2, tone: "turq" },
  { from: "tashkent", to: "dushanbe", bend: 0.3, tone: "turq" },
  { from: "bishkek", to: "almaty", bend: 0.4, tone: "turq" },
];

const SYMBOLS = [
  { s: "₸", x: 560, y: 190 },
  { s: "₽", x: 300, y: 250 },
  { s: "₩", x: 890, y: 300 },
  { s: "$", x: 470, y: 420 },
  { s: "€", x: 160, y: 300 },
  { s: "сўм", x: 455, y: 335 },
];

const C = { turq: "#16A6A1", gold: "#D8A64A" };

export function HeroNetwork({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="80 120 900 420" className={className} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hn-fade" cx="58%" cy="52%" r="62%">
          <stop offset="55%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id="hn-mask" maskUnits="userSpaceOnUse" x="80" y="120" width="900" height="420">
          <rect x="80" y="120" width="900" height="420" fill="url(#hn-fade)" />
        </mask>
        <filter id="hn-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <pattern id="hn-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.6" />
        </pattern>
      </defs>

      <g mask="url(#hn-mask)">
        <rect x="80" y="120" width="900" height="420" fill="url(#hn-grid)" />
        <use href="#srei-map-context" fill="#132341" stroke="#24406A" strokeWidth="0.6" />
      </g>
      <g className="hn-focus">
        {focusCountries.map((c, i) => (
          <path key={c.code} d={c.d} pathLength={1} fill="rgba(22,166,161,0.08)" stroke="#16A6A1" strokeWidth="0.9" vectorEffect="non-scaling-stroke" strokeLinejoin="round" style={{ "--i": i } as CSSProperties} />
        ))}
      </g>

      {/* latitude / longitude ticks */}
      <g className="font-mono" fill="#5CCFC9" fillOpacity="0.45" fontSize="8.5" letterSpacing="1">
        <text x="485" y="128">60°E</text>
        <text x="585" y="128">75°E</text>
        <text x="86" y="270">50°N</text>
        <text x="86" y="378">40°N</text>
      </g>

      {/* routes */}
      {ROUTES.map((r, i) => {
        const d = curve(NODES[r.from], NODES[r.to], r.bend);
        const id = `hn-r${i}`;
        return (
          <g key={id}>
            <path id={id} d={d} pathLength={1} className="hn-route" stroke={C[r.tone]} strokeOpacity={r.tone === "gold" ? 0.55 : 0.7} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ "--i": i } as CSSProperties} />
            <circle r="2.6" fill={C[r.tone]} className="hn-pulse">
              <animateMotion dur={`${6 + (i % 5) * 1.3}s`} begin={`${1.4 + i * 0.37}s`} repeatCount="indefinite" keyPoints={r.tone === "gold" ? "0;1" : "0;1"} keyTimes="0;1" calcMode="linear">
                <mpath href={`#${id}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}

      {/* currency symbols */}
      <g className="font-serif" fill="#D8A64A">
        {SYMBOLS.map((s, i) => (
          <text key={i} x={s.x} y={s.y} fontSize={s.s.length > 1 ? 13 : 18} className="hn-sym" style={{ "--i": i } as CSSProperties} fillOpacity="0.32">
            {s.s}
          </text>
        ))}
      </g>

      {/* nodes */}
      {(Object.entries(NODES) as [Key, (typeof NODES)[Key]][]).map(([k, n], i) => {
        // label offsets [dx, dy, anchor] chosen so the Central Asian cluster stays legible
        const OFF: Record<Key, [number, number, "start" | "end"]> = {
          tashkent: [-9, -6, "end"], almaty: [8, 12, "start"], bishkek: [6, -9, "start"], dushanbe: [-8, 13, "end"], astana: [8, -7, "start"],
          moscow: [8, -7, "start"], seoul: [-9, -7, "end"], dubai: [-9, 4, "end"], europe: [8, -7, "start"],
        };
        const [dx, dy, anchor] = OFF[k];
        const color = ["moscow", "seoul", "dubai", "europe"].includes(k) ? C.gold : C.turq;
        return (
          <g key={k} className="hn-node" style={{ "--i": i } as CSSProperties}>
            <circle cx={n.x} cy={n.y} r={"hub" in n ? 7 : 5} fill={color} opacity="0.55" filter="url(#hn-glow)" className="hn-glow" />
            <circle cx={n.x} cy={n.y} r={"hub" in n ? 3.6 : 2.6} fill={color} />
            <text
              x={n.x + dx}
              y={n.y + dy}
              textAnchor={anchor}
              className="font-mono"
              fontSize={k === "bishkek" || k === "almaty" || k === "dushanbe" ? 8 : 9.5}
              letterSpacing="1.2"
              fill="#E7ECF5"
              fillOpacity="0.85"
            >
              {n.label}
            </text>
          </g>
        );
      })}
      <text x={NODES.tashkent.x - 14} y={NODES.tashkent.y + 7} textAnchor="end" className="font-mono" fontSize="7.5" fill="#5CCFC9" fillOpacity="0.7" letterSpacing="0.8">
        41.31°N 69.24°E
      </text>
    </svg>
  );
}
