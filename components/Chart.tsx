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
    <figure className="not-prose my-8 rounded-sm border border-cream-300 bg-white p-3 md:p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-auto w-full" />
      {(caption || source) && (
        <figcaption className="mt-3 space-y-1 text-sm">
          {caption && <p className="font-medium text-navy">{caption}</p>}
          {source && <p className="text-ink/70">{source}</p>}
        </figcaption>
      )}
    </figure>
  );
}
