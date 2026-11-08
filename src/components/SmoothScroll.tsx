"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scroll on its own animation frame loop (it pauses by itself when the tab is hidden). */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
