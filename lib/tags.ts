/** The brief topics readers can filter by. Add a tag here to give it a filter page. */
export const BRIEF_TAGS = ["Remittances", "Exchange Rates", "Labor Migration", "Household Economics", "Policy"] as const;

export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToTag(slug: string): string | undefined {
  return BRIEF_TAGS.find((t) => tagToSlug(t) === slug);
}
