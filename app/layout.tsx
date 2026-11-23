import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Instrument_Serif } from "next/font/google";
import { ViewTransition } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Revealer } from "@/components/motion/Revealer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

// Fonts: Instrument Serif (editorial headlines, with italic for accents),
// Inter (body), IBM Plex Mono (small technical labels). Latin subset only.
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap", preload: false });

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
  themeColor: "#101B33",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before paint: switches html.no-js → html.js so reveal "hidden" states
 * apply only when JavaScript works. If the reveal observer hasn't started
 * within 3s (blocked script, old browser), everything is shown.
 * On the first visit to the home page in a session (tablet/desktop; phones skip
 * it so they never wait) it adds html.intro for 1.2s,
 * which shows the CSS-only intro curtain (components/home/Intro).
 */
const bootScript = `(function(d){d.classList.remove('no-js');d.classList.add('js');try{if(location.pathname==='/'&&!sessionStorage.getItem('srei-intro')&&matchMedia('(min-width:768px) and (prefers-reduced-motion:no-preference)').matches){sessionStorage.setItem('srei-intro','1');d.classList.add('intro');var end=function(){d.classList.remove('intro');removeEventListener('keydown',end);removeEventListener('pointerdown',end)};setTimeout(end,1200);addEventListener('keydown',end);addEventListener('pointerdown',end)}}catch(e){}setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.add('reveal-fallback')},3000)})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`no-js ${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
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
