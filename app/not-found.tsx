import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-4xl text-navy">Page not found</h1>
      <p className="mt-4 text-ink/80">The page you were looking for doesn&rsquo;t exist or has moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/">Home</Button>
        <Button href="/papers" variant="secondary">
          Working papers
        </Button>
      </div>
    </section>
  );
}
