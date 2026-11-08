import { getDb } from "@/lib/db";
import { getMongo, mongoEnabled } from "@/lib/mongo";

/**
 * Visitor map storage, one API for two backends:
 *  - MongoDB Atlas when MONGODB_URI is set (production on Vercel);
 *  - otherwise libSQL: Turso when TURSO_DATABASE_URL is set, else a local SQLite file in development.
 * With neither available in production, reads return an empty map and writes report "no-db".
 */
export type Place = { c: string; r: string; city: string; lat: number | null; lng: number | null; n: number };
export type VisitData = { total: number; places: number; items: Place[] };
export type NewVisit = Omit<Place, "n">;

const EMPTY: VisitData = { total: 0, places: 0, items: [] };
const keyOf = (p: NewVisit) => `${p.c}|${p.r}|${p.city}`;
const pack = (items: Place[]): VisitData => ({ total: items.reduce((s, i) => s + i.n, 0), places: items.length, items });

/** Every place with its visit count (max 300), busiest first. */
export async function getVisits(): Promise<VisitData> {
  if (mongoEnabled()) {
    const { places } = await getMongo();
    const docs = await places
      .find({}, { sort: { n: -1 }, limit: 300, projection: { _id: 0, c: 1, r: 1, city: 1, lat: 1, lng: 1, n: 1 } })
      .toArray();
    return pack(docs.map((d) => ({ c: d.c, r: d.r, city: d.city, lat: d.lat ?? null, lng: d.lng ?? null, n: d.n })));
  }
  const db = await getDb();
  if (!db) return EMPTY;
  const { rows } = await db.execute("SELECT country, region, city, lat, lng, count FROM places ORDER BY count DESC LIMIT 300");
  return pack(
    rows.map((r) => ({
      c: String(r.country),
      r: String(r.region),
      city: String(r.city),
      lat: r.lat === null ? null : Number(r.lat),
      lng: r.lng === null ? null : Number(r.lng),
      n: Number(r.count),
    })),
  );
}

/** Cheap change detector: differs whenever any count or place changes. */
export async function getVersion(): Promise<string> {
  if (mongoEnabled()) {
    const { meta } = await getMongo();
    const m = await meta.findOne({ _id: "visits" });
    return `m:${m?.v ?? 0}`;
  }
  const db = await getDb();
  if (!db) return "none";
  const { rows } = await db.execute("SELECT COUNT(*) AS c, COALESCE(SUM(count), 0) AS t, COALESCE(MAX(updated_at), '') AS u FROM places");
  const r = rows[0];
  return `${r.c}:${r.t}:${r.u}`;
}

/** Count one visit for a place. Returns false when no database is configured. */
export async function addVisit(p: NewVisit): Promise<boolean> {
  if (mongoEnabled()) {
    const { places, meta } = await getMongo();
    await places.updateOne(
      { _id: keyOf(p) },
      { $inc: { n: 1 }, $set: { updated_at: new Date() }, $setOnInsert: { c: p.c, r: p.r, city: p.city, lat: p.lat, lng: p.lng } },
      { upsert: true },
    );
    await meta.updateOne({ _id: "visits" }, { $inc: { v: 1 } }, { upsert: true });
    return true;
  }
  const db = await getDb();
  if (!db) return false;
  await db.execute({
    sql: "INSERT INTO places (country, region, city, lat, lng, count, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?) ON CONFLICT(country, region, city) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at",
    args: [p.c, p.r, p.city, p.lat, p.lng, new Date().toISOString()],
  });
  return true;
}
