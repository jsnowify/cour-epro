import { MongoClient, type Collection } from "mongodb";

/**
 * MongoDB Atlas store for the visitor map (used when MONGODB_URI is set, e.g. on Vercel).
 * Serverless-friendly: one client per function instance, cached on globalThis so warm invocations reuse the connection
 * pool instead of opening a new one per request, with a small pool and short timeouts.
 *
 *  places: { _id: "PH|NCR|Manila", c, r, city, lat, lng, n, updated_at }   one document per place, n = visit count
 *  meta:   { _id: "visits", v }                                              bumped on every visit: the cheap change signal
 */
export type PlaceDoc = { _id: string; c: string; r: string; city: string; lat: number | null; lng: number | null; n: number; updated_at: Date };
type MetaDoc = { _id: string; v: number };

const g = globalThis as unknown as { __courMongo?: Promise<{ places: Collection<PlaceDoc>; meta: Collection<MetaDoc> }> };

export function mongoEnabled() {
  return !!process.env.MONGODB_URI;
}

export function getMongo() {
  g.__courMongo ??= (async () => {
    const client = new MongoClient(process.env.MONGODB_URI!, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      appName: "cour-epro",
    });
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || "cour-epro");
    const places = db.collection<PlaceDoc>("places");
    const meta = db.collection<MetaDoc>("meta");
    // idempotent: a no-op when the index already exists
    await places.createIndex({ n: -1 });
    return { places, meta };
  })().catch((err) => {
    g.__courMongo = undefined; // try again on the next request
    throw err;
  });
  return g.__courMongo;
}
