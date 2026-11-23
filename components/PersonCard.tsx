import type { CSSProperties } from "react";
import type { Person } from "@/lib/content";
import { WithPlaceholders } from "./Placeholder";

/** Team/judge card with an "archival photograph" treatment and a museum-label caption. */
export function PersonCard({ person, index = 0 }: { person: Person; index?: number }) {
  return (
    <article className="group" data-reveal="up" style={{ "--d": `${index * 120}ms` } as CSSProperties}>
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200" data-reveal="wipe" style={{ "--d": `${index * 120 + 100}ms` } as CSSProperties}>
        {person.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.photo}
            alt={`Photo of ${person.name}`}
            loading="lazy"
            className="settle h-full w-full object-cover [filter:url(#duotone)] transition-[filter] duration-700 group-hover:[filter:none]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-gold" role="img" aria-label={`Photo placeholder for ${person.name}`}>
            <span className="font-serif text-[4rem] leading-none text-navy/70">
              {person.name.split(/\s+/).slice(0, 2).map((n) => n[0]).join("")}
            </span>
            <span className="placeholder text-xs">[Photo placeholder]</span>
          </div>
        )}
      </div>
      <div className="mt-4 border-l-2 border-gold pl-4">
        <h3 className="font-serif text-h3 text-navy">{person.name}</h3>
        <p className="dateline mt-1">{person.role}</p>
        {person.affiliation && <p className="mt-1 text-sm italic text-ink-soft">{person.affiliation}</p>}
      </div>
      {person.bio && (
        <p className="mt-4 text-ink-soft">
          <WithPlaceholders text={person.bio} />
        </p>
      )}
      {person.links && person.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {person.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="link">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/** SVG duotone filter (navy shadows, cream highlights), referenced by PersonCard photos. */
export function DuotoneFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="duotone" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.106 0.961" />
          <feFuncG type="table" tableValues="0.165 0.937" />
          <feFuncB type="table" tableValues="0.290 0.890" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
