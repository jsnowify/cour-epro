"use client";

import { createContext, useContext } from "react";
import type { CSSProperties, ReactNode } from "react";
import { HAIRLINE_XS } from "@/lib/design";

/**
 * Layout primitives. On desktop (>= 900px) everything is placed at the exact
 * 1440px-design coordinates from Figma (y values are page-absolute and are
 * made band-relative here). Below 900px the same elements fall back to normal
 * flow, stacked vertically in DOM order, and huge type scales down.
 */

const BandTop = createContext(0);

const css = (v: Record<string, string>) => v as CSSProperties;

/** Mobile font size: scale large display type with the viewport, floor small. */
function mobileFs(fs: number) {
  if (fs < 40) return `${fs}px`;
  return `max(calc(${fs} * (100vw - 40px) / 1440), ${Math.min(fs, 24)}px)`;
}

type BandProps = {
  top: number;
  h: number;
  className?: string;
  /** hairline colour class, e.g. "bg-white/10" */
  rules?: string;
  /** desktop-only backdrop drawn beneath the hairlines */
  under?: ReactNode;
  children: ReactNode;
};

export function Band({ top, h, className = "", rules, under, children }: BandProps) {
  return (
    <BandTop.Provider value={top}>
      <section
        className={`relative w-full md:h-[var(--h)] max-md:flex max-md:flex-col max-md:gap-3 max-md:px-5 max-md:py-8 ${className}`}
        style={css({ "--h": `${h}px` })}
      >
        {under}
        {rules &&
          HAIRLINE_XS.map((x) => (
            <div
              key={x}
              aria-hidden
              className={`pointer-events-none absolute top-0 h-full w-px max-md:hidden ${rules}`}
              style={{ left: x }}
            />
          ))}
        {children}
      </section>
    </BandTop.Provider>
  );
}

type AProps = {
  x: number;
  y: number;
  w?: number;
  fs?: number;
  /** x is the RIGHT edge of the element */
  right?: boolean;
  as?: "div" | "h1" | "h2" | "p" | "span";
  className?: string;
  children: ReactNode;
};

/** Absolutely positioned (desktop) / flowing (mobile) element. */
export function A({ x, y, w, fs, right, as: Tag = "div", className = "", children }: AProps) {
  const top = useContext(BandTop);
  const style: Record<string, string> = { "--x": `${x}px`, "--y": `${y - top}px` };
  if (w) style["--w"] = `${w}px`;
  if (fs) {
    style["--fs"] = `${fs}px`;
    style["--fsm"] = mobileFs(fs);
  }
  const cls = ["md:absolute md:left-[var(--x)] md:top-[var(--y)] max-md:break-words"];
  cls.push(w ? "md:w-[var(--w)]" : "md:whitespace-nowrap");
  if (fs) cls.push("text-[length:var(--fsm)] md:text-[length:var(--fs)]");
  if (right) cls.push("md:-translate-x-full text-right");
  return (
    <Tag className={`${cls.join(" ")} ${className}`} style={css(style)}>
      {children}
    </Tag>
  );
}

/** Horizontal 1px rule. Full width when stacked. */
export function Rule({ x, y, w, className = "" }: { x: number; y: number; w: number; className?: string }) {
  const top = useContext(BandTop);
  return (
    <div
      aria-hidden
      className={`h-px max-md:w-full md:absolute md:left-[var(--x)] md:top-[var(--y)] md:w-[var(--w)] ${className}`}
      style={css({ "--x": `${x}px`, "--y": `${y - top}px`, "--w": `${w}px` })}
    />
  );
}

/** Decorative rectangle. Desktop only. */
export function Box({
  x,
  y,
  w,
  h,
  className = "",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
}) {
  const top = useContext(BandTop);
  return (
    <div
      aria-hidden
      className={`max-md:hidden md:absolute md:left-[var(--x)] md:top-[var(--y)] md:h-[var(--h)] md:w-[var(--w)] ${className}`}
      style={css({ "--x": `${x}px`, "--y": `${y - top}px`, "--w": `${w}px`, "--h": `${h}px` })}
    />
  );
}

type BlockProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** background class, e.g. "bg-brand" */
  bg: string;
  /** class for the 7px corner squares; omit for none */
  corner?: string;
  /** draw the desktop rectangle (false when a band backdrop already does) */
  rect?: boolean;
  children: ReactNode;
};

/** A coloured block (with optional 7px corner squares) that contains its text. */
export function Block({ x, y, w, h, bg, corner, rect = true, children }: BlockProps) {
  const c = 3.5;
  return (
    <div className={`md:contents max-md:flex max-md:flex-col max-md:gap-2 max-md:p-5 ${bg}`}>
      {rect && <Box x={x} y={y} w={w} h={h} className={bg} />}
      {corner && (
        <>
          <Box x={x - c} y={y - c} w={7} h={7} className={corner} />
          <Box x={x + w - c} y={y - c} w={7} h={7} className={corner} />
          <Box x={x - c} y={y + h - c} w={7} h={7} className={corner} />
          <Box x={x + w - c} y={y + h - c} w={7} h={7} className={corner} />
        </>
      )}
      {children}
    </div>
  );
}

/** Bracket match box with its label. */
export function Match({
  x,
  y,
  w = 250,
  h = 48,
  className = "bg-white border-ink/90 text-ink",
  round,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  className?: string;
  round?: string;
  children: ReactNode;
}) {
  const top = useContext(BandTop);
  return (
    <div
      className={`box-border flex items-center border border-solid px-[14px] text-[11px] tracking-[0.22px] max-md:py-3 md:absolute md:left-[var(--x)] md:top-[var(--y)] md:h-[var(--h)] md:w-[var(--w)] ${className}`}
      style={css({ "--x": `${x}px`, "--y": `${y - top}px`, "--w": `${w}px`, "--h": `${h}px` })}
    >
      {round && <span className="mr-2 opacity-60 md:hidden">{round} ·</span>}
      {children}
    </div>
  );
}
