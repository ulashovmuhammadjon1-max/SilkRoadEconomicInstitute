"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type U = { name: string; email: string } | null;

/**
 * "Sign in" link or initials menu. Static pages stay static: the session is
 * fetched after load, inside a fixed-size slot, so nothing shifts.
 */
export function HeaderAccount() {
  const [user, setUser] = useState<U | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/member-auth/get-session", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ? { name: d.user.name, email: d.user.email } : null))
      .catch(() => setUser(null));
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  const initials = (user?.name || user?.email || "?").split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0]!.toUpperCase()).join("");

  return (
    <div ref={ref} className="relative flex h-11 w-[5.5rem] items-center justify-end">
      {user === undefined ? null : user === null ? (
        <Link href="/signin" className="whitespace-nowrap rounded-full border border-white/25 px-4 py-2 text-sm text-cream hover:border-turquoise hover:text-turquoise-light">
          Sign in
        </Link>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-turquoise font-mono text-sm text-midnight"
          >
            <span aria-hidden="true">{initials}</span>
            <span className="sr-only">Account menu</span>
          </button>
          {open && (
            <div role="menu" className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-midnight py-2 text-cream shadow-2xl">
              <p className="truncate px-4 py-2 text-xs text-cream/60">{user.email}</p>
              <Link role="menuitem" href="/account" className="block px-4 py-2.5 text-sm hover:bg-white/5">
                My account
              </Link>
              <form action="/api/member-auth/sign-out" method="post" onSubmit={async (e) => {
                e.preventDefault();
                await fetch("/api/member-auth/sign-out", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: "{}" });
                window.location.assign("/");
              }}>
                <button role="menuitem" type="submit" className="block w-full px-4 py-2.5 text-left text-sm hover:bg-white/5">
                  Sign out
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
