/**
 * Rehype plugin: copies each GFM footnote's text next to its reference as
 * <span class="sidenote">. CSS shows these in the margin on wide screens and
 * hides the footnote list there; below 1280px the normal footnote list is used.
 */
type Node = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: Node[] };

const isEl = (n: Node, tag: string) => n.type === "element" && n.tagName === tag;

function find(node: Node, pred: (n: Node) => boolean, out: Node[] = []): Node[] {
  if (pred(node)) out.push(node);
  node.children?.forEach((c) => find(c, pred, out));
  return out;
}

function stripBackrefs(nodes: Node[]): Node[] {
  return nodes
    .filter((n) => !(isEl(n, "a") && n.properties && "dataFootnoteBackref" in n.properties))
    .map((n) => (n.children ? { ...n, children: stripBackrefs(n.children) } : n));
}

export default function rehypeSidenotes() {
  return (tree: Node) => {
    const defs = new Map<string, Node[]>();
    for (const li of find(tree, (n) => isEl(n, "li") && String(n.properties?.id ?? "").includes("fn-"))) {
      const p = li.children?.find((c) => isEl(c, "p"));
      defs.set(String(li.properties!.id), stripBackrefs(p?.children ?? li.children ?? []));
    }
    if (defs.size === 0) return;

    const visit = (node: Node) => {
      if (!node.children) return;
      const next: Node[] = [];
      for (const child of node.children) {
        next.push(child);
        if (isEl(child, "sup")) {
          const a = child.children?.find((c) => isEl(c, "a") && c.properties && "dataFootnoteRef" in c.properties);
          const href = String(a?.properties?.href ?? "");
          const content = defs.get(href.replace(/^#/, ""));
          if (a && content) {
            const label = find(a, (n) => n.type === "text").map((t) => t.value).join("");
            next.push({
              type: "element",
              tagName: "span",
              properties: { className: ["sidenote"], ariaHidden: "true" },
              children: [{ type: "element", tagName: "span", properties: { className: ["section-no", "mr-1"] }, children: [{ type: "text", value: label }] }, ...content],
            });
          }
        } else {
          visit(child);
        }
      }
      node.children = next;
    };
    visit(tree);
  };
}
