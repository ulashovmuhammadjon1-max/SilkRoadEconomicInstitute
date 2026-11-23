import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PersonCard } from "@/components/PersonCard";
import { WithPlaceholders } from "@/components/Placeholder";
import { getJudges, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Why the Silk Road Economic Institute exists, and the people behind it.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const founderStory =
  "[Founder's story in 3–4 sentences: growing up around families supported by remittances; researching how exchange rates affect them]";

export default function AboutPage() {
  const team = getTeam();
  const judges = getJudges();

  return (
    <>
      <PageHeader eyebrow="About SREI" title="Research on migration, by the generation it shapes" />

      <div className="mx-auto max-w-4xl space-y-16 px-5 py-12 md:py-16">
        <section aria-labelledby="mission">
          <h2 id="mission" className="section-title">
            Mission
          </h2>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink/85">
            <p>
              Millions of Central Asian families depend on remittances: money sent home by relatives working in Russia, Korea,
              the Gulf and Europe. Young people in the region rarely get to study how migration and remittances shape their own
              economies.
            </p>
            <p>
              The Silk Road Economic Institute gives students a place to research these questions, present their work to
              economics professors, and publish it, through seasonal research forums, a working paper series and weekly
              data briefs.
            </p>
          </div>
        </section>

        <section aria-labelledby="story">
          <h2 id="story" className="section-title">
            Why we started
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/85">
            <WithPlaceholders text={founderStory} />
          </p>
        </section>

        {team.length > 0 && (
          <section aria-labelledby="team">
            <h2 id="team" className="section-title">
              Team
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </section>
        )}

        {judges.length > 0 && (
          <section aria-labelledby="judges">
            <h2 id="judges" className="section-title">
              Judges &amp; advisors
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {judges.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
