"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@/components/canvas";
import { isDesktop, onFrame } from "@/lib/frame";

/**
 * Left-rail section index that follows the scroll. A crimson line grows down the rail as you scroll; when it reaches a
 * square, that square fills red (and stays filled while the line is below it). Squares only: no numbers or labels.
 * Positions are page-absolute 1440-design px, like the rest of the canvas.
 * Perf: the line grows with a transform (no layout), and React only re-renders when a new square is reached.
 */
const REACH = 0.6; // the line tracks this share of the viewport height
const DECOR = "max-md:hidden";

export default function RailIndex({
  items,
  y0 = 560,
  h = 1760,
}: {
  items: { y: number; label: string }[];
  y0?: number;
  h?: number;
}) {
  const line = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0); // how many squares the line has reached (items are sorted by y)

  useEffect(() => {
    const page = document.getElementById("top");
    if (!page) return;
    return onFrame(() => {
      if (!isDesktop()) return;
      const r = page.getBoundingClientRect();
      const scale = r.width / (page.offsetWidth || 1440) || 1;
      const pageY = Math.round((window.innerHeight * REACH - r.top) / scale); // design-px y the line has reached
      const fill = Math.max(0, Math.min(h, pageY - y0));
      const reached = items.filter((it) => pageY >= it.y + 6).length;
      return () => {
        if (line.current) line.current.style.transform = `scaleY(${h ? fill / h : 0})`;
        setCount(reached);
      };
    });
  }, [h, y0, items]);

  return (
    <>
      <Box x={24} y={y0} w={1} h={h} className="bg-black/20" />
      <Box ref={line} x={23} y={y0} w={3} h={h} className="origin-top scale-y-0 bg-crimson will-change-transform" />
      {items.map((it, i) => (
        <div key={it.y} className={`contents ${DECOR}`}>
          <Box
            x={20}
            y={it.y + 2}
            w={9}
            h={9}
            className={`border transition-colors duration-300 ${i < count ? "border-crimson bg-crimson" : "border-black bg-white"}`}
          />
        </div>
      ))}
    </>
  );
}
