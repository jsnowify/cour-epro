import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Zen_Dots } from "next/font/google";
import PageScramble from "@/components/PageScramble";
import LinkScramble from "@/components/LinkScramble";
import ConsentNotice from "@/components/ConsentNotice";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { PORTFOLIO_URL } from "@/lib/links";
import { SITE_URL, SUMMARY, siteLd } from "@/lib/site";
import "./globals.css";

const zenDots = Zen_Dots({ weight: "400", subsets: ["latin"], variable: "--font-zen-dots" });

const TITLE = "COUR E-PRO | Mobile Legends esports team, Philippines";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | COUR E-PRO" },
  description: SUMMARY,
  applicationName: "COUR E-PRO",
  keywords: [
    "COUR E-PRO",
    "Aeronova Esport",
    "Mobile Legends",
    "MLBB",
    "esports team Philippines",
    "MLBB tryouts",
    "PH server",
    "COUR UNO",
    "COUR DOS",
    "Snowi",
  ],
  authors: [{ name: "Snowi", url: PORTFOLIO_URL }],
  creator: "Snowi",
  publisher: "COUR E-PRO",
  category: "esports",
  alternates: { canonical: "/", languages: { "en-PH": "/" } },
  openGraph: { type: "website", siteName: "COUR E-PRO", locale: "en_PH", url: SITE_URL, title: TITLE, description: SUMMARY },
  twitter: { card: "summary_large_image", title: TITLE, description: SUMMARY },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Google Search Console (the same site is also verified by the HTML file in /public)
  verification: { google: "iB53T08hbGrfdsAmrKTVhocsuFV5rgOwT5imiFu2Iu8" },
  // regional hints for search and AI engines
  other: { "geo.region": "PH", "geo.placename": "Philippines", "content-language": "en-PH" },
};

export const viewport: Viewport = { themeColor: "#c8102e" };

const jetbrainsMono = JetBrains_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-jetbrains-mono" });

// Scales the 1440px design to the viewport width at >= 1100px (a static scale factor, not an animation).
const zoomScript =
  "(function(){function z(){var w=document.documentElement.clientWidth;document.documentElement.style.setProperty('--z',w>=1100?String(w/1440):'1')}z();window.addEventListener('resize',z)})()";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PH" className={`${zenDots.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-code antialiased">
        <script dangerouslySetInnerHTML={{ __html: zoomScript }} />
        <noscript>
          <style>{".preloader{display:none!important}"}</style>
        </noscript>
        <JsonLd data={siteLd} />
        <Preloader />
        <SmoothScroll />
        <PageScramble />
        <LinkScramble />
        <ConsentNotice />
        {children}
      </body>
    </html>
  );
}
