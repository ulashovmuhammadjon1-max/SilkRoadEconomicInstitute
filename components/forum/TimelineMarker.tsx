"use client";

import { useEffect, useState } from "react";

/**
 * "You are here" marker on the forum timeline. Computed in the browser from
 * the real dates (never at build time, which would go stale). Hidden unless
 * every step has an exact date.
 */
export function TimelineMarker({ isoDates }: { isoDates: (string | undefined)[] }) {
  const [pos, setPos] = useState<number | null>(null);
  useEffect(() => {
    const ts = isoDates.map((d) => (d && /^\d{4}-\d{2}-\d{2}/.test(d) ? new Date(d).getTime() : NaN));
    if (ts.length < 2 || ts.some(Number.isNaN)) return;
    const now = Date.now();
    if (now < ts[0] || now > ts[ts.length - 1]) return;
    const i = ts.findIndex((t, k) => now >= t && now <= ts[k + 1]);
    const frac = (now - ts[i]) / Math.max(ts[i + 1] - ts[i], 1);
    setPos((i + frac) / (ts.length - 1));
  }, [isoDates]);
  if (pos === null) return null;
  return (
    <div className="absolute -left-[7px] z-10 flex items-center gap-3" style={{ top: `calc(${(pos * 100).toFixed(2)}% - 8px)` }}>
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute h-4 w-4 animate-ping rounded-full bg-gold/50 motion-reduce:hidden" />
        <span className="h-2.5 w-2.5 rounded-full bg-navy" />
      </span>
      <span className="dateline bg-cream px-1 text-navy">You are here</span>
    </div>
  );
}
