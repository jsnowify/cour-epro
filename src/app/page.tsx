import JsonLd from "@/components/JsonLd";
import { pageLd, pageMeta } from "@/lib/site";
import Link from "next/link";
import type { CSSProperties } from "react";
import { A, Band, Block, Box, GROUP, ROW } from "@/components/canvas";
import { Btn, FOOTER_H, Footer, Header, Page } from "@/components/cour";
import { CtaBand, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";
import Drift from "@/components/Drift";
import { DISCORD_URL } from "@/lib/links";
import Season from "@/components/Season";
import VisitorMap from "@/components/VisitorMap";
import { Arrow } from "@/components/Arrow";

export const metadata = pageMeta("/");

// One grid cell of empty space between sections (md+ only; below 1100px the bands already stack with their own padding).
const GAP = 180;
const gap = "md:mt-[180px]";
const SNIPPET_H = 540; // explore cards band: two rows (280 + 20 gap + 240)

// Section start y (page-absolute) once the gaps are inserted: lineup, match, explore (header 180 + cards SNIPPET_H), tryouts, footer.
const S_LINEUP = 1081 + GAP;
const S_MATCH = 1621 + 2 * GAP;
const S_EXPLORE = 1981 + 3 * GAP;
const S_TRYOUTS = S_EXPLORE + 180 + SNIPPET_H + GAP;
const S_MAP = S_TRYOUTS + 360 + GAP; // visitor map, right before the footer
const H = S_MAP + 360 + GAP + FOOTER_H;

const LANES = [
  { n: "01", code: "GL", fs: 36, name: "GOLD LANE", desc: "Late-game carry. Farms gold and wins the fights.", focus: "Farming · Positioning" },
  { n: "02", code: "EXP", fs: 30, name: "EXP LANE", desc: "Frontline fighter. Holds the side lane.", focus: "Lane control · Peel" },
  { n: "03", code: "MID", fs: 30, name: "MID LANE", desc: "Burst and control. Rotates early.", focus: "Rotations · Burst timing" },
  { n: "04", code: "JG", fs: 36, name: "JUNGLE", desc: "Objective driver. Takes Turtle and Lord.", focus: "Objectives · Tempo" },
  { n: "05", code: "RM", fs: 36, name: "ROAM", desc: "Vision and protection. Shields the carry.", focus: "Vision · Engage" },
];

const BULLETIN = [
  { v: "VER_02", t: "THE PROCESS", d: "Three phases: gameplay and individual performance, a one-week observation, then a final fit evaluation." },
  { v: "VER_03_01", t: "5V5 FORMAT", d: "So many players joined that tryouts are now 5v5 matches instead of ranked games." },
  { v: "VER_03_02", t: "ROLES & 2ND TEAM", d: "All five lanes are open. A second team, COUR DOS, is opening for more players." },
];

const TRYOUT_ROWS = [
  { y: 632, k: "Format", v: "5v5 matches" },
  { y: 668, k: "Phases", v: "3" },
  { y: 704, k: "Open roles", v: "All five lanes" },
  { y: 740, k: "Second team", v: "COUR DOS" },
  { y: 776, k: "Schedule", v: "TBA" },
];

const PAGES = [
  {
    kicker: "TEAMS",
    title: "UNO & DOS",
    text: "COUR UNO is our active squad. COUR DOS is not formed yet and we are still finding its players.",
    facts: "COUR UNO · Active  /  COUR DOS · Forming",
    href: "/teams",
  },
  {
    kicker: "TOURNAMENTS",
    title: "TO BE ANNOUNCED",
    text: "No tournament is running right now. Dates, format and registration will be announced here first.",
    facts: "Dates TBA  /  Format TBA  /  Registration TBA",
    href: "/tournaments",
  },
  {
    kicker: "PLAYERS",
    title: "MEET THE ROSTER",
    text: "Every card shows the player's IGN and the role they hold on COUR UNO.",
    facts: "6 players  /  5 lanes  /  COUR UNO",
    href: "/players",
  },
  {
    kicker: "NEWS",
    title: "LATEST UPDATES",
    text: "Tryouts are open for all five lanes. Plus guides, roster moves and event news, all to be announced.",
    facts: "NOV 03 · Announcement  /  Guides  /  Events TBA",
    href: "/news",
  },
  {
    kicker: "ABOUT",
    title: "WHO WE ARE",
    text: "Formerly Aeronova Esport. Established January 2026 and competing only on the PH server.",
    facts: "Teamwork  /  Discipline  /  Growth",
    href: "/about",
  },
];

/** Card slots for the snippets band (band-relative): 3 across, then 2 across, 20px gutters. */
const SLOTS = [
  { x: 181, y: 0, w: 346, h: 280 },
  { x: 547, y: 0, w: 346, h: 280 },
  { x: 913, y: 0, w: 346, h: 280 },
  { x: 181, y: 300, w: 530, h: 240 },
  { x: 731, y: 300, w: 529, h: 240 },
];

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function HomePage() {
  return (
    <Page h={H}>
      <JsonLd data={pageLd("/")} />
      <Header active="home" sticky />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: S_LINEUP + 23, label: "LINEUP" },
          { y: S_MATCH + 23, label: "BULLETIN" },
          { y: S_EXPLORE + 23, label: "EXPLORE" },
          { y: S_TRYOUTS + 23, label: "TRYOUTS" },
          { y: S_MAP + 23, label: "MAP" },
        ]}
        badge={{ label: "TRYOUTS", big: "OPEN" }}
        badgeY={S_MATCH}
        idY={S_TRYOUTS}
        indexH={S_MAP + 360 - 560}
        railH={S_MAP + 320 - 1100}
      />

      <Intro
        lines={["BEYOND THE", "HORIZON"]}
        text="COUR E-PRO is a Philippines-based Mobile Legends: Bang Bang team competing in ranked, scrims and tournaments on the PH server. We're scouting new players for the current season."
        primary={{ href: DISCORD_URL, label: "APPLY FOR TRYOUTS" }}
        secondary={{ href: "/teams", label: "MEET THE TEAMS" }}
        status="TRYOUTS OPEN"
        meta={<><Season />{"  ·  PH SERVER  ·  EST. JAN 2026"}</>}
      >
        <Block x={921} y={581} w={319} h={299} bg="bg-white">
          <A x={945} y={605} className={`${label} text-muted`}>TRYOUT STATUS</A>
          {TRYOUT_ROWS.map((r) => (
            <div key={r.k} className={ROW}>
              <A x={945} y={r.y} className="text-[13px] text-muted">{r.k}</A>
              <A x={1216} y={r.y} w={220} right className="text-[13px] font-bold">{r.v}</A>
              <Box x={945} y={r.y + 26} w={271} h={1} className="bg-black/8" />
            </div>
          ))}
          <Box x={945} y={816} w={271} h={1} className="bg-black/12" />
          <A x={945} y={836} className="text-[13px] font-bold tracking-[0.52px] text-crimson"><Link href="/tryouts">SEE THE PROCESS<Arrow /></Link></A>
        </Block>
      </Intro>

      <Stats
        items={[
          { n: "03", t: "Tryout phases", d: "Gameplay, observation, final review." },
          { n: "05", t: "Open roles", d: "All five lanes are open." },
          { n: "5v5", t: "Tryout format", d: "Played in 5v5 matches." },
        ]}
      />

      <div className={gap}>
      <SectionHeader
        sec="SEC.03 // ROLES"
        kicker="THE LINEUP"
        title="FIVE LANES"
        text="Every position has a job. Tryouts are open for all five lanes."
        link={{ href: "/players", label: "SEE ALL ROLES →" }}
        count={5}
        countLabel="ROLES ONLINE"
      />
      </div>

      <Band top={1261} h={360} tab={3}>
        {LANES.map((l, i) => {
          const x = 181 + 180 * i;
          const tx = x + 19;
          return (
            <Block key={l.code} x={x} y={1261} w={179} h={359} bg="group bg-white">
              {/* red fill sweeps in from the left on hover, like the header tabs; the text flips to white */}
              <Box x={x} y={1261} w={179} h={359} className="origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
              <A x={tx} y={1282} className="text-[12px] text-muted transition-colors duration-500 group-hover:text-white/75">{l.n}</A>
              <A x={tx} y={1308} fs={l.fs} className="font-display leading-none transition-colors duration-500 group-hover:text-white">{l.code}</A>
              <A x={tx} y={1372} className="text-[15px] font-bold transition-colors duration-500 group-hover:text-white">{l.name}</A>
              <A x={tx} y={1400} w={139} className="text-[13px] leading-[1.5] text-muted transition-colors duration-500 group-hover:text-white/85"><Drift>{l.desc}</Drift></A>
              <Box x={tx} y={1532} w={139} h={1} className="bg-black/12 transition-colors duration-500 group-hover:bg-white/30" />
              <A x={tx} y={1546} className={`${kicker} text-muted transition-colors duration-500 group-hover:text-white/75`}>FOCUS</A>
              <A x={tx} y={1564} w={139} className="text-[13px] font-bold leading-[1.4] transition-colors duration-500 group-hover:text-white">{l.focus}</A>
            </Block>
          );
        })}
        <Block x={1081} y={1261} w={179} h={359} bg="bg-crimson">
          <A x={1100} y={1282} className={`${label} text-white/75`}>NOW OPEN</A>
          <A x={1100} y={1308} fs={22} className="font-display text-white">TRYOUTS</A>
          <A x={1100} y={1348} w={139} className="text-[13px] leading-[1.5] text-white"><Drift>All five lanes are open. PH server.</Drift></A>
          <A x={1100} y={1552} w={139}><Btn href={DISCORD_URL} variant="white" h={48} block>APPLY</Btn></A>
        </Block>
      </Band>

      {/* TRYOUT BULLETIN */}
      <div className={gap}>
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1644} className={`${label} text-crimson`}>TRYOUT BULLETIN</A>
          <A x={1240} y={1644} right className={`${kicker} text-white/50 max-md:hidden`}>SCHEDULE TBA</A>
          <Box x={201} y={1676} w={1039} h={1} className="bg-white/20" />
          {BULLETIN.map((b, i) => {
            const x = 201 + 340 * i;
            return (
              <div key={b.v} className={GROUP}>
                <A x={x} y={1698} className={`${kicker} text-crimson`}>{"// "}{b.v}{" //"}</A>
                <A x={x} y={1722} w={300} fs={22} className="font-display leading-[1.1]">{b.t}</A>
                <A x={x} y={1770} w={300} className="text-[14px] leading-[1.6] text-white/70"><Drift>{b.d}</Drift></A>
                {i > 0 && <Box x={x - 20} y={1698} w={1} h={190} className="bg-white/15" />}
              </div>
            );
          })}
          <Box x={201} y={1904} w={1039} h={1} className="bg-white/20" />
          <A x={201} y={1914}><Btn href={DISCORD_URL} variant="red" h={48}>APPLY FOR TRYOUTS</Btn></A>
          <A x={1240} y={1930} right className="text-[13px] font-bold text-crimson max-md:hidden"><Link href="/tryouts">FULL TRYOUT PROCESS<Arrow /></Link></A>
        </Block>
      </Band>
      </div>

      <div className={gap}>
      <SectionHeader
        sec="SEC.05 // EXPLORE"
        kicker="MORE FROM COUR"
        title="EXPLORE"
        text="A quick look at every other part of the site."
        link={{ href: "/about", label: "ABOUT THE TEAM →" }}
        count={5}
        countLabel="PAGES"
      />
      </div>

      <Band top={0} h={SNIPPET_H} tab={2}>
        {PAGES.map((p, i) => {
          const c = SLOTS[i];
          const style = { "--x": `${c.x}px`, "--y": `${c.y}px`, "--w": `${c.w}px`, "--h": `${c.h}px` } as CSSProperties;
          // Flex column on desktop: each element sits below the previous one, so long text can never overlap.
          return (
            <div
              key={p.href}
              style={style}
              className="flex flex-col bg-white p-6 md:absolute md:left-[var(--x)] md:top-[var(--y)] md:h-[var(--h)] md:w-[var(--w)]"
            >
              <p className={`${label} text-crimson`}>{p.kicker}</p>
              <p className="mt-3 font-display text-[24px] leading-none">{p.title}</p>
              <p className="mt-4 text-[14px] leading-[1.6]"><Drift>{p.text}</Drift></p>
              <p className="mt-auto pt-4 text-[12px] text-muted">{p.facts}</p>
              <div className="mt-4 border-t border-black/12 pt-4 text-[13px] font-bold tracking-[0.52px] text-crimson">
                <Link href={p.href}>OPEN {p.kicker}<Arrow /></Link>
              </div>
            </div>
          );
        })}
      </Band>

      <div className={gap}>
      <CtaBand
        kicker="JOIN COUR E-PRO"
        title="TRYOUTS"
        text="Apply on Discord, then go through three phases to earn a roster spot."
        steps={[
          { t: "APPLY", d: "Join the Discord, send your IGN." },
          { t: "PHASE 1", d: "Gameplay evaluation." },
          { t: "PHASE 2", d: "One-week observation." },
          { t: "PHASE 3", d: "Final fit evaluation." },
        ]}
        cta={{ href: DISCORD_URL, label: "APPLY NOW" }}
        note="Schedule and details will be announced soon."
      />
      </div>

      {/* VISITOR MAP */}
      <div className={gap}>
      <Band top={1981} h={360}>
        <Block x={181} y={1981} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={2005} w={1039} className="max-md:w-full">
            <VisitorMap />
          </A>
        </Block>
      </Band>
      </div>

      <div className={gap}>
        <Footer top={H - FOOTER_H} />
      </div>
    </Page>
  );
}
