import Image from "next/image";
import Link from "next/link";
import { features } from "@/lib/features";
import { site } from "@/lib/site";
import { HeaderAccount } from "./header/HeaderAccount";
import { HeaderShell } from "./header/HeaderShell";
import { MobileMenu } from "./header/MobileMenu";
import { NavLinks } from "./header/NavLinks";
import { SearchButton } from "./search/SearchButton";

export function Header() {
  return (
    <HeaderShell>
      <div className="page flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <Image src="/logo.png" alt="" width={44} height={44} priority className="h-9 w-9 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-[-8deg] md:h-11 md:w-11" />
          <span className="min-w-0 leading-tight">
            <span className="block font-serif text-[1.15rem] leading-[1.05] text-cream md:text-[1.35rem]">{site.name}</span>
            <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.14em] text-turquoise-light sm:block">41.31°N 69.24°E · Tashkent</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 md:gap-6">
          <NavLinks />
          <SearchButton />
          {features.accounts && (
            <div className="hidden sm:block">
              <HeaderAccount />
            </div>
          )}
          <MobileMenu accounts={features.accounts} />
        </div>
      </div>
    </HeaderShell>
  );
}
