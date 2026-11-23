import { getForum } from "@/lib/content";
import { Button } from "./Button";
import { WithPlaceholders } from "./Placeholder";

/** Shown on the home page while the current forum is upcoming or open. */
export function ForumBanner() {
  const { current } = getForum();
  if (current.status === "closed") return null;
  return (
    <section aria-labelledby="forum-banner" className="mx-auto max-w-6xl px-5">
      <div className="relative overflow-hidden rounded-sm bg-navy px-6 py-10 text-cream md:px-12 md:py-12">
        <svg aria-hidden="true" className="pointer-events-none absolute -right-10 bottom-0 h-32 w-[420px] text-gold/40" viewBox="0 0 420 120" fill="none">
          <path d="M0 100 C 80 60, 160 110, 240 70 S 360 30, 420 50" stroke="currentColor" strokeDasharray="1 8" strokeLinecap="round" strokeWidth="2" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
          {current.status === "open" ? "Call for papers open" : "Upcoming forum"}
        </p>
        <h2 id="forum-banner" className="mt-3 font-serif text-2xl md:text-4xl">
          {current.name}
        </h2>
        <p className="mt-3 text-cream/90">
          <WithPlaceholders text={current.dates} /> · Online
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/forum" variant="light">
            Call for papers
          </Button>
        </div>
      </div>
    </section>
  );
}
