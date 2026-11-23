import Image from "next/image";
import Link from "next/link";
import { BriefCard } from "@/components/BriefCard";
import { Button } from "@/components/Button";
import { ForumBanner } from "@/components/ForumBanner";
import { PaperCard } from "@/components/PaperCard";
import { RouteDivider } from "@/components/RouteDivider";
import { getAllBriefs, getAllPapers } from "@/lib/content";
import { site } from "@/lib/site";

const pillars = [
  {
    title: "Research Forums",
    href: "/forum",
    body: "Seasonal online forums where students present original research and economics professors judge it. The first edition is Winter 2026.",
  },
  {
    title: "Working Papers",
    href: "/papers",
    body: "The strongest student papers are published in our series as SREI Working Papers, with a permanent page and a citable number.",
  },
  {
    title: "Weekly Briefs",
    href: "/briefs",
    body: "Short, data-driven posts: one chart and around 250 words on remittances, exchange rates and labor migration.",
  },
];

export default function HomePage() {
  const briefs = getAllBriefs().slice(0, 3);
  const papers = getAllPapers().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-16 md:flex-row md:items-center md:gap-14 md:py-24">
          <Image src="/logo.png" alt={`${site.name} logo`} width={160} height={160} priority className="h-24 w-24 md:h-40 md:w-40" />
          <div>
            <p className="eyebrow">{site.name}</p>
            <h1 className="mt-3 max-w-3xl font-serif text-[2.1rem] leading-[1.15] text-navy md:text-6xl">
              Youth-led research on how migration shapes Central Asia&rsquo;s economy.
            </h1>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/papers">Read the research</Button>
              <Button href="/forum" variant="secondary">
                Submit your research
              </Button>
            </div>
          </div>
        </div>
      </section>

      <RouteDivider className="my-2" />

      {/* Mission */}
      <section aria-labelledby="mission" className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2 id="mission" className="section-title mt-2">
              Studying the economics that shape our own families
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-ink/85">
            <p>
              Millions of Central Asian families depend on remittances: money sent home by relatives working in Russia, Korea,
              the Gulf and Europe. Yet young people in the region rarely get to study how migration and remittances shape
              their own economies.
            </p>
            <p>
              SREI gives students a place to research these questions, present their work to economics professors, and publish
              it.{" "}
              <Link href="/about" className="text-navy underline decoration-gold underline-offset-4">
                More about us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section aria-labelledby="what-we-do" className="border-y border-cream-300 bg-cream-50">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <p className="eyebrow">What we do</p>
          <h2 id="what-we-do" className="section-title mt-2">
            Three ways to take part
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <li key={p.title} className="flex flex-col border-t-2 border-gold pt-5">
                <span className="font-serif text-sm text-gold-dark">0{i + 1}</span>
                <h3 className="mt-1 font-serif text-2xl text-navy">{p.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink/80">{p.body}</p>
                <Link href={p.href} className="mt-5 text-sm font-medium text-navy underline decoration-gold underline-offset-4">
                  Explore {p.title.toLowerCase()} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Latest briefs */}
      <section aria-labelledby="latest-briefs" className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Weekly briefs</p>
            <h2 id="latest-briefs" className="section-title mt-2">
              Latest briefs
            </h2>
          </div>
          <Link href="/briefs" className="text-sm font-medium text-navy underline decoration-gold underline-offset-4">
            All briefs <span aria-hidden="true">→</span>
          </Link>
        </div>
        {briefs.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {briefs.map((b) => (
              <BriefCard key={b.slug} brief={b} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink/70">The first brief is on its way.</p>
        )}
      </section>

      {/* Latest papers */}
      <section aria-labelledby="latest-papers" className="mx-auto max-w-6xl px-5 pb-14 md:pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Working paper series</p>
            <h2 id="latest-papers" className="section-title mt-2">
              Latest working papers
            </h2>
          </div>
          <Link href="/papers" className="text-sm font-medium text-navy underline decoration-gold underline-offset-4">
            All working papers <span aria-hidden="true">→</span>
          </Link>
        </div>
        {papers.length > 0 ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {papers.map((p) => (
              <PaperCard key={p.slug} paper={p} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink/70">The first working papers will be published after the Winter 2026 forum.</p>
        )}
      </section>

      <ForumBanner />
    </>
  );
}
