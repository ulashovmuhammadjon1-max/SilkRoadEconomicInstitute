import { ForumBand } from "@/components/home/ForumBand";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { LatestBriefs } from "@/components/home/LatestBriefs";
import { LatestPapers } from "@/components/home/LatestPapers";
import { MapScene } from "@/components/home/MapScene";
import { Pillars } from "@/components/home/Pillars";
import { RouteLine } from "@/components/ornaments/Ornaments";

export default function HomePage() {
  return (
    <>
      <Intro />
      <Hero />
      <div className="page" aria-hidden="true">
        <RouteLine className="h-8 w-full" />
      </div>
      <Mission />
      <MapScene />
      <Pillars />
      <LatestBriefs />
      <LatestPapers />
      <ForumBand />
    </>
  );
}

function Mission() {
  return (
    <section aria-labelledby="mission-title" className="page py-24 lg:py-36">
      <div className="grid-12 gap-y-6">
        <p className="label col-span-12 lg:col-span-2">§ 02 · Mission</p>
        <div className="col-span-12 lg:col-span-7 lg:col-start-4">
          <h2 id="mission-title" className="sr-only">
            Mission
          </h2>
          <p className="font-serif text-h2 leading-[1.25] text-navy" data-reveal="up">
            Millions of Central Asian families depend on remittances: money sent home by relatives working in Russia, Korea, the Gulf and Europe.
          </p>
          <p className="mt-8 max-w-measure text-lead text-ink-soft" data-reveal="up" style={{ "--d": "150ms" } as React.CSSProperties}>
            Young people in the region rarely get to study how migration and remittances shape their own economies. SREI gives students a place
            to research these questions, present their work to economics professors, and publish it.
          </p>
        </div>
      </div>
    </section>
  );
}
