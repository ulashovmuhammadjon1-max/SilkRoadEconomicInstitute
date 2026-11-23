import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ComponentProps } from "react";
import rehypePlaceholders from "@/lib/rehype-placeholders";
import { Chart } from "./Chart";

const components = {
  Chart,
  img: (props: ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img loading="lazy" className="h-auto w-full rounded-sm" {...props} />
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
export function Mdx({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className="prose prose-srei prose-lg max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:decoration-gold prose-a:underline-offset-4 prose-img:rounded-sm">
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypePlaceholders] } }} />
    </div>
  );
}
