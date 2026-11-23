import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Glyph } from "../ornaments/Glyph";

function ForumArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" fill="none" aria-hidden="true">
      <rect x="40" y="16" width="160" height="92" rx="8" fill="#101B33" />
      <g className="pa-bars">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={62 + i * 24} y={40} width="14" height="54" rx="2" fill="#16A6A1" style={{ "--i": i, transformOrigin: `${69 + i * 24}px 94px` } as CSSProperties} opacity={0.5 + i * 0.1} />
        ))}
      </g>
      <path d="M58 32h50" stroke="#5CCFC9" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 108v14M100 124h40" stroke="#101B33" strokeWidth="3" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={i} cx={50 + i * 23} cy={140} r="5" fill={i === 3 ? "#16A6A1" : "#C8BA9B"} className="pa-head" style={{ "--i": i } as CSSProperties} />
      ))}
    </svg>
  );
}

function PapersArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" fill="none" aria-hidden="true">
      {[2, 1, 0].map((i) => (
        <g key={i} className="pa-paper" style={{ "--i": i } as CSSProperties}>
          <rect x={78} y={12} width="88" height="122" rx="4" fill={i === 0 ? "#FFFFFF" : i === 1 ? "#F7F4EC" : "#EDE7D9"} stroke="#292D35" strokeOpacity="0.25" />
          {i === 0 && (
            <>
              <rect x={78} y={12} width="88" height="6" fill="#D8A64A" />
              <text x="88" y="38" fontSize="7" className="font-mono" fill="#76520F" letterSpacing="0.8">SREI WP No. 0</text>
              <path d="M88 50h66M88 58h60M88 66h52" stroke="#292D35" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M88 86h66M88 92h66M88 98h50M88 104h62M88 110h44" stroke="#292D35" strokeOpacity="0.22" strokeWidth="1.4" strokeLinecap="round" />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

function BriefsArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" fill="none" aria-hidden="true">
      <rect x="20" y="14" width="200" height="122" rx="10" fill="#FFFFFF" stroke="#292D35" strokeOpacity="0.12" />
      <path d="M38 118h164M38 118V30" stroke="#292D35" strokeOpacity="0.25" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={48 + i * 22} y={118 - (24 + ((i * 37) % 50))} width="12" height={24 + ((i * 37) % 50)} rx="2" fill="#E58B72" opacity="0.35" className="pa-col" style={{ "--i": i, transformOrigin: `${54 + i * 22}px 118px` } as CSSProperties} />
      ))}
      <path d="M44 96 C 70 90, 82 70, 104 74 S 140 52, 160 56 S 186 34, 200 38" pathLength={1} className="pa-line" stroke="#A9472F" strokeWidth="2.4" strokeLinecap="round" />
      <text x="40" y="26" fontSize="7" className="font-mono" fill="#5A6170" letterSpacing="0.6">TEMPLATE · NOT DATA</text>
    </svg>
  );
}

const PILLARS: { no: string; title: string; text: string; cta: string; href: string; accent: string; ink: string; bg: string; art: ReactNode }[] = [
  {
    no: "01",
    title: "Research Forums",
    text: "Seasonal research forums where students present original economic research, engage with academic reviewers, and receive constructive feedback.",
    cta: "Explore Forums",
    href: "/forum",
    accent: "#16A6A1",
    ink: "text-turquoise-ink",
    bg: "bg-[#E6F4F3]",
    art: <ForumArt />,
  },
  {
    no: "02",
    title: "Working Papers",
    text: "A publication platform for selected student research examining migration, remittances, and the changing economies of Central Asia.",
    cta: "Read Working Papers",
    href: "/papers",
    accent: "#D8A64A",
    ink: "text-gold-dark",
    bg: "bg-[#F7EEDB]",
    art: <PapersArt />,
  },
  {
    no: "03",
    title: "Weekly Briefs",
    text: "Short, data-driven publications explaining important developments in migration, exchange rates, and household economics.",
    cta: "Explore Briefs",
    href: "/briefs",
    accent: "#E58B72",
    ink: "text-coral-ink",
    bg: "bg-[#FBE9E3]",
    art: <BriefsArt />,
  },
];

export function Pillars() {
  return (
    <section id="pillars" aria-labelledby="pillars-title" className="bg-cream-50 py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 gap-y-6">
          <p className="label col-span-12 lg:col-span-3">02 / What we do</p>
          <h2 id="pillars-title" className="col-span-12 max-w-[16ch] font-serif text-h1 text-midnight lg:col-span-9" data-reveal="up">
            Three ways to advance <em className="text-turquoise-ink">economic research.</em>
          </h2>
        </div>
        <ul className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <li key={p.no} data-reveal="rise" style={{ "--d": `${i * 120}ms` } as CSSProperties}>
              <Link
                href={p.href}
                className="pillar group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-cream-300 bg-paper p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_30px_60px_-30px_rgba(16,27,51,0.35)] focus-visible:-translate-y-1.5 md:p-8"
                style={{ "--accent": p.accent } as CSSProperties}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.25] transition-transform duration-700 ease-out group-hover:scale-x-100" style={{ background: p.accent }} />
                <div className="flex items-baseline justify-between">
                  <span className={`font-mono text-sm ${p.ink}`}>{p.no}</span>
                  <span className={`font-mono text-[0.65rem] uppercase tracking-[0.14em] ${p.ink}`}>Pillar</span>
                </div>
                <div className={`mt-6 aspect-[16/10] overflow-hidden rounded-2xl ${p.bg} p-4`}>{p.art}</div>
                <h3 className="mt-7 font-serif text-h2 text-midnight">{p.title}</h3>
                <p className="mt-3 flex-1 text-ink-soft">{p.text}</p>
                <span className={`mt-7 inline-flex items-center gap-2 text-ui font-medium ${p.ink}`}>
                  {p.cta} <Glyph name="arrow" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
