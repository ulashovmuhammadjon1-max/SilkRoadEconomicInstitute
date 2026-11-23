import Link from "next/link";
import { getForum, parseIsoDate } from "@/lib/content";
import { Marquee } from "../motion/Marquee";
import { Glyph } from "../ornaments/Glyph";
import { WithPlaceholders } from "../Placeholder";
import { Countdown } from "./Countdown";

/** Navy "call for papers" band: themes marquee + a real countdown (only with a real date). */
export function ForumBand() {
  const { current } = getForum();
  if (current.status === "closed") return null;
  const deadline = parseIsoDate(current.submissionDeadline);
  const deadlineRow = current.timeline.find((t) => /deadline/i.test(t.label));
  return (
    <section aria-labelledby="forum-band" className="relative overflow-hidden bg-navy py-20 text-cream lg:py-28">
      <div className="page grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-7">
          <p className="dateline text-gold-light">§ 06 · {current.status === "open" ? "Call for papers open" : "Upcoming forum"}</p>
          <h2 id="forum-band" className="mt-4 font-serif text-h1 text-cream" data-reveal="up">
            {current.name}
          </h2>
          <p className="mt-4 text-lead text-cream/80">
            <WithPlaceholders text={current.dates} /> · Online · Open to high school and university students from any country
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
          {deadline ? (
            <>
              <p className="dateline mb-3 text-cream/60">Submissions close in</p>
              <Countdown iso={deadline.toISOString()} />
            </>
          ) : (
            <p className="font-serif text-h3 text-cream">
              Deadline: <WithPlaceholders text={deadlineRow?.date ?? "[date]"} />
            </p>
          )}
        </div>
      </div>
      <div className="mt-14 border-y border-white/15 py-6">
        <Marquee items={current.themes} label={`Suggested themes: ${current.themes.join("; ")}.`} />
      </div>
      <div className="page mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/forum" className="btn btn-light">
          Call for papers <Glyph name="arrow" className="arrow" />
        </Link>
        <Link href="/forum#rubric" className="btn border border-cream/40 text-cream hover:border-cream">
          How entries are judged
        </Link>
      </div>
    </section>
  );
}
