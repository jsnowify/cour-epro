"use client";

import { useEffect } from "react";
import { nearGlyph } from "@/lib/scramble";

/**
 * Hover scramble for text links ("VIEW SQUAD →", "READ STORY →", footer links...). One delegated listener, nothing per link.
 * Skipped for links that are buttons/cards (contain an image) and with reduced motion. Includes the header nav tabs.
 * Letters near the pointer-enter turn into neighbouring letters and settle left to right in ~0.45s.
 */
const DURATION = 450;
const TICK = 40;
const LETTER = /[A-Za-z0-9]/;

function textNodes(root: Element): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode as Text;
    if (LETTER.test(n.nodeValue ?? "")) out.push(n);
  }
  return out;
}

export default function LinkScramble() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onOver = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.hasAttribute("data-hs") || a.querySelector("img")) return;
      if (a.contains(e.relatedTarget as Node | null)) return; // moving between children of the same link
      const nodes = textNodes(a);
      if (!nodes.length) return;

      const items = nodes.map((node) => {
        const text = node.nodeValue ?? "";
        return { node, text, at: Array.from(text, (_, i) => (i / text.length) * DURATION * 0.75 + Math.random() * DURATION * 0.25) };
      });
      a.setAttribute("data-hs", ""); // lets the page transition ignore this link's temporary text
      const start = performance.now();

      const timer = setInterval(() => {
        const t = performance.now() - start;
        const done = t >= DURATION;
        for (const { node, text, at } of items) {
          let out = "";
          for (let i = 0; i < text.length; i++) out += !done && t < at[i] && LETTER.test(text[i]) ? nearGlyph(text[i]) : text[i];
          if (node.nodeValue !== out) node.nodeValue = out;
        }
        if (done) {
          clearInterval(timer);
          a.removeAttribute("data-hs");
        }
      }, TICK);
    };

    document.addEventListener("mouseover", onOver);
    return () => document.removeEventListener("mouseover", onOver);
  }, []);

  return null;
}
