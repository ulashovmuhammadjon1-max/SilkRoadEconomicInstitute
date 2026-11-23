import type { CSSProperties } from "react";
import { FlowDiagram } from "./FlowDiagram";

export function Institute() {
  return (
    <section id="institute" aria-labelledby="institute-title" className="relative bg-cream py-24 lg:py-36">
      <div className="page">
        <div className="grid-12 gap-y-8">
          <p className="label col-span-12 lg:col-span-3">01 / The Institute</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="institute-title" className="max-w-[20ch] font-serif text-h1 text-midnight" data-reveal="up">
              An economic region deserves a generation of researchers <em className="text-turquoise-ink">studying it.</em>
            </h2>
            <div className="mt-10 grid gap-8 text-lead text-ink-soft md:grid-cols-2">
              <p data-reveal="up" style={{ "--d": "120ms" } as CSSProperties}>
                Millions of Central Asian households are connected to the global economy through migration. Money sent home by relatives working abroad
                influences consumption, education, investment, and economic stability.
              </p>
              <p data-reveal="up" style={{ "--d": "220ms" } as CSSProperties}>
                Yet the young people growing up in this region rarely have dedicated opportunities to investigate these questions themselves.{" "}
                <strong className="font-medium text-midnight">SREI exists to change that.</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-20 rounded-[28px] border border-cream-300 bg-paper p-6 md:p-10 lg:mt-28">
          <p className="dateline mb-8">How migration reaches the economy</p>
          <FlowDiagram />
        </div>
      </div>
    </section>
  );
}
