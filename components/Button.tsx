import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  download?: boolean;
  external?: boolean;
  className?: string;
};

const styles = {
  primary: "bg-navy text-cream hover:bg-navy-700 border border-navy",
  secondary: "bg-transparent text-navy border border-navy hover:bg-navy hover:text-cream",
  light: "bg-cream text-navy border border-cream hover:bg-white",
};

export function Button({ href, children, variant = "primary", download, external, className = "" }: Props) {
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline-offset-4 ${styles[variant]} ${className}`;
  if (download || external || /^(https?:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        className={cls}
        download={download || undefined}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
