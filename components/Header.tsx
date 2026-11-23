import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="relative z-20 border-b border-cream-300 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${site.name}, home`}>
          <Image src="/logo.png" alt="" width={44} height={44} priority className="h-9 w-9 shrink-0 md:h-11 md:w-11" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-serif text-base font-semibold text-navy md:text-lg">{site.name}</span>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-gold-dark sm:block">Research · Forums · Briefs</span>
          </span>
        </Link>
        <NavLinks />
        <MobileNav />
      </div>
    </header>
  );
}
