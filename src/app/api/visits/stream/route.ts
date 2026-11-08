import { connection } from "next/server";
import { visitBus } from "@/lib/bus";
import { getVersion, getVisits } from "@/lib/visits";

/**
 * Realtime visit counts over Server-Sent Events. The first message is the current snapshot; after that a new message is
 * pushed whenever a visit is counted: immediately for visits on this server instance (in-process signal), and within
 * CHECK_MS for visits on other instances (a one-row database check, the full payload is only built when something changed).
 * The stream ends after LIFETIME_MS (serverless functions have a time limit) and the browser reconnects by itself.
 */
export const maxDuration = 60;

const CHECK_MS = 2000;
const HEARTBEAT_MS = 15000;
const LIFETIME_MS = 55000;

export async function GET(req: Request) {
  await connection();
  const enc = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let version = "";
      const send = (chunk: string) => {
        if (!closed) controller.enqueue(enc.encode(chunk));
      };
      const push = async () => {
        try {
          const v = await getVersion();
          if (v === version) return;
          version = v;
          send(`data: ${JSON.stringify(await getVisits())}\n\n`);
        } catch {
          /* database hiccup: try again on the next tick */
        }
      };

      send("retry: 500\n\n");
      await push(); // snapshot

      const onVisit = () => void push();
      visitBus.addEventListener("visit", onVisit);
      const check = setInterval(() => void push(), CHECK_MS);
      const beat = setInterval(() => send(": keep-alive\n\n"), HEARTBEAT_MS);
      const end = setTimeout(() => cleanup(), LIFETIME_MS);

      cleanup = () => {
        if (closed) return;
        closed = true;
        visitBus.removeEventListener("visit", onVisit);
        clearInterval(check);
        clearInterval(beat);
        clearTimeout(end);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      req.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
