import { A, Band, Block, Box } from "@/components/canvas";
import { Btn, Footer, Header, Page } from "@/components/cour";
import { CtaBand, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";

const H = 2520;

const SUMMARY = [
  { y: 632, k: "Official DC", v: "Active", dx: 1169 },
  { y: 668, k: "Tryouts DC", v: "Recruiting", dx: 1138 },
  { y: 704, k: "Starters", v: "5 + 5", dx: 1177 },
  { y: 740, k: "Head coach", v: "1", dx: 1208 },
  { y: 776, k: "Server", v: "PH", dx: 1200 },
];

const ROSTER = [
  { code: "GL", role: "GOLD LANE", focus: "Farming · Positioning", status: "STARTER" },
  { code: "EXP", role: "EXP LANE", focus: "Lane control · Peel", status: "STARTER" },
  { code: "MID", role: "MID LANE", focus: "Rotations · Burst timing", status: "STARTER" },
  { code: "JG", role: "JUNGLE", focus: "Objectives · Tempo", status: "STARTER" },
  { code: "RM", role: "ROAM", focus: "Vision · Engage", status: "STARTER" },
  { code: "HC", role: "HEAD COACH", focus: "Draft · VOD review", status: "STAFF" },
];

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function TeamsPage() {
  return (
    <Page h={H}>
      <Header active="teams" />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104, label: "SQUADS" },
          { y: 1644, label: "ROSTER" },
          { y: 2004, label: "JOIN" },
        ]}
        badge={{ label: "ROSTER", big: "06" }}
      />

      <Intro
        lines={["TWO SQUADS.", "ONE ORG."]}
        text="Tryouts DC scouts the next players. Official DC competes. Players move up on merit, one scrim at a time."
        primary={{ href: "/about", label: "APPLY FOR TRYOUTS" }}
        secondary={{ href: "#roster", label: "VIEW ROSTER" }}
        status="TRYOUTS DC RECRUITING"
        meta={"SEASON 04  ·  PH SERVER"}
        metaX={402}
      >
        <Block x={921} y={581} w={319} h={299} bg="bg-white">
          <A x={945} y={605} className={`${label} text-muted`}>SQUADS</A>
          {SUMMARY.map((r, i) => (
            <div key={r.k} className="contents">
              <A x={945} y={r.y} className="text-[13px] text-muted">{r.k}</A>
              <A x={r.dx} y={r.y} className="text-[13px] font-bold">{r.v}</A>
              <Box x={945} y={r.y + 26} w={271} h={1} className="bg-black/8" />
              {i === SUMMARY.length - 1 && <Box x={945} y={816} w={271} h={1} className="bg-black/12" />}
            </div>
          ))}
          <A x={945} y={836} className="text-[13px] font-bold tracking-[0.52px] text-crimson">PROMOTION PATH →</A>
        </Block>
      </Intro>

      <Stats
        items={[
          { n: "02", t: "Squads", d: "One competes, one develops talent." },
          { n: "05", t: "Starters each", d: "A player for every lane." },
          { n: "01", t: "Head coach", d: "Draft prep and VOD review." },
        ]}
      />

      <SectionHeader
        sec="SEC.02 // SQUADS"
        kicker="THE SQUADS"
        title="TWO ROSTERS"
        text="Official DC plays for results. Tryouts DC develops new talent."
        textY={1124}
        link={{ href: "#roster", label: "HOW PROMOTION WORKS →" }}
        count={2}
        countLabel="SQUADS ACTIVE"
      />

      {/* SQUAD CARDS */}
      <Band top={1261} h={360}>
        <Block x={181} y={1261} w={539} h={359} bg="bg-black text-white">
          <A x={201} y={1285} className={`${label} text-crimson`}>SQUAD 01 · ACTIVE</A>
          <A x={201} y={1312} fs={32} className="font-display">OFFICIAL DC</A>
          <A x={201} y={1362} w={360} className="text-[14px] leading-[1.6] text-white/60">
            Our competing roster. Five starters and a head coach in ranked, scrims and tournaments.
          </A>
          <A x={590} y={1281} className="size-[110px] max-md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/v3/official-dc.jpg" alt="Official DC" width={110} height={110} className="block size-[110px] object-cover" />
          </A>
          {[
            { y: 1452, k: "Starters", v: "5", vx: 692 },
            { y: 1488, k: "Head coach", v: "1", vx: 692 },
            { y: 1524, k: "Status", v: "Active", vx: 653 },
          ].map((r) => (
            <div key={r.k} className="contents">
              <A x={201} y={r.y} className="text-[13px] text-white/60">{r.k}</A>
              <A x={r.vx} y={r.y} className="text-[13px] font-bold">{r.v}</A>
              <Box x={201} y={r.y + 26} w={499} h={1} className="bg-white/8" />
            </div>
          ))}
          <A x={201} y={1576} className="text-[13px] font-bold tracking-[0.52px] text-crimson">VIEW FULL ROSTER →</A>
        </Block>

        <Block x={721} y={1261} w={539} h={359} bg="bg-crimson text-white">
          <A x={741} y={1285} className={`${label} text-white/80`}>SQUAD 02 · RECRUITING</A>
          <A x={741} y={1312} fs={32} className="font-display">TRYOUTS DC</A>
          <A x={741} y={1362} w={360} className="text-[14px] leading-[1.6] text-white/85">
            Our open roster. Prove yourself in scrims and get promoted to Official DC.
          </A>
          <A x={1130} y={1281} className="size-[110px] max-md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/v3/tryouts-dc.jpg" alt="Tryouts DC" width={110} height={110} className="block size-[110px] object-cover" />
          </A>
          {[
            { y: 1452, k: "Open slots", v: "5", vx: 1232 },
            { y: 1488, k: "Status", v: "Recruiting", vx: 1162 },
            { y: 1524, k: "Promotion", v: "To Official DC", vx: 1130 },
          ].map((r) => (
            <div key={r.k} className="contents">
              <A x={741} y={r.y} className="text-[13px] text-white/60">{r.k}</A>
              <A x={r.vx} y={r.y} className="text-[13px] font-bold">{r.v}</A>
              <Box x={741} y={r.y + 26} w={499} h={1} className="bg-white/20" />
            </div>
          ))}
          <A x={741} y={1562}><Btn href="/about" variant="white">APPLY FOR TRYOUTS</Btn></A>
        </Block>
      </Band>

      {/* OFFICIAL ROSTER TABLE */}
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-white">
          <A x={201} y={1645} className={`${label} text-crimson`}>
            <span id="roster">OFFICIAL ROSTER</span>
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
            const staff = r.status === "STAFF";
            return (
              <div key={r.code} className="contents">
                <A x={201} y={y} fs={18} className="font-display">{r.code}</A>
                <A x={321} y={y + 4} className="text-[13px] font-bold">{r.role}</A>
                <A x={501} y={y + 4} className="text-[13px] text-muted">IGN TBA</A>
                <A x={741} y={y + 4} className="text-[13px]">{r.focus}</A>
                <Box x={1101} y={y + 1} w={staff ? 64 : 80} h={24} className={staff ? "border border-black bg-white" : "bg-crimson"} />
                <A x={1113} y={y + 6} className={`text-[11px] font-bold tracking-[0.44px] ${staff ? "text-black" : "text-white"}`}>{r.status}</A>
                <Box x={201} y={y + 34} w={1039} h={1} className="bg-black/10" />
              </div>
            );
          })}
        </Block>
      </Band>

      <CtaBand
        kicker="JOIN A SQUAD"
        title="PLAY FOR COUR"
        text="Start in Tryouts DC. Prove yourself in scrims. Get promoted to Official DC."
        steps={[
          { t: "TRYOUTS DC", d: "Start in the recruiting squad." },
          { t: "SCRIMS", d: "Prove yourself on the PH server." },
          { t: "REVIEW", d: "Weekly VOD and feedback." },
          { t: "OFFICIAL DC", d: "Get promoted on merit." },
        ]}
        cta={{ href: "/about", label: "APPLY FOR TRYOUTS" }}
        note="Applications are reviewed every week."
      />

      <Footer top={H - 179} />
    </Page>
  );
}
