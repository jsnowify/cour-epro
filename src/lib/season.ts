/**
 * MLBB ranked season clock. Nothing to update by hand each season: the season number and the next reset window
 * are derived from the current date, starting from one known reset.
 *
 * ASSUMPTION to verify: seasons run SEASON_MONTHS calendar months, resetting on the same day of the month.
 * If Moonton changes the cadence, edit the three constants below (and nothing else).
 */
export const ANCHOR_SEASON = 42; // the season that ends at the anchor reset
export const ANCHOR_RESET = { year: 2026, month: 12, day: 15 }; // reset window starts Dec 15 (month is 1-12)
export const RESET_DAYS = 2; // window is Dec 15–16
export const SEASON_MONTHS = 2;

const DAY = 86_400_000;
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Start (UTC ms) of the reset window that ends season `n`. */
function resetStart(n: number) {
  const { year, month, day } = ANCHOR_RESET;
  return Date.UTC(year, month - 1 + (n - ANCHOR_SEASON) * SEASON_MONTHS, day);
}

/** The season running at `now` (a new season begins once the reset window of the previous one is over). */
export function seasonAt(now: Date): number {
  const t = now.getTime();
  let n = ANCHOR_SEASON;
  while (t >= resetStart(n) + RESET_DAYS * DAY) n++;
  while (t < resetStart(n - 1) + RESET_DAYS * DAY) n--;
  return n;
}

/** Reset window that ends season `n`, e.g. "DEC 15–16" or "DEC 31–JAN 1". */
export function resetLabel(n: number): string {
  const a = new Date(resetStart(n));
  const b = new Date(resetStart(n) + (RESET_DAYS - 1) * DAY);
  const from = `${MONTHS[a.getUTCMonth()]} ${a.getUTCDate()}`;
  return a.getUTCMonth() === b.getUTCMonth() ? `${from}–${b.getUTCDate()}` : `${from}–${MONTHS[b.getUTCMonth()]} ${b.getUTCDate()}`;
}

/** Where `now` sits in the current season: days until the reset window opens, whether it is open, and the season progress 0–1. */
export function seasonClock(now: Date) {
  const t = now.getTime();
  const n = seasonAt(now);
  const start = resetStart(n - 1) + RESET_DAYS * DAY;
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
