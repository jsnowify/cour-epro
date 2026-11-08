import { Fragment } from "react";

/** The file printed by the code editor (desktop rail and mobile dock). */
export const CODE = [
  "const team = {",
  '  name: "COUR E-PRO",',
  '  game: "MLBB",',
  '  server: "PH",',
  '  season: "current",',
  "};",
  "",
  "function scout(role) {",
  "  const pool = ranked();",
  "  return pool.filter(",
  "    p => p.role == role",
  "  );",
  "}",
  "",
  "const lanes = [",
  '  "gold", "exp", "mid",',
  '  "jungle", "roam",',
  "];",
  "",
  "for (const l of lanes) {",
  "  scout(l).trial();",
  "}",
  "",
  "await scrim.block();",
  "if (win) rank.up();",
  "else vod.review();",
  "",
  "export default team;",
  "// beyond the horizon",
];

const TOKEN = /(\/\/.*$)|("[^"]*")|\b(const|function|return|for|of|await|if|else|export|default)\b/g;

/** Tiny syntax highlighter: comments grey, strings white, keywords crimson. */
export function highlight(text: string) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(<Fragment key={last}>{text.slice(last, i)}</Fragment>);
    const cls = m[1] ? "text-white/35" : m[2] ? "text-white" : "text-crimson";
    out.push(
      <span key={i} className={cls}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={last}>{text.slice(last)}</Fragment>);
  return out;
}
