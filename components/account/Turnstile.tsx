"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void };
  }
}

/** Cloudflare Turnstile widget. Rendered only when a site key is configured. */
export function Turnstile({ siteKey, onToken, action }: { siteKey: string; onToken: (t: string | null) => void; action?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id: string | undefined;
    const render = () => {
      if (!ref.current || !window.turnstile) return;
      id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        action,
        theme: "light",
        callback: (t: string) => onToken(t),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    };
    if (window.turnstile) render();
    else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
    return () => {
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [siteKey, onToken, action]);
  return <div ref={ref} className="min-h-[65px]" />;
}
