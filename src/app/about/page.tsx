import JsonLd from "@/components/JsonLd";
import { pageLd, pageMeta } from "@/lib/site";
import { A, Band, Block, Box } from "@/components/canvas";
import { FOOTER_H, Footer, Header, Page } from "@/components/cour";
import { CtaBand, InfoCard, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";
import Drift from "@/components/Drift";
import { DISCORD_URL, PORTFOLIO_URL } from "@/lib/links";
import PixelImage from "@/components/PixelImage";
import MagicLink from "@/components/MagicLink";
import { PressKitLink } from "@/components/Reader";

export const metadata = pageMeta("/about");

// One grid cell of empty space between sections (md+ only; below 1100px the bands already stack with their own padding).
const GAP = 180;
const gap = "md:mt-[180px]";
const H = 2880 + 5 * GAP + (FOOTER_H - 179);

const VALUES = [
  { t: "TEAMWORK", d: "Five players, one plan. Clear comms, trust and shared goals in every draft and fight." },
  { t: "DISCIPLINE", d: "Consistent practice, punctual scrims and honest VOD reviews." },
  { t: "GROWTH", d: "Every loss is a lesson. We track progress and keep raising the standard." },
];

const CONTACTS = [
  { x: 201, k: "GENERAL", v: "Ask in the Discord" },
  { x: 441, k: "TRYOUTS", v: "COUR DOS is open" },
  { x: 681, k: "PARTNERSHIPS", v: "Message the staff" },
];

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function AboutPage() {
  return (
    <Page h={H}>
      <JsonLd data={pageLd("/about")} />
      <Header active="about" sticky />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "FACTS" },
          { y: 1104 + GAP, label: "MOTTO" },
          { y: 1644 + 2 * GAP, label: "VALUES" },
          { y: 2004 + 3 * GAP, label: "FOUNDER" },
          { y: 2364 + 4 * GAP, label: "DISCORD" },
        ]}
        badge={{ label: "SINCE", big: "2026" }}
        badgeY={1621 + 2 * GAP}
        idY={2341 + 4 * GAP}
        indexH={2120 + 4 * GAP}
        railH={1560 + 4 * GAP}
      />

      <Intro
        lines={["COUR", "E-PRO."]}
        text="Formerly Aeronova Esport. A Philippines-based Mobile Legends: Bang Bang team, established January 2026, competing only on the PH server."
        primary={{ href: DISCORD_URL, label: "JOIN THE DISCORD" }}
        secondary={{ href: "/teams", label: "JOIN TRYOUTS" }}
        secondaryX={428}
        status="INDEPENDENT ORG"
        meta={"EST. JAN 2026  ·  PH SERVER"}
        metaX={356}
      >
        <InfoCard
          title="FACT SHEET"
          rows={[
            ["Formerly", "Aeronova Esport"],
            ["Game", "MLBB"],
            ["Region", "Philippines"],
            ["Server", "PH only"],
            ["Established", "Jan 2026"],
          ]}
          link={<PressKitLink />}
        />
      </Intro>

      <Stats
        items={[
          { n: "2026", t: "Established", d: "Founded in January." },
          { n: "PH", t: "Server only", d: "We compete on the Philippine server." },
          { n: "01", t: "Active squad", d: "COUR UNO. COUR DOS is forming." },
        ]}
      />

      <div className={gap}>
      <SectionHeader
        sec="SEC.03 // MOTTO"
        kicker="OUR MOTTO"
        title="TWO LINES"
        text="Two lines that guide every draft, scrim and review."
        textY={1124}
        link={{ href: "#values", label: "OUR STORY →" }}
        count={2}
        countLabel="PRINCIPLES"
      />
      </div>

      {/* MOTTOS */}
      <Band top={1261} h={360} tab={2}>
        <Block x={181} y={1261} w={539} h={359} bg="bg-black text-white">
          <A x={201} y={1285} className={`${label} text-crimson`}>MOTTO 01 · OUR DIRECTION</A>
          <A x={201} y={1322} w={500} fs={54} className="font-display leading-[1.05]">BEYOND THE HORIZON.</A>
          <A x={201} y={1520} w={440} className="text-[15px] leading-[1.6] text-white/70">
            We look past the next match. Every scrim, review and rank push is a step toward a bigger stage.
          </A>
        </Block>
        <Block x={721} y={1261} w={539} h={359} bg="bg-crimson text-white">
          <A x={741} y={1285} className={`${label} text-white/80`}>MOTTO 02 · OUR CULTURE</A>
          <A x={741} y={1322} w={500} fs={54} className="font-display leading-[1.05]">BEYOND OURSELVES.</A>
          <A x={741} y={1520} w={440} className="text-[15px] leading-[1.6] text-white/85">
            Teamwork comes before individual glory. We win, learn and improve together.
          </A>
        </Block>
      </Band>

      {/* VALUES */}
      <div className={gap}>
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1645} className={`${label} text-crimson`}><span id="values">HOW WE PLAY</span></A>
          <Box x={201} y={1676} w={1039} h={1} className="bg-white/20" />
          {VALUES.map((v, i) => {
            const y = 1706 + 96 * i;
            return (
              <div key={v.t} className="contents">
                <A x={201} y={y + 12} fs={20} className="font-display text-crimson">{String(i + 1).padStart(2, "0")}</A>
                <A x={301} y={y} fs={40} className="font-display leading-none">{v.t}</A>
                <A x={921} y={y + 4} w={319} className="text-[14px] leading-[1.6] text-white/70"><Drift>{v.d}</Drift></A>
                <Box x={201} y={y + 76} w={1039} h={1} className="bg-white/10" />
              </div>
            );
          })}
        </Block>
      </Band>
      </div>

      {/* FOUNDER */}
      <div className={gap}>
      <Band top={1981} h={360}>
        <Block x={181} y={1981} w={1079} h={359} bg="bg-white">
          <A x={201} y={2001} w={318} className="max-md:w-full">
            <PixelImage alt="Snowi, founder of COUR E-PRO: a silver-haired elf character in a blue scarf" size={736} />
          </A>
          <A x={559} y={2005} className={`${label} text-crimson`}><span id="founder">FOUNDER &amp; CREATOR</span></A>
          <A as="h2" x={556} y={2028} fs={64} className="font-display leading-none">SNOWI</A>
          <A x={559} y={2102} w={650} className="text-[14px] leading-[1.6]">
            Snowi started COUR E-PRO in January 2026, back when the team was still known as Aeronova Esport. Outside of esports, Snowi spends time designing and developing websites, with a particular interest in motion design, creative interactions, and the technical side of making things work. Snowi also built this website from the ground up. When not working on a project, Snowi plays Mid Lane for COUR UNO.
          </A>
          <A x={559} y={2259}><MagicLink href={PORTFOLIO_URL} label="Snowi's portfolio">VIEW SNOWI&apos;S PORTFOLIO</MagicLink></A>
        </Block>
      </Band>
      </div>

      <div className={gap}>
      <CtaBand
        kicker="COMMUNITY"
        title="JOIN THE DISCORD"
        text="Tryouts, scrims or partnerships. Everything goes through our Discord."
        cta={{ href: DISCORD_URL, label: "JOIN THE DISCORD" }}
        note="Staff reply there."
      >
        <span id="contact" />
        {CONTACTS.map((c, i) => (
          <div key={c.k} className="contents">
            <A x={c.x} y={2184} className={`${kicker} text-white/70`}>{c.k}</A>
            <A x={c.x} y={2208} className="text-[14px] font-bold">{c.v}</A>
            {i > 0 && <Box x={c.x - 20} y={2184} w={1} h={64} className="bg-white/25" />}
          </div>
        ))}
      </CtaBand>
      </div>

      <div className={gap}>
        <Footer top={H - FOOTER_H} />
      </div>
    </Page>
  );
}
