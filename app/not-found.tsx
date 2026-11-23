import Link from "next/link";
import { Glyph } from "@/components/ornaments/Glyph";

/** 404: a small caravan wanders along a dotted route and loses its way (one 4-second pass, then stops; static under reduced motion). */
export default function NotFound() {
  return (
    <section className="page py-24 md:py-32">
      <p className="label">Error 404</p>
      <h1 className="mt-4 max-w-[16ch] font-serif text-h1 text-navy">This caravan has wandered off the route</h1>
      <p className="mt-5 max-w-measure text-lead text-ink-soft">The page you were looking for doesn&rsquo;t exist or has moved.</p>
      <div className="relative mt-14 h-24 w-full max-w-3xl" aria-hidden="true">
        <svg viewBox="0 0 600 80" className="h-full w-full text-gold" fill="none">
          <path id="lost" d="M10 60 C 90 10, 160 70, 240 40 S 380 0, 430 45 S 540 70, 560 20" stroke="currentColor" strokeWidth="1.3" strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx="560" cy="20" r="4" fill="currentColor" />
          <circle cx="10" cy="60" r="5" className="hidden fill-navy motion-reduce:block" />
          <g className="text-navy motion-reduce:hidden">
            <circle r="5" fill="currentColor">
              <animateMotion dur="4s" repeatCount="1" fill="freeze" rotate="auto">
                <mpath href="#lost" />
              </animateMotion>
            </circle>
          </g>
          <text x="566" y="14" fontSize="11" fill="#5B6475" fontFamily="var(--font-serif)" fontStyle="italic">
            ?
          </text>
        </svg>
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to the start <Glyph name="arrow" className="arrow" />
        </Link>
        <Link href="/papers" className="btn btn-ghost">
          Working papers
        </Link>
      </div>
    </section>
  );
}
