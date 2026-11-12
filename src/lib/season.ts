/**
 * MLBB ranked season clock. The season number and the next end are derived from the current date, starting from one
 * known end. A season ends at 16:00 PHT (08:00 UTC) on its end date, the moment the game's day counter hits 0.
 *
 * Season 42 ("Starward Decade") ran Sep 16 – Dec 16, 2026 (3 months). If Moonton changes the cadence, edit the
 * constants below (and nothing else).
 */
export const ANCHOR_SEASON = 42; // the season that ends at the anchor date
export const ANCHOR_END = { year: 2026, month: 12, day: 16 }; // end date (month is 1-12), at 16:00 PHT
export const SEASON_MONTHS = 3;
const END_HOUR_UTC = 8; // 16:00 PHT

const DAY = 86_400_000;
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** End (UTC ms) of season `n`; season n+1 starts at the same instant. */
function resetStart(n: number) {
  const { year, month, day } = ANCHOR_END;
  return Date.UTC(year, month - 1 + (n - ANCHOR_SEASON) * SEASON_MONTHS, day, END_HOUR_UTC);
}

/** The season running at `now` (a new season begins once the reset window of the previous one is over). */
export function seasonAt(now: Date): number {
  const t = now.getTime();
  let n = ANCHOR_SEASON;
  while (t >= resetStart(n)) n++;
  while (t < resetStart(n - 1)) n--;
  return n;
}

/** End date of season `n`, e.g. "DEC 16". */
export function resetLabel(n: number): string {
  const a = new Date(resetStart(n));
  return `${MONTHS[a.getUTCMonth()]} ${a.getUTCDate()}`;
}

/** Where `now` sits in the current season: days until the reset window opens, whether it is open, and the season progress 0–1. */
export function seasonClock(now: Date) {
  const t = now.getTime();
  const n = seasonAt(now);
  const start = resetStart(n - 1);
  const end = resetStart(n);
  const live = t >= end;
  return {
    n,
    start,
    end,
    live,
    days: live ? 0 : Math.ceil((end - t) / DAY),
    pct: Math.min(1, Math.max(0, (t - start) / (end - start))),
  };
}

/** The game's day counter drops once a day at 16:00 PHT (UTC+8, no daylight saving) = 08:00 UTC. */
const DROP_UTC_MS = 8 * 3_600_000;

/** Days left as the game shows them: whole calendar days to the reset day, flipping at 16:00 PHT. 0 = reset day. */
export function gameDaysLeft(nowMs: number, resetStartMs: number): number {
  const today = Math.floor((nowMs - DROP_UTC_MS) / DAY);
  return Math.max(0, Math.floor(resetStartMs / DAY) - today);
}

/** Milliseconds until the next 16:00 PHT, when the day counter drops by one. */
export function msToNextDrop(nowMs: number): number {
  return (Math.floor((nowMs - DROP_UTC_MS) / DAY) + 1) * DAY + DROP_UTC_MS - nowMs;
}
