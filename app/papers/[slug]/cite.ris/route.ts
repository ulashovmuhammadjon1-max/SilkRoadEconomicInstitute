import { getAllPapers, getPaper } from "@/lib/content";
import { citeRis } from "@/lib/cite";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }));
}
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const paper = getPaper((await params).slug);
  if (!paper) return new Response("Not found", { status: 404 });
  return new Response(citeRis(paper), {
    headers: { "Content-Type": "application/x-research-info-systems; charset=utf-8", "Content-Disposition": `attachment; filename="srei-wp-${paper.paperNumber}.ris"` },
  });
}
