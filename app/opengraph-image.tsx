import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: site.shortName, title: site.tagline });
}
