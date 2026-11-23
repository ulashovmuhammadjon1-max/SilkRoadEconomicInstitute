import fs from "node:fs";
import path from "node:path";
import { LazyChart } from "./LazyChart";

/**
 * Chart for briefs. Use in MDX:
 *
 * <DataChart
 *   src="/briefs/data/my-data.csv"   // CSV in public/briefs/data/, first row = column names
 *   type="line"                      // line | bar | area
 *   x="quarter"                      // column for the x-axis
 *   series="uzbekistan,kazakhstan"   // one or more columns to plot
 *   labels="Uzbekistan,Kazakhstan"   // optional legend names
 *   yLabel="USD million"
 *   title="Chart title"
 *   source="Source: Central Bank of Uzbekistan, 2026"
 *   summary="One sentence describing what the chart shows (for screen readers)"
 * />
 *
 * The CSV is read at build time; a missing file or column fails the build with a clear message.
 */
export function DataChart({
  src,
  type = "line",
  x,
  series,
  labels,
  yLabel,
  title,
  source,
  summary,
}: {
  src: string;
  type?: "line" | "bar" | "area";
  x: string;
  series: string;
  labels?: string;
  yLabel?: string;
  title?: string;
  source?: string;
  summary: string;
}) {
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!fs.existsSync(file)) throw new Error(`[DataChart] data file not found: public${src}`);
  const [head, ...rows] = fs.readFileSync(file, "utf8").trim().split(/\r?\n/).map((l) => l.split(",").map((c) => c.trim()));
  const keys = series.split(",").map((s) => s.trim());
  for (const k of [x, ...keys]) if (!head.includes(k)) throw new Error(`[DataChart] column "${k}" not in ${src} (has: ${head.join(", ")})`);
  const names = labels ? labels.split(",").map((s) => s.trim()) : keys;
  const data = rows.map((r) =>
    Object.fromEntries(head.map((h, i) => [h, h === x ? r[i] : r[i] === "" || r[i] === undefined ? null : Number(r[i])])),
  );
  return (
    <figure className="not-prose my-12 rounded-[24px] border border-ink/10 bg-paper p-5 md:-mx-8 md:p-7" data-reveal="up">
      {title && <figcaption className="mb-4 font-serif text-h3 text-midnight">{title}</figcaption>}
      <LazyChart type={type} data={data} x={x} series={keys.map((k, i) => ({ key: k, label: names[i] ?? k }))} yLabel={yLabel} summary={summary} />
      {source && <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">{source}</p>}
    </figure>
  );
}
