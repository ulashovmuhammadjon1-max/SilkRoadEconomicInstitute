import type { CSSProperties, ReactNode } from "react";
import { RevealLines } from "./motion/RevealLines";
import { RouteLine } from "./ornaments/Ornaments";

/** Editorial page opener: section mark, line-revealed title, optional lead and aside. */
export function PageHeader({
  section,
  eyebrow,
  title,
  children,
  aside,
}: {
  section?: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="relative">
      <div className="page grid-12 gap-y-6 pb-12 pt-12 md:pt-20 lg:pb-16">
        <p className="label load-fade col-span-12 lg:col-span-2 lg:pt-4">
          {section && <span className="mr-2">§ {section}</span>}
          {eyebrow}
        </p>
        <div className="col-span-12 lg:col-span-7">
          <RevealLines as="h1" text={title} className="max-w-[18ch] font-serif text-h1 text-navy" delay={80} />
          {children && (
            <div className="load-in mt-6 max-w-measure text-lead text-ink-soft" style={{ "--d": "400ms" } as CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {aside && <div className="col-span-12 lg:col-span-3 lg:self-end">{aside}</div>}
      </div>
      <div className="page" aria-hidden="true">
        <RouteLine className="h-6 w-full" delay={300} />
      </div>
    </header>
  );
}
