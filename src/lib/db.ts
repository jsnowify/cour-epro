import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";

/**
 * Visitor store: serverless SQLite (libSQL).
 *  - Production / serverless: set TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN). Turso is hosted SQLite, so it works on Vercel.
 *  - Local dev without those variables: a plain SQLite file at ./data/visits.db, created on first use.
 *  - Production without TURSO_DATABASE_URL: returns null (a serverless file system is read-only), and the map just stays empty.
 * Only the place name (city, state, country), its coordinates rounded to 1 decimal (about 11 km) and a counter are stored.
 * Never an IP address, a user id or an exact location.
 */
let pending: Promise<Client | null> | undefined;

async function connect(): Promise<Client | null> {
  let url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    if (process.env.NODE_ENV === "production") return null;
    fs.mkdirSync("data", { recursive: true });
    url = "file:data/visits.db";
  }
  const db = createClient({ url, authToken });
  await db.execute(
    "CREATE TABLE IF NOT EXISTS places (country TEXT NOT NULL, region TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT '', lat REAL, lng REAL, count INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL, PRIMARY KEY (country, region, city))",
  );
  return db;
}

/** Shared connection (created once per server instance). Resolves to null when no database is configured. */
export function getDb(): Promise<Client | null> {
  pending ??= connect().catch((err) => {
    console.error("visitor db unavailable:", err instanceof Error ? err.message : err);
    pending = undefined; // try again on the next request
    return null;
  });
  return pending;
}
