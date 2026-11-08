import { A, Band, Block, Box, Match } from "@/components/canvas";
import { FOOTER_H, Footer, Header, Page } from "@/components/cour";
import { CtaBand, InfoCard, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";
import { DISCORD_URL } from "@/lib/links";
import Season from "@/components/Season";

// One grid cell of empty space between sections (md+ only; below 1100px the bands already stack with their own padding).
const GAP = 180;
const gap = "md:mt-[180px]";
const H = 2520 + 4 * GAP + (FOOTER_H - 179);

const SCHEDULE = [
  { stage: "OPEN QUALIFIER", date: "TBA", format: "TBA", status: "TBA" },
  { stage: "GROUP STAGE", date: "TBA", format: "TBA", status: "TBA" },
  { stage: "PLAYOFFS", date: "TBA", format: "TBA", status: "TBA" },
  { stage: "FINALS", date: "TBA", format: "TBA", status: "TBA" },
];

const MATCH_ON = "border-[1.5px] border-crimson bg-white text-black font-bold text-[12px]";
const MATCH_OFF = "border border-black/20 bg-white text-black font-bold text-[12px]";

const line = "bg-black/35";
const path = "bg-crimson";

export default function TournamentsPage() {
  return (
    <Page h={H}>
      <Header active="tournaments" sticky />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104 + GAP, label: "BRACKET" },
          { y: 1644 + 2 * GAP, label: "SCHEDULE" },
          { y: 2004 + 3 * GAP, label: "UPDATES" },
        ]}
        badge={{ label: "EVENTS", big: "00" }}
        badgeY={1621 + 2 * GAP}
        idY={1981 + 3 * GAP}
        indexH={1760 + 3 * GAP}
        railH={1200 + 3 * GAP}
      />

      <Intro
        lines={["NO EVENT", "RIGHT NOW."]}
        text="There is no tournament happening at the moment. Dates, format and registration will be announced on our Discord."
        primary={{ href: DISCORD_URL, label: "JOIN THE DISCORD" }}
        secondary={{ href: "#schedule", label: "WHAT'S NEXT" }}
        secondaryX={428}
        status="NO EVENT YET"
        meta={<><Season />{"  ·  PH SERVER"}</>}
        metaX={372}
      >
        <InfoCard
          title="EVENT STATUS"
          rows={[
            ["Live event", "None"],
            ["Next event", "TBA"],
            ["Format", "TBA"],
            ["Teams", "TBA"],
            ["Dates", "TBA"],
          ]}
          link="GET UPDATES →"
        />
      </Intro>

      <Stats
        items={[
          { n: "00", t: "Live events", d: "Nothing running right now." },
          { n: "TBA", t: "Next event", d: "Announced on Discord." },
          { n: "TBA", t: "Start date", d: "Not scheduled yet." },
        ]}
      />

      <div className={gap}>
      <SectionHeader
        sec="SEC.03 // BRACKET"
        kicker="THE BRACKET"
        title="NOT SET YET"
        text="No bracket yet. The format will be announced with the next event."
        textY={1124}
        link={{ href: DISCORD_URL, label: "GET UPDATES →" }}
        count={0}
        countLabel="EVENTS"
      />
      </div>

      {/* BRACKET */}
      <Band top={1261} h={360}>
        <Block x={181} y={1261} w={1079} h={359} bg="bg-white">
          <A x={201} y={1280} className={`${kicker} text-muted`}><span id="bracket">ROUND OF 16</span></A>
          <A x={471} y={1280} className={`${kicker} text-muted max-md:hidden`}>QUARTERFINALS</A>
          <A x={741} y={1280} className={`${kicker} text-muted max-md:hidden`}>SEMIFINALS</A>
          <A x={1011} y={1280} className={`${kicker} text-muted max-md:hidden`}>FINAL</A>
          
          {/* round of 16 */}
          <div className="contents max-md:grid max-md:gap-2 max-md:min-[640px]:grid-cols-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="contents">
              <Match x={201} y={1306 + 38 * i} w={220} h={30} round="R16" className={MATCH_OFF}>
                TBA  vs  TBA
              </Match>
            </div>
          ))}

          </div>

          {/* quarterfinals */}
          <div className="contents max-md:grid max-md:gap-2 max-md:min-[640px]:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => {
            const y = 1325 + 76 * i;
            const cy = 1321 + 76 * i;
            return (
              <div key={i} className="contents">
                <Match x={471} y={y} w={220} h={30} round="QF" className={MATCH_OFF}>
                  {`WIN M${2 * i + 1}  vs  WIN M${2 * i + 2}`}
                </Match>
                <Box x={421} y={cy} w={25} h={1} className={line} />
                <Box x={421} y={cy + 38} w={25} h={1} className={line} />
                <Box x={446} y={cy} w={1} h={38} className={line} />
                <Box x={446} y={cy + 19} w={25} h={1} className={line} />
              </div>
            );
          })}

          </div>

          {/* semifinals */}
          <div className="contents max-md:grid max-md:gap-2 max-md:min-[640px]:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => {
            const y = 1363 + 152 * i;
            return (
              <div key={i} className="contents">
                <Match x={741} y={y} w={220} h={30} round="SF" className={MATCH_OFF}>
                  {`QF${2 * i + 1}  vs  QF${2 * i + 2}`}
                </Match>
                <Box x={691} y={1340 + 152 * i} w={25} h={1} className={line} />
                <Box x={691} y={1416 + 152 * i} w={25} h={1} className={line} />
                <Box x={716} y={1340 + 152 * i} w={1} h={76} className={line} />
                <Box x={716} y={1378 + 152 * i} w={25} h={1} className={line} />
              </div>
            );
          })}

          </div>

          {/* final */}
          <Match x={1011} y={1434} w={229} h={40} round="FINAL" className="border-crimson bg-crimson text-[12px] font-bold text-white">
            CHAMPION · TBD
          </Match>
          <Box x={961} y={1378} w={25} h={1} className={line} />
          <Box x={961} y={1530} w={25} h={1} className={line} />
          <Box x={986} y={1378} w={1} h={152} className={line} />
          <Box x={986} y={1454} w={25} h={1} className={line} />
          <A x={1011} y={1486} className={`${kicker} font-normal text-muted max-md:hidden`}>ALL MATCHES TO BE ANNOUNCED</A>
        </Block>
      </Band>

      {/* SCHEDULE */}
      <div className={gap}>
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1645} className="text-[12px] font-bold tracking-[0.96px] text-crimson"><span id="schedule">SCHEDULE</span></A>
          {[
            ["#", 201],
            ["STAGE", 281],
            ["DATE", 661],
            ["FORMAT", 841],
            ["STATUS", 1101],
          ].map(([t, x]) => (
            <A key={t} x={x as number} y={1684} className={`${kicker} text-white/50 max-md:hidden`}>{t}</A>
          ))}
          <Box x={201} y={1706} w={1039} h={1} className="bg-white/20" />
          {SCHEDULE.map((r, i) => {
            const y = 1732 + 62 * i;
            const open = false;
            return (
              <div key={r.stage} className="contents max-md:flex max-md:flex-wrap max-md:items-baseline max-md:gap-x-3 max-md:gap-y-1 max-md:border-b max-md:border-white/10 max-md:py-4">
                <A x={201} y={y + 2} className={`font-display text-[20px] ${open ? "text-crimson" : "text-white"}`}>{String(i + 1).padStart(2, "0")}</A>
                <A x={281} y={y} className="font-display text-[20px] max-md:basis-[calc(100%-3.5rem)]">{r.stage}</A>
                <A x={661} y={y + 5} className="text-[13px] text-white/70">{r.date}</A>
                <A x={841} y={y + 5} className="text-[13px]">{r.format}</A>
                <Box x={1101} y={y + 3} w={52} h={24} className={open ? "bg-crimson" : "border border-white bg-black"} />
                <A x={1113} y={y + 8} className="text-[11px] font-bold tracking-[0.44px]">{r.status}</A>
                <Box x={201} y={y + 46} w={1039} h={1} className="bg-white/10" />
              </div>
            );
          })}
        </Block>
      </Band>
      </div>

      <div className={gap}>
      <CtaBand
        kicker="STAY IN THE LOOP"
        title="GET NOTIFIED"
        text="No tournament is running yet. Join the Discord to hear first when one is announced."
        steps={[
          { t: "JOIN DISCORD", d: "Get the announcements." },
          { t: "FORM A SQUAD", d: "Five players and a captain." },
          { t: "REGISTER", d: "When an event opens." },
          { t: "COMPETE", d: "Play on the PH server." },
        ]}
        cta={{ href: DISCORD_URL, label: "JOIN THE DISCORD" }}
        note="Registration opens when an event is announced."
      />
      </div>

      <div className={gap}>
        <Footer top={H - FOOTER_H} />
      </div>
    </Page>
  );
}
