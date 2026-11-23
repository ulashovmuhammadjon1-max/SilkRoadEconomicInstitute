import Link from "next/link";
import type { CSSProperties } from "react";
import { getAllBriefs, getAllPapers, getForum } from "@/lib/content";
import { site } from "@/lib/site";
import { MapSvg } from "../map/MapSvg";
import { Magnetic } from "../motion/Magnetic";
import { RevealLines } from "../motion/RevealLines";
import { Glyph } from "../ornaments/Glyph";
import { WithPlaceholders } from "../Placeholder";

export function Hero() {
  const { current } = getForum();
  const papers = getAllPapers();
  const briefs = getAllBriefs();
  const latest = papers[0];
  const submitHref = current.registrationMode === "site" && current.registrationOpen ? "/forum/register" : "/forum";

  const facts: { k: string; v: React.ReactNode }[] = [
    { k: "Next forum", v: current.name },
    { k: "Dates", v: <WithPlaceholders text={current.dates} /> },
    { k: "Format", v: "Online, judged by economics professors" },
    ...(latest ? [{ k: "Latest paper", v: <Link href={`/papers/${latest.slug}`} className="link">Working Paper No. {latest.paperNumber}</Link> }] : []),
    { k: "Briefs published", v: <span className="tnum">{briefs.length}</span> },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="page grid-12 gap-y-12 pb-16 pt-10 md:pt-16 lg:pb-28 lg:pt-24">
        <div className="col-span-12 lg:col-span-8">
          <p className="label load-fade" style={{ "--d": "100ms" } as CSSProperties}>
            § 01 · {site.name}
          </p>
          <RevealLines
            id="hero-title"
            as="h1"
            text="Youth-led research on how migration shapes Central Asia’s economy."
            className="mt-6 max-w-[16ch] font-serif text-display text-navy"
            delay={150}
          />
          <p className="load-in mt-8 max-w-xl text-lead text-ink-soft" style={{ "--d": "650ms" } as CSSProperties}>
            A place for students to research remittances, exchange rates and labor migration, present their work to economics professors,
            and publish it.
          </p>
          <div className="load-in mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": "800ms" } as CSSProperties}>
            <Magnetic>
              <Link href="/papers" className="btn btn-primary">
                Read the research <Glyph name="arrow" className="arrow" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href={submitHref} className="btn btn-ghost">
                Submit your research <Glyph name="arrow" className="arrow" />
              </Link>
            </Magnetic>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-3 lg:col-start-10" aria-label="At a glance">
          <div className="rule-strong load-draw" style={{ "--d": "300ms" } as CSSProperties} />
          <dl className="divide-y divide-cream-300">
            {facts.map((f, i) => (
              <div key={f.k} className="load-left py-4" style={{ "--d": `${450 + i * 90}ms` } as CSSProperties}>
                <dt className="dateline">{f.k}</dt>
                <dd className="mt-1 font-serif text-lg leading-snug text-navy">{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="load-fade relative mt-6 hidden lg:block" style={{ "--d": "1000ms" } as CSSProperties}>
            <MapSvg variant="fragment" className="drift h-auto w-full text-navy" />
            <p className="dateline mt-2 text-[0.6rem]">Illustration · Central Asia</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
