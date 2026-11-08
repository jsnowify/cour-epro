import { getDb } from "@/lib/db";

export type Place = { c: string; r: string; city: string; lat: number | null; lng: number | null; n: number };
export type VisitData = { total: number; places: number; items: Place[] };

/** Every place with its visit count (max 300), busiest first. */
export async function getVisits(): Promise<VisitData> {
  const db = await getDb();
  if (!db) return { total: 0, places: 0, items: [] };
  const { rows } = await db.execute("SELECT country, region, city, lat, lng, count FROM places ORDER BY count DESC LIMIT 300");
  const items: Place[] = rows.map((r) => ({
    c: String(r.country),
    r: String(r.region),
    city: String(r.city),
    lat: r.lat === null ? null : Number(r.lat),
    lng: r.lng === null ? null : Number(r.lng),
    n: Number(r.count),
  }));
  return { total: items.reduce((s, i) => s + i.n, 0), places: items.length, items };
}

/** Cheap change detector: differs whenever any count or place changes. */
export async function getVersion(): Promise<string> {
  const db = await getDb();
  if (!db) return "none";
  const { rows } = await db.execute("SELECT COUNT(*) AS c, COALESCE(SUM(count), 0) AS t, COALESCE(MAX(updated_at), '') AS u FROM places");
  const r = rows[0];
  return `${r.c}:${r.t}:${r.u}`;
}
