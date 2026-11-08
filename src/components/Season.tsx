"use client";

import { useSyncExternalStore } from "react";
import { ANCHOR_SEASON, resetLabel, seasonAt } from "@/lib/season";

/**
 * Current MLBB season, computed from today's date in the browser (so it needs no manual update and no server clock).
 * Server render and hydration use the anchor season, then it switches to the real one if it differs.
 *   v="S" -> S42   v="long" -> SEASON 42   v="num" -> 42   v="reset" -> DEC 15–16 (next reset)
 */
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 3_600_000); // re-check hourly, so a tab left open still rolls over
  return () => clearInterval(id);
};
const now = () => seasonAt(new Date());
const server = () => ANCHOR_SEASON;

export default function Season({ v = "long" }: { v?: "S" | "long" | "num" | "reset" }) {
  const n = useSyncExternalStore(subscribe, now, server);
  if (v === "S") return <>S{n}</>;
  if (v === "num") return <>{n}</>;
  if (v === "reset") return <>{resetLabel(n)}</>;
  return <>SEASON {n}</>;
}
