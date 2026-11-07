import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { A, Band, Box } from "@/components/canvas";
import { GRID_BG, NAV, type NavKey } from "@/lib/grid";

/**
 * COUR \ design system shell: white 1440px canvas on a 180px grid, red logo cell
 * top-left, black APPLY cell top-right, nav tabs along y=83, footer cells at the bottom.
 * Everything reuses the absolute/stacked layout primitives in canvas.tsx.
 */

const DECOR = "max-md:hidden";

/** Page frame. `h` is the full design height (px) of the 1440-wide frame. */
export function Page({ h, children }: { h: number; children: ReactNode }) {
  return (
    <main
      id="top"
      className="relative w-full bg-white font-code text-black md:h-[var(--h)] md:w-[1440px] md:[zoom:var(--z)]"
      style={{ "--h": `${h}px` } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 max-md:hidden"
        style={{ width: 1440, height: h, backgroundImage: GRID_BG, backgroundSize: "180px 180px" }}
      />
      <div aria-hidden className="absolute left-[1439px] top-0 h-full w-px bg-gridline max-md:hidden" />
      <div aria-hidden className="absolute bottom-0 left-0 h-px w-full bg-gridline max-md:hidden" />
      {children}
    </main>
  );
}

/** Logo: two exported Figma SVG layers (body rotated 180°, mark on top). */
export function Logo({ x, y }: { x: number; y: number }) {
  return (
    <A x={x} y={y} className="h-[73px] w-[107px] max-md:order-first">
      <span className="relative block h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/v3/logo-main.svg" alt="COUR E-PRO" className="absolute inset-0 block h-full w-full rotate-180" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/v3/logo-mark.svg"
          alt=""
          className="absolute block"
          style={{ left: "45.98%", top: "12.01%", right: "46.08%", bottom: "76.41%", width: "7.94%", height: "11.58%" }}
        />
      </span>
    </A>
  );
}

const BTN = {
  red: { cls: "bg-crimson text-white", icon: "arrow-white" },
  outline: { cls: "border border-black bg-white text-black", icon: "arrow-dark" },
  "outline-light": { cls: "border border-white text-white", icon: "arrow-white" },
  white: { cls: "bg-white text-crimson", icon: "arrow-red" },
  dark: { cls: "bg-black text-white", icon: "arrow-white" },
} as const;

/** Sci-fi arrow button. `block` makes it fill its container (label left, arrow right). */
export function Btn({
  href,
  variant = "red",
  h = 52,
  block,
  children,
}: {
  href: string;
  variant?: keyof typeof BTN;
  h?: 48 | 52 | 56;
  block?: boolean;
  children: ReactNode;
}) {
  const v = BTN[variant];
  return (
    <Link
      href={href}
      style={{ height: h }}
      className={`flex items-center overflow-hidden pl-5 pr-4 text-[14px] font-bold tracking-[0.56px] whitespace-nowrap transition-opacity hover:opacity-85 ${v.cls} ${
        block ? "w-full justify-between" : "w-fit gap-[14px]"
      }`}
    >
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/assets/v3/${v.icon}.svg`} alt="" width={22} height={22} className="block shrink-0" />
    </Link>
  );
}

/** Header band (y 0–361): logo cell, nav tabs, APPLY cell. */
export function Header({ active }: { active: NavKey }) {
  return (
    <Band top={0} h={361} className="max-md:gap-0 max-md:px-0 max-md:py-0">
      <Box x={0} y={0} w={180} h={180} className="bg-crimson" />
      <Box x={1261} y={0} w={179} h={180} className="bg-black" />
      <div className="flex items-center justify-between bg-crimson px-5 py-4 md:contents">
        <Logo x={37} y={57} />
        <A x={1351} y={82} className="md:-translate-x-1/2 max-md:order-last max-md:bg-black max-md:px-3 max-md:py-2 max-md:text-[12px] max-md:font-bold max-md:text-white">
          <Link href="/about" className="text-[12px] font-bold text-white">
            APPLY
          </Link>
        </A>
      </div>
      <nav aria-label="Primary" className="max-md:grid max-md:grid-cols-3 max-md:gap-px max-md:bg-rule md:contents">
        {NAV.map((n) => {
          const on = n.key === active;
          return (
            <A key={n.key} x={n.x} y={83} className="max-md:contents">
              <Link
                href={n.href}
                aria-current={on ? "page" : undefined}
                style={{ "--nw": `${n.w}px` } as CSSProperties}
                className={`group relative block overflow-hidden text-[12px] font-bold max-md:p-3 md:h-[19px] md:w-[var(--nw)] md:pl-[6px] md:pt-[2px] ${
                  on
                    ? "bg-crimson text-white"
                    : "bg-white text-black before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-crimson before:transition-transform before:duration-500 before:ease-out hover:text-white hover:before:scale-x-100"
                }`}
              >
                <span className="relative transition-colors duration-500">{n.label}</span>
              </Link>
            </A>
          );
        })}
      </nav>
    </Band>
  );
}

/** Footer band. `top` is the page-absolute y of its first row (page height − 179). */
export function Footer({ top }: { top: number }) {
  return (
    <Band top={top} h={179} className="max-md:bg-white">
      <Box x={1} y={top} w={179} h={179} className="bg-crimson" />
      <Box x={1261} y={top} w={179} h={179} className="bg-black" />
      <Logo x={37} y={top + 56} />
      <A x={201} y={top + 63} className="text-[14px] font-bold">COUR E-PRO</A>
      <A x={201} y={top + 87} className="text-[13px] text-muted">Beyond the horizon. Beyond ourselves.</A>
      <A x={561} y={top + 65} className="flex gap-[34px] text-[12px] font-bold tracking-[0.48px]">
        {NAV.slice(1).map((n) => (
          <Link key={n.key} href={n.href} className="hover:text-crimson">
            {n.label}
          </Link>
        ))}
      </A>
      <A x={561} y={top + 89} className="text-[12px] text-muted">© 2026 COUR E-PRO · Mobile Legends: Bang Bang · PH server</A>
      <A x={1300} y={top + 81} className="max-md:bg-black max-md:p-3">
        <a href="#top" className="text-[12px] font-bold tracking-[0.48px] text-white">BACK TO TOP ↑</a>
      </A>
    </Band>
  );
}

/** Left-rail section index: vertical line, a marker + "NN LABEL" per section. */
export function RailIndex({ items, active = 0, y0 = 560, h = 1760 }: { items: { y: number; label: string }[]; active?: number; y0?: number; h?: number }) {
  return (
    <>
      <Box x={24} y={y0} w={1} h={h} className="bg-black/20" />
      {items.map((it, i) => {
        const on = i === active;
        const n = String(i + 1).padStart(2, "0");
        return (
          <div key={n} className={`contents ${DECOR}`}>
            <Box x={20} y={it.y + 2} w={9} h={9} className={on ? "bg-crimson" : "border border-black bg-white"} />
            <A x={40} y={it.y} className={`text-[11px] font-bold ${on ? "text-crimson" : "text-black"} ${DECOR}`}>{n}</A>
            <A x={64} y={it.y} className={`text-[11px] tracking-[0.88px] text-muted ${DECOR}`}>{it.label}</A>
          </div>
        );
      })}
    </>
  );
}
