import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { ViewTransition } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Revealer } from "@/components/motion/Revealer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

// Font budget: one variable serif (normal style) and one variable sans, Latin
// subset only. Add "latin-ext" here when Uzbek-language pages are introduced.
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} (${site.shortName})`,
    template: `%s | ${site.shortName}`,
  },
  description: site.tagline,
  applicationName: site.name,
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: site.name,
    description: site.tagline,
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    canonical: "/",
    types: {
      "application/atom+xml": [
        { url: "/briefs/feed.xml", title: "SREI Briefs" },
        { url: "/papers/feed.xml", title: "SREI Working Papers" },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F5EFE3",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before paint: switches html.no-js → html.js so reveal "hidden" states
 * apply only when JavaScript works. If the reveal observer hasn't started
 * within 3s (blocked script, old browser), everything is shown.
 * On a first desktop visit to the home page it also adds html.intro for 1.3s,
 * which shows the CSS-only intro curtain (components/home/Intro).
 */
const bootScript = `(function(d){d.classList.remove('no-js');d.classList.add('js');try{if(location.pathname==='/'&&!sessionStorage.getItem('srei-intro')&&matchMedia('(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches){sessionStorage.setItem('srei-intro','1');d.classList.add('intro');var end=function(){d.classList.remove('intro');removeEventListener('keydown',end);removeEventListener('pointerdown',end)};setTimeout(end,1300);addEventListener('keydown',end);addEventListener('pointerdown',end)}}catch(e){}setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.add('reveal-fallback')},3000)})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`no-js ${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <ViewTransition>
          <main id="main" className="flex-1">
            {children}
          </main>
        </ViewTransition>
        <Footer />
        <Revealer />
        <SmoothScroll />
        <Analytics />
      </body>
    </html>
  );
}
