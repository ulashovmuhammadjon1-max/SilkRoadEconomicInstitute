import settings from "@/content/site.json";
import { t } from "./i18n";

/**
 * Site-wide settings. The editable values (email, links, founder's story) live
 * in content/site.json, so they can be changed from /admin. Any value that
 * still starts with "[" is shown as a visible placeholder, not a broken link.
 */
export const site = {
  name: "Silk Road Economic Institute",
  shortName: "SREI",
  tagline: "Youth-led research on how migration shapes Central Asia's economy.",
  url: "https://silkroadecon.asia",
  locale: "en_US",
  email: settings.email,
  telegramUrl: settings.telegramUrl,
  telegramHandle: settings.telegramHandle,
  instagramHandle: settings.instagramHandle,
  instagramUrl: settings.instagramUrl,
  submissionFormUrl: settings.submissionFormUrl,
  founderStory: settings.founderStory,
};

export const nav = [
  { href: "/papers", label: t.nav.papers },
  { href: "/briefs", label: t.nav.briefs },
  { href: "/forum", label: t.nav.forum },
  { href: "/about", label: t.nav.about },
  { href: "/contact", label: t.nav.contact },
] as const;

/** True for values that are still "[placeholders]" or empty. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith("[");
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
