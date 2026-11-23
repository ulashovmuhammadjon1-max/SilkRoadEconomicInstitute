import Link from "next/link";
import type { CSSProperties } from "react";
import { Magnetic } from "../motion/Magnetic";
import { RevealLines } from "../motion/RevealLines";
import { Glyph } from "../ornaments/Glyph";
import { HeroNetwork } from "./HeroNetwork";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative -mt-px overflow-hidden bg-midnight text-cream">
      {/* soft color fields */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[38rem] w-[38rem] rounded-full bg-turquoise/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-deep/60 blur-3xl" />

      <div className="page relative grid-12 min-h-[calc(100svh-var(--header-h))] content-center gap-y-10 py-14 lg:py-20">
        <div className="relative z-10 col-span-12 lg:col-span-6 lg:row-start-1">
          <p className="load-fade font-mono text-label uppercase text-turquoise-light" style={{ "--d": "100ms" } as CSSProperties}>
            Independent youth-led economic research
          </p>
          <RevealLines
            id="hero-title"
            as="h1"
            text="Understanding the economics of a moving region."
            accent={["moving", "region"]}
            className="mt-6 max-w-[13ch] font-serif text-display text-cream"
            delay={150}
          />
          <p className="load-in mt-8 max-w-xl text-lead text-cream/80" style={{ "--d": "600ms" } as CSSProperties}>
            Silk Road Economic Institute is a youth-led research initiative exploring how migration, remittances, and economic change shape Central Asia.
          </p>
          <div className="load-in mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": "750ms" } as CSSProperties}>
            <Magnetic>
              <Link href="/papers" className="btn btn-accent">
                Explore Our Research <Glyph name="arrow" className="arrow" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/forum" className="btn border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-midnight">
                Join the Research Forum <Glyph name="arrow" className="arrow" />
              </Link>
            </Magnetic>
          </div>
          <p className="load-fade mt-10 max-w-md font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.12em] text-cream/55" style={{ "--d": "950ms" } as CSSProperties}>
            Researching Central Asia. Connecting young economists. Exploring the economics of migration.
          </p>
        </div>

        <div className="relative col-span-12 self-center lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:-mr-[var(--margin)]">
          <div className="relative lg:w-[118%] lg:-translate-x-[6%]">
            <HeroNetwork className="h-auto w-full" />
            <p className="load-fade absolute right-2 top-2 rounded-full border border-turquoise/40 bg-midnight/70 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-turquoise-light backdrop-blur sm:right-6 sm:top-6" style={{ "--d": "1300ms" } as CSSProperties}>
              Research focus: Central Asia
            </p>
          </div>
          <p className="mt-2 text-right font-mono text-[0.62rem] uppercase tracking-[0.12em] text-cream/55">Illustrative network · not migration data</p>
        </div>
      </div>

      <a href="#institute" className="load-fade absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cream/60 hover:text-cream md:flex" style={{ "--d": "1500ms" } as CSSProperties}>
        Scroll
        <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-white/15">
          <span className="scroll-cue absolute left-0 top-0 h-4 w-px bg-turquoise" />
        </span>
      </a>
    </section>
  );
}
