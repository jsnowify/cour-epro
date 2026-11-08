"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { nearGlyph } from "@/lib/scramble";
import { onFrame, requestFrame } from "@/lib/frame";

/**
 * Scroll-based scramble for sub texts. No timers: the text only changes while you scroll.
 * Only in a short band near the bottom of the screen: letters turn to noise from the right and settle left to right
 * as the text moves up, so it is already clean well before it reaches the middle. Scrolling back down scrambles it again.
 * Wrap plain string children only. The font is monospace, so noise never shifts the layout.
 */

type Item = { el: HTMLElement; text: string; u: number[]; shown: string };

const items = new Set<Item>();
let idle: ReturnType<typeof setTimeout> | undefined;
let unsubscribe: (() => void) | undefined;

/** Scrolling stopped: every text settles to its real value, so nothing can stay scrambled (e.g. at the page bottom). */
function settle() {
  for (const it of items) {
    if (it.el.textContent !== it.text) it.el.textContent = it.text;
    it.shown = it.text;
  }
}

/** Frame task: read every text's position first, then write only the texts whose scrambled string changed. */
function task() {
  clearTimeout(idle);
  idle = setTimeout(settle, 160);
  const vh = window.innerHeight;
  const changes: [Item, string][] = [];
  for (const it of items) {
    const top = it.el.getBoundingClientRect().top;
    // texts well above (already clean) or below the screen (not visible yet) need no per-letter work
    if ((top < -40 && it.shown === it.text) || top > vh * 1.05) continue;
    // short band: clean above 60% of the screen height, fully noisy only at 90% (near the bottom edge)
    const t = Math.min(1, Math.max(0, (top - vh * 0.6) / (vh * 0.3)));
    let out = "";
    const n = it.text.length;
    for (let i = 0; i < n; i++) {
      const c = it.text[i];
      // left letters settle first, right letters last, with a little jitter: a quick sweep, not a block of noise
      const s = 0.92 - 0.7 * (i / n) - it.u[i] * 0.12;
      out += t > s && /[A-Za-z0-9]/.test(c) ? nearGlyph(c) : c;
    }
    if (out !== it.shown) changes.push([it, out]);
  }
  if (!changes.length) return;
  return () => {
    for (const [it, out] of changes) {
      it.el.textContent = out;
      it.shown = out;
    }
  };
}

export default function Drift({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const text = el.textContent ?? "";
    const it: Item = { el, text, u: Array.from(text, () => Math.random()), shown: text };
    items.add(it);
    if (!unsubscribe) unsubscribe = onFrame(task);
    else requestFrame();
    return () => {
      items.delete(it);
      clearTimeout(idle);
      if (el.textContent !== text) el.textContent = text;
      if (!items.size) {
        unsubscribe?.();
        unsubscribe = undefined;
      }
    };
  }, []);

  return (
    <span ref={ref} data-drift="" className="block">
      {children}
    </span>
  );
}
