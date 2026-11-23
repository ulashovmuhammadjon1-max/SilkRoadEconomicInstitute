"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Glyph } from "../ornaments/Glyph";

const SearchDialog = dynamic(() => import("./SearchDialog"), { ssr: false });

/** Opens site search. Shortcut: "/" (ignored while typing in a field). */
export function SearchButton() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 min-w-11 items-center justify-center gap-2 text-ui text-ink-soft hover:text-navy"
        aria-keyshortcuts="/"
      >
        <Glyph name="search" size={20} />
        <span className="sr-only lg:not-sr-only">Search</span>
        <kbd className="hidden border border-cream-300 px-1.5 font-sans text-[0.7rem] text-ink-muted xl:inline">/</kbd>
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}
