"use client";

import * as m from "motion/react-m";
import type { CSSProperties } from "react";
import { ease } from "@/lib/motion";

const STAGES = [
  { k: "Migration", text: "Workers leave for jobs in Russia, South Korea, the Gulf and Europe.", icon: "M4 18c4-1 6-6 9-9M13 9l1 4 4-1M5 6h.01M20 20H4", color: "#16A6A1" },
  { k: "Remittances", text: "Part of what they earn is sent home to their families.", icon: "M4 8h16v9H4zM8 12.5h.01M16 12.5h.01M12 10.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM7 5h10", color: "#D8A64A" },
  { k: "Household economics", text: "That money shapes spending, schooling, savings and debt.", icon: "M4 11 12 4l8 7M6 10v9h12v-9M10 19v-5h4v5", color: "#E58B72" },
  { k: "Regional development", text: "Added up, it influences exchange rates, inequality and growth.", icon: "M4 20V10M10 20V5M16 20v-8M20 20H3M4 10l6-5 6 7 4-4", color: "#9A91B8" },
];

/** MIGRATION → REMITTANCES → HOUSEHOLD ECONOMICS → REGIONAL DEVELOPMENT. Text is always visible; connectors and icons animate. */
export function FlowDiagram() {
  return (
    <ol className="relative grid gap-6 md:grid-cols-4 md:gap-0">
      {STAGES.map((s, i) => (
        <li key={s.k} className="relative md:pr-8" data-reveal="up" style={{ "--d": `${i * 140}ms` } as CSSProperties}>
          <div className="flex items-center gap-3">
            <m.span
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border"
              style={{ borderColor: s.color, color: s.color }}
              initial={{ scale: 0.6, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.14, ease: ease.out }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={s.icon} />
              </svg>
            </m.span>
            {i < STAGES.length - 1 && (
              <svg className="hidden h-3 flex-1 md:block" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <m.path
                  d="M0 6H96M90 1l6 5-6 5"
                  stroke={STAGES[i + 1].color}
                  strokeWidth="1.4"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.9, delay: 0.35 + i * 0.2, ease: ease.inOut }}
                />
              </svg>
            )}
          </div>
          <p className="mt-5 font-mono text-label uppercase text-ink">
            <span className="text-ink-muted">0{i + 1} </span>
            {s.k}
          </p>
          <p className="mt-2 max-w-[24ch] text-ink-soft">{s.text}</p>
          {i < STAGES.length - 1 && (
            <span aria-hidden="true" className="mt-4 block h-6 w-px bg-cream-400 md:hidden" />
          )}
        </li>
      ))}
    </ol>
  );
}
