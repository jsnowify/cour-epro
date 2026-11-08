import JsonLd from "@/components/JsonLd";
import { pageLd, pageMeta } from "@/lib/site";
import { A, Band, Block, Box, GROUP, ROW } from "@/components/canvas";
import { Btn, FOOTER_H, Footer, Header, Page } from "@/components/cour";
import { CtaBand, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";
import Drift from "@/components/Drift";
import { DISCORD_URL } from "@/lib/links";
import Season from "@/components/Season";
import { Arrow } from "@/components/Arrow";

export const metadata = pageMeta("/tryouts");

// One grid cell of empty space between sections (md+ only; below 1100px the bands already stack with their own padding).
const GAP = 180;
const gap = "md:mt-[180px]";
const H = 3061 + 6 * GAP + FOOTER_H;

const PHASES = [
  {
    t: "GAMEPLAY",
    d: "The first phase focuses on evaluating your gameplay and individual performance.",
    look: ["Gameplay", "Individual performance"],
    len: "TBA",
    bg: "bg-white",
  },
  {
    t: "OBSERVATION",
    d: "A one-week observation period to assess your attitude, communication and activeness within the team.",
    look: ["Attitude", "Communication", "Activeness"],
    len: "1 WEEK",
    bg: "bg-black text-white",
  },
  {
    t: "FINAL REVIEW",
    d: "The final evaluation to determine whether you are a good fit for the team.",
    look: ["Skill fit", "Character fit"],
    len: "TBA",
    bg: "bg-crimson text-white",
  },
];

const BULLETIN = [
  { v: "VER_02", t: "THE PROCESS", d: "Based on what we learned from our previous tryouts, to keep selection fair and build a roster that fits in skill and character." },
  { v: "VER_03_01", t: "5V5 FORMAT", d: "So many players joined the tryout server that matches are now 5v5 instead of the planned ranked games." },
  { v: "VER_03_02", t: "SECOND TEAM", d: "All five lanes are open. COUR DOS is opening to give more players with potential a chance. Schedule soon." },
];

const LANES = [
  { code: "GL", name: "GOLD LANE" },
  { code: "EXP", name: "EXP LANE" },
  { code: "MID", name: "MID LANE" },
  { code: "JG", name: "JUNGLE" },
  { code: "RM", name: "ROAM" },
];

const STATUS = [
  { y: 632, k: "Format", v: "5v5 matches" },
  { y: 668, k: "Phases", v: "3" },
  { y: 704, k: "Open roles", v: "All five lanes" },
  { y: 740, k: "Slots per role", v: "UNO 4 · DOS 5" },
  { y: 776, k: "Schedule", v: "TBA" },
];

/** Short, answer-first Q&A: shown on the page and mirrored as FAQPage structured data for search and answer engines. */
const FAQ = [
  { q: "Are tryouts open right now?", a: "Yes. All five lanes are open: 4 slots per lane on COUR UNO and 5 per lane on COUR DOS." },
  { q: "How do I apply?", a: "Join our Discord and send your IGN and main role. The Discord is the only place to apply." },
  { q: "What are the tryout phases?", a: "Gameplay and individual performance, a one-week observation, then a final review of skill and character fit." },
  { q: "What format are the matches?", a: "5v5 matches instead of ranked games, because so many players joined the tryout server." },
  { q: "Which server do we play on?", a: "Only the PH (Philippines) server." },
  { q: "When is the tryout schedule?", a: "It has not been announced yet. It will be posted on our Discord." },
];
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function TryoutsPage() {
  return (
    <Page h={H}>
      <JsonLd data={[pageLd("/tryouts"), faqLd]} />
      <Header active={null} sticky />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104 + GAP, label: "PHASES" },
          { y: 1644 + 2 * GAP, label: "BULLETIN" },
          { y: 2004 + 3 * GAP, label: "ROLES" },
          { y: 2364 + 4 * GAP, label: "FAQ" },
          { y: 2724 + 5 * GAP, label: "APPLY" },
        ]}
        badge={{ label: "PHASES", big: "03" }}
        badgeY={1621 + 2 * GAP}
        idY={2701 + 5 * GAP}
        indexH={2480 + 5 * GAP}
        railH={1920 + 5 * GAP}
      />

      <Intro
        lines={["TRYOUT", "PROCESS."]}
        text="Three phases to earn a spot on COUR E-PRO. 5v5 matches, all five lanes open, PH server only."
        primary={{ href: DISCORD_URL, label: "APPLY FOR TRYOUTS" }}
        secondary={{ href: "#phases", label: "SEE THE PHASES" }}
        status="TRYOUTS OPEN"
        meta={<><Season />{"  ·  PH SERVER"}</>}
      >
        <Block x={921} y={581} w={319} h={299} bg="bg-white">
          <A x={945} y={605} className={`${label} text-muted`}>TRYOUT STATUS</A>
          {STATUS.map((r) => (
            <div key={r.k} className={ROW}>
              <A x={945} y={r.y} className="text-[13px] text-muted">{r.k}</A>
              <A x={1216} y={r.y} w={220} right className="text-[13px] font-bold">{r.v}</A>
              <Box x={945} y={r.y + 26} w={271} h={1} className="bg-black/8" />
            </div>
          ))}
          <Box x={945} y={816} w={271} h={1} className="bg-black/12" />
          <A x={945} y={836} className="text-[13px] font-bold tracking-[0.52px] text-crimson">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">APPLY ON DISCORD<Arrow /></a>
          </A>
        </Block>
      </Intro>

      <Stats
        items={[
          { n: "03", t: "Phases", d: "Gameplay, observation, final review." },
          { n: "5v5", t: "Match format", d: "Played in 5v5 matches." },
          { n: "05", t: "Open roles", d: "All five lanes are open." },
        ]}
      />

      <div className={gap}>
      <SectionHeader
        sec="SEC.03 // PHASES"
        kicker="HOW IT WORKS"
        title="3 PHASES"
        text="Each phase is a checkpoint. Pass one to move on to the next."
        textY={1124}
        link={{ href: "#bulletin", label: "READ THE BULLETIN →" }}
        count={3}
        countLabel="PHASES"
      />
      </div>

      {/* PHASES */}
      <Band top={1261} h={360} tab={3}>
        {PHASES.map((p, i) => {
          const x = 181 + 360 * i;
          const dark = i > 0;
          return (
            <Block key={p.t} x={x} y={1261} w={359} h={359} bg={p.bg}>
              <A x={x + 24} y={1285} className={`${label} ${dark ? "text-white/80" : "text-crimson"}`}>
                <span id={i === 0 ? "phases" : undefined}>PHASE {String(i + 1).padStart(2, "0")}</span>
              </A>
              <A x={x + 24} y={1316} fs={30} className="font-display leading-none">{p.t}</A>
              <A x={x + 24} y={1372} w={311} className={`text-[14px] leading-[1.6] ${dark ? "text-white/80" : "text-muted"}`}>{p.d}</A>
              <Box x={x + 24} y={1488} w={311} h={1} className={dark ? "bg-white/25" : "bg-black/12"} />
              <A x={x + 24} y={1502} className={`${kicker} ${dark ? "text-white/70" : "text-muted"}`}>WE LOOK AT</A>
              <A x={x + 24} y={1522} className="text-[13px] font-bold leading-[1.5]">{p.look.join("  ·  ")}</A>
              <A x={x + 24} y={1572} className={`${kicker} ${dark ? "text-white/70" : "text-muted"}`}>DURATION</A>
              <A x={x + 335} y={1572} right className="text-[13px] font-bold">{p.len}</A>
            </Block>
          );
        })}
      </Band>

      {/* BULLETIN */}
      <div className={gap}>
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1644} className={`${label} text-crimson`}><span id="bulletin">TRYOUT BULLETIN</span></A>
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
        </Block>
      </Band>
      </div>

      {/* ROLES */}
      <div className={gap}>
      <Band top={1981} h={360} tab={3}>
        {LANES.map((l, i) => {
          const x = 181 + 180 * i;
          return (
            <Block key={l.code} x={x} y={1981} w={179} h={359} bg="group bg-white">
              {/* red fill sweeps in from the left on hover, like the home lane cards; the text flips to white */}
              <Box x={x} y={1981} w={179} h={359} className="origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
              <A x={x + 19} y={2002} className="text-[12px] text-muted transition-colors duration-500 group-hover:text-white/75">{String(i + 1).padStart(2, "0")}</A>
              <A x={x + 19} y={2028} fs={l.code.length > 2 ? 30 : 36} className="font-display leading-none transition-colors duration-500 group-hover:text-white">{l.code}</A>
              <A x={x + 19} y={2092} className="text-[15px] font-bold transition-colors duration-500 group-hover:text-white">{l.name}</A>
              <Box x={x + 19} y={2226} w={139} h={1} className="bg-black/12 transition-colors duration-500 group-hover:bg-white/30" />
              {[["UNO", 4], ["DOS", 5]].map(([sq, n], j) => (
                <div key={sq} className="contents">
                  <Box x={x + 19} y={2244 + 32 * j} w={122} h={24} className="bg-crimson transition-colors duration-500 group-hover:bg-white" />
                  <A x={x + 30} y={2249 + 32 * j} className="text-[11px] font-bold tracking-[0.44px] text-white transition-colors duration-500 group-hover:text-crimson max-md:w-fit max-md:bg-crimson max-md:px-2 max-md:py-[3px]">{sq} · {n} SLOTS</A>
                </div>
              ))}
            </Block>
          );
        })}
        <Block x={1081} y={1981} w={179} h={359} bg="bg-black text-white">
          <A x={1100} y={2002} className={`${label} text-crimson`}><span id="roles">ROLES</span></A>
          <A x={1100} y={2028} fs={22} className="font-display">ALL FIVE</A>
          <A x={1100} y={2068} w={139} className="text-[13px] leading-[1.5] text-white/70">Pick your main lane when you apply on Discord.</A>
        </Block>
      </Band>
      </div>

      {/* FAQ */}
      <div className={gap}>
      <Band top={1981} h={360}>
        <Block x={181} y={1981} w={1079} h={359} bg="bg-white">
          <A x={201} y={2005} className={`${label} text-crimson`}><span id="faq">FAQ</span></A>
          <Box x={201} y={2036} w={1039} h={1} className="bg-black/20" />
          {FAQ.map((f, i) => {
            const x = 201 + 340 * (i % 3);
            const y = 2056 + 142 * Math.floor(i / 3);
            return (
              <div key={f.q} className={GROUP}>
                <A x={x} y={y} w={300} className="text-[14px] font-bold leading-[1.4]">{f.q}</A>
                <A x={x} y={y + 34} w={300} className="text-[13px] leading-[1.6] text-muted">{f.a}</A>
              </div>
            );
          })}
        </Block>
      </Band>
      </div>

      <div className={gap}>
      <CtaBand
        kicker="READY?"
        title="APPLY NOW"
        text="Join the Discord, send your IGN and main role, then go through the three phases."
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
