"use client";

import { useEffect, useRef } from "react";
import { SNOWI_LQIP } from "@/lib/snowiLqip";

/**
 * Snowi's avatar with a pixel reveal, in the spirit of the site's pixel grid:
 *  - while it loads, a 12x12 version is already on screen as big square pixels (paints at once, no JavaScript needed);
 *  - when the real image has arrived and the avatar is in view, the pixels sharpen step by step (8, 14, 22 ... blocks
 *    across) until the picture is crisp;
 *  - on hover (or a tap) it replays the same pixel render: it drops back to big pixels and resolves again. The hand-over from
 *    the canvas to the sharp image is a hard swap of identical pictures, never a crossfade, so nothing bounces or flickers.
 * AVIF first, WebP as the fallback. With "reduce motion", or if the canvas fails, the plain image is shown.
 */
const STEPS = [8, 14, 22, 34, 52, 80, 124, 190, 300]; // blocks across, coarse to fine
const STEP_MS = 80;

export default function PixelImage({ alt, size, className = "" }: { alt: string; size: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const play = useRef<() => void>(() => {});

  useEffect(() => {
    const el = box.current;
    const image = img.current;
    const canvas = cv.current;
    const ctx = canvas?.getContext("2d");
    if (!el || !image || !canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const small = document.createElement("canvas");
    const sctx = small.getContext("2d");
    if (!sctx) return;

    let running = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let visible = false;
    let started = false;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    };
    const draw = (n: number) => {
      const nh = Math.max(1, Math.round((n * image.naturalHeight) / image.naturalWidth));
      small.width = n;
      small.height = nh;
      sctx.drawImage(image, 0, 0, n, nh);
      ctx.imageSmoothingEnabled = false; // hard square pixels
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(small, 0, 0, n, nh, 0, 0, canvas.width, canvas.height);
    };

    /** The last frame: the real image at full resolution, so the hand-over to the <img> is pixel for pixel the same. */
    const drawFull = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    const run = () => {
      if (running || !image.naturalWidth) return;
      running = true;
      timers.forEach(clearTimeout);
      timers = [];
      fit();
      draw(STEPS[0]); // the first pixels are on the canvas before the sharp image is taken away: no empty frame
      delete el.dataset.done;
      STEPS.slice(1).forEach((n, i) => timers.push(setTimeout(() => draw(n), (i + 1) * STEP_MS)));
      timers.push(setTimeout(drawFull, STEPS.length * STEP_MS));
      timers.push(
        setTimeout(() => {
          el.dataset.done = "1"; // canvas off and sharp image on in the same frame: no crossfade, nothing to flicker
          running = false;
        }, STEPS.length * STEP_MS + 40),
      );
    };
    play.current = run;

    el.dataset.js = "1"; // from now on the sharp <img> stays hidden until the reveal has finished
    const begin = () => {
      if (started || !visible || !image.naturalWidth) return;
      started = true;
      run();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        begin();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    if (image.complete) begin();
    else {
      image.addEventListener("load", begin, { once: true });
      image.addEventListener("error", () => (el.dataset.done = "1"), { once: true }); // never leave it hidden
    }

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      image.removeEventListener("load", begin);
    };
  }, []);

  return (
    <div
      ref={box}
      onPointerEnter={() => play.current()}
      onPointerDown={() => play.current()}
      className={`pixel-img relative overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${SNOWI_LQIP})`, aspectRatio: "1 / 1" }}
    >
      <picture>
        <source srcSet="/assets/snowi.avif" type="image/avif" />
        <source srcSet="/assets/snowi.webp" type="image/webp" />
        <img ref={img} src="/assets/snowi.webp" alt={alt} width={size} height={size} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
      </picture>
      <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
