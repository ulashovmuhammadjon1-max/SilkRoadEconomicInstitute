import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          900: "#121C33",
          800: "#1B2A4A",
          700: "#2A3D63",
          600: "#3D5280",
        },
        cream: {
          DEFAULT: "#F5EFE3",
          50: "#FBF8F2",
          100: "#F5EFE3",
          200: "#EAE0CC",
          300: "#DDD0B5",
        },
        gold: {
          DEFAULT: "#B8964F", // decorative accents (lines, borders, icons)
          light: "#D4BC86",
          dark: "#7A5F28", // text-safe gold: 5.3:1 on cream
        },
        ink: "#16202F",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
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
            "--tw-prose-captions": "#4A5568",
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
