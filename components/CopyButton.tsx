"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy citation" }: { text: string; label?: string }) {
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
      className="inline-flex min-h-10 items-center rounded-sm border border-navy px-4 text-sm font-medium text-navy hover:bg-navy hover:text-cream"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
