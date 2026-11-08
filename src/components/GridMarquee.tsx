"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive grid under the header (2 rows x 6 columns on the 180px grid, md+). "Pixel paint":
 *  - hover: a cell fills crimson with the same left-to-right sweep as the buttons and tabs (it leaves to the right),
 *    keeps a soft afterglow that fades out, and prints its grid coordinate (C3·R1) like a blueprint inspector;
 *  - click: a ripple runs out from that cell, ring by ring, and the clicked cell flashes its coordinate;
 *  - idle: a faint scanner walks the grid so it is never static; it stops while you play with it.
 * Hover is pure CSS; the ripple and the scanner use the Web Animations API (opacity only), so there is no per-frame JS.
 */
const COLS = 6;
const ROWS = 2;
const CELL_MS = 1100; // time between scanner steps
const RING_MS = 110; // delay per ring of the ripple
const IDLE_AFTER = 2500; // the scanner waits this long after the last interaction

const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ i, col: i % COLS, row: Math.floor(i / COLS) }));
// snake order for the scanner: top row left to right, bottom row right to left
const SNAKE = [0, 1, 2, 3, 4, 5, 11, 10, 9, 8, 7, 6];

export default function GridMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const lastTouch = useRef(0);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pulse = (i: number) => el.querySelector<HTMLElement>(`[data-cell="${i}"] [data-pulse]`);
    let step = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const id = setInterval(() => {
      if (document.hidden || !visible || Date.now() - lastTouch.current < IDLE_AFTER) return;
      pulse(SNAKE[step++ % SNAKE.length])?.animate([{ opacity: 0 }, { opacity: 0.16, offset: 0.35 }, { opacity: 0 }], { duration: 1500, easing: "ease-out" });
    }, CELL_MS);

    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, []);

  const touch = () => {
    lastTouch.current = Date.now();
  };

  /** Click: ripple outwards ring by ring from the clicked cell. */
  const ripple = (e: React.PointerEvent<HTMLDivElement>) => {
    touch();
    const origin = (e.target as HTMLElement).closest<HTMLElement>("[data-cell]");
    if (!origin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const o = cells[Number(origin.dataset.cell)];
    for (const c of cells) {
      const ring = Math.max(Math.abs(c.col - o.col), Math.abs(c.row - o.row));
      const layer = root.current?.querySelector<HTMLElement>(`[data-cell="${c.i}"] [data-pulse]`);
      layer?.animate([{ opacity: 0 }, { opacity: ring === 0 ? 1 : 0.8, offset: 0.2 }, { opacity: 0 }], { duration: 750, delay: ring * RING_MS, easing: "ease-out" });
    }
    origin.querySelector<HTMLElement>("[data-tag]")?.animate([{ opacity: 1 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], { duration: 1300 });
  };

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute left-0 top-0 h-[361px] w-full max-md:hidden" onPointerDown={ripple} onPointerMove={touch}>
      {cells.map((c) => (
        <span
          key={c.i}
          data-cell={c.i}
          className="group pointer-events-auto absolute h-[179px] w-[179px] cursor-crosshair overflow-hidden"
          style={{ left: 181 + 180 * c.col, top: 1 + 180 * c.row }}
        >
          {/* ripple + scanner layer */}
          <span data-pulse className="absolute inset-0 bg-crimson opacity-0" />
          {/* afterglow: on instantly while hovered, fades out slowly after you leave */}
          <span className="absolute inset-0 bg-crimson opacity-0 transition-opacity duration-[1400ms] ease-out group-hover:opacity-30 group-hover:duration-0" />
          {/* sweep: in from the left, out to the right */}
          <span className="absolute inset-0 origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
          {/* grid coordinate */}
          <span className="absolute bottom-[10px] left-[12px] text-[10px] font-bold tracking-[0.8px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {`C${c.col + 1}·R${c.row + 1}`}
          </span>
          {/* coordinate flash on click */}
          <span data-tag className="absolute bottom-[10px] left-[12px] text-[10px] font-bold tracking-[0.8px] text-white opacity-0">
            {`C${c.col + 1}·R${c.row + 1}`}
          </span>
        </span>
      ))}
    </div>
  );
}
