"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole site. Elements opt in with
 * [data-reveal] or [data-draw]; when they enter the viewport this
 * sets [data-revealed] and CSS (app/globals.css) does the animation.
 * New elements added by client navigation are picked up by a MutationObserver.
 */
const SELECTOR = "[data-reveal]:not([data-revealed]),[data-draw]:not([data-revealed])";

export function Revealer() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).setAttribute("data-revealed", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    const scan = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    scan();
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
