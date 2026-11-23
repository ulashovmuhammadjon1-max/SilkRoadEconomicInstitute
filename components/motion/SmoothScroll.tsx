"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling, desktop fine-pointer devices only. Loaded after the
 * page is idle; never on touch devices, data-saver or reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches &&
      !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!ok) return;
    let destroyed = false;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: true });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(start);
    else setTimeout(start, 600);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
