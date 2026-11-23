/**
 * Site-wide settings. Edit the values in square brackets once you have them.
 * Any value that still starts with "[" is shown on the site as a visible
 * placeholder instead of a broken link.
 */
export const site = {
  name: "Silk Road Economic Institute",
  shortName: "SREI",
  tagline: "Youth-led research on how migration shapes Central Asia's economy.",
  url: "https://silkroadecon.asia",
  locale: "en_US",

  email: "[email]",
  telegramUrl: "https://t.me/silkroad_economicinstitute",
  telegramHandle: "@silkroad_economicinstitute",
  instagramHandle: "[@handle]",
  // e.g. "https://www.instagram.com/yourhandle/"
  instagramUrl: "[Instagram URL]",
  submissionFormUrl: "[Google Form URL]",
} as const;

export const nav = [
  { href: "/papers", label: "Working Papers" },
  { href: "/briefs", label: "Briefs" },
  { href: "/forum", label: "Forum" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** True for values that are still "[placeholders]". */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith("[");
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
