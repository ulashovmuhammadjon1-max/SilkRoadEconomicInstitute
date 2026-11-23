/**
 * Rehype plugin: wraps "[bracketed placeholders]" in MDX text in
 * <mark class="placeholder">, so unfinished text is highlighted in briefs too.
 */
type Node = { type: string; value?: string; tagName?: string; children?: Node[]; properties?: Record<string, unknown> };

const RE = /(\[[^\]\n]+\])/g;

function split(value: string): Node[] {
  return value
    .split(RE)
    .filter((part) => part !== "")
    .map((part) =>
      /^\[[^\]\n]+\]$/.test(part)
        ? { type: "element", tagName: "mark", properties: { className: ["placeholder"] }, children: [{ type: "text", value: part }] }
        : { type: "text", value: part },
    );
}

function walk(node: Node) {
  if (!node.children) return;
  if (node.type === "element" && (node.tagName === "code" || node.tagName === "pre")) return;
  const next: Node[] = [];
  for (const child of node.children) {
    if (child.type === "text" && child.value && RE.test(child.value)) {
      RE.lastIndex = 0;
      next.push(...split(child.value));
    } else {
      walk(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function rehypePlaceholders() {
  return (tree: Node) => walk(tree);
}
