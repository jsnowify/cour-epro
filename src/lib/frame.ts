/**
 * One shared scroll/resize loop for every scroll-driven component (code editor, rail index, drift text, mobile header...).
 * Instead of each component owning a listener and an rAF, there is a single passive listener and a single frame per scroll.
 * Each task reads layout and returns an optional write callback; all reads run first, then all writes, so the frame does one
 * layout pass instead of thrashing between reading and writing.
 */
export type FrameTask = () => (() => void) | void;

const tasks = new Set<FrameTask>();
let raf = 0;
let bound = false;

function run() {
  raf = 0;
  const writes: (() => void)[] = [];
  for (const task of tasks) {
    const write = task();
    if (write) writes.push(write);
  }
  for (const write of writes) write();
}

/** Ask for a frame (e.g. after content changed without a scroll). */
export function requestFrame() {
  if (!raf && tasks.size) raf = requestAnimationFrame(run);
}

/** Subscribe to scroll / resize frames. Runs once right away. Returns the unsubscribe function. */
export function onFrame(task: FrameTask): () => void {
  tasks.add(task);
  if (!bound) {
    bound = true;
    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", requestFrame);
  }
  requestFrame();
  return () => {
    tasks.delete(task);
    if (!tasks.size && bound) {
      bound = false;
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", requestFrame);
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

let mq: MediaQueryList | undefined;
/** True at the desktop layout (>= 1100px). Lets mobile-only and desktop-only tasks skip their work instead of measuring hidden elements. */
export function isDesktop() {
  mq ??= window.matchMedia("(min-width: 1100px)");
  return mq.matches;
}
