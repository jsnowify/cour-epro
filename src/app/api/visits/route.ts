import { connection, NextResponse } from "next/server";
import { getVisits } from "@/lib/visits";

/** Visit counts per place (snapshot). The live updates come from /api/visits/stream. */
export async function GET() {
  await connection(); // always read at request time
  return NextResponse.json(await getVisits(), { headers: { "Cache-Control": "no-store" } });
}
