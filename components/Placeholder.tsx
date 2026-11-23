import { Fragment } from "react";

/**
 * Renders text and highlights every "[bracketed placeholder]" so unfinished
 * content is impossible to miss. Once you replace the brackets with real
 * content, the highlight disappears automatically.
 */
export function WithPlaceholders({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <mark key={i} className="placeholder" title="Placeholder: replace before launch">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
