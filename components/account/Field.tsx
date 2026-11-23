import type { ReactNode } from "react";

/** Labelled form field with an error message linked via aria-describedby. */
export function Field({ id, label, hint, error, children, optional }: { id: string; label: string; hint?: string; error?: string; children: ReactNode; optional?: boolean }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-ui font-medium text-navy">
        {label} {optional && <span className="font-normal text-ink-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-rust">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputCls =
  "block w-full min-h-12 border border-cream-400 bg-cream-50 px-4 text-[1rem] text-ink outline-none transition-colors focus:border-navy aria-[invalid=true]:border-rust";
