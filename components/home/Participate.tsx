import Link from "next/link";
import type { CSSProperties } from "react";
import { features } from "@/lib/features";
import { Glyph } from "../ornaments/Glyph";

const AUDIENCES = [
  { title: "High school students", text: "Develop research skills and explore economic questions beyond the classroom.", icon: "M12 4 3 9l9 5 9-5-9-5ZM7 11.5V16c3 2 7 2 10 0v-4.5" },
  { title: "University students", text: "Present independent research and engage with other young economists.", icon: "M4 19V9l8-5 8 5v10M9 19v-6h6v6M4 19h16" },
  { title: "Academics & researchers", text: "Support student research through academic feedback, reviewing, and mentorship opportunities.", icon: "M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 6l2-2M19.5 9H22" },
];

export function Participate() {
  return (
    <section aria-labelledby="participate-title" className="bg-lavender-soft py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 gap-y-6">
          <p className="label col-span-12 !text-lavender-ink lg:col-span-3">07 / Who can participate?</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="participate-title" className="max-w-[16ch] font-serif text-h1 text-midnight" data-reveal="up">
              Built for curious minds, <em className="text-lavender-ink">wherever they are.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-lead text-ink-soft" data-reveal="up" style={{ "--d": "120ms" } as CSSProperties}>
              SREI Research Forums are open to high school and university students from any country.
            </p>
          </div>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((a, i) => (
            <li key={a.title} className="group rounded-[28px] bg-paper/80 p-7 transition-[transform,background-color] duration-500 hover:-translate-y-1 hover:bg-paper" data-reveal="rise" style={{ "--d": `${i * 120}ms` } as CSSProperties}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-lavender/20 text-lavender-ink transition-colors duration-500 group-hover:bg-lavender group-hover:text-paper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={a.icon} />
                </svg>
              </span>
              <h3 className="mt-6 font-mono text-label uppercase text-midnight">{a.title}</h3>
              <p className="mt-3 text-ink-soft">{a.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href={features.accounts ? "/signup" : "/forum"} className="btn btn-primary">
            Student Participation <Glyph name="arrow" className="arrow" />
          </Link>
          <Link href="/contact" className="btn border border-lavender-ink text-lavender-ink hover:bg-lavender-ink hover:text-paper">
            Academic Involvement <Glyph name="arrow" className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
