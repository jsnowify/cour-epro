import Link from "next/link";
import { A, Band, Block, Box, GROUP, ROW, TROW } from "@/components/canvas";
import { Btn, FOOTER_H, Footer, Header, Page } from "@/components/cour";
import { CtaBand, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";
import { DISCORD_URL } from "@/lib/links";
import Season from "@/components/Season";
import { Arrow } from "@/components/Arrow";

// One grid cell of empty space between sections (md+ only; below 1100px the bands already stack with their own padding).
const GAP = 180;
const gap = "md:mt-[180px]";
const H = 2880 + 5 * GAP + (FOOTER_H - 179);

const SUMMARY = [
  { y: 632, k: "COUR UNO", v: "Active" },
  { y: 668, k: "COUR DOS", v: "Forming" },
  { y: 704, k: "UNO players", v: "6" },
  { y: 740, k: "DOS open slots", v: "5" },
  { y: 776, k: "Server", v: "PH" },
];

const ROSTER = [
  { code: "GL", role: "GOLD LANE", ign: "Xaichi", status: "Active", focus: "Farming · Positioning" },
  { code: "EXP", role: "EXP LANE", ign: "Giphy", status: "Active", focus: "Lane control · Peel" },
  { code: "MID", role: "MID LANE", ign: "Snowi", status: "Semi-active", focus: "Rotations · Burst timing" },
  { code: "JG", role: "JUNGLE", ign: "ZedX", status: "Inactive", focus: "Objectives · Tempo" },
  { code: "RM", role: "ROAM", ign: "Xivs", status: "Inactive", focus: "Vision · Engage" },
  { code: "MID", role: "MID LANE", ign: "CtrlAltDelulu", status: "Active", focus: "Rotations · Burst timing" },
];

const PHASES = [
  { t: "GAMEPLAY", d: "We evaluate your gameplay and individual performance." },
  { t: "OBSERVATION", d: "A one-week observation of your attitude, communication and activeness within the team." },
  { t: "FINAL REVIEW", d: "The final evaluation: are you a good fit for the team, in skill and character?" },
];

const TRYOUT_INFO = [
  { x: 201, k: "FORMAT", v: "5v5 matches", c: "" },
  { x: 461, k: "OPEN ROLES", v: "All five lanes", c: "" },
  { x: 721, k: "SECOND TEAM", v: "COUR DOS", c: "" },
  { x: 981, k: "SCHEDULE", v: "To be announced", c: "" },
];

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function TeamsPage() {
  return (
    <Page h={H}>
      <Header active="teams" sticky />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104 + GAP, label: "SQUADS" },
          { y: 1644 + 2 * GAP, label: "ROSTER" },
          { y: 2004 + 3 * GAP, label: "TRYOUTS" },
          { y: 2364 + 4 * GAP, label: "JOIN" },
        ]}
        badge={{ label: "ROSTER", big: "06" }}
        badgeY={1621 + 2 * GAP}
        idY={2341 + 4 * GAP}
        indexH={2120 + 4 * GAP}
        railH={1560 + 4 * GAP}
      />

      <Intro
        lines={["OUR SQUADS.", "UNO & DOS."]}
        text="COUR UNO is our active squad. COUR DOS is not formed yet and we are still finding its players."
        primary={{ href: DISCORD_URL, label: "APPLY FOR TRYOUTS" }}
        secondary={{ href: "#roster", label: "VIEW ROSTER" }}
        status="COUR DOS RECRUITING"
        meta={<><Season />{"  ·  PH SERVER"}</>}
        metaX={402}
      >
        <Block x={921} y={581} w={319} h={299} bg="bg-white">
          <A x={945} y={605} className={`${label} text-muted`}>SQUADS</A>
          {SUMMARY.map((r, i) => (
            <div key={r.k} className={ROW}>
              <A x={945} y={r.y} className="text-[13px] text-muted">{r.k}</A>
              <A x={1216} y={r.y} w={150} right className="text-[13px] font-bold">{r.v}</A>
              <Box x={945} y={r.y + 26} w={271} h={1} className="bg-black/8" />
              {i === SUMMARY.length - 1 && <Box x={945} y={816} w={271} h={1} className="bg-black/12" />}
            </div>
          ))}
          <A x={945} y={836} className="text-[13px] font-bold tracking-[0.52px] text-crimson">JOIN COUR DOS<Arrow /></A>
        </Block>
      </Intro>

      <Stats
        items={[
          { n: "01", t: "Active squad", d: "COUR UNO competes now." },
          { n: "06", t: "UNO players", d: "All five lanes covered." },
          { n: "05", t: "DOS open slots", d: "COUR DOS is still forming." },
        ]}
      />

      <div className={gap}>
      <SectionHeader
        sec="SEC.02 // SQUADS"
        kicker="THE SQUADS"
        title="UNO & DOS"
        text="COUR UNO is active. COUR DOS is still finding its players."
        textY={1124}
        link={{ href: "#roster", label: "SEE THE ROSTER →" }}
        count={2}
        countLabel="SQUADS"
      />
      </div>

      {/* SQUAD CARDS */}
      <Band top={1261} h={360} tab={2}>
        <Block x={181} y={1261} w={539} h={359} bg="bg-black text-white">
          <A x={201} y={1285} className={`${label} text-crimson`}>SQUAD 01 · ACTIVE</A>
          <A x={201} y={1312} fs={32} className="font-display">COUR UNO</A>
          <A x={201} y={1362} w={360} className="text-[14px] leading-[1.6] text-white/60">
            Our competing squad. Six players covering all five lanes in ranked, scrims and tournaments.
          </A>
          <A x={590} y={1281} className="size-[110px] max-md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/v3/official-dc.jpg" alt="COUR UNO" width={110} height={110} loading="lazy" decoding="async" className="block size-[110px] object-cover" />
          </A>
          {[
            { y: 1452, k: "Players", v: "6", vx: 700 },
            { y: 1488, k: "Lanes covered", v: "5 / 5", vx: 700 },
            { y: 1524, k: "Status", v: "Active", vx: 700 },
          ].map((r) => (
            <div key={r.k} className={ROW}>
              <A x={201} y={r.y} className="text-[13px] text-white/60">{r.k}</A>
              <A x={r.vx} y={r.y} w={150} right className="text-[13px] font-bold">{r.v}</A>
              <Box x={201} y={r.y + 26} w={499} h={1} className="bg-white/8" />
            </div>
          ))}
          <A x={201} y={1576} className="text-[13px] font-bold tracking-[0.52px] text-crimson">VIEW FULL ROSTER<Arrow /></A>
        </Block>

        <Block x={721} y={1261} w={539} h={359} bg="bg-crimson text-white">
          <A x={741} y={1285} className={`${label} text-white/80`}>SQUAD 02 · NOT FORMED YET</A>
          <A x={741} y={1312} fs={32} className="font-display">COUR DOS</A>
          <A x={741} y={1362} w={360} className="text-[14px] leading-[1.6] text-white/85">
            Not formed yet. We are still finding players. Join the Discord to be one of the first on the squad.
          </A>
          <A x={1130} y={1281} className="size-[110px] max-md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/v3/tryouts-dc.jpg" alt="COUR DOS" width={110} height={110} loading="lazy" decoding="async" className="block size-[110px] object-cover" />
          </A>
          {[
            { y: 1452, k: "Open slots", v: "5", vx: 1240 },
            { y: 1488, k: "Players", v: "0", vx: 1240 },
            { y: 1524, k: "Status", v: "Finding players", vx: 1240 },
          ].map((r) => (
            <div key={r.k} className={ROW}>
              <A x={741} y={r.y} className="text-[13px] text-white/60">{r.k}</A>
              <A x={r.vx} y={r.y} w={150} right className="text-[13px] font-bold">{r.v}</A>
              <Box x={741} y={r.y + 26} w={499} h={1} className="bg-white/20" />
            </div>
          ))}
          <A x={741} y={1562}><Btn href={DISCORD_URL} variant="white">APPLY FOR TRYOUTS</Btn></A>
        </Block>
      </Band>

      {/* OFFICIAL ROSTER TABLE */}
      <div className={gap}>
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-white">
          <A x={201} y={1645} className={`${label} text-crimson`}>
            <span id="roster">COUR UNO ROSTER</span>
          </A>
          {[
            ["LANE", 201],
            ["ROLE", 321],
            ["PLAYER (IGN)", 501],
            ["FOCUS", 741],
            ["STATUS", 1101],
          ].map(([t, x]) => (
            <A key={t} x={x as number} y={1684} className={`${kicker} text-muted max-md:hidden`}>{t}</A>
          ))}
          <Box x={201} y={1706} w={1039} h={1} className="bg-black/20" />
          {ROSTER.map((r, i) => {
            const y = 1724 + 42 * i;
            return (
              <div key={r.ign} className={TROW}>
                <A x={201} y={y} fs={18} className="font-display">{r.code}</A>
                <A x={321} y={y + 4} className="text-[13px] font-bold">{r.role}</A>
                <A x={501} y={y + 4} className="text-[13px] font-bold">{r.ign}</A>
                <A x={741} y={y + 4} className="text-[13px]">{r.focus}</A>
                <Box x={1101} y={y + 1} w={r.status === "Semi-active" ? 112 : r.status === "Inactive" ? 88 : 72} h={24} className={r.status === "Active" ? "bg-crimson" : r.status === "Inactive" ? "bg-black/12" : "bg-black"} />
                <A x={1113} y={y + 6} className={`text-[11px] font-bold uppercase tracking-[0.44px] max-md:col-span-2 max-md:w-fit max-md:px-2 max-md:py-[3px] ${r.status === "Inactive" ? "text-black/60 max-md:bg-black/10" : r.status === "Active" ? "text-white max-md:bg-crimson" : "text-white max-md:bg-black"}`}>{r.status}</A>
                <Box x={201} y={y + 34} w={1039} h={1} className="bg-black/10" />
              </div>
            );
          })}
        </Block>
      </Band>
      </div>

      {/* TRYOUT PROCESS */}
      <div className={gap}>
      <Band top={1981} h={360}>
        <Block x={181} y={1981} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={2005} className={`${label} text-crimson`}><span id="tryouts">TRYOUT PROCESS</span></A>
          <A x={1240} y={2005} right className="text-[12px] font-bold tracking-[0.48px] text-crimson max-md:hidden"><Link href="/tryouts">FULL TRYOUT PAGE<Arrow /></Link></A>
          <Box x={201} y={2036} w={1039} h={1} className="bg-white/20" />
          {PHASES.map((p, i) => {
            const x = 201 + 340 * i;
            return (
              <div key={p.t} className={GROUP}>
                <A x={x} y={2056} className={`${kicker} text-white/50`}>PHASE {String(i + 1).padStart(2, "0")}</A>
                <A x={x} y={2078} fs={26} className="font-display leading-none">{p.t}</A>
                <A x={x} y={2124} w={300} className="text-[14px] leading-[1.6] text-white/70">{p.d}</A>
                {i > 0 && <Box x={x - 20} y={2056} w={1} h={170} className="bg-white/15" />}
              </div>
            );
          })}
          <Box x={201} y={2252} w={1039} h={1} className="bg-white/20" />
          {TRYOUT_INFO.map((r) => (
            <div key={r.k} className={ROW}>
              <A x={r.x} y={2274} className={`${kicker} text-white/50`}>{r.k}</A>
              <A x={r.x} y={2298} className={`text-[14px] font-bold ${r.c}`}>{r.v}</A>
            </div>
          ))}
        </Block>
      </Band>
      </div>

      <div className={gap}>
      <CtaBand
        kicker="JOIN A SQUAD"
        title="PLAY FOR COUR"
        text="COUR DOS is still forming. Join the Discord and be one of the first players on the squad."
        steps={[
          { t: "APPLY", d: "Join the Discord, send your IGN." },
          { t: "PHASE 1", d: "Gameplay evaluation." },
          { t: "PHASE 2", d: "One-week observation." },
          { t: "PHASE 3", d: "Final fit evaluation." },
        ]}
        cta={{ href: DISCORD_URL, label: "APPLY FOR TRYOUTS" }}
        note="Schedule and details will be announced soon."
      />
      </div>

      <div className={gap}>
        <Footer top={H - FOOTER_H} />
      </div>
    </Page>
  );
}
