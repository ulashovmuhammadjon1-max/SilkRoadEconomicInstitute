"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Sticky header that tucks away while scrolling down and returns on scroll up. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const el = ref.current;
      if (!el) return;
      el.dataset.scrolled = y > 8 ? "true" : "false";
      const menuOpen = document.documentElement.dataset.menu === "open";
      el.dataset.hidden = !menuOpen && y > 240 && y > last + 4 ? "true" : y < last - 4 || y < 240 ? "false" : el.dataset.hidden;
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      ref={ref}
      data-site-header=""
      data-scrolled="false"
      data-hidden="false"
      className="on-dark sticky top-0 z-40 border-b border-white/0 bg-midnight/95 text-cream backdrop-blur-md transition-[transform,border-color] duration-500 ease-out data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-white/10 motion-reduce:transition-none"
    >
      {children}
    </header>
  );
}
