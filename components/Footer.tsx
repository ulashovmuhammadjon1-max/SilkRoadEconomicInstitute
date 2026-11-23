import Link from "next/link";
import { isPlaceholder, nav, site } from "@/lib/site";
import { WithPlaceholders } from "./Placeholder";
import { CompassRose, RouteLine } from "./ornaments/Ornaments";

export function Footer() {
  const year = new Date().getFullYear();
  const emailReady = !isPlaceholder(site.email);
  const instaReady = !isPlaceholder(site.instagramUrl);
  return (
    <footer data-site-footer="" className="relative mt-32 overflow-hidden bg-navy text-cream">
      <RouteLine className="absolute inset-x-0 top-10 h-8 w-full text-gold/60" />
      <div className="page relative grid-12 gap-y-14 pb-10 pt-28">
        <div className="col-span-12 lg:col-span-6">
          <p className="dateline text-cream/60">Colophon</p>
          <p className="mt-4 max-w-[16ch] font-serif text-h1 leading-[1.02] text-cream">{site.name}</p>
          <p className="mt-6 max-w-md text-lead text-cream/75">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="col-span-6 lg:col-span-2 lg:col-start-8">
          <h2 className="dateline text-gold-light">Read</h2>
          <ul className="mt-5 space-y-3 text-ui">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 lg:col-span-3">
          <h2 className="dateline text-gold-light">Write to us</h2>
          <ul className="mt-5 space-y-3 text-ui text-cream/85">
            <li>
              {emailReady ? (
                <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                  {site.email}
                </a>
              ) : (
                <WithPlaceholders text={site.email} />
              )}
            </li>
            <li>
              <a href={site.telegramUrl} target="_blank" rel="noopener noreferrer" className="break-all hover:text-white">
                Telegram {site.telegramHandle}
              </a>
            </li>
            <li>
              {instaReady ? (
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram {site.instagramHandle}
                </a>
              ) : (
                <span>
                  Instagram <WithPlaceholders text={site.instagramHandle} />
                </span>
              )}
            </li>
            <li>
              <a href="/briefs/feed.xml" className="hover:text-white">
                RSS · Briefs
              </a>
              {" · "}
              <a href="/papers/feed.xml" className="hover:text-white">
                Papers
              </a>
            </li>
          </ul>
        </div>
        <CompassRose className="pointer-events-none absolute -bottom-40 right-[-90px] hidden w-72 text-gold/20 xl:block" draw delay={200} />
      </div>
      <div className="border-t border-white/10">
        <div className="page flex flex-col gap-2 py-6 text-xs text-cream/60 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>Set in Source Serif 4 and Inter · Map geography: Natural Earth (public domain)</p>
        </div>
      </div>
    </footer>
  );
}
