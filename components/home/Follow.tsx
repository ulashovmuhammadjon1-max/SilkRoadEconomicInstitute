import Link from "next/link";
import { features, turnstileSiteKey } from "@/lib/features";
import { isPlaceholder, site } from "@/lib/site";
import { NewsletterForm } from "../newsletter/NewsletterForm";
import { Glyph } from "../ornaments/Glyph";
import { RouteLine } from "../ornaments/Ornaments";

export function Follow() {
  const insta = !isPlaceholder(site.instagramUrl);
  return (
    <section aria-labelledby="follow-title" className="on-dark relative overflow-hidden bg-gradient-to-br from-deep via-midnight to-midnight py-24 text-cream lg:py-32">
      <RouteLine className="absolute inset-x-0 top-12 h-10 w-full text-gold/50" />
      <div className="page relative grid-12 gap-y-8">
        <p className="col-span-12 font-mono text-label uppercase text-turquoise-light lg:col-span-3">09 / Follow the institute</p>
        <div className="col-span-12 lg:col-span-9">
          <h2 id="follow-title" className="max-w-[16ch] font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.98] text-cream" data-reveal="up">
            Follow the research. <em className="text-turquoise-light">Join the conversation.</em>
          </h2>
          <p className="mt-6 max-w-xl text-lead text-cream/80">New research briefs, forum announcements and working papers appear first on our channels.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={site.telegramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
              <Glyph name="telegram" size={18} /> Telegram
            </a>
            {insta ? (
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn border border-cream/30 text-cream hover:bg-cream hover:text-midnight">
                Instagram
              </a>
            ) : (
              <span className="inline-flex min-h-12 items-center rounded-full border border-dashed border-cream/30 px-6 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-cream/70">Instagram · coming soon</span>
            )}
            <Link href="/contact" className="btn border border-cream/30 text-cream hover:bg-cream hover:text-midnight">
              Contact SREI <Glyph name="arrow" className="arrow" />
            </Link>
          </div>
          {features.newsletter && (
            <div className="mt-12 max-w-xl">
              <NewsletterForm tone="dark" id="follow-newsletter" turnstileSiteKey={features.turnstile ? turnstileSiteKey : ""} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
