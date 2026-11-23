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
        className="inline-flex h-11 min-w-11 items-center justify-center gap-2 text-ui text-cream/70 hover:text-cream"
        aria-keyshortcuts="/"
      >
        <Glyph name="search" size={20} />
        <span className="sr-only lg:not-sr-only">Search</span>
        <kbd className="hidden rounded border border-white/20 px-1.5 font-mono text-[0.7rem] text-cream/60 xl:inline">/</kbd>
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}
