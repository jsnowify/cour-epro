"use client";

import { useEffect, useRef } from "react";

/**
 * Preloader in the COUR \ style. One line across the middle of the screen: the count on the left, the logo in the middle,
 * COUR on the right. As the count climbs (00 to 100) the whole screen steps through six frames:
 *   00 white / black   20 crimson / black   40 black / crimson   60 white / crimson   80 crimson / white   100 black / white
 * (background / ink). After 100 the exit is a short sequence, not a cut: it holds on the last frame, the count and COUR slide
 * out to the sides while the logo shrinks away, then the curtain lifts off the top with a long ease and a crimson edge
 * riding along its bottom while the page fades in underneath.
 *
 * The count is real: it eases toward 92% while the page loads and only reaches 100 once the window has loaded and the fonts
 * are ready (never sooner than MIN_MS, so the frames are always readable; never later than FAILSAFE_MS). It plays on every
 * full load and reload (moving between pages inside the site does not replay it: the layout stays mounted). With "reduce
 * motion" it never shows, and without JavaScript a <noscript> rule hides it. Nothing re-renders while it runs: it only writes to the DOM.
 */
const MIN_MS = 1700;
const FAILSAFE_MS = 7000;
const FRAMES = [0, 20, 40, 60, 80, 100]; // the count at which each frame begins
const HOLD_MS = 600; // stay on the 100 frame
const INK_MS = 380; // head start of the ink sliding out before the curtain moves
const LIFT_MS = 1300; // the curtain (matches the CSS)

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const edge = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.hidden = true;
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
      // 1. hold the last frame  2. the ink slides out  3. the curtain lifts, the page fades in
      setTimeout(() => {
        el.dataset.leaving = "ink";
        setTimeout(() => {
          html.setAttribute("data-revealing", "");
          el.dataset.leaving = "lift";
          if (edge.current) edge.current.dataset.leaving = "lift";
          const end = () => {
            el.hidden = true;
            if (edge.current) edge.current.hidden = true;
            html.style.overflow = prevOverflow;
            setTimeout(() => html.removeAttribute("data-revealing"), 200);
          };
          setTimeout(end, LIFT_MS + 80);
        }, INK_MS);
      }, HOLD_MS);
    };

    const tick = (t: number) => {
      const elapsed = t - start;
      const ready = loaded && fonts && elapsed >= MIN_MS;
      const target = ready ? 100 : Math.min(92, (elapsed / MIN_MS) * 92);
      cur += (target - cur) * 0.14 + (target > cur ? 0.12 : 0); // ease toward the target, with a floor so it always arrives
      if (ready && cur > 99.2) cur = 100;
      paint(Math.max(0, Math.min(100, Math.round(cur))));
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
        <span ref={num} aria-hidden className="pl-num text-[clamp(12px,1.1vw,18px)] tabular-nums leading-none">
          00
        </span>
        <span
          aria-hidden
          className="pl-logo absolute left-1/2 top-1/2 block aspect-[107/73] w-[clamp(54px,5.2vw,92px)] -translate-x-1/2 -translate-y-1/2 bg-current"
          style={{ WebkitMask: "url(/assets/press/cour-e-pro-logo.svg) center / contain no-repeat", mask: "url(/assets/press/cour-e-pro-logo.svg) center / contain no-repeat" }}
        />
        <span aria-hidden className="pl-cour text-[clamp(12px,1.1vw,18px)] leading-none">
          COUR
        </span>
        {/* crosshair marks in the corners, like the page grid */}
        <span aria-hidden className={`${cross} left-3 top-3`}>+</span>
        <span aria-hidden className={`${cross} right-3 top-3`}>+</span>
        <span aria-hidden className={`${cross} bottom-3 left-3`}>+</span>
        <span aria-hidden className={`${cross} bottom-3 right-3`}>+</span>
      </div>
      {/* crimson edge that rides along the bottom of the curtain while it lifts */}
      <span ref={edge} aria-hidden className="pl-edge" />
    </>
  );
}
