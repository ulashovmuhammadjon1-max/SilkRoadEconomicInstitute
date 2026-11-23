import Image from "next/image";
import Link from "next/link";
import { getForum } from "@/lib/content";
import { site } from "@/lib/site";
import { HeaderShell } from "./header/HeaderShell";
import { MobileMenu } from "./header/MobileMenu";
import { NavLinks } from "./header/NavLinks";
import { SearchButton } from "./search/SearchButton";

export function Header() {
  const { current } = getForum();
  return (
    <HeaderShell>
      <div className="page flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <Image src="/logo.png" alt="" width={44} height={44} priority className="h-9 w-9 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-[-8deg] md:h-11 md:w-11" />
          <span className="min-w-0 leading-tight">
            <span className="block font-serif text-[0.98rem] font-semibold leading-[1.15] tracking-[-0.01em] text-navy sm:text-[1.05rem] md:text-lg">{site.name}</span>
            <span className="dateline hidden text-[0.65rem] sm:block">Tashkent · {current.name.replace(" Research Forum", "")}</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 md:gap-6">
          <NavLinks />
          <SearchButton />
          <MobileMenu />
        </div>
      </div>
    </HeaderShell>
  );
}
