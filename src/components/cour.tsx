import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { A, Band, Box } from "@/components/canvas";
import GridMarquee from "@/components/GridMarquee";
import Season from "@/components/Season";
import { DISCORD_URL, PORTFOLIO_URL } from "@/lib/links";
import { GRID_BG, NAV, type NavKey } from "@/lib/grid";
import { Arrow } from "@/components/Arrow";
import MobileHeader from "@/components/MobileHeader";
import SeasonClock from "@/components/SeasonClock";
import FooterTile from "@/components/FooterTile";
import LogoArt from "@/components/LogoArt";

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
      className="relative w-full bg-white font-code text-black max-md:bg-surface md:h-[var(--h)] md:w-[1440px] md:[zoom:var(--z)]"
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

/** Logo: interactive (see LogoArt). `toTop` makes it a back-to-top button (footer). */
export function Logo({ x, y, toTop }: { x: number; y: number; toTop?: boolean }) {
  return (
    <A x={x} y={y} className="h-[73px] w-[107px] max-md:order-first">
      <LogoArt toTop={toTop} />
    </A>
  );
}

/** `fill` is the colour that sweeps in from the left on hover (same motion as the header tabs); `hover` recolours label and arrow. */
const BTN = {
  red: { cls: "bg-crimson text-white", fill: "bg-black", hover: "", icon: "arrow-white", iconHover: "" },
  outline: { cls: "bg-black text-white", fill: "bg-crimson", hover: "", icon: "arrow-white", iconHover: "" },
  "outline-light": { cls: "bg-white text-black", fill: "bg-crimson", hover: "group-hover:text-white", icon: "arrow-dark", iconHover: "group-hover:brightness-0 group-hover:invert" },
  white: { cls: "bg-white text-crimson", fill: "bg-black", hover: "group-hover:text-white", icon: "arrow-red", iconHover: "group-hover:brightness-0 group-hover:invert" },
  dark: { cls: "bg-black text-white", fill: "bg-crimson", hover: "", icon: "arrow-white", iconHover: "" },
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
  const external = /^https?:\/\//.test(href);
  const Tag = external ? "a" : Link;
  return (
    <Tag
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ height: h }}
      className={`group relative flex items-center overflow-hidden pl-5 pr-4 text-[14px] font-bold tracking-[0.56px] whitespace-nowrap transition-colors duration-500 ${v.cls} ${v.hover} ${
        block ? "w-full justify-between" : "w-fit gap-[14px] max-[639px]:w-full max-[639px]:justify-between"
      }`}
    >
      <span aria-hidden className={`absolute inset-0 origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 ${v.fill}`} />
      <span className="relative">{children}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/v3/${v.icon}.svg`}
        alt=""
        width={22}
        height={22}
        className={`relative block shrink-0 transition-[transform,filter] duration-500 group-hover:translate-x-1 ${v.iconHover}`}
      />
    </Tag>
  );
}

/**
 * Header band (y 0–361): logo cell, nav tabs, APPLY cell.
 * `sticky` (md+): swaps the tall band for a compact 64px bar pinned to the top (crimson logo cell, frosted nav tabs,
 * black APPLY card), plus a spacer so the page below keeps its original y positions. Below 1100px the band is unchanged.
 */
export function Header({ active, sticky }: { active: NavKey | null; sticky?: boolean }) {
  const bar = (
    <Band top={0} h={361} className="max-md:gap-0 max-md:px-0 max-md:py-0">
      <Box x={0} y={0} w={180} h={180} className="bg-crimson" />
      <Box x={1261} y={0} w={179} h={180} className="bg-black" />
      <div className="flex items-center justify-between bg-crimson px-5 py-4 md:contents">
        <Logo x={37} y={57} />
        <A x={1351} y={82} className="md:-translate-x-1/2 max-md:order-last max-md:bg-black max-md:px-3 max-md:py-2 max-md:text-[12px] max-md:font-bold max-md:text-white">
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-white">
            APPLY
          </a>
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
                    : `bg-white text-black before:absolute before:inset-0 before:origin-right before:scale-x-0 before:bg-crimson before:transition-transform before:duration-500 before:ease-out hover:text-white hover:before:origin-left hover:before:scale-x-100`
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
  if (!sticky) return bar;
  return (
    <>
      <div className="z-50 max-md:hidden md:pointer-events-none md:sticky md:top-0">
        <CompactBar active={active} />
      </div>
      {/* mobile: pinned with position:fixed (more robust than sticky) plus a spacer that keeps its 56px in the flow */}
      <div className="md:hidden">
        <div aria-hidden className="h-14" />
        <div className="fixed inset-x-0 top-0 z-50">
          <MobileHeader />
        </div>
      </div>
      <GridMarquee />
      <div aria-hidden className="h-[297px] max-md:hidden" />
    </>
  );
}

/** Compact 64px header (md+) on the original header grid: 180px logo cell, tabs at their grid columns (x 180–1261), 179px APPLY cell. */
function CompactBar({ active }: { active: NavKey | null }) {
  return (
    <div className="flex h-16 w-full items-stretch">
      <Link
        href="/"
        aria-label="COUR E-PRO, home"
        className="pointer-events-auto flex w-[180px] shrink-0 items-center bg-crimson pl-5"
      >
        <span className="block h-[40px] w-[59px]">
          <LogoArt />
        </span>
      </Link>

      {/* tabs exactly as in the original header: one 19px bar per grid column (x 180–1261), 1px apart */}
      <nav aria-label="Primary" className="relative h-[19px] flex-1 self-center">
        {NAV.map((n) => {
          const on = n.key === active;
          return (
            <Link
              key={n.key}
              href={n.href}
              aria-current={on ? "page" : undefined}
              style={{ left: n.x - 180, width: n.w }}
              className={`group pointer-events-auto absolute top-0 block h-[19px] overflow-hidden pl-[6px] pt-[2px] text-[12px] font-bold ${
                on
                  ? "bg-crimson text-white"
                  : "bg-white/35 text-black backdrop-blur-md before:absolute before:inset-0 before:origin-right before:scale-x-0 before:bg-crimson before:transition-transform before:duration-500 before:ease-out hover:text-white hover:before:origin-left hover:before:scale-x-100"
              }`}
            >
              <span className="relative transition-colors duration-500">{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group pointer-events-auto relative flex w-[179px] shrink-0 items-center justify-between overflow-hidden bg-black pl-5 pr-4 text-white"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100"
        />
        <span className="relative flex flex-col gap-[5px]">
          <span className="flex items-center gap-[6px] text-[10px] font-bold tracking-[0.8px] text-white/75 transition-colors group-hover:text-white">
            <span aria-hidden className="block size-[6px] bg-crimson transition-colors group-hover:bg-white motion-safe:animate-pulse" />
            TRYOUTS OPEN
          </span>
          <span className="text-[14px] font-bold leading-none tracking-[0.56px]">APPLY NOW</span>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/v3/arrow-white.svg"
          alt=""
          width={22}
          height={22}
          className="relative block shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>
    </div>
  );
}

/** Height (px) of the footer band: sign-off row 220 + giant wordmark 180 + status bar 40. */
export const FOOTER_H = 440;

const SWEEP =
  "absolute inset-0 origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100";

/**
 * Footer, inverted: a black slab. Crimson logo rail on the left, a big "join the squad" sign-off, the sitemap as a 2×3
 * grid of tiles that fill crimson on hover, a white back-to-top rail, a solid crimson wordmark and a one-line status bar.
 * `top` is the page-absolute y of its first row.
 */
export function Footer({ top }: { top: number }) {
  const rows = top + 220; // wordmark
  const bar = top + 400; // status bar
  const line = "bg-white/12";
  const k = "text-[10px] font-bold tracking-[0.8px]";
  return (
    <div data-footer>
    <Band top={top} h={FOOTER_H} className="bg-black text-white">
      {/* rails */}
      <Box x={0} y={top} w={180} h={220} className="bg-crimson" />
      <Logo x={37} y={top + 76} toTop />

      {/* sign-off */}
      <A x={201} y={top + 28} className={`${k} text-crimson`}>
        RECRUITING · <Season v="S" /> · ALL FIVE LANES
      </A>
      <A x={201} y={top + 54} w={480} fs={46} className="font-display leading-[1.05]">
        JOIN THE<br />SQUAD.
      </A>
      <A x={201} y={top + 160}>
        <Btn href={DISCORD_URL} variant="white">APPLY FOR TRYOUTS</Btn>
      </A>

      {/* sitemap tiles */}
      <div className="contents max-md:grid max-md:grid-cols-1 max-md:min-[640px]:grid-cols-2 max-md:gap-px">
      {NAV.map((n, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <A key={n.key} x={721 + col * 270} y={top + row * 73} w={269} className="max-md:w-full">
            <FooterTile href={n.href} label={n.label} n={i + 1} />
          </A>
        );
      })}
      </div>
      {[721, 991].map((x) => (
        <div key={x} className="contents">
          <Box x={x} y={top + 73} w={269} h={1} className={line} />
          <Box x={x} y={top + 146} w={269} h={1} className={line} />
        </div>
      ))}
      <Box x={720} y={top} w={1} h={220} className={line} />
      <Box x={990} y={top} w={1} h={220} className={line} />

      {/* season clock rail */}
      <Box x={1260} y={top} w={180} h={220} className="bg-white" />
      <A x={1260} y={top} w={180} className="max-md:w-full">
        <SeasonClock />
      </A>

      {/* giant wordmark */}
      <Box x={0} y={rows} w={1440} h={1} className={line} />
      <A x={0} y={rows + 16} w={1440} fs={150} className="select-none text-center font-display leading-[1] text-crimson max-md:whitespace-nowrap max-md:text-[length:calc((100vw-40px)/8.4)]">
        COUR E-PRO
      </A>

      {/* status bar */}
      <Box x={0} y={bar} w={1440} h={1} className={line} />
      <A x={20} y={bar + 14} className="flex items-center gap-[10px] text-[11px] tracking-[0.44px]">
        <span aria-hidden className="size-[8px] bg-crimson" />
        TRYOUTS OPEN · <Season v="S" /> · NEXT RESET <Season v="reset" />
      </A>
      <A x={1420} y={bar + 14} right className="text-[11px] tracking-[0.44px] text-white/50">
        © 2026 COUR E-PRO · MOBILE LEGENDS: BANG BANG · PH SERVER
      </A>
      <A x={840} y={bar + 8} className="text-[11px] tracking-[0.44px] text-white/50">
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/snowi.svg" alt="" width={22} height={24} className="block h-[24px] w-[22px] object-cover object-top" />
          BUILT BY SNOWI
          <Arrow />
        </a>
      </A>
      <A x={720} y={bar + 14} className="max-md:hidden text-[11px] tracking-[0.44px] text-white/50" as="div">
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">DISCORD<Arrow /></a>
      </A>
    </Band>
    </div>
  );
}

export { default as RailIndex } from "@/components/RailIndex";
