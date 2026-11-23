import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ComponentProps } from "react";
import rehypePlaceholders from "@/lib/rehype-placeholders";
import rehypeSidenotes from "@/lib/rehype-sidenotes";
import { Chart } from "./Chart";

const components = {
  Chart,
  img: (props: ComponentProps<"img">) => (
    <span className="not-prose my-8 block" data-reveal="wipe">
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img loading="lazy" className="settle h-auto w-full" {...props} />
    </span>
  ),
  a: (props: ComponentProps<"a">) => {
    const external = typeof props.href === "string" && /^https?:\/\//.test(props.href);
    return <a {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />;
  },
  table: (props: ComponentProps<"table">) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

/** Renders the body of a brief or paper. Runs at build time only. */
export function Mdx({ source, variant = "plain" }: { source: string; variant?: "plain" | "article" }) {
  if (!source.trim()) return null;
  const article = variant === "article";
  return (
    <div
      className={`prose prose-srei max-w-none font-serif text-body prose-headings:font-serif prose-headings:font-semibold prose-h2:mt-14 prose-h2:text-h3 prose-a:decoration-gold prose-a:underline-offset-4 prose-blockquote:border-l-2 prose-blockquote:font-sans prose-blockquote:text-base prose-blockquote:text-ink-soft ${
        article ? "drop-cap has-sidenotes" : ""
      }`}
    >
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypePlaceholders, rehypeSidenotes] } }}
      />
    </div>
  );
}
