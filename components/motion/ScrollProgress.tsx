"use client";

import { useEffect, useRef } from "react";

/** Thin gold reading-progress line. Tracks the element with id `targetId`. */
export function ScrollProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !bar.current) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = target.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
      bar.current!.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [targetId]);
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden="true">
      <div ref={bar} className="h-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
