import { A, Band, Block, Box } from "@/components/canvas";
import { Footer, Header, Page } from "@/components/cour";
import { CtaBand, InfoCard, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";

const H = 2520;

const VALUES = [
  { t: "TEAMWORK", d: "Five players, one plan. Clear comms, trust and shared goals in every draft and fight." },
  { t: "DISCIPLINE", d: "Consistent practice, punctual scrims and honest VOD reviews." },
  { t: "GROWTH", d: "Every loss is a lesson. We track progress and keep raising the standard." },
];

// Placeholder addresses taken from the Figma file — replace with the real inboxes.
const CONTACTS = [
  { x: 201, k: "GENERAL", v: "hello@example.com" },
  { x: 441, k: "TRYOUTS", v: "tryouts@example.com" },
  { x: 681, k: "PARTNERSHIPS", v: "partners@example.com" },
];

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function AboutPage() {
  return (
    <Page h={H}>
      <Header active="about" />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "FACTS" },
          { y: 1104, label: "MOTTO" },
          { y: 1644, label: "VALUES" },
          { y: 2004, label: "CONTACT" },
        ]}
        badge={{ label: "SINCE", big: "2026" }}
      />

      <Intro
        lines={["COUR", "E-PRO."]}
        underline={393}
        text="Formerly Aeronova Esport. A Philippines-based Mobile Legends: Bang Bang team, established January 2026, competing only on the PH server."
        primary={{ href: "#contact", label: "WORK WITH US" }}
        secondary={{ href: "/teams", label: "JOIN TRYOUTS" }}
        secondaryX={392}
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
          link="PRESS KIT →"
        />
      </Intro>

      <Stats
        items={[
          { n: "2026", t: "Established", d: "Founded in January." },
          { n: "PH", t: "Server only", d: "We compete on the Philippine server." },
          { n: "02", t: "Squads", d: "Official DC and Tryouts DC." },
        ]}
      />

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

      {/* MOTTOS */}
      <Band top={1261} h={360}>
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
                <A x={921} y={y + 4} w={319} className="text-[14px] leading-[1.6] text-white/70">{v.d}</A>
                <Box x={201} y={y + 76} w={1039} h={1} className="bg-white/10" />
              </div>
            );
          })}
        </Block>
      </Band>

      <CtaBand
        kicker="CONTACT"
        title="WORK WITH US"
        text="Partnerships, scrims or tryouts. Reach the right inbox."
        cta={{ href: "mailto:hello@example.com", label: "SEND A MESSAGE" }}
        note="We reply within a few days."
      >
        <span id="contact" />
        {CONTACTS.map((c, i) => (
          <div key={c.k} className="contents">
            <A x={c.x} y={2184} className={`${kicker} text-white/70`}>{c.k}</A>
            <A x={c.x} y={2208} className="text-[14px] font-bold">
              <a href={`mailto:${c.v}`} className="hover:underline">{c.v}</a>
            </A>
            {i > 0 && <Box x={c.x - 20} y={2184} w={1} h={64} className="bg-white/25" />}
          </div>
        ))}
      </CtaBand>

      <Footer top={H - 179} />
    </Page>
  );
}
