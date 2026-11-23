import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Glyph, type GlyphName } from "@/components/ornaments/Glyph";
import { PageHeader } from "@/components/PageHeader";
import { WithPlaceholders } from "@/components/Placeholder";
import { isPlaceholder, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Silk Road Economic Institute by email, Telegram or Instagram.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  const rows: { k: string; glyph: GlyphName; href?: string; text: string; note: string }[] = [
    { k: "Email", glyph: "mail", href: isPlaceholder(site.email) ? undefined : `mailto:${site.email}?subject=${encodeURIComponent("Hello SREI")}`, text: site.email, note: "Forum questions, judging, partnerships" },
    { k: "Telegram", glyph: "telegram", href: site.telegramUrl, text: site.telegramHandle, note: "News, new briefs and forum updates" },
    { k: "Instagram", glyph: "share", href: isPlaceholder(site.instagramUrl) ? undefined : site.instagramUrl, text: site.instagramHandle, note: "Charts and announcements" },
  ];
  return (
    <>
      <PageHeader section="08" eyebrow="Contact" title="Write to us">
        Questions about the forum, an idea for a brief, or interested in judging? We&rsquo;d like to hear from you.
      </PageHeader>
      <section className="page py-12" aria-label="Ways to reach us">
        <ul className="border-t-2 border-navy">
          {rows.map((r, i) => (
            <li key={r.k} className="group border-b border-cream-300" data-reveal="up" style={{ "--d": `${i * 100}ms` } as CSSProperties}>
              <div className="grid-12 items-center gap-y-2 py-8">
                <p className="dateline col-span-12 flex items-center gap-3 sm:col-span-3 lg:col-span-2">
                  <Glyph name={r.glyph} size={18} className="text-gold-dark" /> {r.k}
                </p>
                <p className="col-span-12 font-serif text-h2 text-navy sm:col-span-9 lg:col-span-6">
                  {r.href ? (
                    <a
                      href={r.href}
                      {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="break-all bg-[linear-gradient(theme(colors.gold.DEFAULT),theme(colors.gold.DEFAULT))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 hover:bg-[length:100%_2px] focus-visible:bg-[length:100%_2px]"
                    >
                      {r.text}
                    </a>
                  ) : (
                    <WithPlaceholders text={r.text} />
                  )}
                </p>
                <p className="col-span-12 text-ink-muted lg:col-span-4 lg:text-right">{r.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
