"use client";

import { useEffect, useRef } from "react";

/**
 * Preloader in the COUR \ style. One line across the middle of the screen: the count on the left, the logo in the middle,
 * COUR on the right. As the count climbs (01 to 100) the whole screen steps through six frames:
 *   01 white / black   20 crimson / black   40 black / crimson   60 white / crimson   80 crimson / white   100 black / white
 * (background / ink), then the curtain lifts off the top of the page.
 *
 * The count is real: it eases toward 92% while the page loads and only reaches 100 once the window has loaded and the fonts
 * are ready (never sooner than MIN_MS, so the frames are always readable; never later than FAILSAFE_MS). It plays once per
 * browser session; an inline script in the layout hides it before first paint on later loads. With "reduce motion" it never
 * shows, and without JavaScript a <noscript> rule hides it. Nothing re-renders while it runs: it only writes to the DOM.
 */
const MIN_MS = 1700;
const FAILSAFE_MS = 7000;
const FRAMES = [1, 20, 40, 60, 80, 100]; // the count at which each frame begins

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const skip = html.hasAttribute("data-preloaded") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const remember = () => {
      try {
        sessionStorage.setItem("cour_preloaded", "1");
      } catch {
        /* storage blocked: it just plays again next time */
      }
    };
    if (skip) {
      el.hidden = true;
      remember();
      return;
    }

    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    let loaded = document.readyState === "complete";
    let fonts = false;
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    void document.fonts?.ready.then(() => (fonts = true)).catch(() => (fonts = true));
    if (!document.fonts) fonts = true;

    let cur = 0;
    let raf = 0;
    let finished = false;
    const start = performance.now();

    const paint = (n: number) => {
      let stage = 0;
      for (let i = 0; i < FRAMES.length; i++) if (n >= FRAMES[i]) stage = i;
      if (el.dataset.stage !== String(stage)) el.dataset.stage = String(stage);
      if (num.current) num.current.textContent = String(n).padStart(2, "0");
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      paint(100);
      remember();
      // hold the last frame for a beat, then lift the curtain
      setTimeout(() => {
        el.dataset.leaving = "";
        const end = () => {
          el.hidden = true;
          html.style.overflow = prevOverflow;
        };
        el.addEventListener("transitionend", end, { once: true });
        setTimeout(end, 1200); // in case transitionend never fires
      }, 320);
    };

    const tick = (t: number) => {
      const elapsed = t - start;
      const ready = loaded && fonts && elapsed >= MIN_MS;
      const target = ready ? 100 : Math.min(92, (elapsed / MIN_MS) * 92);
      cur += (target - cur) * 0.14 + (target > cur ? 0.12 : 0); // ease toward the target, with a floor so it always arrives
      if (ready && cur > 99.2) cur = 100;
      paint(Math.max(1, Math.min(100, Math.round(cur))));
      if (cur >= 100) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const failsafe = setTimeout(finish, FAILSAFE_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      html.style.overflow = prevOverflow;
    };
  }, []);

  const cross = "absolute text-[10px] leading-none opacity-60";
  return (
    <>
      <link rel="preload" href="/assets/press/cour-e-pro-logo.svg" as="image" />
      <div
        ref={root}
        id="preloader"
        data-stage="0"
        role="status"
        aria-live="polite"
        aria-label="Loading COUR E-PRO"
        className="preloader fixed inset-0 z-[100] flex items-center justify-between px-[clamp(14px,2vw,36px)] font-display"
      >
        <span ref={num} aria-hidden className="text-[clamp(12px,1.1vw,18px)] tabular-nums leading-none">
          01
        </span>
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 block aspect-[107/73] w-[clamp(54px,5.2vw,92px)] -translate-x-1/2 -translate-y-1/2 bg-current"
          style={{ WebkitMask: "url(/assets/press/cour-e-pro-logo.svg) center / contain no-repeat", mask: "url(/assets/press/cour-e-pro-logo.svg) center / contain no-repeat" }}
        />
        <span aria-hidden className="text-[clamp(12px,1.1vw,18px)] leading-none">
          COUR
        </span>
        {/* crosshair marks in the corners, like the page grid */}
        <span aria-hidden className={`${cross} left-3 top-3`}>+</span>
        <span aria-hidden className={`${cross} right-3 top-3`}>+</span>
        <span aria-hidden className={`${cross} bottom-3 left-3`}>+</span>
        <span aria-hidden className={`${cross} bottom-3 right-3`}>+</span>
      </div>
    </>
  );
}
