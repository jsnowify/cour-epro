import JsonLd from "@/components/JsonLd";
import { pageLd, pageMeta } from "@/lib/site";
import { A, Band, Block, Box } from "@/components/canvas";
import { FOOTER_H, Footer, Header, Page } from "@/components/cour";
import { CtaBand, InfoCard, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";
import { DISCORD_URL } from "@/lib/links";
import Season from "@/components/Season";
import { Arrow } from "@/components/Arrow";

export const metadata = pageMeta("/players");

// One grid cell of empty space between sections (md+ only; below 1100px the bands already stack with their own padding).
const GAP = 180;
const gap = "md:mt-[180px]";
const H = 2520 + 4 * GAP + (FOOTER_H - 179);

const OFFICIAL = [
  { code: "GL", role: "GOLD LANE", ign: "Xaichi", status: "Active" },
  { code: "EXP", role: "EXP LANE", ign: "Giphy", status: "Active" },
  { code: "MID", role: "MID LANE", ign: "Snowi", status: "Semi-active" },
  { code: "JG", role: "JUNGLE", ign: "ZedX", status: "Inactive" },
  { code: "RM", role: "ROAM", ign: "Xivs", status: "Inactive" },
  { code: "MID", role: "MID LANE", ign: "CtrlAltDelulu", status: "Active" },
];

const TRYOUTS = [
  { code: "GL", role: "GOLD LANE" },
  { code: "EXP", role: "EXP LANE" },
  { code: "MID", role: "MID LANE" },
  { code: "JG", role: "JUNGLE" },
  { code: "RM", role: "ROAM" },
];

const NOTCH = "[clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))]";
const tagW = (c: string) => (c.length > 2 ? 34 : 27);

/**
 * Portrait frame with a head-and-shoulders placeholder clipped to its bottom edge.
 * Default is the sci-fi look (notched corners + crimson brackets); `plain` is a simple square frame.
 */
function Portrait({
  x,
  y,
  w,
  h,
  size,
  fill,
  line,
  person,
  bracket,
  plain,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  size: number;
  fill: string;
  line: string;
  person: string;
  bracket: number;
  plain?: boolean;
}) {
  const b = bracket;
  const shape = plain ? "" : NOTCH;
  return (
    <>
      <Box x={x} y={y} w={w} h={h} className={`${line} ${shape}`} />
      <Box x={x + 1} y={y + 1} w={w - 2} h={h - 2} className={`${fill} ${shape}`} />
      <Avatar x={x + (w - size) / 2} y={y + h - 1 - size * 0.9} size={size} color={person} clipY={y + h - 1} />
      {!plain && (
        <>
          <Box x={x} y={y} w={b} h={2} className="bg-crimson" />
          <Box x={x} y={y} w={2} h={b} className="bg-crimson" />
          <Box x={x + w - b} y={y + h - 2} w={b} h={2} className="bg-crimson" />
          <Box x={x + w - 2} y={y + h - b} w={2} h={b} className="bg-crimson" />
        </>
      )}
    </>
  );
}

/** Head + shoulders silhouette. Page-absolute coordinates; the lower edge is cut at `clipY`. */
function Avatar({ x, y, size, color, clipY }: { x: number; y: number; size: number; color: string; clipY: number }) {
  const h = clipY - y;
  return (
    <A x={x} y={y} w={size} className="relative overflow-hidden max-md:hidden" >
      <span className="block" style={{ height: h }} />
      <span className={`absolute rounded-full ${color}`} style={{ left: size * 0.3, top: size * 0.06, width: size * 0.4, height: size * 0.4 }} />
      <span className={`absolute rounded-t-full ${color}`} style={{ left: size * 0.06, top: size * 0.52, width: size * 0.88, height: size }} />
    </A>
  );
}

export default function PlayersPage() {
  return (
    <Page h={H}>
      <JsonLd data={pageLd("/players")} />
      <Header active="players" sticky />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104 + GAP, label: "UNO" },
          { y: 1644 + 2 * GAP, label: "DOS" },
          { y: 2004 + 3 * GAP, label: "JOIN" },
        ]}
        badge={{ label: "PLAYERS", big: "06" }}
        badgeY={1621 + 2 * GAP}
        idY={1981 + 3 * GAP}
        indexH={1760 + 3 * GAP}
        railH={1200 + 3 * GAP}
      />

      <Intro
        lines={["THE", "PLAYERS."]}
        text="Meet the players of COUR E-PRO. Every card shows the player's IGN and the role they hold on the PH server."
        primary={{ href: DISCORD_URL, label: "APPLY FOR TRYOUTS" }}
        secondary={{ href: "/teams", label: "VIEW SQUADS" }}
        status="TRYOUTS OPEN"
        meta={<><Season />{"  ·  PH SERVER"}</>}
        metaX={333}
      >
        <InfoCard
          title="ROSTER"
          rows={[
            ["COUR UNO", "6 players"],
            ["COUR DOS", "Forming"],
            ["Roles", "GL · EXP · MID · JG · RM"],
            ["Server", "PH"],
            ["Season", <Season key="s" v="num" />],
          ]}
          link="OPEN ROLES →"
          href="/tryouts#roles"
        />
      </Intro>

      <Stats
        items={[
          { n: "06", t: "Players", d: "All on COUR UNO." },
          { n: "05", t: "Roles", d: "Gold, EXP, Mid, Jungle and Roam." },
          { n: "00", t: "COUR DOS players", d: "The squad is still forming." },
        ]}
      />

      <div className={gap}>
      <SectionHeader
        sec="SEC.03 // COUR UNO"
        kicker="SQUAD 01 · ACTIVE"
        title="COUR UNO"
        text="Six players across all five lanes. Our competing squad."
        textY={1124}
        link={{ href: "/teams", label: "VIEW SQUAD →" }}
        count={6}
        countLabel="CARDS"
      />
      </div>

      {/* COUR UNO CARDS */}
      <Band top={1261} h={360} tab={3} ph={2}>
        {OFFICIAL.map((p, i) => {
          const x = 181 + 180 * i;
          return (
            <Block key={p.ign} x={x} y={1261} w={179} h={359} bg="bg-white max-md:!gap-1.5 max-md:!p-3">
              <Portrait x={x + 12} y={1273} w={155} h={190} size={125} fill="bg-surface" line="bg-black/15" person="bg-black/15" bracket={14} />
              {/* mobile: head-and-shoulders silhouette (the desktop portrait is drawn with absolute boxes) */}
              <div aria-hidden className="relative mb-1 h-[84px] overflow-hidden bg-surface md:hidden">
                <span className="absolute left-1/2 top-[10px] size-[34px] -translate-x-1/2 rounded-full bg-black/15" />
                <span className="absolute left-1/2 top-[50px] h-[70px] w-[76px] -translate-x-1/2 rounded-t-full bg-black/15" />
              </div>
              <div className="contents max-md:flex max-md:items-center max-md:justify-between">
                <A x={x + 22} y={1283} className="text-[10px] tracking-[0.8px] text-muted">{`#${String(i + 1).padStart(2, "0")}`}</A>
                <Box x={x + 149 - tagW(p.code)} y={1283} w={tagW(p.code)} h={20} className="bg-crimson" />
                <A x={x + 149 - tagW(p.code) + 7} y={1286.5} className="text-[10px] font-bold text-white max-md:bg-crimson max-md:px-2 max-md:py-[2px]">{p.code}</A>
              </div>
              <A x={x + 12} y={1479} className="text-[10px] tracking-[0.8px] text-muted">IGN</A>
              <A x={x + 12} y={1495} fs={p.ign.length > 8 ? 11 : 18} className="font-display">{p.ign}</A>
              <A x={x + 12} y={1533} className="text-[13px] font-bold">{p.role}</A>
              <A x={x + 12} y={1553} className={`text-[12px] ${p.status === "Active" ? "font-bold text-crimson" : p.status === "Inactive" ? "text-muted" : "font-bold text-black"}`}>{p.status}</A>
              <Box x={x + 12} y={1583} w={155} h={1} className="bg-black/12" />
              <A x={x + 12} y={1593} className="text-[10px] tracking-[0.4px] text-muted">COUR UNO</A>
            </Block>
          );
        })}
      </Band>

      {/* COUR DOS (not formed yet: open slots only) */}
      <div className={gap}>
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1645} className="text-[12px] font-bold tracking-[0.96px] text-crimson">SQUAD 02 · NOT FORMED YET</A>
          <A as="h2" x={201} y={1666} fs={32} className="font-display">COUR DOS</A>
          <A x={1240} y={1650} w={200} right className="text-[10px] tracking-[0.8px] text-white/60 max-md:hidden">0/5 SLOTS FILLED</A>

          <div className="contents max-md:grid max-md:grid-cols-2 max-md:gap-3 max-md:min-[640px]:grid-cols-3">
          {TRYOUTS.map((p, i) => {
            const x = 190 + 180 * i;
            const w = tagW(p.code);
            return (
              <Block key={p.code} x={x} y={1736} w={160} h={226} bg="bg-[#141414]">
                <Box x={x} y={1736} w={160} h={226} className="border border-white/10" />
                <Portrait x={x + 10} y={1746} w={140} h={104} size={84} fill="bg-[#222]" line="bg-white/15" person="bg-white/20" bracket={12} plain />
                <A x={x + 18} y={1754} className="text-[10px] tracking-[0.8px] text-white/50">{`#${String(i + 7).padStart(2, "0")}`}</A>
                <Box x={x + 142 - w} y={1754} w={w} h={20} className="bg-crimson" />
                <A x={x + 142 - w + 7} y={1757.5} className="text-[10px] font-bold">{p.code}</A>
                <A x={x + 10} y={1862} className="text-[10px] tracking-[0.8px] text-white/50">IGN</A>
                <A x={x + 10} y={1878} fs={14} className="font-display">OPEN</A>
                <A x={x + 10} y={1910} className="text-[12px] font-bold">{p.role}</A>
                <A x={x + 10} y={1930} className="text-[11px] text-white/50">Open slot</A>
              </Block>
            );
          })}

          <Block x={1090} y={1736} w={160} h={226} bg="bg-crimson">
            <Box x={1100} y={1746} w={140} h={104} className={`bg-white/15 ${NOTCH}`} />
            <A x={1170} y={1764} w={0} fs={56} className="font-display md:-translate-x-1/2">?</A>
            <A x={1100} y={1862} className="text-[10px] tracking-[0.8px] text-white/80">OPEN SLOT</A>
            <A x={1100} y={1878} fs={14} className="font-display">YOUR IGN</A>
            <A x={1100} y={1930} className="text-[12px] font-bold"><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">APPLY<Arrow /></a></A>
          </Block>
          </div>
        </Block>
      </Band>
      </div>

      <div className={gap}>
      <CtaBand
        kicker="EARN YOUR CARD"
        title="GET ON THE ROSTER"
        text="Every player here started with a tryout. Apply on Discord, then go through three phases."
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
