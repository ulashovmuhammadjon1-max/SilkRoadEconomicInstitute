/**
 * UI strings, structured so Russian (ru) and Uzbek (uz) can be added later.
 * Content (briefs, papers) is not translated here. English only for now.
 */
export const dictionaries = {
  en: {
    nav: { papers: "Working Papers", briefs: "Briefs", forum: "Forum", about: "About", contact: "Contact" },
    search: { open: "Search", placeholder: "Search briefs and working papers" },
    share: { telegram: "Share to Telegram", copyLink: "Copy link", copied: "Copied" },
  },
} as const;

export type Locale = keyof typeof dictionaries;
export const defaultLocale: Locale = "en";
export const t = dictionaries[defaultLocale];
