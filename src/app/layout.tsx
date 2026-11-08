import type { Metadata } from "next";
import { JetBrains_Mono, Zen_Dots } from "next/font/google";
import PageScramble from "@/components/PageScramble";
import LinkScramble from "@/components/LinkScramble";
import ConsentNotice from "@/components/ConsentNotice";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const zenDots = Zen_Dots({ weight: "400", subsets: ["latin"], variable: "--font-zen-dots" });

export const metadata: Metadata = {
  title: "COUR E-PRO",
  description: "COUR E-PRO — Mobile Legends: Bang Bang esports team. PH server.",
};

const jetbrainsMono = JetBrains_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-jetbrains-mono" });

// Scales the 1440px design to the viewport width at >= 1100px (a static scale factor, not an animation).
const zoomScript =
  "(function(){function z(){var w=document.documentElement.clientWidth;document.documentElement.style.setProperty('--z',w>=1100?String(w/1440):'1')}z();window.addEventListener('resize',z)})()";

// Played once per browser session: later loads hide the preloader before the first paint.
const preloadedScript = "try{if(sessionStorage.getItem('cour_preloaded'))document.documentElement.setAttribute('data-preloaded','')}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${zenDots.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-code antialiased">
        <script dangerouslySetInnerHTML={{ __html: preloadedScript }} />
        <script dangerouslySetInnerHTML={{ __html: zoomScript }} />
        <noscript>
          <style>{".preloader{display:none!important}"}</style>
        </noscript>
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
