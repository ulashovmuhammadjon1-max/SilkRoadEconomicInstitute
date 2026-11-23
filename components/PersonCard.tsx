import type { Person } from "@/lib/content";
import { WithPlaceholders } from "./Placeholder";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function PersonCard({ person }: { person: Person }) {
  return (
    <article className="flex h-full flex-col rounded-sm border border-cream-300 bg-cream-50 p-6">
      {person.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.photo} alt={`Photo of ${person.name}`} className="h-24 w-24 rounded-full object-cover" loading="lazy" />
      ) : (
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-gold bg-cream-200 font-serif text-2xl text-navy"
          role="img"
          aria-label={`Photo placeholder for ${person.name}`}
          title="[Photo placeholder]"
        >
          {initials(person.name)}
        </div>
      )}
      <h3 className="mt-5 font-serif text-xl text-navy">{person.name}</h3>
      <p className="text-sm font-medium text-gold-dark">{person.role}</p>
      {person.affiliation && <p className="mt-1 text-sm text-ink/80">{person.affiliation}</p>}
      {person.bio && (
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/80">
          <WithPlaceholders text={person.bio} />
        </p>
      )}
      {person.links && person.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {person.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-navy underline decoration-gold underline-offset-4">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
