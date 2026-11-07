import { A, Band, Block, Box, Match } from "@/components/canvas";
import { Footer, Header, Page } from "@/components/cour";
import { CtaBand, InfoCard, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";

const H = 2520;

const SCHEDULE = [
  { stage: "OPEN QUALIFIER", date: "Date TBA", format: "BO3 · 64 teams", status: "OPEN" },
  { stage: "GROUP STAGE", date: "Date TBA", format: "BO3 · 16 teams", status: "SOON" },
  { stage: "PLAYOFFS", date: "Date TBA", format: "BO3 · Top 8", status: "SOON" },
  { stage: "SEASON FINALS", date: "Date TBA", format: "BO5 · Top 2", status: "SOON" },
];

const MATCH_ON = "border-[1.5px] border-crimson bg-white text-black font-bold text-[12px]";
const MATCH_OFF = "border border-black/20 bg-white text-black font-bold text-[12px]";

const line = "bg-black/35";
const path = "bg-crimson";

export default function TournamentsPage() {
  return (
    <Page h={H}>
      <Header active="tournaments" />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104, label: "BRACKET" },
          { y: 1644, label: "SCHEDULE" },
          { y: 2004, label: "REGISTER" },
        ]}
        badge={{ label: "TEAMS", big: "16" }}
      />

      <Intro
        lines={["COUR CUP", "SEASON 04"]}
        underline={704}
        text="Our Season 04 tournament on the PH server. Sixteen squads, single elimination and a best-of-five final."
        primary={{ href: "/about", label: "REGISTER YOUR SQUAD" }}
        secondary={{ href: "#bracket", label: "VIEW BRACKET" }}
        secondaryX={455}
        status="REGISTRATION SOON"
        meta={"DRAFT PICK  ·  PH SERVER"}
        metaX={372}
      >
        <InfoCard
          title="EVENT DETAILS"
          rows={[
            ["Teams", "16"],
            ["Format", "Single elim"],
            ["Matches", "BO3"],
            ["Final", "BO5"],
            ["Dates", "TBA"],
          ]}
          link="READ THE RULES →"
        />
      </Intro>

      <Stats
        items={[
          { n: "16", t: "Teams", d: "Eight first-round matches." },
          { n: "BO5", t: "Final", d: "Best of five for the title." },
          { n: "TBA", t: "Start date", d: "Announced with qualifiers." },
        ]}
      />

      <SectionHeader
        sec="SEC.03 // BRACKET"
        kicker="THE BRACKET"
        title="SINGLE ELIM"
        text="Sixteen squads, four rounds, one champion."
        textY={1124}
        link={{ href: "#bracket", label: "FULL BRACKET →" }}
        count={4}
        countLabel="ROUNDS"
      />

      {/* BRACKET */}
      <Band top={1261} h={360}>
        <Block x={181} y={1261} w={1079} h={359} bg="bg-white">
          <A x={201} y={1280} className={`${kicker} text-muted`}><span id="bracket">ROUND OF 16</span></A>
          <A x={471} y={1280} className={`${kicker} text-muted max-md:hidden`}>QUARTERFINALS</A>
          <A x={741} y={1280} className={`${kicker} text-muted max-md:hidden`}>SEMIFINALS</A>
          <A x={1011} y={1280} className={`${kicker} text-muted max-md:hidden`}>FINAL</A>
          <A x={1151} y={1280} className="whitespace-pre text-[11px] font-bold tracking-[0.88px] text-crimson max-md:hidden">{"■  COUR PATH"}</A>

          {/* round of 16 */}
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="contents">
              <Match x={201} y={1306 + 38 * i} w={220} h={30} round="R16" className={i === 0 ? MATCH_ON : MATCH_OFF}>
                <span className={i === 0 ? "text-crimson" : ""}>{i === 0 ? "COUR  vs  TBA" : "TBA  vs  TBA"}</span>
              </Match>
              {i === 0 && <Box x={201} y={1306} w={3} h={30} className="bg-crimson" />}
            </div>
          ))}

          {/* quarterfinals */}
          {Array.from({ length: 4 }, (_, i) => {
            const y = 1325 + 76 * i;
            const cy = 1321 + 76 * i;
            return (
              <div key={i} className="contents">
                <Match x={471} y={y} w={220} h={30} round="QF" className={i === 0 ? MATCH_ON : MATCH_OFF}>
                  {`WIN M${2 * i + 1}  vs  WIN M${2 * i + 2}`}
                </Match>
                <Box x={421} y={cy} w={25} h={1} className={line} />
                <Box x={421} y={cy + 38} w={25} h={1} className={line} />
                <Box x={446} y={cy} w={1} h={38} className={line} />
                <Box x={446} y={cy + 19} w={25} h={1} className={line} />
              </div>
            );
          })}

          {/* semifinals */}
          {Array.from({ length: 2 }, (_, i) => {
            const y = 1363 + 152 * i;
            return (
              <div key={i} className="contents">
                <Match x={741} y={y} w={220} h={30} round="SF" className={i === 0 ? MATCH_ON : MATCH_OFF}>
                  {`QF${2 * i + 1}  vs  QF${2 * i + 2}`}
                </Match>
                <Box x={691} y={1340 + 152 * i} w={25} h={1} className={line} />
                <Box x={691} y={1416 + 152 * i} w={25} h={1} className={line} />
                <Box x={716} y={1340 + 152 * i} w={1} h={76} className={line} />
                <Box x={716} y={1378 + 152 * i} w={25} h={1} className={line} />
              </div>
            );
          })}

          {/* final */}
          <Match x={1011} y={1434} w={229} h={40} round="FINAL" className="border-crimson bg-crimson text-[12px] font-bold text-white">
            CHAMPION · TBD
          </Match>
          <Box x={961} y={1378} w={25} h={1} className={line} />
          <Box x={961} y={1530} w={25} h={1} className={line} />
          <Box x={986} y={1378} w={1} h={152} className={line} />
          <Box x={986} y={1454} w={25} h={1} className={line} />
          <A x={1011} y={1486} className={`${kicker} font-normal text-muted max-md:hidden`}>THE FINAL IS BEST-OF-FIVE</A>

          {/* COUR path */}
          <Box x={421} y={1320} w={25} h={2} className={path} />
          <Box x={445} y={1320} w={2} h={21} className={path} />
          <Box x={446} y={1339} w={25} h={2} className={path} />
          <Box x={691} y={1339} w={25} h={2} className={path} />
          <Box x={715} y={1339} w={2} h={40} className={path} />
          <Box x={716} y={1377} w={25} h={2} className={path} />
          <Box x={961} y={1377} w={25} h={2} className={path} />
          <Box x={985} y={1377} w={2} h={78} className={path} />
          <Box x={986} y={1453} w={25} h={2} className={path} />
        </Block>
      </Band>

      {/* SCHEDULE */}
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1645} className="text-[12px] font-bold tracking-[0.96px] text-crimson">SCHEDULE</A>
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
            const open = r.status === "OPEN";
            return (
              <div key={r.stage} className="contents">
                <A x={201} y={y + 2} className={`font-display text-[20px] ${open ? "text-crimson" : "text-white"}`}>{String(i + 1).padStart(2, "0")}</A>
                <A x={281} y={y} className="font-display text-[20px]">{r.stage}</A>
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

      <CtaBand
        kicker="ENTER THE CUP"
        title="REGISTER"
        text="Five players, one captain. Open qualifiers decide who reaches the main event."
        steps={[
          { t: "FORM A SQUAD", d: "Five players and a captain." },
          { t: "REGISTER", d: "Squad name and every IGN." },
          { t: "QUALIFY", d: "Play the open qualifier." },
          { t: "MAIN EVENT", d: "Top 16 enter the bracket." },
        ]}
        cta={{ href: "/about", label: "REGISTER NOW" }}
        note="Registration opens with the Season 04 qualifiers."
      />

      <Footer top={H - 179} />
    </Page>
  );
}
