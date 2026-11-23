import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="border-b border-cream-300 bg-cream-50">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl font-serif text-3xl leading-tight text-navy md:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{children}</div>}
      </div>
    </header>
  );
}
