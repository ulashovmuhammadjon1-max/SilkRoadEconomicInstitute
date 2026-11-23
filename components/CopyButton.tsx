"use client";

import { useState } from "react";
import { Glyph, StampCheck } from "./ornaments/Glyph";

/** Copies text; shows an ink-stamp tick and "Copied" for 2s. */
export function CopyButton({ text, label = "Copy citation", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      className={`inline-flex min-h-11 items-center gap-2 border border-navy px-4 text-ui font-medium text-navy transition-colors hover:bg-navy hover:text-cream ${className}`}
    >
      {copied ? (
        <StampCheck className="animate-[stamp_260ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none" />
      ) : (
        <Glyph name="copy" size={18} />
      )}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
