"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Season from "@/components/Season";
import { isDesktop, onFrame } from "@/lib/frame";
import { NAV } from "@/lib/grid";
import { DISCORD_URL } from "@/lib/links";

/**
 * Mobile header (<1100px), built as an editor chrome to match the code panel:
 *  - a frosted 56px bar: crimson logo cell, the current page as a file path (`~/cour/teams.tsx` + blinking cursor),
 *    a menu button: a 3x3 pixel grid that collapses into an X plus a MENU / EXIT label that rolls like a slot reel;
 *  - a crimson scroll-progress line along the bottom edge of the bar;
 *  - the menu is an "explorer" drawer: numbered files that stagger in, the current page filled crimson, tryouts + APPLY
 *    pinned at the bottom, with the season and reset date as a status line.
 */
const ITEMS = [
  ...NAV.map((n) => ({ key: n.key as string, label: n.label, href: n.href })),
  { key: "tryouts", label: "TRYOUTS", href: "/tryouts" },
];

const fileOf = (href: string) => (href === "/" ? "home" : href.slice(1));

export default function MobileHeader() {
  const pathname = usePathname();
  // the drawer is open only for the page it was opened on, so navigating closes it without an effect
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenAt((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));
  const bar = useRef<HTMLSpanElement>(null);
  const current = ITEMS.find((i) => i.href === pathname);
  const file = fileOf(pathname || "/");

  // lock page scroll while the drawer is open, Esc closes it
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // scroll progress line (transform only)
  useEffect(
    () =>
      onFrame(() => {
        if (isDesktop()) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        return () => {
          if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        };
      }),
    [],
  );

  return (
    <>
      <div className="relative flex h-14 items-stretch bg-white/60 backdrop-blur-md">
        <Link href="/" aria-label="COUR E-PRO, home" className="flex w-14 shrink-0 items-center justify-center bg-crimson">
          <span className="relative block h-[30px] w-[44px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/v3/logo-main.svg" alt="" className="absolute inset-0 block h-full w-full rotate-180" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/v3/logo-mark.svg"
              alt=""
              className="absolute block"
              style={{ left: "45.98%", top: "12.01%", right: "46.08%", bottom: "76.41%", width: "7.94%", height: "11.58%" }}
            />
          </span>
        </Link>

        {/* current page as a file path */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[3px] px-4">
          <span className="text-[9px] font-bold leading-none tracking-[0.8px] text-crimson">
            <Season v="S" /> · PH
          </span>
          <span className="flex items-center whitespace-nowrap text-[13px] font-bold leading-none">
            <span className="text-black/40">~/cour/</span>
            {file}
            <span className="text-black/40">.tsx</span>
            <span aria-hidden className="code-rail__cursor ml-[3px] inline-block h-[14px] w-[6px] bg-crimson" />
          </span>
        </div>

        {/* menu button: a 3x3 pixel grid that collapses into an X, with a MENU / EXIT label that rolls like a slot reel */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="group relative flex w-[94px] shrink-0 items-center justify-center gap-[10px] overflow-hidden bg-black pl-1 text-white"
        >
          <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-crimson transition-transform duration-300 ease-out group-active:scale-y-100" />
          <span aria-hidden className="relative grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 9 }, (_, i) => {
              const diag = i % 4 === 0 || i === 2 || i === 6; // the X: corners + centre
              const centre = i === 4;
              return (
                <span
                  key={i}
                  style={{ transitionDelay: `${(i % 3) * 40 + Math.floor(i / 3) * 40}ms` }}
                  className={`block size-[5px] transition-all duration-300 ease-out ${
                    open
                      ? diag
                        ? `${centre ? "bg-white" : "bg-crimson"} scale-110`
                        : "scale-0 opacity-0"
                      : centre
                        ? "bg-crimson motion-safe:animate-pulse"
                        : "bg-white"
                  }`}
                />
              );
            })}
          </span>
          <span aria-hidden className="relative block h-[12px] w-[34px] overflow-hidden text-[11px] font-bold leading-[12px] tracking-[0.8px]">
            <span className="flex flex-col transition-transform duration-500 ease-out" style={{ transform: `translateY(${open ? -12 : 0}px)` }}>
                <span className="block h-[12px]">MENU</span>
                <span className="block h-[12px] text-crimson">EXIT</span>
            </span>
          </span>
        </button>

        {/* scroll progress */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-black/10">
          <span ref={bar} className="block h-full origin-left scale-x-0 bg-crimson will-change-transform" />
        </span>
      </div>

      {/* explorer drawer: a crimson curtain drops first, the black panel follows a beat later */}
      <div
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-14 overflow-hidden text-white ${open ? "visible" : "invisible delay-[700ms] [transition:visibility_0s_700ms]"}`}
      >
        <div
          aria-hidden
          className={`absolute inset-0 bg-crimson transition-[clip-path] duration-500 ease-out ${
            open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)] delay-150"
          }`}
        />
        <div
          className={`relative flex h-full flex-col overflow-y-auto bg-black transition-[clip-path] duration-500 ease-out ${
            open ? "delay-150 [clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
          }`}
        >
        <div className="flex items-center justify-between px-5 pb-3 pt-5 text-[10px] font-bold tracking-[0.8px]">
          <span className="text-crimson">{"// EXPLORER"}</span>
          <span className="text-white/40">cour-epro/</span>
        </div>

        <nav aria-label="Primary" className="border-t border-white/10">
          {ITEMS.map((it, i) => {
            const on = current?.key === it.key;
            return (
              <Link
                key={it.key}
                href={it.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                aria-current={on ? "page" : undefined}
                style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
                className={`group relative flex h-[62px] items-center gap-4 overflow-hidden border-b border-white/10 px-5 transition-[transform,opacity] duration-500 ease-out ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } ${on ? "bg-crimson" : ""}`}
              >
                {!on && (
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-active:origin-left group-active:scale-x-100"
                  />
                )}
                <span className={`relative text-[11px] ${on ? "text-white/80" : "text-crimson"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="relative font-display text-[22px] leading-none min-[400px]:text-[24px]">{it.label}</span>
                <span className={`relative ml-auto text-[11px] max-[399px]:hidden ${on ? "text-white/80" : "text-white/35"}`}>
                  {fileOf(it.href)}.tsx
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-5 pb-6 pt-8">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="group relative flex h-[56px] items-center justify-between overflow-hidden bg-white pl-5 pr-4 text-[14px] font-bold tracking-[0.56px] text-crimson"
          >
            <span aria-hidden className="absolute inset-0 origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-active:origin-left group-active:scale-x-100" />
            <span className="relative flex items-center gap-[10px] transition-colors duration-500 group-active:text-white">
              <span aria-hidden className="block size-[7px] bg-crimson transition-colors group-active:bg-white motion-safe:animate-pulse" />
              APPLY FOR TRYOUTS
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/v3/arrow-red.svg" alt="" width={22} height={22} className="relative block shrink-0 transition-[filter] duration-500 group-active:brightness-0 group-active:invert" />
          </a>
          <p className="mt-5 flex items-center justify-between text-[10px] tracking-[0.8px] text-white/40">
            <span>
              <Season v="S" /> · PH SERVER
            </span>
            <span>
              NEXT RESET <Season v="reset" />
            </span>
          </p>
        </div>
        </div>
      </div>
    </>
  );
}
