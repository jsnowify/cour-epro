"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CENTROIDS, LAND_PATH, MAP_H, MAP_W, project } from "@/lib/geo";
import { useConsent } from "@/lib/consent";

/**
 * Visitor map in the COUR \ style: a dot-matrix world on the same grid language as the page, land in faint squares and every
 * place that has visited as a crimson square (sized by visits) with a soft pulse. The left panel lists the busiest places as
 *   CITY  COUNTRY · STATE  visits
 * with a share bar behind each row.
 *
 * Edge cases: no data (empty state), 1-3 places (the list just ends), more than MAX_ROWS places (the list keeps the top rows
 * and ends with "+N MORE PLACES · M VISITS"), the same city name in two countries (the country is always shown), places with
 * no city (falls back to state, then country), huge counts (compact: 12K), no coordinates (country centre).
 *
 * Perf: the land is one static SVG path (rasterised once); the pulses are plain HTML squares animated with transform/opacity
 * (compositor only) and paused while the map is off screen or the tab is hidden.
 */
import type { Place, VisitData as Data } from "@/lib/visits";

const MAX_ROWS = 5; // rows shown when there are more places than this (plus the "+N more" row)
const MAX_LABELS = 3; // places labelled directly on the map

const keyOf = (p: Pick<Place, "c" | "r" | "city">) => `${p.c}-${p.r}-${p.city}`;

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fmt = (n: number) => (n >= 10_000 ? compact.format(n) : n.toLocaleString("en"));

let names: Intl.DisplayNames | null = null;
const country = (cc: string) => {
  try {
    names ??= new Intl.DisplayNames(["en"], { type: "region" });
    return (names.of(cc) ?? cc).toUpperCase();
  } catch {
    return cc;
  }
};

/** Name shown for a place: city, else state (when it is a name, not a numeric code), else the country. */
const nameOf = (p: Place) => (p.city || (/[A-Za-z]/.test(p.r) ? p.r : "") || country(p.c)).toUpperCase();
/** Second line: "PHILIPPINES · NCR". The state is dropped when it is only a numeric code or repeats the name. */
const subOf = (p: Place) => {
  const state = /[A-Za-z]/.test(p.r) && p.r.toUpperCase() !== nameOf(p) ? p.r.toUpperCase() : "";
  const cn = country(p.c);
  return cn === nameOf(p) ? state : state ? `${cn} · ${state}` : cn;
};

export default function VisitorMap() {
  const [data, setData] = useState<Data | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const consent = useConsent(); // 'yes' | 'no' | null | undefined (not known yet)

  const dataRef = useRef<Data | null>(null);
  const known = useRef<Map<string, number>>(new Map());
  const loaded = useRef(false);
  const bumpTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [bumped, setBumped] = useState<Set<string>>(new Set());

  /** Show new data right away and flash the rows whose count went up (or that just appeared). */
  const apply = useCallback((next: Data, force = false) => {
    const up = new Set<string>();
    for (const p of next.items) {
      const was = known.current.get(keyOf(p));
      if ((loaded.current || force) && (was === undefined ? p.n > 0 : p.n > was)) up.add(keyOf(p));
    }
    known.current = new Map(next.items.map((p) => [keyOf(p), p.n]));
    loaded.current = true;
    dataRef.current = next;
    setData(next);
    if (up.size) {
      setBumped(up);
      clearTimeout(bumpTimer.current);
      bumpTimer.current = setTimeout(() => setBumped(new Set()), 1400);
    }
  }, []);

  // count this visit once per tab session (only after the visitor accepted cookies), then keep the totals fresh
  useEffect(() => {
    if (consent === undefined) return; // still hydrating
    const ctrl = new AbortController();
    const el = root.current;

    // realtime: a Server-Sent Events stream, open only while the map is on screen and the tab is visible
    let es: EventSource | null = null;
    const open = () => {
      if (es) return;
      es = new EventSource("/api/visits/stream");
      es.onmessage = (e) => {
        try {
          apply(JSON.parse(e.data));
        } catch {
          /* ignore a malformed message */
        }
      };
    };
    const close = () => {
      es?.close();
      es = null;
    };
    const sync = () => (root.current?.dataset.live === "true" ? open() : close());
    el?.addEventListener("livechange", sync);

    const load = async () => {
      try {
        const res = await fetch("/api/visits", { signal: ctrl.signal, cache: "no-store" });
        if (res.ok) apply(await res.json());
      } catch {
        /* aborted or offline */
      }
    };
    (async () => {
      try {
        if (consent === "yes" && !sessionStorage.getItem("cour_visit")) {
          sessionStorage.setItem("cour_visit", "1");
          const res = await fetch("/api/visit", { method: "POST", signal: ctrl.signal, headers: { "x-cour-consent": "1" } });
          const body: { counted?: boolean; place?: Omit<Place, "n"> } = await res.json();
          if (body.counted && body.place) {
            // instant: add this visit to what is on screen now, without waiting for another round trip
            const cur = dataRef.current ?? { total: 0, places: 0, items: [] };
            const hit = cur.items.find((p) => keyOf(p) === keyOf(body.place!));
            const items = hit ? cur.items.map((p) => (p === hit ? { ...p, n: p.n + 1 } : p)) : [...cur.items, { ...body.place, n: 1 }];
            items.sort((a, b) => b.n - a.n);
            apply({ total: cur.total + 1, places: items.length, items }, true);
          }
        }
      } catch {
        /* storage blocked or offline: still show the map */
      }
      await load();
      sync(); // from here on the server pushes every change
    })();
    return () => {
      ctrl.abort();
      close();
      el?.removeEventListener("livechange", sync);
    };
  }, [consent, apply]);

  // pause the pulses while the map is off screen or the tab is hidden
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = false;
    const apply = () => {
      el.setAttribute("data-live", String(visible && !document.hidden));
      el.dispatchEvent(new Event("livechange"));
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      apply();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  const items = useMemo(() => data?.items ?? [], [data]);
  const max = Math.max(1, ...items.map((i) => i.n));
  const countries = useMemo(() => new Set(items.map((i) => i.c)).size, [items]);
  const overflow = items.length > MAX_ROWS + 1;
  const rows = overflow ? items.slice(0, MAX_ROWS) : items;
  const rest = overflow ? items.slice(MAX_ROWS) : [];

  const dots = useMemo(() => {
    const out = items.flatMap((p, k) => {
      // the place's own coordinates (rounded by the server), else the middle of its country
      const at: [number, number] | undefined = p.lat !== null && p.lng !== null ? [p.lng, p.lat] : CENTROIDS[p.c];
      if (!at) return [];
      const [x, y] = project(at[0], at[1]);
      const s = 7 + (Math.log2(p.n + 1) / Math.log2(max + 1)) * 9; // 7–16 map px
      return [{ key: `${p.c}-${p.r}-${p.city}`, name: nameOf(p), n: p.n, x, y, s, k, label: "" as string | null, dy: 0 }];
    });
    // label the busiest few directly on the map; nudge a label down when it would sit on top of the previous one
    const placed: typeof out = [];
    for (const d of out.slice(0, MAX_LABELS)) {
      // keep moving down one line at a time until it clears every label already placed
      for (let tries = 0; tries < 8 && placed.some((q) => Math.abs(q.x - d.x) < 110 && Math.abs(q.y + q.dy - (d.y + d.dy)) < 11); tries++) d.dy += 11;
      d.label = d.name;
      placed.push(d);
    }
    for (const d of out.slice(MAX_LABELS)) d.label = null;
    return out;
  }, [items, max]);

  return (
    <div ref={root} data-live="false" className="flex gap-10 max-md:flex-col max-md:gap-6 md:h-[311px]">
      {/* places */}
      <div className="flex w-[250px] shrink-0 flex-col max-md:w-full">
        <span className="text-[12px] font-bold tracking-[0.96px] text-crimson">{"// VISITOR MAP"}</span>
        <h2 className="mt-3 font-display text-[26px] leading-[1.05]">
          AROUND
          <br />
          THE WORLD
        </h2>
        <p className="mt-3 h-[14px] text-[10px] font-bold tracking-[0.8px] text-white/50">
          {data && data.total > 0 ? `${fmt(data.total)} ${data.total === 1 ? "VISIT" : "VISITS"} · ${items.length} ${items.length === 1 ? "PLACE" : "PLACES"} · ${countries} ${countries === 1 ? "COUNTRY" : "COUNTRIES"}` : ""}
        </p>

        <ul className="mt-3 flex flex-col gap-[5px]">
          {rows.map((p) => (
            <li key={keyOf(p)} className={`relative h-[26px] overflow-hidden bg-white/[0.04] ${bumped.has(keyOf(p)) ? "map-bump" : ""}`}>
              {/* share of the busiest place */}
              <span aria-hidden className="absolute inset-y-0 left-0 bg-crimson/25" style={{ width: `${Math.max(4, (p.n / max) * 100)}%` }} />
              <span className="relative flex h-full items-center gap-2 px-2">
                <span className="min-w-0 flex-1 truncate text-[12px] font-bold leading-none">
                  {nameOf(p)}
                  {subOf(p) && <span className="ml-[6px] text-[9px] font-normal tracking-[0.4px] text-white/50">{subOf(p)}</span>}
                </span>
                <span className="shrink-0 text-[12px] font-bold leading-none text-crimson">{fmt(p.n)}</span>
              </span>
            </li>
          ))}
          {rest.length > 0 && (
            <li className="flex h-[22px] items-center justify-between px-2 text-[10px] font-bold tracking-[0.8px] text-white/50">
              <span>+{rest.length} MORE {rest.length === 1 ? "PLACE" : "PLACES"}</span>
              <span>{fmt(rest.reduce((s, p) => s + p.n, 0))} {rest.reduce((s, p) => s + p.n, 0) === 1 ? "VISIT" : "VISITS"}</span>
            </li>
          )}
          {items.length === 0 && (
            <li className="px-2 text-[11px] leading-[1.6] text-white/45">{data ? "NO VISITS YET. BE THE FIRST ON THE MAP." : "LOADING"}</li>
          )}
        </ul>
      </div>

      {/* dot map */}
      <div className="relative w-full max-w-[720px] self-start md:h-[280px] md:w-[720px]">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={items.length ? `World map of visitors from ${items.length} places` : "World map of visitors"} className="block h-auto w-full">
          <path d={LAND_PATH} className="fill-white/20" />
        </svg>

        {/* corner marks, like the crosshairs on the page grid */}
        <span aria-hidden className="absolute left-0 top-0 h-[10px] w-[10px] border-l border-t border-white/30" />
        <span aria-hidden className="absolute bottom-0 right-0 h-[10px] w-[10px] border-b border-r border-white/30" />

        {dots.map((d) => (
          <span
            key={d.key}
            className="absolute aspect-square min-w-[5px] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(d.x / MAP_W) * 100}%`, top: `${(d.y / MAP_H) * 100}%`, width: `${(d.s / MAP_W) * 100}%` }}
          >
            <span aria-hidden className="map-pulse absolute inset-0 bg-crimson" style={{ animationDelay: `${(d.k % 6) * 0.35}s` }} />
            <span className="absolute inset-0 bg-crimson" title={`${d.name}: ${fmt(d.n)}`} />
            {d.label && (
              <span
                aria-hidden
                className={`pointer-events-none absolute whitespace-nowrap bg-black/70 max-md:hidden px-[4px] py-[1px] text-[9px] font-bold leading-[11px] tracking-[0.4px] ${d.x > MAP_W * 0.78 ? "right-full mr-[6px]" : "left-full ml-[6px]"}`}
                style={{ top: `calc(50% + ${d.dy}px)`, transform: "translateY(-50%)" }}
              >
                {d.label}: {fmt(d.n)}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
