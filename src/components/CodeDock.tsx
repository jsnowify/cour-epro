"use client";

import CodeLine from "@/components/CodeLine";
import { CODE } from "@/lib/code";
import { isDesktop, onFrame } from "@/lib/frame";
import { useEffect, useState } from "react";

/**
 * Mobile version of the right-rail code editor: a docked editor pinned to the bottom of the screen.
 * Every STEP px you scroll prints one more line (scroll back up and it un-prints), the newest line types itself in and
 * carries the blinking cursor, and only the last VISIBLE lines are shown, like a terminal tail. Tap the title bar to fold
 * it down to a slim bar. It slides away when the footer comes into view so it never covers it.
 */
const VISIBLE = 4;
const START = 9; // line index printed at scroll 0
const STEP = 48; // px of scroll per printed line

export default function CodeDock() {
  const [n, setN] = useState(START);
  const [open, setOpen] = useState(true);
  const [away, setAway] = useState(false);

  useEffect(
    () =>
      onFrame(() => {
        if (isDesktop()) return;
        const next = START + Math.floor(window.scrollY / STEP);
        const foot = [...document.querySelectorAll("[data-footer]")].find((el) => (el as HTMLElement).offsetParent !== null);
        const gone = !!foot && foot.getBoundingClientRect().top < window.innerHeight - 48;
        return () => {
          setN(next);
          setAway(gone);
        };
      }),
    [],
  );

  const lines = [];
  for (let i = Math.max(0, n - VISIBLE + 1); i <= n; i++) lines.push({ no: i, text: CODE[i % CODE.length] });
  const cur = CODE[n % CODE.length];

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black text-[11px] leading-[18px] text-white transition-transform duration-500 ease-out [font-variant-ligatures:none] md:hidden ${
        away ? "translate-y-full" : "translate-y-0"
      }`}
    >
      {/* title bar: tap to fold */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle code editor"
        className="flex h-[28px] w-full items-end gap-[8px] bg-[#141414] pl-[12px] pr-[12px] text-left"
      >
        <span className="mb-[11px] h-[5px] w-[5px] bg-crimson" />
        <span className="border-t border-crimson bg-black px-[10px] pb-[4px] pt-[4px] text-[10px] leading-[14px]">team.ts</span>
        <span className="mb-[9px] ml-auto text-white/50">
          <svg viewBox="0 0 10 10" width="10" height="10" fill="currentColor" className={`transition-transform duration-300 ${open ? "" : "rotate-180"}`}>
            <path d="M0 3h10L5 8z" />
          </svg>
        </span>
      </button>

      {/* code */}
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="py-[6px]">
            {lines.map((l, k) => (
              <CodeLine key={l.no} no={l.no} text={l.text} cur={k === lines.length - 1} gutter="w-[40px] pr-[12px]" cursor="h-[14px] w-[6px] translate-y-[2px]" />
            ))}
          </div>
        </div>
      </div>

      {/* status bar */}
      <div className="flex h-[22px] items-center justify-between bg-crimson px-[12px] text-[10px] leading-none text-white">
        <span>
          Ln {(n % CODE.length) + 1}, Col {cur.length + 1}
        </span>
        <span>TS</span>
      </div>
    </div>
  );
}
