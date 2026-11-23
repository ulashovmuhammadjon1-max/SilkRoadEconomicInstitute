import type { CSSProperties } from "react";
import { MapSvg } from "../map/MapSvg";

const QUESTIONS = [
  { topic: "Labor migration", q: "How do labor markets in Russia, South Korea, the Gulf and Europe shape decisions made at home?" },
  { topic: "Remittance dependence", q: "What changes in an economy when a large share of household income arrives from abroad?" },
  { topic: "Household welfare", q: "How does money from relatives change spending on food, schooling, housing and savings?" },
  { topic: "Currency fluctuations", q: "When exchange rates move, what happens to the value of migrant income back home?" },
  { topic: "Regional differences", q: "Why do some regions and families depend on migration more than others?" },
  { topic: "International labor markets", q: "How do policies abroad and at home affect the families of workers who migrate?" },
];

export function WhyCentralAsia() {
  return (
    <section aria-labelledby="why-title" className="bg-cream py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 gap-y-6">
          <p className="label col-span-12 lg:col-span-3">06 / Why Central Asia?</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="why-title" className="max-w-[18ch] font-serif text-h1 text-midnight" data-reveal="up">
              An interconnected region. <em className="text-turquoise-ink">A shared economic story.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-lead text-ink-soft" data-reveal="up" style={{ "--d": "120ms" } as CSSProperties}>
              Central Asian economies are tied to international labor markets, to money moving across borders, and to changing exchange rates. Those
              connections reach directly into household budgets. These are the questions SREI wants young researchers to investigate.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-7">
            <div className="rounded-[28px] border border-cream-300 bg-paper p-4 md:p-6">
              <MapSvg className="h-auto w-full" drawCorridors />
            </div>
            <figcaption className="dateline mt-3">Illustration: main labor-migration corridors · not to scale, not data</figcaption>
          </figure>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {QUESTIONS.map((x, i) => (
              <li key={x.topic} className="border-l-2 border-turquoise/50 pl-4" data-reveal="left" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-turquoise-ink">{x.topic}</p>
                <p className="mt-1 text-ink">{x.q}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
