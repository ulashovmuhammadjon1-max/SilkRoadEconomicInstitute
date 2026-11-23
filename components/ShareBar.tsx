"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./CopyButton";
import { Glyph } from "./ornaments/Glyph";

/** Telegram-first sharing: native share sheet where available, Telegram, copy link. */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== "undefined" && "share" in navigator), []);
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  return (
    <div className="no-print flex flex-wrap items-center gap-3">
      <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-11 px-5">
        <Glyph name="telegram" size={18} /> Share to Telegram
      </a>
      {canShare && (
        <button
          type="button"
          onClick={() => navigator.share({ title, url }).catch(() => {})}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy px-4 text-ui font-medium text-navy hover:bg-navy hover:text-cream"
        >
          <Glyph name="share" size={18} /> Share…
        </button>
      )}
      <CopyButton text={url} label="Copy link" />
    </div>
  );
}
