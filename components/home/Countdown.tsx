"use client";

import { useEffect, useState } from "react";

/** Live countdown to a real ISO date from content/forum.json. Updates each minute. */
export function Countdown({ iso, className = "" }: { iso: string; className?: string }) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const ms = now === null ? null : target - now;
  const parts =
    ms === null || ms <= 0
      ? null
      : { days: Math.floor(ms / 864e5), hours: Math.floor((ms % 864e5) / 36e5), minutes: Math.floor((ms % 36e5) / 6e4) };
  return (
    <div className={`min-h-[4.5rem] ${className}`}>
      {ms !== null && ms <= 0 ? (
        <p className="font-serif text-h3 text-[#E7A79A]">The submission deadline has passed.</p>
      ) : (
        <dl className="flex gap-6 tnum" aria-label="Time left until the submission deadline">
          {(["days", "hours", "minutes"] as const).map((k) => (
            <div key={k} className="flex flex-col-reverse">
              <dt className="dateline mt-1 text-cream/60">{k}</dt>
              <dd className="font-serif text-h1 leading-none text-cream">{parts ? String(parts[k]).padStart(2, "0") : "··"}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
