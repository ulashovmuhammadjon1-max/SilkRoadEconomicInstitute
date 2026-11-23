import { useId, type CSSProperties } from "react";
import { contextCountries, destinations, focusCountries, origins } from "./paths";

const CONTEXT_D = contextCountries.map((c) => c.d).join("");

/**
 * Shared geometry for every map on a page. Render once per page that shows a
 * map (home, forum); each MapSvg references it with <use>, which keeps the
 * HTML small.
 */
export function MapDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <path id="srei-map-context" d={CONTEXT_D} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </defs>
    </svg>
  );
}

/**
 * Decorative map of Central Asia and the main labor-migration corridors.
 * Illustration only: not to scale, not data. All corridors share one stroke
 * width so nothing implies volumes.
 *
 * Class hooks (used by the scroll scene): .m-ctx, .m-focus, .m-city,
 * .m-out[data-k], .m-back[data-k], .m-dest[data-k].
 */

export type CorridorKey = (typeof destinations)[number]["key"];
const HUB = origins[0]; // Tashkent as the visual hub

function curve(ax: number, ay: number, bx: number, by: number, bend: number) {
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  const cx = mx + nx * len * bend, cy = my + ny * len * bend;
  return `M${ax} ${ay}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${bx} ${by}`;
}

export const corridors = destinations.map((d) => ({
  ...d,
  out: curve(HUB.x, HUB.y, d.x, d.y, d.key === "gulf" ? 0.22 : -0.2),
  back: curve(d.x, d.y, HUB.x, HUB.y, d.key === "gulf" ? 0.12 : -0.1),
}));

type Props = {
  className?: string;
  /** "full": the whole scene. "fragment": Central Asia only (hero). "mini": forum themes map. */
  variant?: "full" | "fragment" | "mini";
  /** Which corridor to emphasize (mini map). */
  highlight?: CorridorKey | "all" | null;
  /** Show the return (remittance) lines. */
  showReturn?: boolean;
  /** Use [data-draw] reveal on the corridors (mobile frames). */
  drawCorridors?: boolean;
  showOutline?: boolean;
  showCities?: boolean;
  showCorridors?: boolean;
  title?: string;
};

export function MapSvg({
  className = "",
  variant = "full",
  highlight = "all",
  showReturn = true,
  drawCorridors = false,
  showOutline = true,
  showCities = true,
  showCorridors = true,
  title,
}: Props) {
  const viewBox = variant === "fragment" ? "372 150 290 215" : "70 140 900 400";
  const vb = viewBox.split(" ").map(Number);
  const fadeId = `fade${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const sw = variant === "fragment" ? 0.6 : 1.1;
  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...(drawCorridors ? { "data-draw": "" } : {})}
    >
      <defs>
        <radialGradient id={`${fadeId}-g`} cx="50%" cy="50%" r="60%">
          <stop offset="62%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id={fadeId} maskUnits="userSpaceOnUse" x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]}>
          <rect x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]} fill={`url(#${fadeId}-g)`} />
        </mask>
      </defs>
      <g className="m-ctx" stroke="#C9B992" strokeWidth={sw * 0.7} fill="#EFE7D6" mask={`url(#${fadeId})`}>
        <use href="#srei-map-context" />
      </g>
      {showOutline && (
        <g className="m-focus" stroke="#1B2A4A" strokeWidth={sw * 1.2} fill="#F5EFE3" strokeLinejoin="round">
          {focusCountries.map((c) => (
            <path key={c.code} d={c.d} pathLength={1} className={drawCorridors ? "draw" : undefined} />
          ))}
        </g>
      )}
      {showCorridors && variant !== "fragment" &&
        corridors.map((c, i) => {
          const on = highlight === "all" || highlight === c.key;
          return (
            <g key={c.key} style={{ opacity: on ? 1 : 0.22, transition: "opacity 400ms var(--ease-out)" }}>
              <path
                className={`m-out ${drawCorridors ? "draw" : ""}`}
                data-k={c.key}
                d={c.out}
                pathLength={1}
                stroke="#1B2A4A"
                strokeWidth={1.4}
                strokeLinecap="round"
                style={{ "--dd": `${300 + i * 180}ms` } as CSSProperties}
              />
              {showReturn && (
                <path
                  className={`m-back ${drawCorridors ? "draw" : ""}`}
                  data-k={c.key}
                  d={c.back}
                  pathLength={1}
                  stroke="#B8964F"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  style={{ "--dd": `${900 + i * 180}ms` } as CSSProperties}
                />
              )}
              <g className="m-dest" data-k={c.key}>
                <circle cx={c.x} cy={c.y} r={4} fill="#1B2A4A" />
                <text
                  x={c.x + (c.key === "korea" ? -8 : 8)}
                  y={c.y - 8}
                  textAnchor={c.key === "korea" ? "end" : "start"}
                  fontSize={variant === "mini" ? 20 : 15}
                  fontFamily="var(--font-sans)"
                  letterSpacing="0.12em"
                  fill="#1B2A4A"
                >
                  {c.label.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
      {showCities && (
        <g className="m-cities">
          {origins.map((o, i) => (
            <g key={o.name} className="m-city pop" style={{ "--dd": `${200 + i * 70}ms` } as CSSProperties}>
              <circle cx={o.x} cy={o.y} r={variant === "fragment" ? 1.6 : 3.4} fill="#B8964F" />
              <circle cx={o.x} cy={o.y} r={variant === "fragment" ? 3.2 : 7} stroke="#B8964F" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
              {variant === "full" && o.name !== "Samarkand" && (
                <text
                  x={o.x + (["Samarkand", "Dushanbe", "Ashgabat"].includes(o.name) ? -10 : 10)}
                  y={o.y + (o.name === "Dushanbe" ? 16 : o.name === "Almaty" ? 14 : -6)}
                  textAnchor={["Samarkand", "Dushanbe", "Ashgabat"].includes(o.name) ? "end" : "start"}
                  fontSize={11}
                  fontFamily="var(--font-serif)"
                  fontStyle="italic"
                  fill="#3C4656"
                >
                  {o.name}
                </text>
              )}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
