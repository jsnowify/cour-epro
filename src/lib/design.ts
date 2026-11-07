/** Column x positions of the 6-column, 1440px design grid. */
export const COLS = [40, 269, 497, 725, 954, 1182] as const;

/** x positions of the faint vertical hairlines (one per column start, plus the right margin). */
export const HAIRLINE_XS = [40, 269, 497, 725, 954, 1182, 1400] as const;

export const NAV = [
  { key: "home", label: "HOME", href: "/" },
  { key: "teams", label: "TEAMS", href: "/teams" },
  { key: "tournaments", label: "TOURNAMENTS", href: "/tournaments" },
  { key: "players", label: "PLAYERS", href: "/players" },
  { key: "news", label: "NEWS", href: "/news" },
  { key: "about", label: "ABOUT", href: "/about" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];
