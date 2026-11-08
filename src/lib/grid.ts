/** COUR \ design system: 1440px canvas on a 180px square grid.
 *  Cols 0 and 7 are rails (180px); the content field is x 181–1260. */
export const CELL = 180;
export const FIELD_X = 181;
export const FIELD_W = 1079;

export const NAV = [
  { key: "home", label: "HOME", href: "/", x: 180, w: 180 },
  { key: "teams", label: "TEAMS", href: "/teams", x: 361, w: 179 },
  { key: "players", label: "PLAYERS", href: "/players", x: 541, w: 179 },
  { key: "tournaments", label: "TOURNAMENTS", href: "/tournaments", x: 722, w: 178 },
  { key: "news", label: "NEWS", href: "/news", x: 903, w: 178 },
  { key: "about", label: "ABOUT", href: "/about", x: 1083, w: 178 },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

/** 180×180 tile: 1px gridlines on the top/left edge plus crosshair marks on the corner. */
const tile =
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<rect width='1' height='180' fill='%23d6d6d6'/><rect width='180' height='1' fill='%23d6d6d6'/>" +
  "<g fill='%236b6b6b'><rect width='6' height='1'/><rect x='175' width='5' height='1'/>" +
  "<rect width='1' height='6'/><rect y='175' width='1' height='5'/></g></svg>";

export const GRID_BG = `url("data:image/svg+xml,${tile}")`;
