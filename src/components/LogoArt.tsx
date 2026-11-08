"use client";

import { useEffect, useRef, type Ref } from "react";

/**
 * The COUR logo, alive. Two exported Figma layers (body rotated 180 degrees, small mark on top) plus:
 *  - the mark is an "eye": it follows the cursor a few pixels, and the body leans a little the same way;
 *  - it blinks by itself every few seconds, and when you press it the whole logo squashes and bounces;
 *  - toTop: the logo is a button that bounces and then scrolls the page back to the top (used in the footer).
 * Pointer tracking is one rAF per move, writing CSS variables only (no React renders). Reduced motion: static logo.
 */
const MARK = { left: "45.98%", top: "12.01%", width: "7.94%", height: "11.58%" };

export default function LogoArt({ toTop = false }: { toTop?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const eye = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (px - (r.left + r.width / 2)) / 320));
      const ny = Math.max(-1, Math.min(1, (py - (r.top + r.height / 2)) / 320));
      el.style.setProperty("--mx", `${(nx * 3).toFixed(2)}px`);
      el.style.setProperty("--my", `${(ny * 3).toFixed(2)}px`);
      el.style.setProperty("--bx", `${(nx * 1.4).toFixed(2)}px`);
      el.style.setProperty("--by", `${(ny * 1.4).toFixed(2)}px`);
      el.style.setProperty("--rot", `${(nx * 2.5).toFixed(2)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // blink now and then
    let timer: ReturnType<typeof setTimeout>;
    const blink = () => {
      if (visible && !document.hidden) eye.current?.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0.1)" }, { transform: "scaleY(1)" }], { duration: 220 });
      timer = setTimeout(blink, 3500 + Math.random() * 4500);
    };
    timer = setTimeout(blink, 2500);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  /** Press: squash and bounce, blink; as a back-to-top button it then scrolls up. */
  const press = () => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.9, 0.84)", offset: 0.3 }, { transform: "scale(1.07, 1.1)", offset: 0.65 }, { transform: "scale(1)" }],
        { duration: 420, easing: "ease-out" },
      );
      eye.current?.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0.1)" }, { transform: "scaleY(1)" }], { duration: 260 });
    }
    if (toTop) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const art = (
    <>
      {/* body: leans with the cursor */}
      <span
        className="absolute inset-0 block transition-transform duration-200 ease-out"
        style={{ transform: "translate(var(--bx, 0px), var(--by, 0px)) rotate(var(--rot, 0deg))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/v3/logo-main.svg" alt="" className="block h-full w-full rotate-180" draggable={false} />
      </span>
      {/* eye: follows the cursor */}
      <span
        className="absolute block transition-transform duration-150 ease-out"
        style={{ ...MARK, transform: "translate(var(--mx, 0px), var(--my, 0px))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={eye} src="/assets/v3/logo-mark.svg" alt="" className="block h-full w-full origin-center" draggable={false} />
      </span>
    </>
  );

  const cls = "relative block h-full w-full transition-transform duration-300 ease-out hover:scale-[1.06] focus-visible:outline-none";
  return toTop ? (
    <button ref={root as unknown as Ref<HTMLButtonElement>} type="button" aria-label="Back to top" onClick={press} className={cls}>
      {art}
    </button>
  ) : (
    <span ref={root} onPointerDown={press} className={cls}>
      {art}
    </span>
  );
}
