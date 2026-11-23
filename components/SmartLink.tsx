import Link from "next/link";
import type { ReactNode } from "react";
import { isPlaceholder } from "@/lib/site";
import { WithPlaceholders } from "./Placeholder";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Shown instead of the link while href is still a [placeholder]. */
  placeholderLabel?: string;
  ariaLabel?: string;
};

/**
 * Internal links use next/link; external links open in a new tab.
 * If href is still a "[placeholder]", a highlighted placeholder is rendered
 * instead of a broken link.
 */
export function SmartLink({ href, children, className, placeholderLabel, ariaLabel }: Props) {
  if (isPlaceholder(href)) {
    return (
      <span className={className}>
        <WithPlaceholders text={placeholderLabel ?? href} />
      </span>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
