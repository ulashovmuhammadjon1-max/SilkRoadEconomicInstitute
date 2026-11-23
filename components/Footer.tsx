import Link from "next/link";
import { isPlaceholder, nav, site } from "@/lib/site";
import { WithPlaceholders } from "./Placeholder";
import { CompassRose, RouteLine } from "./ornaments/Ornaments";

export function Footer() {
  const year = new Date().getFullYear();
  const emailReady = !isPlaceholder(site.email);
  const instaReady = !isPlaceholder(site.instagramUrl);
  return (
    <footer data-site-footer="" className="on-dark relative mt-24 overflow-hidden border-t border-white/10 bg-midnight text-cream">
      <RouteLine className="absolute inset-x-0 top-10 h-8 w-full text-turquoise/50" />
      <div className="page relative grid-12 gap-y-14 pb-10 pt-28">
        <div className="col-span-12 lg:col-span-6">
          <p className="font-mono text-label uppercase text-turquoise-light">Silk Road Economic Institute</p>
          <p className="mt-4 max-w-[14ch] font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.98] text-cream">{site.name}</p>
          <p className="mt-6 max-w-md text-lead text-cream/75">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="col-span-6 lg:col-span-2 lg:col-start-8">
          <h2 className="font-mono text-label uppercase text-gold">Navigate</h2>
          <ul className="mt-5 space-y-3 text-ui">
            {[{ href: "/", label: "Home" }, ...nav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 lg:col-span-3">
          <h2 className="font-mono text-label uppercase text-gold">Connect</h2>
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
        <CompassRose className="pointer-events-none absolute -bottom-40 right-[-90px] hidden w-72 text-turquoise/20 xl:block" draw delay={200} />
      </div>
      <div className="border-t border-white/10">
        <div className="page flex flex-col gap-2 py-6 text-xs text-cream/60 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>An independent youth-led research initiative · Not affiliated with any government, university or international organization · Map data: Natural Earth</p>
        </div>
      </div>
    </footer>
  );
}
