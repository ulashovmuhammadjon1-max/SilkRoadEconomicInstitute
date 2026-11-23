/**
 * First-visit loader (home, once per session, ~1.1s): SREI wordmark, a Silk
 * Road line drawing across, a thin progress bar, then the page is revealed.
 * Pure CSS — shown only while the boot script in app/layout.tsx sets html.intro.
 * Any key press or tap skips it. Never shown with reduced motion.
 */
export function Intro() {
  return (
    <div className="intro-curtain" aria-hidden="true">
      <p className="intro-word font-serif text-[clamp(3.5rem,12vw,7rem)] leading-none tracking-[0.04em] text-cream">SREI</p>
      <p className="intro-word mt-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-turquoise-light" style={{ animationDelay: "120ms" }}>
        Silk Road Economic Institute
      </p>
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="mt-10 h-8 w-[min(620px,82vw)]" fill="none">
        <path d="M0 24 C 120 8, 220 34, 340 20 S 560 6, 680 22 S 880 34, 1000 16" pathLength={1} className="draw" stroke="#D8A64A" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-8 h-px w-[min(220px,50vw)] overflow-hidden bg-white/15">
        <div className="intro-progress h-full bg-turquoise" />
      </div>
    </div>
  );
}
