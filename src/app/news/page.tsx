import Link from "next/link";
import { A, Band, Block, Box } from "@/components/canvas";
import { Footer, Header, Page } from "@/components/cour";
import { CtaBand, Intro, Rails, SectionHeader, kicker } from "@/components/sections";

const H = 2520;

const CHIPS = [
  { t: "ALL", x: 201, w: 55, on: true },
  { t: "ANNOUNCEMENTS", x: 264, w: 132 },
  { t: "GUIDES", x: 404, w: 78 },
  { t: "ROSTER", x: 490, w: 78 },
  { t: "EVENTS", x: 576, w: 78 },
  { t: "TEAM", x: 662, w: 63 },
];

const STORIES = [
  { n: "01", tag: "ANNOUNCEMENT", date: "NOV 03", title: "Season 04 tryouts now open for all five lanes", media: "bg-black", mediaText: "text-white", sub: "text-white/60" },
  { n: "02", tag: "GUIDE", date: "NOV 02", title: "How the tryout process works, step by step", media: "bg-surface", mediaText: "text-black", sub: "text-black/60" },
  { n: "03", tag: "ROSTER", date: "NOV 01", title: "Tryouts DC roster slots explained", media: "bg-crimson", mediaText: "text-white", sub: "text-white/60" },
];

const ARCHIVE = [
  { d: "OCT 30", t: "GUIDE", title: "Gold lane: what we look for in a carry", hot: true },
  { d: "OCT 29", t: "TEAM", title: "Meet the coaching staff" },
  { d: "OCT 27", t: "GUIDE", title: "How draft pick and bans work" },
  { d: "OCT 25", t: "EVENT", title: "Cour Cup registration details coming soon" },
  { d: "OCT 22", t: "GUIDE", title: "Jungle tempo: Turtle and Lord timings" },
  { d: "OCT 20", t: "GUIDE", title: "Roam vision and peel fundamentals" },
];

const label = "text-[12px] font-bold tracking-[0.96px]";

export default function NewsPage() {
  return (
    <Page h={H}>
      <Header active="news" />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "TOPICS" },
          { y: 1104, label: "STORIES" },
          { y: 1644, label: "ARCHIVE" },
          { y: 2004, label: "ALERTS" },
        ]}
        badge={{ label: "NEW", big: "03" }}
      />

      <Intro
        lines={["LATEST", "NEWS."]}
        underline={469}
        text="Roster moves, tryout schedules, guides and tournament updates from COUR E-PRO."
        primary={{ href: "#alerts", label: "GET TRYOUT ALERTS" }}
        secondary={{ href: "#archive", label: "BROWSE ARCHIVE" }}
        status="UPDATED NOV 04"
        meta="5 NEW STORIES"
        metaX={348}
      >
        <Block x={921} y={581} w={319} h={299} bg="bg-white">
          <A x={945} y={605} className={`${label} text-muted`}>FEATURED · NOV 04</A>
          <A x={945} y={632} w={271} className="font-display text-[20px] leading-[1.2]">Aeronova Esport is now COUR E-PRO</A>
          <A x={945} y={698} className="text-[13px] text-muted">Category</A>
          <A x={1216} y={698} w={150} right className="text-[13px] font-bold">Organization</A>
          <Box x={945} y={724} w={271} h={1} className="bg-black/8" />
          <A x={945} y={734} className="text-[13px] text-muted">Read time</A>
          <A x={1216} y={734} w={150} right className="text-[13px] font-bold">4 min</A>
          <Box x={945} y={760} w={271} h={1} className="bg-black/8" />
          <Box x={945} y={816} w={271} h={1} className="bg-black/12" />
          <A x={945} y={836} className="text-[13px] font-bold tracking-[0.52px] text-crimson">READ ARTICLE →</A>
        </Block>
      </Intro>

      {/* TOPICS */}
      <Band top={901} h={180}>
        <Block x={181} y={901} w={1079} h={179} bg="bg-white">
          <A x={201} y={924} className={`${label} text-muted`}>BROWSE BY TOPIC</A>
          <A x={1240} y={924} w={200} right className={label}>26 STORIES</A>
          <div className="contents max-md:flex max-md:flex-wrap max-md:gap-2">
            {CHIPS.map((c) => (
              <div key={c.t} className="contents">
                <Box x={c.x} y={980} w={c.w} h={40} className={c.on ? "bg-crimson" : "border border-black/30 bg-white"} />
                <A x={c.x + 16} y={992} className={`text-[12px] font-bold tracking-[0.48px] ${c.on ? "text-white" : ""}`}>{c.t}</A>
              </div>
            ))}
          </div>
        </Block>
      </Band>

      <SectionHeader
        sec="SEC.03 // STORIES"
        kicker="THIS WEEK"
        title="NEW STORIES"
        text="Fresh updates from the team, tryouts and the Cour Cup."
        textY={1124}
        link={{ href: "#archive", label: "SEE ALL STORIES →" }}
        count={3}
        countLabel="THIS WEEK"
      />

      {/* STORY CARDS */}
      <Band top={1261} h={360}>
        {STORIES.map((s, i) => {
          const x = 181 + 360 * i;
          return (
            <div key={s.n} className="contents">
              <Block x={x} y={1261} w={359} h={160} bg={s.media}>
                <A x={x + 20} y={1281} className={`${kicker} ${s.sub}`}>{s.n}</A>
                <A x={x + 20} y={1360} fs={22} className={`font-display ${s.mediaText}`}>{s.tag}</A>
              </Block>
              <Block x={x} y={1421} w={359} h={199} bg="bg-white">
                <A x={x + 20} y={1443} className={`${kicker} whitespace-pre text-muted`}>{`${s.date}  ·  ${s.tag}`}</A>
                <A x={x + 20} y={1468} w={319} className="text-[17px] font-bold leading-[1.4]">{s.title}</A>
                <A x={x + 20} y={1580} className="text-[13px] font-bold tracking-[0.52px] text-crimson">
                  <Link href="/news">READ STORY →</Link>
                </A>
              </Block>
            </div>
          );
        })}
      </Band>

      {/* ARCHIVE */}
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-white">
          <A x={201} y={1645} className={`${label} text-crimson`}><span id="archive">ARCHIVE</span></A>
          <A x={1240} y={1645} w={200} right className="text-[12px] font-bold tracking-[0.48px]">VIEW ALL →</A>
          <Box x={201} y={1676} w={1039} h={1} className="bg-black/20" />
          {ARCHIVE.map((a, i) => {
            const y = 1700 + 46 * i;
            return (
              <div key={a.title} className="contents">
                <A x={201} y={y} className="text-[13px] font-bold">{a.d}</A>
                <A x={341} y={y + 1} className={`${kicker} ${a.hot ? "text-crimson" : "text-muted"}`}>{a.t}</A>
                <A x={501} y={y - 2} className="text-[15px]">{a.title}</A>
                <Box x={201} y={y + 32} w={1039} h={1} className="bg-black/10" />
              </div>
            );
          })}
        </Block>
      </Band>

      <CtaBand
        kicker="STAY IN THE LOOP"
        title="GET ALERTS"
        text="Tryout schedules, scrim results and roster news before anyone else."
        note=""
      >
        <A x={201} y={2184} w={700} className="max-md:w-full">
          <form action="/news" method="get" id="alerts" className="contents">
            <label htmlFor="alert-email" className="sr-only">Email address</label>
            <input
              id="alert-email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="block h-[56px] w-full bg-white px-5 text-[15px] text-black outline-none placeholder:text-muted focus:ring-2 focus:ring-black"
            />
          </form>
        </A>
        <A x={201} y={2256} className="text-[11px] font-bold tracking-[0.88px] text-white/70">EMAIL ADDRESS</A>
        <A x={921} y={2184} w={319}>
          <button
            type="submit"
            form="alerts"
            className="flex h-[56px] w-full items-center justify-between bg-black pl-5 pr-4 text-[14px] font-bold tracking-[0.56px] text-white transition-opacity hover:opacity-85"
          >
            SUBSCRIBE
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/v3/arrow-white.svg" alt="" width={22} height={22} className="block" />
          </button>
        </A>
        <A x={921} y={2256} w={319} className="text-[13px] text-white/80">No spam. Unsubscribe anytime.</A>
      </CtaBand>

      <Footer top={H - 179} />
    </Page>
  );
}
