/**
 * Use in a brief like this:
 *
 * <Chart
 *   src="/briefs/my-chart.png"
 *   alt="Describe what the chart shows for screen readers"
 *   caption="Chart title"
 *   source="Source: World Bank, 2026"
 * />
 */
export function Chart({ src, alt, caption, source }: { src: string; alt: string; caption?: string; source?: string }) {
  return (
    <figure className="not-prose my-12 md:-mx-8">
      <div className="border border-cream-300 bg-white p-3 md:p-5" data-reveal="wipe">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="settle h-auto w-full" />
      </div>
      {(caption || source) && (
        <figcaption className="mt-3 grid gap-1 font-sans text-sm md:grid-cols-[auto_1fr] md:gap-x-4">
          <span className="dateline pt-0.5">Fig.</span>
          <span>
            {caption && <span className="block font-medium text-navy">{caption}</span>}
            {source && <span className="block text-ink-muted">{source}</span>}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
