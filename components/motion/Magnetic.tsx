"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Very subtle magnetic pull (max 4px) on fine-pointer devices only. */
export function Magnetic({ children, strength = 4 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    if (!ok) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };
    const leave = () => (el.style.transform = "translate3d(0,0,0)");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className="inline-block transition-transform duration-300 ease-out will-change-transform">
      {children}
    </span>
  );
}
