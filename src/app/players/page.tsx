import { A, Band, Block, Box } from "@/components/canvas";
import { Footer, Header, Page } from "@/components/cour";
import { CtaBand, InfoCard, Intro, Rails, SectionHeader, Stats, kicker } from "@/components/sections";

const H = 2520;

const OFFICIAL = [
  { code: "GL", role: "GOLD LANE", status: "Starter" },
  { code: "EXP", role: "EXP LANE", status: "Starter" },
  { code: "MID", role: "MID LANE", status: "Starter" },
  { code: "JG", role: "JUNGLE", status: "Starter" },
  { code: "RM", role: "ROAM", status: "Starter" },
  { code: "HC", role: "HEAD COACH", status: "Staff" },
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

/** Notched portrait frame with a head-and-shoulders placeholder clipped to its bottom edge. */
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
}) {
  const b = bracket;
  return (
    <>
      <Box x={x} y={y} w={w} h={h} className={`${line} ${NOTCH}`} />
      <Box x={x + 1} y={y + 1} w={w - 2} h={h - 2} className={`${fill} ${NOTCH}`} />
      <Avatar x={x + (w - size) / 2} y={y + h - 1 - size * 0.9} size={size} color={person} clipY={y + h - 1} />
      <Box x={x} y={y} w={b} h={2} className="bg-crimson" />
      <Box x={x} y={y} w={2} h={b} className="bg-crimson" />
      <Box x={x + w - b} y={y + h - 2} w={b} h={2} className="bg-crimson" />
      <Box x={x + w - 2} y={y + h - b} w={2} h={b} className="bg-crimson" />
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
      <Header active="players" />
      <Rails
        index={[
          { y: 584, label: "INTRO" },
          { y: 924, label: "STATS" },
          { y: 1104, label: "OFFICIAL" },
          { y: 1644, label: "TRYOUTS" },
          { y: 2004, label: "JOIN" },
        ]}
        badge={{ label: "PLAYERS", big: "11" }}
      />

      <Intro
        lines={["THE", "PLAYERS."]}
        underline={565}
        text="Meet the players of COUR E-PRO. Every card shows the player's IGN and the role they hold on the PH server."
        primary={{ href: "/about", label: "APPLY FOR TRYOUTS" }}
        secondary={{ href: "/teams", label: "VIEW SQUADS" }}
        status="TRYOUTS OPEN"
        meta={"SEASON 04  ·  PH SERVER"}
        metaX={333}
      >
        <InfoCard
          title="ROSTER"
          rows={[
            ["Official DC", "5 + coach"],
            ["Tryouts DC", "5 trialists"],
            ["Roles", "GL · EXP · MID · JG · RM"],
            ["Server", "PH"],
            ["Season", "04"],
          ]}
          link="HOW ROLES WORK →"
        />
      </Intro>

      <Stats
        items={[
          { n: "11", t: "Players", d: "Across both squads." },
          { n: "05", t: "Roles", d: "Gold, EXP, Mid, Jungle and Roam." },
          { n: "01", t: "Head coach", d: "Draft prep and VOD review." },
        ]}
      />

      <SectionHeader
        sec="SEC.03 // OFFICIAL"
        kicker="SQUAD 01 · ACTIVE"
        title="OFFICIAL DC"
        text="Five starters and a head coach. Our competing roster."
        textY={1124}
        link={{ href: "/teams", label: "VIEW SQUAD →" }}
        count={6}
        countLabel="CARDS"
      />

      {/* OFFICIAL DC CARDS */}
      <Band top={1261} h={360}>
        {OFFICIAL.map((p, i) => {
          const x = 181 + 180 * i;
          const staff = p.code === "HC";
          const t = staff ? "text-white" : "text-black";
          return (
            <Block key={p.code} x={x} y={1261} w={179} h={359} bg={staff ? "bg-black text-white" : "bg-white"}>
              <Portrait
                x={x + 12}
                y={1273}
                w={155}
                h={190}
                size={125}
                fill={staff ? "bg-black" : "bg-surface"}
                line={staff ? "bg-white/20" : "bg-black/15"}
                person={staff ? "bg-white/20" : "bg-black/15"}
                bracket={14}
              />
              <A x={x + 22} y={1283} className={`text-[10px] tracking-[0.8px] ${staff ? "text-white/50" : "text-muted"}`}>{`#${String(i + 1).padStart(2, "0")}`}</A>
              <Box x={x + 149 - tagW(p.code)} y={1283} w={tagW(p.code)} h={20} className="bg-crimson" />
              <A x={x + 149 - tagW(p.code) + 7} y={1286.5} className="text-[10px] font-bold text-white">{p.code}</A>
              <A x={x + 12} y={1479} className={`text-[10px] tracking-[0.8px] ${staff ? "text-white/50" : "text-muted"}`}>IGN</A>
              <A x={x + 12} y={1495} fs={18} className={`font-display ${t}`}>IGN TBA</A>
              <A x={x + 12} y={1533} className={`text-[13px] font-bold ${t}`}>{p.role}</A>
              <A x={x + 12} y={1553} className={`text-[12px] ${staff ? "text-white/60" : "text-muted"}`}>{p.status}</A>
              <Box x={x + 12} y={1583} w={155} h={1} className={staff ? "bg-white/15" : "bg-black/12"} />
              <A x={x + 12} y={1593} className={`text-[10px] tracking-[0.4px] ${staff ? "text-white/50" : "text-muted"}`}>COUR · OFFICIAL DC</A>
            </Block>
          );
        })}
      </Band>

      {/* TRYOUTS DC */}
      <Band top={1621} h={360}>
        <Block x={181} y={1621} w={1079} h={359} bg="bg-black text-white">
          <A x={201} y={1645} className="text-[12px] font-bold tracking-[0.96px] text-crimson">SQUAD 02 · RECRUITING</A>
          <A as="h2" x={201} y={1666} fs={32} className="font-display">TRYOUTS DC</A>
          <A x={1240} y={1650} w={200} right className="text-[10px] tracking-[0.8px] text-white/60 max-md:hidden">05/05 TRIALISTS</A>

          {TRYOUTS.map((p, i) => {
            const x = 190 + 180 * i;
            const w = tagW(p.code);
            return (
              <Block key={p.code} x={x} y={1736} w={160} h={226} bg="bg-[#141414]">
                <Box x={x} y={1736} w={160} h={226} className="border border-white/10" />
                <Portrait x={x + 10} y={1746} w={140} h={104} size={84} fill="bg-[#222]" line="bg-white/15" person="bg-white/20" bracket={12} />
                <A x={x + 18} y={1754} className="text-[10px] tracking-[0.8px] text-white/50">{`#${String(i + 7).padStart(2, "0")}`}</A>
                <Box x={x + 142 - w} y={1754} w={w} h={20} className="bg-crimson" />
                <A x={x + 142 - w + 7} y={1757.5} className="text-[10px] font-bold">{p.code}</A>
                <A x={x + 10} y={1862} className="text-[10px] tracking-[0.8px] text-white/50">IGN</A>
                <A x={x + 10} y={1878} fs={14} className="font-display">IGN TBA</A>
                <A x={x + 10} y={1910} className="text-[12px] font-bold">{p.role}</A>
                <A x={x + 10} y={1930} className="text-[11px] text-white/50">Trialist</A>
              </Block>
            );
          })}

          <Block x={1090} y={1736} w={160} h={226} bg="bg-crimson">
            <Box x={1100} y={1746} w={140} h={104} className={`bg-white/15 ${NOTCH}`} />
            <A x={1170} y={1764} w={0} fs={56} className="font-display md:-translate-x-1/2">?</A>
            <A x={1100} y={1862} className="text-[10px] tracking-[0.8px] text-white/80">OPEN SLOT</A>
            <A x={1100} y={1878} fs={14} className="font-display">YOUR IGN</A>
            <A x={1100} y={1930} className="text-[12px] font-bold">APPLY →</A>
          </Block>
        </Block>
      </Band>

      <CtaBand
        kicker="EARN YOUR CARD"
        title="GET ON THE ROSTER"
        text="Every player here started with a tryout. Four steps to your own card."
        steps={[
          { t: "APPLY", d: "IGN, rank, main role and hero pool." },
          { t: "REVIEW", d: "We check rank and role fit." },
          { t: "SCRIM", d: "Play a block with Tryouts DC." },
          { t: "DECISION", d: "Get your card and a roster call." },
        ]}
        cta={{ href: "/about", label: "APPLY FOR TRYOUTS" }}
        note="Applications are reviewed every week."
      />

      <Footer top={H - 179} />
    </Page>
  );
}
