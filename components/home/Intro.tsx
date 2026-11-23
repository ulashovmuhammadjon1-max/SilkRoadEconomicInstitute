/**
 * First-visit intro curtain (desktop, home page, once per session, ≤1.2s).
 * Pure CSS: hidden unless the boot script in app/layout.tsx added html.intro.
 * Any key press or click skips it.
 */
export function Intro() {
  return (
    <div className="intro-curtain" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" width={88} height={88} className="h-20 w-20" />
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="mt-8 h-8 w-[min(560px,80vw)] text-gold" fill="none">
        <path d="M0 24 C 120 8, 220 34, 340 20 S 560 6, 680 22 S 880 34, 1000 16" pathLength={1} className="draw" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
