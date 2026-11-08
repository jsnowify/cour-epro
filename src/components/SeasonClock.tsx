"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gameDaysLeft, msToNextDrop, resetLabel, seasonClock } from "@/lib/season";

/**
 * Footer season clock, live. The big number is the days left as the game shows them: it drops once a day at 4 PM PHT
 * (UTC+8), not at midnight. H / M / S count down to that next drop (the seconds roll every tick). The time comes from our
 * server (UTC), not the visitor's device clock, so a wrong clock cannot show a wrong day. A pulsing LIVE dot and a season
 * ruler with a playhead at "now" complete it. Move over the ruler to scrub through the
 * season: a marker follows the cursor and shows the date at that point and how far into the season it is.
 * Computed in the browser, nothing to update by hand. The server render shows dashes and the numbers fill in after
 * hydration. The tick only runs while the tab is visible.
 */
const subscribe = (cb: () => void) => {
  const id = setInterval(() => {
    if (!document.hidden) cb();
  }, 1000);
  return () => clearInterval(id);
};
/** server time minus device time (ms), refreshed from /api/time */
let offset = 0;
const tick = () => Math.floor((Date.now() + offset) / 1000);
const server = () => 0;

const TICKS = 24;
const two = (n: number) => String(n).padStart(2, "0");
const day = new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", timeZone: "UTC" });
/** The exact date and time in the Philippines (PHT, UTC+8), from the synced server time: "NOV 08 · 20:35". */
const pht = new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Manila" });
const phtLabel = (ms: number) => pht.format(new Date(ms)).replace(",", " ·").toUpperCase();

/** A value that rolls in from above each time it changes. */
function Roll({ v, className = "" }: { v: string; className?: string }) {
  return (
    <span key={v} className={`roll-in inline-block ${className}`}>
      {v}
    </span>
  );
}

/** Ask the server what time it is and remember how far the device clock is off (half the round trip is the latency). */
async function syncTime() {
  try {
    const t0 = Date.now();
    const res = await fetch("/api/time", { cache: "no-store" });
    const { now } = (await res.json()) as { now: number };
    const t1 = Date.now();
    offset = now + (t1 - t0) / 2 - t1;
  } catch {
    /* offline: keep the last offset (or the device clock) */
  }
}

export default function SeasonClock() {
  useEffect(() => {
    void syncTime();
    const id = setInterval(syncTime, 600_000);
    return () => clearInterval(id);
  }, []);

  const s = useSyncExternalStore(subscribe, tick, server);
  const now = s * 1000;
  const c = s ? seasonClock(new Date(now)) : null;
  const days = c ? gameDaysLeft(now, c.end) : 0;
  const live = !!c && days === 0;
  const drop = c ? msToNextDrop(now) : 0; // time until the day counter drops (4 PM PHT)
  const h = Math.floor(drop / 3_600_000) % 24;
  const m = Math.floor(drop / 60_000) % 60;
  const sec = Math.floor(drop / 1000) % 60;
  const pct = c ? c.pct : 0;

  const tip = useRef<HTMLSpanElement>(null);
  const tipText = useRef<HTMLSpanElement>(null);
  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!c || !tip.current || !tipText.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    tip.current.style.left = `${p * 100}%`;
    tip.current.style.opacity = "1";
    tipText.current.textContent = `${day.format(new Date(c.start + p * (c.end - c.start))).toUpperCase()} · ${Math.round(p * 100)}%`;
  };
  const unscrub = () => {
    if (tip.current) tip.current.style.opacity = "0";
  };

  return (
    <div className="flex h-[220px] flex-col justify-between p-5 text-black max-md:h-auto max-md:gap-5 max-md:bg-white">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.8px] text-muted">SEASON CLOCK</span>
        <span className="flex items-center gap-[5px] text-[9px] font-bold tracking-[0.8px] text-crimson">
          <span aria-hidden className="block size-[5px] bg-crimson motion-safe:animate-pulse" />
          LIVE
        </span>
      </div>

      <div>
        {/* days, big */}
        <div className="flex items-end gap-2">
          <span className="font-display text-[52px] leading-none">{c ? (live ? "NOW" : <Roll v={two(days)} />) : "--"}</span>
          {c && !live && <span className="pb-[5px] text-[11px] font-bold tracking-[0.88px]">DAYS</span>}
        </div>
        {/* hours / minutes / seconds in grid cells */}
        <div className="mt-[10px] grid grid-cols-3 gap-[3px]">
          {[
            ["H", c ? two(h) : "--"],
            ["M", c ? two(m) : "--"],
            ["S", c ? two(sec) : "--"],
          ].map(([k, v]) => (
            <div key={k} className="relative h-[30px] overflow-hidden bg-black/[0.05]">
              <span className="absolute left-[5px] top-[3px] text-[8px] font-bold leading-none tracking-[0.5px] text-muted">{k}</span>
              <span className="absolute inset-x-0 bottom-[3px] text-center font-display text-[14px] leading-none">
                {c ? <Roll v={v} /> : v}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-[8px] text-[10px] leading-[1.4] tracking-[0.3px] text-muted">
          {c ? (
            <>
              {phtLabel(now)} PHT
              <br />
              {live ? `S${c.n + 1} STARTS SOON` : `-1 AT 4PM · ${resetLabel(c.n)}`}
            </>
          ) : (
            "TO NEXT SEASON"
          )}
        </p>
      </div>

      {/* season ruler: playhead at now, scrub with the pointer */}
      <div className="relative h-[18px] cursor-crosshair touch-none" onPointerMove={scrub} onPointerLeave={unscrub} onPointerDown={scrub}>
        <div aria-hidden className="absolute inset-x-0 top-[6px] flex h-[8px] items-start justify-between">
          {Array.from({ length: TICKS }, (_, i) => (
            <span key={i} className={`block w-px bg-black/35 ${i % 4 === 0 ? "h-[8px]" : "h-[4px]"}`} />
          ))}
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[4px] bg-black/10">
          <div className="h-full origin-left bg-crimson transition-transform duration-1000 ease-out" style={{ transform: `scaleX(${pct})` }} />
        </div>
        {/* playhead: now */}
        <span aria-hidden className="absolute bottom-0 top-[2px] w-[2px] -translate-x-1/2 bg-crimson transition-[left] duration-1000 ease-out" style={{ left: `${pct * 100}%` }} />
        {/* scrub marker */}
        <span ref={tip} aria-hidden className="pointer-events-none absolute bottom-0 top-0 w-px -translate-x-1/2 bg-black opacity-0 transition-opacity duration-150">
          <span ref={tipText} className="absolute bottom-[calc(100%+3px)] left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-[4px] py-[1px] text-[8px] font-bold leading-[10px] tracking-[0.4px] text-white" />
        </span>
      </div>
    </div>
  );
}
