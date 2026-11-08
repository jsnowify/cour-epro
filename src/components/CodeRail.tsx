"use client";

import { FOOTER_H } from "@/components/cour";
import CodeLine from "@/components/CodeLine";
import { CODE } from "@/lib/code";
import { isDesktop, onFrame } from "@/lib/frame";
import { useEffect, useRef } from "react";

/**
 * Right-rail code editor: dark panel with a title bar, line-number gutter, syntax colours and a status bar.
 * The file is printed down the rail exactly as far as you have scrolled: it grows while you scroll down, shrinks
 * again when you scroll up, and stops above the footer. The newest line is highlighted, types itself in and has a blinking
 * cursor. Opaque, so the page gridlines never cross the code.
 *
 * Perf: every line is rendered once. Scrolling only toggles which rows are visible and which one is current (plain DOM
 * writes inside the shared frame loop), so React renders nothing while you scroll.
 */

const START = 9; // lines already printed at scroll 0
const REACH = 0.8; // print down to this share of the viewport height
const MAX_LINES = 280; // more than the tallest rail can print

const ALL = Array.from({ length: MAX_LINES }, (_, i) => CODE[i % CODE.length]);

export default function CodeRail() {
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const shown = useRef(START); // index of the newest printed line

  useEffect(
    () =>
      onFrame(() => {
        if (!isDesktop()) return;
        const rows = list.current?.children;
        const area = wrap.current?.getBoundingClientRect();
        const line = rows?.[0]?.getBoundingClientRect();
        if (!rows || !area || !line || !line.height) return;
        // lines that fit down to REACH of the viewport, but never past the end of the rail area (the status bar needs ~1 line)
        const toViewport = Math.floor((window.innerHeight * REACH - line.top) / line.height);
        const toRailEnd = Math.floor((area.bottom - line.top) / line.height) - 2;
        const next = Math.min(MAX_LINES - 1, Math.max(START, Math.min(toViewport, toRailEnd)));
        if (next === shown.current) return;
        return () => {
          const prev = shown.current;
          const el = rows as HTMLCollectionOf<HTMLElement>;
          if (next > prev) for (let i = prev + 1; i <= next; i++) el[i].style.display = "";
          else for (let i = next + 1; i <= prev; i++) el[i].style.display = "none";
          el[prev]?.removeAttribute("data-cur");
          el[next].setAttribute("data-cur", "");
          shown.current = next;
          const cur = CODE[next % CODE.length];
          if (status.current) status.current.textContent = `Ln ${(next % CODE.length) + 1}, Col ${cur.length + 1}`;
        };
      }),
    [],
  );

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute left-[1261px] top-[361px] w-[179px] overflow-hidden max-md:hidden" style={{ bottom: FOOTER_H + 180 }}>
      <div className="mx-[5px] mt-[24px] overflow-hidden border border-white/10 bg-black text-[9px] leading-[17px] [font-variant-ligatures:none]">
        {/* title bar */}
        <div className="flex h-[24px] items-end gap-[6px] border-b border-white/10 bg-[#141414] pl-[8px]">
          <span className="mb-[9px] h-[5px] w-[5px] bg-crimson" />
          <span className="border-t border-crimson bg-black px-[8px] pb-[3px] pt-[3px] text-[9px] leading-[14px] text-white">team.ts</span>
        </div>
        {/* code: rows after START start hidden and are revealed while scrolling */}
        <div ref={list} className="py-[6px]">
          {ALL.map((text, i) => (
            <div key={i} style={i > START ? { display: "none" } : undefined}>
              <CodeLine no={i} text={text} cur={i === START} gutter="w-[26px] pr-[8px]" cursor="h-[12px] w-[5px] translate-y-[2px]" />
            </div>
          ))}
        </div>
        {/* status bar */}
        <div className="flex h-[18px] items-center justify-between bg-crimson px-[8px] text-[8px] leading-none text-white">
          <span ref={status}>
            Ln {(START % CODE.length) + 1}, Col {CODE[START % CODE.length].length + 1}
          </span>
          <span>TS</span>
        </div>
      </div>
    </div>
  );
}
