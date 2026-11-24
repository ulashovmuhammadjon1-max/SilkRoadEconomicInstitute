"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { nav, site } from "@/lib/site";
import { Glyph } from "../ornaments/Glyph";
import { RouteLine } from "../ornaments/Ornaments";

/** Full-screen cream sheet; items stagger in and a route line draws along the bottom. */
export function MobileMenu({ accounts = false }: { accounts?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const sheet = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.dataset.menu = "closed";
      root.style.overflow = "";
      return;
    }
    root.dataset.menu = "open";
    root.style.overflow = "hidden";
    const first = sheet.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab" && sheet.current) {
        const f = Array.from(sheet.current.querySelectorAll<HTMLElement>("a,button"));
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream"
      >
        <span className="sr-only">Open menu</span>
        <Glyph name="menu" size={24} />
      </button>
      {mounted &&
        createPortal(
          <div
            ref={sheet}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-open={open}
            className="fixed inset-0 z-[70] flex flex-col bg-midnight text-cream transition-[clip-path,visibility] duration-700 ease-in-out data-[open=false]:invisible motion-reduce:transition-none"
            style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
          >
            <div className="page flex h-[var(--header-h)] items-center justify-between">
              <span className="font-mono text-label uppercase text-turquoise-light">Menu</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream"
              >
                <span className="sr-only">Close menu</span>
                <Glyph name="close" size={24} />
              </button>
            </div>
            <nav aria-label="Main" className="page flex-1 overflow-y-auto pt-6">
              <ol>
                {[{ href: "/", label: "Home" }, ...nav].map((item, i) => {
                  const active = pathname === item.href;
                  return (
                    <li
                      key={item.href}
                      className="border-b border-white/10 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
                      style={{ opacity: open ? 1 : 0, transform: open ? "none" : "translateY(18px)", transitionDelay: open ? `${150 + i * 60}ms` : "0ms" } as CSSProperties}
                    >
                      <Link href={item.href} aria-current={active ? "page" : undefined} className="flex items-baseline gap-4 py-4">
                        <span className="w-8 font-mono text-sm text-turquoise-light">{String(i).padStart(2, "0")}</span>
                        <span className={`font-serif text-h2 ${active ? "text-turquoise-light" : "text-cream"}`}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
              {accounts && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/account" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-sm text-cream">
                    My account / Sign in
                  </Link>
                  <Link href="/signup" className="inline-flex min-h-11 items-center rounded-full bg-turquoise px-5 text-sm text-midnight">
                    Create account
                  </Link>
                </div>
              )}
              <p className="mt-8 text-sm text-cream/70">
                <a href={site.telegramUrl} className="underline decoration-turquoise underline-offset-4" target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </p>
            </nav>
            <div className="h-10 px-4 pb-4">{open && <RouteLine className="h-full w-full" delay={350} />}</div>
          </div>,
          document.body,
        )}
    </div>
  );
}
