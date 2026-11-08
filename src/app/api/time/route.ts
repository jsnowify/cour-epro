import { connection, NextResponse } from "next/server";

/** Server time (UTC ms). The season clock uses it instead of the visitor's device clock, which can be wrong. */
export async function GET() {
  await connection();
  return NextResponse.json({ now: Date.now() }, { headers: { "Cache-Control": "no-store" } });
}
