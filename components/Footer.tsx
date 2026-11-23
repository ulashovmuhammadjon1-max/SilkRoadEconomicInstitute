import Link from "next/link";
import { isPlaceholder, nav, site } from "@/lib/site";
import { SmartLink } from "./SmartLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-navy text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-xl">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/80">{site.tagline}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/90 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">Follow &amp; contact</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/90">
            <li>
              <SmartLink href={site.telegramUrl} className="hover:text-white hover:underline">
                Telegram
              </SmartLink>
            </li>
            <li>
              <SmartLink
                href={site.instagramUrl}
                placeholderLabel={`Instagram ${site.instagramHandle}`}
                className="hover:text-white hover:underline"
              >
                Instagram {site.instagramHandle}
              </SmartLink>
            </li>
            <li>
              <SmartLink
                href={isPlaceholder(site.email) ? site.email : `mailto:${site.email}`}
                placeholderLabel={site.email}
                className="hover:text-white hover:underline"
              >
                {site.email}
              </SmartLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-cream/70">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
