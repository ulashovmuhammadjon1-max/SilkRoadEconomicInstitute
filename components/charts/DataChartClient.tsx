"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type Series = { key: string; label: string; color?: string };
export type ChartProps = {
  type?: "line" | "bar" | "area";
  data: Record<string, string | number | null>[];
  x: string;
  series: Series[];
  yLabel?: string;
  height?: number;
  /** Template mode: no numbers, no tooltip. Used for illustrative shapes only. */
  template?: boolean;
};

export const CHART_COLORS = ["#16A6A1", "#D8A64A", "#E58B72", "#9A91B8", "#193B64"];

/** Reusable, responsive, interactive chart (line / bar / area, one or many series). */
export default function DataChartClient({ type = "line", data, x, series, yLabel, height = 320, template = false }: ChartProps) {
  const colored = series.map((s, i) => ({ ...s, color: s.color ?? CHART_COLORS[i % CHART_COLORS.length] }));
  const common = { data, margin: { top: 10, right: 12, bottom: 4, left: template ? -20 : 0 } };
  const axes = (
    <>
      <CartesianGrid stroke="#292D35" strokeOpacity={0.08} vertical={false} />
      <XAxis dataKey={x} tick={template ? false : { fill: "#5A6170", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#292D35", strokeOpacity: 0.25 }} />
      <YAxis
        tick={template ? false : { fill: "#5A6170", fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        width={template ? 20 : 56}
        label={yLabel && !template ? { value: yLabel, angle: -90, position: "insideLeft", fill: "#5A6170", fontSize: 12 } : undefined}
      />
      {!template && (
        <Tooltip
          contentStyle={{ background: "#101B33", border: "none", borderRadius: 12, color: "#F7F4EC", fontSize: 13 }}
          labelStyle={{ color: "#5CCFC9", fontFamily: "var(--font-mono)" }}
          cursor={{ stroke: "#16A6A1", strokeOpacity: 0.3 }}
        />
      )}
      {colored.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
    </>
  );
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart {...common}>
            {axes}
            {colored.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} animationDuration={1200} />
            ))}
          </BarChart>
        ) : type === "area" ? (
          <AreaChart {...common}>
            {axes}
            {colored.map((s) => (
              <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.15} strokeWidth={2} animationDuration={1400} />
            ))}
          </AreaChart>
        ) : (
          <LineChart {...common}>
            {axes}
            {colored.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2.4} dot={false} activeDot={{ r: 5 }} animationDuration={1400} />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
