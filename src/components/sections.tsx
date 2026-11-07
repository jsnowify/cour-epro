import Link from "next/link";
import type { ReactNode } from "react";
import { A, Band, Block, Box } from "@/components/canvas";
import { Btn, RailIndex } from "@/components/cour";

/** Reusable page sections of the COUR \ design system (all y values are page-absolute, 1440 design). */

const label = "text-[12px] font-bold tracking-[0.96px]";
export const kicker = "text-[11px] font-bold tracking-[0.88px]";

const BARCODE: [number, number][] = [
  [1280, 3], [1286, 1], [1289, 2], [1293, 1], [1296, 4], [1303, 1], [1306, 1], [1309, 3], [1315, 2], [1319, 1], [1322, 1], [1325, 2],
  [1329, 3], [1335, 1], [1338, 2], [1342, 1], [1345, 1], [1348, 3], [1354, 1], [1357, 2], [1361, 4], [1368, 1], [1371, 2], [1375, 1],
];

/** Decorative left + right rails (desktop only). Zero-height band anchored at y=361, right under the header. */
export function Rails({
  index,
  active = 0,
  badge,
  idY = 1981,
  progress = 220,
}: {
  index: { y: number; label: string }[];
  active?: number;
  /** cell at y=1621: dot + small label + big Zen Dots text */
  badge: { label: string; big: string };
  idY?: number;
  progress?: number;
}) {
  return (
    <Band top={361} h={0} className="max-md:hidden">
      <Block x={1} y={361} w={179} h={179} bg="bg-black">
        <A x={20} y={384} fs={34} className="font-display text-white">S04</A>
        <A x={20} y={432} className={`${kicker} text-white/60`}>SEASON</A>
        <A x={20} y={508} className="text-[10px] tracking-[0.8px] text-white/60">PH SERVER</A>
      </Block>
      <RailIndex items={index} active={active} />
      <A x={1342} y={400} className="whitespace-pre text-[11px] font-bold tracking-[2.2px] [writing-mode:vertical-rl]">
        {"BEYOND THE HORIZON  —  BEYOND OURSELVES"}
      </A>

      <Block x={1261} y={901} w={179} h={179} bg="bg-crimson">
        <A x={1280} y={921} className={`${kicker} text-white`}>SCROLL</A>
        <A x={1291} y={1012} className="h-[42px] w-[26px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/v3/arrow-down.svg" alt="" className="absolute left-1/2 top-1/2 block h-[26px] w-[42px] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90" />
        </A>
      </Block>
      <A x={1384} y={1080} className="text-[10px] text-muted">P.03</A>
      <Box x={1416} y={1100} w={1} h={1200} className="bg-black/15" />
      <Box x={1415} y={1100} w={3} h={progress} className="bg-crimson" />

      <Block x={1261} y={1621} w={179} h={179} bg="bg-crimson text-white">
        <Box x={1280} y={1646} w={8} h={8} className="bg-white" />
        <A x={1296} y={1642} className={kicker}>{badge.label}</A>
        <A x={1280} y={1736} fs={28} className="font-display">{badge.big}</A>
      </Block>

      <Block x={1261} y={idY} w={179} h={179} bg="bg-black text-white">
        <A x={1280} y={idY + 20} className="text-[10px] tracking-[0.8px] text-white/60">ID · COUR-S04</A>
        {BARCODE.map(([bx, bw]) => (
          <Box key={bx} x={bx} y={idY + 79} w={bw} h={64} className="bg-white" />
        ))}
        <A x={1280} y={idY + 153} className="text-[10px] tracking-[0.8px] text-white/60">2026 · PH</A>
      </Block>
    </Band>
  );
}

/** Hero (y 361–900): grey block with 2-line display headline, underline, copy, two buttons, status row. Card goes in children. */
export function Intro({
  lines,
  underline = 832,
  text,
  primary,
  secondary,
  status,
  meta,
  metaX = 340,
  secondaryX = 437,
  children,
}: {
  lines: [string, string];
  underline?: number;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  status: string;
  meta: string;
  metaX?: number;
  secondaryX?: number;
  children?: ReactNode;
}) {
  return (
    <Band top={361} h={540}>
      <Box x={181} y={361} w={1079} h={539} className="bg-surface" />
      <A as="h1" x={186} y={368} fs={89} className="font-display leading-[0.9]">{lines[0]}</A>
      <A x={186} y={457} fs={89} className="font-display leading-[0.9]">{lines[1]}</A>
      <Box x={192} y={540} w={underline} h={4} className="bg-black" />
      <A x={201} y={584} w={560} className="text-[16px] leading-[1.6]">{text}</A>
      <A x={201} y={708}><Btn href={primary.href}>{primary.label}</Btn></A>
      <A x={secondaryX} y={708}><Btn href={secondary.href} variant="outline">{secondary.label}</Btn></A>
      <Box x={201} y={846} w={8} h={8} className="bg-crimson" />
      <A x={217} y={842} className="text-[12px] font-bold tracking-[0.48px] text-crimson">{status}</A>
      <A x={metaX} y={842} className="whitespace-pre text-[12px] text-muted">{meta}</A>
      {children}
    </Band>
  );
}

/** White hero card (x 921, y 581): small title, label/value rows with hairlines, red link. */
export function InfoCard({ title, rows, link }: { title: string; rows: [string, string][]; link: string }) {
  return (
    <Block x={921} y={581} w={319} h={299} bg="bg-white">
      <A x={945} y={605} className={`${label} text-muted`}>{title}</A>
      {rows.map(([k, v], i) => (
        <div key={k} className="contents">
          <A x={945} y={632 + 36 * i} className="text-[13px] text-muted">{k}</A>
          <A x={1216} y={632 + 36 * i} w={220} right className="text-[13px] font-bold">{v}</A>
          <Box x={945} y={658 + 36 * i} w={271} h={1} className="bg-black/8" />
        </div>
      ))}
      <Box x={945} y={816} w={271} h={1} className="bg-black/12" />
      <A x={945} y={836} className="text-[13px] font-bold tracking-[0.52px] text-crimson">{link}</A>
    </Block>
  );
}

/** Three white stat tiles (y 901–1080). */
export function Stats({ items }: { items: { n: string; t: string; d: string }[] }) {
  return (
    <Band top={901} h={180}>
      {items.map((s, i) => {
        const x = 181 + 360 * i;
        return (
          <Block key={s.t} x={x} y={901} w={359} h={179} bg="bg-white">
            <A x={x + 23} y={922} fs={48} className="font-display leading-none">{s.n}</A>
            <A x={x + 23} y={996} className="text-[15px] font-bold">{s.t}</A>
            <A x={x + 23} y={1020} w={300} className="text-[13px] text-muted">{s.d}</A>
          </Block>
        );
      })}
    </Band>
  );
}

/** Notched header card (y 1081–1260) that opens a section. */
export function SectionHeader({
  sec,
  kicker: k,
  title,
  text,
  textY = 1132,
  link,
  count,
  countLabel,
  titleSize = 56,
}: {
  sec: string;
  kicker: string;
  title: string;
  text: string;
  textY?: number;
  link: { href: string; label: string };
  count: number;
  countLabel: string;
  titleSize?: number;
}) {
  return (
    <Band top={1081} h={180}>
      <Box x={181} y={1081} w={1079} h={179} className="bg-[url(/assets/v3/lineup-header.svg)] bg-[length:100%_100%] bg-no-repeat" />
      <Box x={181} y={1125} w={4} h={56} className="bg-crimson" />
      <Box x={1238} y={1089} w={14} h={2} className="bg-crimson" />
      <Box x={1250} y={1089} w={2} h={14} className="bg-crimson" />
      <Box x={189} y={1250} w={14} h={2} className="bg-crimson" />
      <Box x={189} y={1238} w={2} h={14} className="bg-crimson" />
      <Box x={898} y={1103} w={1} h={135} className="bg-black/12" />
      <A x={1231} y={1095} w={200} right className="text-[10px] tracking-[0.8px] text-muted max-md:hidden">{sec}</A>
      <A x={201} y={1104} className={`${label} text-crimson`}>{k}</A>
      <A as="h2" x={198} y={1132} fs={titleSize} className="font-display leading-none">{title}</A>
      <A x={921} y={textY} w={319} className="text-[15px] leading-[1.6]">{text}</A>
      <A x={921} y={1208} className="text-[13px] font-bold tracking-[0.52px] text-crimson">
        <Link href={link.href}>{link.label}</Link>
      </A>
      <A x={201} y={1230} className="text-[10px] font-bold tracking-[0.8px] max-md:hidden">
        {String(count).padStart(2, "0")}/{String(count).padStart(2, "0")}
      </A>
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} x={246 + 13 * i} y={1232} w={9} h={9} className="bg-crimson" />
      ))}
      <A x={246 + 13 * count + 7} y={1230} className="text-[10px] tracking-[0.8px] text-muted max-md:hidden">{countLabel}</A>
      {Array.from({ length: 24 }, (_, i) => (
        <Box key={i} x={921 + 13 * i} y={1246} w={1} h={i % 4 === 0 ? 8 : 4} className={i % 4 === 0 ? "bg-black/50" : "bg-black/25"} />
      ))}
    </Band>
  );
}

/** Crimson closing band (y 1981–2340) with a 4-step strip and a white CTA button. */
export function CtaBand({
  top = 1981,
  kicker: k,
  title,
  text,
  steps,
  cta,
  note,
  children,
}: {
  top?: number;
  kicker: string;
  title: string;
  text: string;
  steps?: { t: string; d: string }[];
  /** omit to render your own call to action in `children` */
  cta?: { href: string; label: string };
  note: string;
  children?: ReactNode;
}) {
  const d = top - 1981;
  return (
    <Band top={top} h={360}>
      <Block x={181} y={top} w={1079} h={359} bg="bg-crimson text-white">
        <A x={201} y={top + 23} className={`${label} text-white/80`}>{k}</A>
        <A as="h2" x={198} y={top + 51} fs={72} className="font-display leading-none">{title}</A>
        <A x={201} y={top + 137} w={560} className="text-[16px] leading-[1.6]">{text}</A>
        {(steps ?? []).map((s, i) => {
          const x = 200 + 180 * i;
          return (
            <div key={s.t} className="contents">
              <A x={x} y={2184 + d} fs={20} className="font-display">{String(i + 1).padStart(2, "0")}</A>
              <A x={x} y={2222 + d} className="text-[14px] font-bold">{s.t}</A>
              <A x={x} y={2246 + d} w={140} className="text-[13px] leading-[1.5] text-white/85">{s.d}</A>
              {i > 0 && <Box x={x - 20} y={2184 + d} w={1} h={132} className="bg-white/25" />}
            </div>
          );
        })}
        {cta && <A x={921} y={2184 + d} w={319}><Btn href={cta.href} variant="white" h={56} block>{cta.label}</Btn></A>}
        {children}
        <A x={921} y={2256 + d} w={319} className="text-[13px] text-white/80">{note}</A>
      </Block>
    </Band>
  );
}
