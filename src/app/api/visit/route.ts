import { NextResponse } from "next/server";
import { addVisit } from "@/lib/visits";
import { emitVisit } from "@/lib/bus";

/**
 * Counts one visit per visitor per day, by place (city, state, country).
 * The location comes from the host's geo headers (Vercel, Cloudflare, CloudFront), which derive it from the IP at the edge.
 * The IP itself is never read or stored here, and coordinates are rounded to 1 decimal (about 11 km).
 * A same-day cookie keeps one browser from being counted twice.
 * Local development has no geo headers, so `next dev` counts a clearly labelled test place ("Localhost") instead;
 * production never does that.
 */
const DEV = process.env.NODE_ENV === "development";
const COOKIE = "cour_v";

/** City headers are URL-encoded; keep a short printable name only. */
function cleanCity(raw: string) {
  let v = raw;
  try {
    v = decodeURIComponent(raw);
  } catch {
    /* keep as is */
  }
  return v.replace(/[^\p{L}\p{N} .'’-]/gu, "").trim().slice(0, 60);
}

/** "14.5995" -> 14.6 (about 11 km); null when missing or not a number. */
function round1(raw: string | null) {
  const n = raw === null || raw === "" ? NaN : Number(raw);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
}

export async function POST(req: Request) {
  const h = req.headers;
  // counted only when the visitor accepted the cookie notice (the client sends this header after Accept)
  if (h.get("x-cour-consent") !== "1") return NextResponse.json({ ok: false, reason: "no-consent" });
  let country = (h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || h.get("cloudfront-viewer-country") || "").toUpperCase();
  const rawRegion = h.get("x-vercel-ip-country-region") || h.get("cloudfront-viewer-country-region") || "";
  let city = cleanCity(h.get("x-vercel-ip-city") || h.get("cloudfront-viewer-city") || h.get("cf-ipcity") || "");
  let lat = round1(h.get("x-vercel-ip-latitude") || h.get("cloudfront-viewer-latitude"));
  let lng = round1(h.get("x-vercel-ip-longitude") || h.get("cloudfront-viewer-longitude"));
  let region = /^[A-Za-z0-9-]{1,8}$/.test(rawRegion) ? rawRegion.toUpperCase() : "";
  if (!/^[A-Z]{2}$/.test(country) || country === "XX" || country === "T1") {
    if (!DEV) return NextResponse.json({ ok: false, reason: "no-geo" });
    [country, region, city, lat, lng] = ["PH", "", "Localhost", 14.6, 121]; // dev only
  }

  const today = new Date().toISOString().slice(0, 10);
  const seen = (h.get("cookie") ?? "").split(/;\s*/).includes(`${COOKIE}=${today}`);
  if (seen && !DEV) return NextResponse.json({ ok: true, counted: false });

  try {
    if (!(await addVisit({ c: country, r: region, city, lat, lng }))) return NextResponse.json({ ok: false, reason: "no-db" });
  } catch (err) {
    console.error("visit not saved:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, reason: "db-error" }, { status: 503 });
  }

  emitVisit(); // realtime: open map streams on this instance update right now
  const res = NextResponse.json({ ok: true, counted: true, place: { c: country, r: region, city, lat, lng } });
  res.cookies.set(COOKIE, today, { httpOnly: true, sameSite: "lax", maxAge: 86_400, path: "/", secure: process.env.NODE_ENV === "production" });
  return res;
}
