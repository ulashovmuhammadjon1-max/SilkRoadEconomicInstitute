import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/** Fluid size: clamp from `min`px at 375px wide to `max`px at 1440px wide. */
const fluid = (min: number, max: number) => {
  const slope = (max - min) / (1440 - 375);
  const base = min - slope * 375;
  return `clamp(${min / 16}rem, ${(base / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${max / 16}rem)`;
};

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // SREI palette. Accents (turquoise, gold, coral, lavender) are for shapes,
        // lines and dark backgrounds; on light backgrounds use their `ink` tints for text.
        midnight: "#101B33",
        deep: "#193B64",
        navy: { DEFAULT: "#101B33", 950: "#0A1224", 900: "#0D1629", 800: "#101B33", 700: "#193B64", 600: "#25507F", 300: "#A7B0C2" },
        turquoise: { DEFAULT: "#16A6A1", ink: "#0B706C", light: "#5CCFC9" },
        gold: { DEFAULT: "#D8A64A", light: "#E8C783", dark: "#76520F" },
        coral: { DEFAULT: "#E58B72", ink: "#A9472F", light: "#F2A893" },
        lavender: { DEFAULT: "#9A91B8", ink: "#574E7C", light: "#C3BCDD", soft: "#E7E4F0" },
        sand: { DEFAULT: "#D9C8A5", soft: "#EFE6D3" },
        paper: "#FFFFFF",
        cream: { DEFAULT: "#F7F4EC", 50: "#FBFAF5", 100: "#F7F4EC", 200: "#EDE7D9", 300: "#DDD3BF", 400: "#C8BA9B" },
        ink: { DEFAULT: "#292D35", soft: "#3F4450", muted: "#5A6170" },
        rust: "#A9472F", // errors only
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: [fluid(48, 120), { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        h1: [fluid(38, 76), { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        h2: [fluid(30, 52), { lineHeight: "1.06", letterSpacing: "-0.01em" }],
        h3: [fluid(23, 30), { lineHeight: "1.15", letterSpacing: "-0.005em" }],
        lead: [fluid(19, 22), { lineHeight: "1.5" }],
        body: [fluid(17, 19), { lineHeight: "1.62" }],
        ui: ["0.9375rem", { lineHeight: "1.5" }],
        label: ["0.72rem", { lineHeight: "1.3", letterSpacing: "0.12em" }],
      },
      maxWidth: { page: "1320px", measure: "68ch" },
      spacing: { gutter: "var(--gutter)", margin: "var(--margin)" },
      borderRadius: { DEFAULT: "2px", sm: "2px" },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      typography: () => ({
        srei: {
          css: {
            "--tw-prose-body": "#292D35",
            "--tw-prose-headings": "#101B33",
            "--tw-prose-links": "#193B64",
            "--tw-prose-bold": "#101B33",
            "--tw-prose-quotes": "#101B33",
            "--tw-prose-quote-borders": "#16A6A1",
            "--tw-prose-captions": "#5A6170",
            "--tw-prose-bullets": "#16A6A1",
            "--tw-prose-counters": "#0B706C",
            "--tw-prose-hr": "#DDD3BF",
            "--tw-prose-th-borders": "#DDD3BF",
            "--tw-prose-td-borders": "#EDE7D9",
            blockquote: { fontStyle: "normal" },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:last-of-type::after": { content: "none" },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
