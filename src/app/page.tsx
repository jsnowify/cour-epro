import { A, Band, Block, Box } from "@/components/canvas";
import { Btn, Footer, Header, Page } from "@/components/cour";
import { CtaBand, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";

const H = 2520;

const LANES = [
  { n: "01", code: "GL", fs: 36, name: "GOLD LANE", desc: "Late-game carry. Farms gold and wins the fights.", focus: "Farming · Positioning" },
  { n: "02", code: "EXP", fs: 30, name: "EXP LANE", desc: "Frontline fighter. Holds the side lane.", focus: "Lane control · Peel" },
  { n: "03", code: "MID", fs: 30, name: "MID LANE", desc: "Burst and control. Rotates early.", focus: "Rotations · Burst timing" },
  { n: "04", code: "JG", fs: 36, name: "JUNGLE", desc: "Objective driver. Takes Turtle and Lord.", focus: "Objectives · Tempo" },
  { n: "05", code: "RM", fs: 36, name: "ROAM", desc: "Vision and protection. Shields the carry.", focus: "Vision · Engage" },
];

const MATCH = [
  { y: 1660, k: "DATE", v: "TBA" },
  { y: 1732, k: "FORMAT", v: "Best of 3 · Draft pick" },
  { y: 1804, k: "TIME", v: "20:00 PHT" },
  { y: 1876, k: "ROSTER", v: "Official DC" },
];

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function HomePage() {
  return (
    <Page h={H}>
      <Header active="home" />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104, label: "LINEUP" },
          { y: 1644, label: "MATCH" },
          { y: 2004, label: "TRYOUTS" },
        ]}
        badge={{ label: "LIVE", big: "SOON" }}
      />

      <Intro
        lines={["BEYOND THE", "HORIZON"]}
        underline={784}
        text="COUR E-PRO is a Philippines-based Mobile Legends: Bang Bang team competing in ranked, scrims and tournaments on the PH server. We're scouting new players for Season 04."
        primary={{ href: "/about", label: "APPLY FOR TRYOUTS" }}
        secondary={{ href: "/teams", label: "MEET THE TEAMS" }}
        status="TRYOUTS OPEN"
        meta={"SEASON 04  ·  PH SERVER  ·  EST. JAN 2026"}
      >
        <Block x={921} y={581} w={319} h={299} bg="bg-white">
          <A x={945} y={605} className={`${label} text-muted`}>NEXT MATCH</A>
          <A x={945} y={632} fs={26} className="font-display">COUR vs TBA</A>
          <A x={945} y={690} className="text-[14px]">Date TBA</A>
          <A x={945} y={714} className="text-[14px] text-muted">Best of 3 · Draft pick</A>
          <A x={945} y={738} className="text-[14px] text-muted">20:00 PHT</A>
          <Box x={945} y={790} w={271} h={1} className="bg-black/12" />
          <A x={945} y={812} className="text-[13px] font-bold tracking-[0.52px] text-crimson">VIEW SCHEDULE →</A>
        </Block>
      </Intro>

      <Stats
        items={[
          { n: "05", t: "Lanes to fill", d: "Gold, EXP, Mid, Jungle and Roam." },
          { n: "02", t: "Squads", d: "Official DC competes. Tryouts DC develops." },
          { n: "BO3", t: "Match format", d: "Draft pick on the PH server." },
        ]}
      />

      <SectionHeader
        sec="SEC.03 // ROLES"
        kicker="THE LINEUP"
        title="FIVE LANES"
        text="Every position has a job. Tryouts fill the open slots on both squads."
        link={{ href: "/players", label: "SEE ALL ROLES →" }}
        count={5}
        countLabel="ROLES ONLINE"
      />

      <Band top={1261} h={360}>
        {LANES.map((l, i) => {
          const x = 181 + 180 * i;
          const tx = x + 19;
          return (
            <Block key={l.code} x={x} y={1261} w={179} h={359} bg="bg-white">
              <A x={tx} y={1282} className="text-[12px] text-muted">{l.n}</A>
              <A x={tx} y={1308} fs={l.fs} className="font-display leading-none">{l.code}</A>
              <A x={tx} y={1372} className="text-[15px] font-bold">{l.name}</A>
              <A x={tx} y={1400} w={139} className="text-[13px] leading-[1.5] text-muted">{l.desc}</A>
              <Box x={tx} y={1532} w={139} h={1} className="bg-black/12" />
              <A x={tx} y={1546} className={`${kicker} text-muted`}>FOCUS</A>
              <A x={tx} y={1564} w={139} className="text-[13px] font-bold leading-[1.4]">{l.focus}</A>
            </Block>
          );
        })}
        <Block x={1081} y={1261} w={179} h={359} bg="bg-crimson">
          <A x={1100} y={1282} className={`${label} text-white/75`}>NOW OPEN</A>
          <A x={1100} y={1308} fs={22} className="font-display text-white">TRYOUTS</A>
          <A x={1100} y={1348} w={139} className="text-[13px] leading-[1.5] text-white">All five lanes. PH server. Weekly lobbies.</A>
          <A x={1100} y={1552} w={139}><Btn href="/about" variant="white" h={48} block>APPLY</Btn></A>
        </Block>
      </Band>

      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1644} className={`${label} text-crimson`}>MATCH DAY</A>
          <A x={201} y={1680} fs={72} className="font-display leading-none">COUR</A>
          <A x={495} y={1711} fs={24} className="font-display text-crimson max-md:hidden">VS</A>
          <A x={558} y={1680} fs={72} className="font-display leading-none text-muted max-md:hidden">TBA</A>
          <A x={201} y={1788} w={600} className="text-[15px] leading-[1.6] text-white/70">Season 04 scrim block on the PH server. Opponent and broadcast to be announced.</A>
          <A x={201} y={1880}><Btn href="/tournaments" variant="outline-light">FULL SCHEDULE</Btn></A>
          <Box x={980} y={1644} w={1} h={312} className="bg-white/15" />
          {MATCH.map((m) => (
            <div key={m.k} className="contents">
              <A x={1004} y={m.y} className={`${kicker} text-white/50`}>{m.k}</A>
              <A x={1004} y={m.y + 20} className="text-[16px] font-bold">{m.v}</A>
            </div>
          ))}
        </Block>
      </Band>

      <CtaBand
        kicker="JOIN COUR E-PRO"
        title="TRYOUTS"
        text="Four steps from application to a roster spot. Open to every lane."
        steps={[
          { t: "APPLY", d: "Send your IGN, rank and main role." },
          { t: "REVIEW", d: "We check rank and hero pool." },
          { t: "SCRIM", d: "Play a block on the PH server." },
          { t: "DECISION", d: "Get feedback and a roster call." },
        ]}
        cta={{ href: "/about", label: "APPLY NOW" }}
        note="Applications are reviewed every week."
      />

      <Footer top={H - 179} />
    </Page>
  );
}
