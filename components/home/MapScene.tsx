import { MapDefs, MapSvg } from "../map/MapSvg";
import { MapScrub } from "./MapScrub";

export const MAP_STEPS = [
  {
    k: "outline",
    title: "Central Asia",
    text: "Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan and Turkmenistan: the economies this institute studies.",
  },
  {
    k: "cities",
    title: "Families at home",
    text: "Millions of Central Asian families depend on remittances: money sent home by relatives working abroad.",
  },
  {
    k: "out",
    title: "Work abroad",
    text: "Those relatives work in Russia, South Korea, the Gulf and Europe.",
  },
  {
    k: "back",
    title: "Money home",
    text: "What they send back shapes household spending, exchange rates and regions. These are the questions our students research.",
  },
] as const;

const CAPTION = "Illustration: main labor-migration corridors. Not to scale; not data.";
const ALT =
  "Illustrated map: Central Asia (Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan) with cities Tashkent, Samarkand, Bishkek, Dushanbe, Almaty and Ashgabat. Lines run from the region to Russia, South Korea, the Gulf and Europe, and gold lines return, illustrating remittances sent home.";

/**
 * The Silk Road map scene. Desktop (≥1024px, fine pointer, motion allowed):
 * a pinned, scroll-scrubbed sequence (MapScrub, GSAP lazy-loaded).
 * Mobile: four stacked frames that draw as they enter.
 * Without JS or with reduced motion: the final, fully composed map.
 */
export function MapScene() {
  return (
    <section aria-labelledby="map-title" className="relative">
      <MapDefs />
      <a href="#pillars" className="skip-link">
        Skip the map illustration
      </a>
      <h2 id="map-title" className="sr-only">
        Where the money comes from: an illustrated map
      </h2>
      <p className="sr-only">{ALT}</p>

      {/* Desktop: pinned scrub scene */}
      <div className="hidden lg:block">
        <MapScrub steps={MAP_STEPS.map((s) => ({ title: s.title, text: s.text }))} caption={CAPTION} />
      </div>

      {/* Mobile and tablet: stacked frames */}
      <div className="page space-y-16 py-20 lg:hidden">
        {MAP_STEPS.map((s, i) => (
          <figure key={s.k} className="grid-12 gap-y-5">
            <figcaption className="col-span-12 sm:col-span-5">
              <span className="section-no text-sm">0{i + 1} / 04</span>
              <span className="mt-2 block font-serif text-h3 text-navy">{s.title}</span>
              <span className="mt-2 block text-ink-soft">{s.text}</span>
            </figcaption>
            <div className="col-span-12 sm:col-span-7">
              <MapSvg
                className="h-auto w-full"
                drawCorridors
                showCities={i >= 1}
                showCorridors={i >= 2}
                showReturn={i >= 3}
              />
            </div>
          </figure>
        ))}
        <p className="dateline">{CAPTION}</p>
      </div>
    </section>
  );
}
