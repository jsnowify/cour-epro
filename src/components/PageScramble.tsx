"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { nearGlyph } from "@/lib/scramble";

/**
 * Page transition: scramble the current page out, navigate instantly, scramble the new page in.
 * Design notes and the stuck-text bug this guards against: docs/page-transition.md
 */

const OUT_MS = 380; // current page scrambles out
const IN_MS = 750; // new page resolves in
const TICK = 45; // ms between glyph re-rolls
const FAILSAFE_MS = 4000; // if navigation has not happened this long after scramble-out, undo it
const SCRAMBLEABLE = /[A-Za-z0-9]/;

type Item = { node: Text; text: string; at: number[] };

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Real text of every text node we have scrambled and not yet restored.
 * Single source of truth for "what this node is supposed to say": the DOM's current value can be scrambled
 * (Next keeps previous routes mounted and hidden), so it must never be read back as the original.
 */
const scrambled = new Map<Text, string>();
let current: { cancel: () => void } | null = null;

/** Put every scrambled node back to its real text and stop any running animation. */
function restoreAll() {
  current?.cancel();
  current = null;
  for (const [node, text] of scrambled) if (node.nodeValue !== text) node.nodeValue = text;
  scrambled.clear();
}

/** Only the page the user can see: Next keeps older routes mounted but hidden, and they have their own <main>. */
function visibleRoots(): Element[] {
  const mains = Array.from(document.querySelectorAll("main"));
  const visible = mains.filter((m) => (m.checkVisibility ? m.checkVisibility() : m.offsetParent !== null));
  return visible.length ? visible : [document.body];
}

/** Text nodes with letters/digits on the visible page, each with per-character trigger times (ms). */
function collect(duration: number): Item[] {
  const nodes: Text[] = [];
  for (const root of visibleRoots()) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const parent = n.parentElement;
        if (!parent || parent.closest("script,style,noscript,[data-drift],[data-hs]")) return NodeFilter.FILTER_REJECT;
        const real = scrambled.get(n as Text) ?? n.nodeValue ?? "";
        return SCRAMBLEABLE.test(real) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  }
  return nodes.map((node, ni) => {
    const text = scrambled.get(node) ?? node.nodeValue ?? "";
    const f = ni / nodes.length;
    // mostly document order, plus jitter
    const at = Array.from(text, (_, ci) => (f * 0.4 + (ci / text.length) * 0.1 + Math.random() * 0.35) * duration);
    return { node, text, at };
  });
}

/**
 * Runs the scramble. "in": starts fully scrambled, each character resolves to its real value.
 * "out": starts real, each character turns into noise and stays noise (until restoreAll()).
 */
function run(items: Item[], mode: "in" | "out", duration: number, onDone?: () => void) {
  restoreAll(); // never overlap two animations, and never start from half-scrambled text

  for (const { node, text } of items) scrambled.set(node, text);

  const paint = (elapsed: number) => {
    for (const { node, text, at } of items) {
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const noisy = mode === "in" ? elapsed < at[i] : elapsed >= at[i];
        out += SCRAMBLEABLE.test(c) && noisy ? nearGlyph(c) : c;
      }
      if (node.nodeValue !== out) node.nodeValue = out;
    }
  };

  let raf = 0;
  let last = -TICK;
  const start = performance.now();

  const frame = (now: number) => {
    const elapsed = now - start;
    if (elapsed >= duration) {
      if (mode === "in") {
        restoreAll();
      } else {
        paint(duration);
        current = null; // finished; nodes stay noisy and tracked in `scrambled` for the failsafe / next page
      }
      onDone?.();
      return;
    }
    if (now - last >= TICK) {
      last = now;
      paint(elapsed);
    }
    raf = requestAnimationFrame(frame);
  };

  current = { cancel: () => cancelAnimationFrame(raf) };
  paint(0); // "in": scrambled before first paint, so the real text never flashes
  raf = requestAnimationFrame(frame);
}

/**
 * Page transition. No fade, slide or delay on the page itself:
 *  1. clicking an internal link scrambles the CURRENT page's text out (~0.4s),
 *  2. then navigates instantly,
 *  3. the NEW page mounts already scrambled and resolves into its real text (~0.75s).
 * Skipped on first load, on browser back/forward (only the "in" part runs) and with prefers-reduced-motion.
 */
export default function PageScramble() {
  const pathname = usePathname();
  const router = useRouter();
  // Last pathname we have seen. Comparing against it (instead of a "first run" flag) keeps the initial load,
  // including React Strict Mode's double effect run, from ever touching server-rendered text before hydration ends.
  const prev = useRef<string | null>(null);
  const leaving = useRef(false);
  const failsafe = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // "in": runs when the route has changed
  useLayoutEffect(() => {
    clearTimeout(failsafe.current);
    leaving.current = false;
    if (prev.current === pathname) return;
    const initial = prev.current === null;
    prev.current = pathname;
    if (initial) return;

    // The page we just left may still be mounted (hidden) with noisy text: put it back before anything else.
    restoreAll();
    if (reduced()) return;
    const items = collect(IN_MS);
    if (items.length) run(items, "in", IN_MS);
  }, [pathname]);

  // "out": intercept internal link clicks, scramble, then navigate
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (reduced()) return;

      e.preventDefault();
      e.stopPropagation(); // keep Next's own Link handler from navigating before we are done
      window.dispatchEvent(new Event("cour:navigate")); // lets open dialogs (news reader, press kit) close before the page text scrambles out
      if (leaving.current) return;
      leaving.current = true;

      const go = () => {
        // If the route never changes (navigation failed or was superseded), undo the noise and unlock links.
        failsafe.current = setTimeout(() => {
          restoreAll();
          leaving.current = false;
        }, FAILSAFE_MS);
        router.push(url.pathname + url.search + url.hash);
      };
      const items = collect(OUT_MS);
      if (!items.length) return go();
      run(items, "out", OUT_MS, go);
    };

    // Coming back from the bfcache must never show half-scrambled text.
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      restoreAll();
      leaving.current = false;
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
      clearTimeout(failsafe.current);
    };
  }, [router]);

  return null;
}
