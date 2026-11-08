import Link from "next/link";
import type { ReactNode } from "react";
import { A, Band, Block, Box, GROUP, ROW } from "@/components/canvas";
import { Btn, RailIndex } from "@/components/cour";
import CodeRail from "@/components/CodeRail";
import CodeDock from "@/components/CodeDock";
import Season from "@/components/Season";
import SpinNumber from "@/components/SpinNumber";
import Drift from "@/components/Drift";
import { ArrowText } from "@/components/Arrow";

/** Reusable page sections of the COUR \ design system (all y values are page-absolute, 1440 design). */

const label = "text-[12px] font-bold tracking-[0.96px]";
export const kicker = "text-[11px] font-bold tracking-[0.88px]";

/** Decorative left + right rails (desktop only). Zero-height band anchored at y=361, right under the header. */
export function Rails({
  index,
  badge,
  indexH = 1760,
}: {
  index: { y: number; label: string }[];
  /** unused: the right rail now only carries the code panel (kept so pages need no change) */
  badge?: { label: string; big: string };
  idY?: number;
  progress?: number;
  /** y of the right-rail badge cell (default 1621) */
  badgeY?: number;
  /** height of the left index line (default 1760) */
  indexH?: number;
  /** height of the right progress line (default 1200) */
  railH?: number;
}) {
  return (
    <>
    <CodeRail />
    <CodeDock />
    <Band top={361} h={0} className="max-md:hidden">
      <Block x={1} y={361} w={179} h={179} bg="bg-black">
        <A x={20} y={384} fs={34} className="font-display text-white"><Season v="S" /></A>
        <A x={20} y={432} className={`${kicker} text-white/60`}>SEASON</A>
        <A x={20} y={456} className="text-[10px] tracking-[0.8px] text-white/60">NEXT RESET</A>
        <A x={20} y={472} className="text-[13px] font-bold text-white"><Season v="reset" /></A>
        <A x={20} y={508} className="text-[10px] tracking-[0.8px] text-white/60">PH SERVER</A>
      </Block>
      <RailIndex items={index} h={indexH} />

    </Band>
    </>
  );
}

/** Hero (y 361–900): grey block with 2-line display headline, copy, two buttons, status row. Card goes in children. */
export function Intro({
  lines,
  text,
  primary,
  secondary,
  status,
  meta,
  metaX = 340,
  secondaryX = 437,
  children,
}: {
  lines: [ReactNode, ReactNode];
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  status: string;
  meta: ReactNode;
  metaX?: number;
  secondaryX?: number;
  children?: ReactNode;
}) {
  return (
    <Band top={361} h={540}>
      <Box x={181} y={361} w={1079} h={539} className="bg-surface" />
      <A as="h1" x={186} y={368} fs={89} className="font-display leading-[0.9] max-md:-mb-2">{lines[0]}</A>
      <A x={186} y={457} fs={89} className="font-display leading-[0.9]">{lines[1]}</A>
      <A x={201} y={584} w={560} className="text-[16px] leading-[1.6]"><Drift>{text}</Drift></A>
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
export function InfoCard({ title, rows, link, href }: { title: string; rows: [string, ReactNode][]; link: ReactNode; href?: string }) {
  // a plain string label needs somewhere to go: internal route / #anchor, or an external URL in a new tab
  const external = !!href && /^https?:\/\//.test(href);
  const action =
    typeof link !== "string" ? (
      link
    ) : href ? (
      external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <ArrowText text={link} />
        </a>
      ) : (
        <Link href={href}>
          <ArrowText text={link} />
        </Link>
      )
    ) : null; // no destination: never render a fake link
  return (
    <Block x={921} y={581} w={319} h={299} bg="bg-white">
      <A x={945} y={605} className={`${label} text-muted`}>{title}</A>
      {rows.map(([k, v], i) => (
        <div key={k} className={ROW}>
          <A x={945} y={632 + 36 * i} className="text-[13px] text-muted">{k}</A>
          <A x={1216} y={632 + 36 * i} w={220} right className="text-[13px] font-bold">{v}</A>
          <Box x={945} y={658 + 36 * i} w={271} h={1} className="bg-black/8" />
        </div>
      ))}
      <Box x={945} y={816} w={271} h={1} className="bg-black/12" />
      {action && <A x={945} y={836} className="text-[13px] font-bold tracking-[0.52px] text-crimson">{action}</A>}
    </Block>
  );
}

/** Three white stat tiles (y 901–1080). */
export function Stats({ items }: { items: { n: string; t: string; d: string }[] }) {
  return (
    <Band top={901} h={180} tab={3}>
      {items.map((s, i) => {
        const x = 181 + 360 * i;
        return (
          <Block key={s.t} x={x} y={901} w={359} h={179} bg="bg-white">
            <A x={x + 23} y={922} fs={48} className="font-display leading-none"><SpinNumber value={s.n} /></A>
            <A x={x + 23} y={996} className="text-[15px] font-bold">{s.t}</A>
            <A x={x + 23} y={1020} w={300} className="text-[13px] text-muted"><Drift>{s.d}</Drift></A>
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
    <Band top={1081} h={180} className="max-md:ml-5 max-md:w-auto max-md:border-l-4 max-md:border-crimson max-md:py-3 max-md:pl-4 max-md:pr-5">
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
      <A x={921} y={textY} w={319} className="text-[15px] leading-[1.6]"><Drift>{text}</Drift></A>
      <A x={921} y={1208} className="text-[13px] font-bold tracking-[0.52px] text-crimson">
        <Link href={link.href}><ArrowText text={link.label} /></Link>
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
        <A x={201} y={top + 137} w={560} className="text-[16px] leading-[1.6]"><Drift>{text}</Drift></A>
        {(steps ?? []).map((s, i) => {
          const x = 200 + 180 * i;
          return (
            <div key={s.t} className={GROUP}>
              <A x={x} y={2184 + d} fs={20} className="font-display">{String(i + 1).padStart(2, "0")}</A>
              <A x={x} y={2222 + d} className="text-[14px] font-bold">{s.t}</A>
              <A x={x} y={2246 + d} w={140} className="text-[13px] leading-[1.5] text-white/85"><Drift>{s.d}</Drift></A>
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
