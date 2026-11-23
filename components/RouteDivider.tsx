/**
 * A thin, dotted "caravan route" with a few waypoints: the site's only
 * Silk Road motif. Purely decorative, hidden from screen readers.
 */
export function RouteDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="h-6 w-full text-gold" fill="none">
        <path
          d="M0 24 C 120 8, 220 34, 340 20 S 560 6, 680 22 S 880 34, 1000 16"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="1 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {[
          [120, 15],
          [340, 20],
          [680, 22],
          [880, 27],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="3" fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}
