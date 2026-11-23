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
        navy: { DEFAULT: "#1B2A4A", 950: "#0E1729", 900: "#121C33", 800: "#1B2A4A", 700: "#2A3D63", 600: "#3D5280", 300: "#9AA6BF" },
        cream: { DEFAULT: "#F5EFE3", 50: "#FBF8F2", 100: "#F5EFE3", 200: "#EAE0CC", 300: "#DDD0B5", 400: "#C9B992" },
        gold: { DEFAULT: "#B8964F", light: "#D4BC86", dark: "#7A5F28" },
        ink: { DEFAULT: "#16202F", soft: "#3C4656", muted: "#5B6475" },
        rust: "#8C3B2E", // errors and "deadline passed" only
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: [fluid(44, 104), { lineHeight: "1.02", letterSpacing: "-0.022em" }],
        h1: [fluid(34, 64), { lineHeight: "1.06", letterSpacing: "-0.018em" }],
        h2: [fluid(26, 40), { lineHeight: "1.12", letterSpacing: "-0.012em" }],
        h3: [fluid(21, 26), { lineHeight: "1.22", letterSpacing: "-0.006em" }],
        lead: [fluid(19, 22), { lineHeight: "1.5" }],
        body: [fluid(17, 19), { lineHeight: "1.62" }],
        ui: ["0.9375rem", { lineHeight: "1.5" }],
        label: ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.14em" }],
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
            "--tw-prose-body": "#16202F",
            "--tw-prose-headings": "#1B2A4A",
            "--tw-prose-links": "#1B2A4A",
            "--tw-prose-bold": "#16202F",
            "--tw-prose-quotes": "#1B2A4A",
            "--tw-prose-quote-borders": "#B8964F",
            "--tw-prose-captions": "#5B6475",
            "--tw-prose-bullets": "#B8964F",
            "--tw-prose-counters": "#7A5F28",
            "--tw-prose-hr": "#DDD0B5",
            "--tw-prose-th-borders": "#DDD0B5",
            "--tw-prose-td-borders": "#EAE0CC",
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
