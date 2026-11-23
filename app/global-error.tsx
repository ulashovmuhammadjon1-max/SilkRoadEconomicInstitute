"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#F5EFE3", color: "#1B2A4A", fontFamily: "Georgia, serif", padding: "10vh 6vw" }}>
        <p style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12 }}>Silk Road Economic Institute</p>
        <h1 style={{ fontSize: 40, fontWeight: 400 }}>Something went wrong</h1>
        <p>The site couldn&rsquo;t load this page. Please try again.</p>
        <button type="button" onClick={reset} style={{ marginTop: 16, padding: "12px 20px", background: "#1B2A4A", color: "#F5EFE3", border: 0 }}>
          Try again
        </button>
      </body>
    </html>
  );
}
