import Link from "next/link";
import type { CSSProperties } from "react";
import { CountThrough } from "../motion/CountThrough";
import { Glyph } from "../ornaments/Glyph";
import { EmblemBriefs, EmblemForum, EmblemPapers } from "../ornaments/Ornaments";

const pillars = [
  {
    title: "Research Forums",
    href: "/forum",
    cta: "The Winter 2026 call for papers",
    body: "Seasonal online forums where students present original research and economics professors judge it. The first edition is Winter 2026.",
    Emblem: EmblemForum,
  },
  {
    title: "Working Papers",
    href: "/papers",
    cta: "Browse the series",
    body: "The strongest student papers are published in our series as SREI Working Papers, with a permanent page and a citable number.",
    Emblem: EmblemPapers,
  },
  {
    title: "Weekly Briefs",
    href: "/briefs",
    cta: "Read the briefs",
    body: "Short, data-driven posts: one chart and around 250 words on remittances, exchange rates and labor migration.",
    Emblem: EmblemBriefs,
  },
];

export function Pillars() {
  return (
    <section id="pillars" aria-labelledby="pillars-title" className="page pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="grid-12">
        <p className="label col-span-12 lg:col-span-2">§ 03 · What we do</p>
        <h2 id="pillars-title" className="col-span-12 mt-3 max-w-[18ch] font-serif text-h1 text-navy lg:col-span-8 lg:mt-0" data-reveal="up">
          Three ways to take part
        </h2>
      </div>
      <ol className="mt-14 lg:mt-20">
        {pillars.map(({ title, href, cta, body, Emblem }, i) => (
          <li key={title} className="group relative">
            <div className="grow-line h-px bg-gold" aria-hidden="true" />
            <div className="grid-12 items-start gap-y-4 py-10 lg:py-14" data-reveal="up" style={{ "--d": `${i * 120}ms` } as CSSProperties}>
              <p className="col-span-3 font-serif text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.85] text-gold-dark lg:col-span-2 tnum">
                <CountThrough value={i + 1} delay={200 + i * 120} />
              </p>
              <h3 className="col-span-9 self-end font-serif text-h2 text-navy lg:col-span-3 lg:self-start lg:pt-2">{title}</h3>
              <div className="col-span-12 lg:col-span-4 lg:pt-3">
                <p className="text-lead text-ink-soft">{body}</p>
                <Link href={href} className="mt-5 inline-flex items-center gap-2 text-ui font-medium text-navy">
                  <span className="link">{cta}</span>
                  <Glyph name="arrow" className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="col-span-12 hidden text-gold-dark lg:col-span-2 lg:col-start-11 lg:block">
                <Emblem className="h-auto w-full" delay={300 + i * 120} />
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="h-px bg-gold" aria-hidden="true" />
    </section>
  );
}
