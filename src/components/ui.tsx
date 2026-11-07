import type { ReactNode } from "react";
import { A, Band, Rule } from "@/components/canvas";
import Header from "@/components/Header";
import { COLS, type NavKey } from "@/lib/design";

/** Page shell: scales the 1440px design to the viewport on desktop. */
export function Page({ active, children }: { active: NavKey; children: ReactNode }) {
  return (
    <main className="w-full bg-black text-white md:w-[1440px] md:[zoom:var(--z)]">
      <Header active={active} />
      {children}
    </main>
  );
}

/** Row of small mono labels on the 6-column grid. `null` skips a column. */
export function MetaRow({
  y,
  items,
  className = "text-[10px] tracking-[0.4px] opacity-70",
}: {
  y: number;
  items: (string | null)[];
  className?: string;
}) {
  return (
    <>
      {items.map((t, i) =>
        t === null ? null : (
          <A key={i} x={COLS[i]} y={y} className={className}>
            {t}
          </A>
        ),
      )}
    </>
  );
}

/** "[01]  THE LINEUP" section label. The thin rule under it is optional. */
export function SectionLabel({
  y,
  tag,
  label,
  className = "",
  rule,
}: {
  y: number;
  tag: string;
  label: string;
  className?: string;
  /** rule colour class; the rule sits 28px below the label */
  rule?: string;
}) {
  return (
    <>
      <A x={40} y={y} className={`flex gap-[17px] text-[11px] ${className}`}>
        <span className="font-bold">{tag}</span>
        <span className="tracking-[0.66px] opacity-70">{label}</span>
      </A>
      {rule && <Rule x={40} y={y + 28} w={1360} className={rule} />}
    </>
  );
}

/** Footer shared by every page. `top` is the page-absolute y where the footer band starts. */
export function Footer({ top, offset = 40 }: { top: number; offset?: number }) {
  return (
    <Band top={top} h={100} className="bg-black">
      <A x={40} y={top + offset} className="text-[10px] tracking-[0.4px] opacity-60">
        {"> BEYOND THE HORIZON."}
      </A>
      <A x={420} y={top + offset} className="text-[10px] tracking-[0.4px] opacity-50">
        © 2026 COUR E-PRO · MOBILE LEGENDS: BANG BANG · PH SERVER
      </A>
      <A x={1400} y={top + offset} w={300} right className="text-[10px] font-bold tracking-[0.4px]">
        {"BEYOND OURSELVES. <"}
      </A>
    </Band>
  );
}
