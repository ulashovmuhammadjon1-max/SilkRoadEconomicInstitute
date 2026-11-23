/**
 * Motion vocabulary for the whole site. Change timings here, not in components.
 * See README → "Editing animations".
 */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const, // most entrances
  inOut: [0.65, 0, 0.35, 1] as const, // scroll-linked, page transitions
  in: [0.55, 0, 1, 0.45] as const, // exits
};

export const dur = { fast: 0.18, base: 0.45, slow: 0.9, epic: 1.6 } as const;

export const stagger = { lines: 0.08, items: 0.06, rows: 0.12 } as const;

/** Small interactive controls only; never text. */
export const spring = { ui: { type: "spring", stiffness: 420, damping: 32 } as const };

/** Viewport margin used to start reveals slightly before elements are fully in view. */
export const inViewMargin = "0px 0px -12% 0px" as const;
