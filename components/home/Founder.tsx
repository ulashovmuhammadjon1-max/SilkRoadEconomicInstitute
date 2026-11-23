import Link from "next/link";
import type { CSSProperties } from "react";
import { getAllPapers, getTeam } from "@/lib/content";
import { Glyph } from "../ornaments/Glyph";
import { WithPlaceholders } from "../Placeholder";

export function Founder() {
  const founder = getTeam()[0];
  const paper = getAllPapers().find((p) => p.paperNumber === 0);
  if (!founder) return null;
  return (
    <section aria-labelledby="founder-title" className="bg-paper py-24 lg:py-32">
      <div className="page grid-12 gap-y-12">
        <p className="label col-span-12 lg:col-span-3">08 / Founder</p>
        <div className="col-span-12 lg:col-span-9">
          <h2 id="founder-title" className="max-w-[18ch] font-serif text-h1 text-midnight" data-reveal="up">
            An initiative built around <em className="text-turquoise-ink">a research question.</em>
          </h2>
        </div>

        <div className="col-span-12 sm:col-span-5 lg:col-span-3 lg:col-start-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-cream" data-reveal="wipe">
            {founder.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={founder.photo} alt={`Portrait of ${founder.name}`} className="settle h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 border border-dashed border-turquoise/50 [border-radius:inherit]" role="img" aria-label={`Portrait placeholder for ${founder.name}`}>
                <span className="font-serif text-[5rem] leading-none text-midnight/70">MU</span>
                <span className="placeholder text-xs">[Portrait photo]</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 sm:col-span-7 lg:col-span-6">
          <p className="font-serif text-h2 text-midnight">{founder.name}</p>
          <p className="mt-1 font-mono text-label uppercase text-turquoise-ink">{founder.role}</p>
          {founder.affiliation && <p className="mt-3 text-ink-soft">High school senior · {founder.affiliation}</p>}
          <p className="mt-6 text-lead text-ink-soft">
            SREI grew out of an interest in understanding how migration affects the economic lives of Central Asian households: what happens to a
            family&rsquo;s spending when the exchange rate moves, and why the answer differs between countries.
          </p>
          {founder.interests && founder.interests.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Research interests">
              {founder.interests.map((t) => (
                <li key={t} className="rounded-full border border-ink/15 px-3 py-1 text-sm text-ink">
                  {t}
                </li>
              ))}
            </ul>
          )}
          {paper && (
            <Link href={`/papers/${paper.slug}`} className="group mt-8 flex items-start gap-4 rounded-2xl border border-gold/40 bg-[#F7EEDB] p-5 transition-colors hover:border-gold" data-reveal="up" style={{ "--d": "150ms" } as CSSProperties}>
              <span className="font-mono text-label uppercase text-gold-dark">Published</span>
              <span className="flex-1">
                <span className="block font-serif text-lg leading-snug text-midnight">
                  <WithPlaceholders text={paper.title} />
                </span>
                <span className="mt-1 block text-sm text-ink-muted">{paper.originalPublication ?? "TIJER, 2026"}</span>
              </span>
              <Glyph name="arrow" className="mt-1 shrink-0 text-gold-dark transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
