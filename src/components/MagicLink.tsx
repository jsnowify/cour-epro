"use client";

import { useRef, type ReactNode } from "react";

/**
 * The portfolio button. The magic is the field of blue flowers (moonweed) that grows around Himmel's statue in Frieren.
 *  - At rest it is a black slab: a four-point sparkle at the left of the label (it twinkles), a light streak that glides across
 *    now and then, and a targeting frame (four corner brackets, like the grid's crosshairs) around it.
 *  - On hover or keyboard focus it turns into a garden. The sparkle blooms into a flower and a drawn meadow grows out of it
 *    like a widening circle: pale sky, soft hills, grass, and moonweed on stems with leaves and fine ink outlines, each stem
 *    growing up in turn and then swaying. The four corner brackets turn into flowers too. Flowers drift up and fade.
 *    Pressing lets go of more.
 *  - The garden is alive: clouds drift, little stars twinkle in the sky, two butterflies cross it, petals fall.
 *  - Leaving is choreographed too: the stems lower from right to left, the circle winds back into the sparkle with a long
 *    ease, the corner flowers fold back into brackets one after the other, the sparkle returns last, and a few seeds drift out.
 *  - The meadow keeps a clear band of sky behind the label (only the short flowers stand there, the tall ones frame it), so
 *    the text stays easy to read.
 *  - The cursor over it is a small blue flower.
 * Drifting flowers are throw-away elements animated with the Web Animations API (transform and opacity only). "Reduce
 * motion" shows the grown garden at once and turns the twinkle, the streak, the sway and the drifting off. It is a real <a>:
 * keyboard, middle click and screen readers all work.
 */
const BLUES = ["#3f7be0", "#5b93ee", "#7fb2f5", "#a9cbf8", "#d6e6fc"];

/** One moonweed: five or six rounded petals around a pale heart with a touch of gold. */
function flowerSvg(color: string, petals = 5) {
  const step = 360 / petals;
  const ps = Array.from({ length: petals }, (_, i) => `<ellipse cx="0" cy="-6.6" rx="4.2" ry="6.4" transform="rotate(${(i * step).toFixed(1)})" fill="${color}"/>`).join("");
  return `<svg viewBox="-12 -12 24 24" width="100%" height="100%" aria-hidden="true">${ps}<circle r="2.7" fill="#f4f9ff"/><circle r="1.1" fill="#f3cf6a"/></svg>`;
}

/** Tiny seeded generator, so the meadow is drawn the same on the server and in the browser (no hydration mismatch). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Stem = { x: number; h: number; lean: number; size: number; color: string; petals: number; spin: number; leaf: number; delay: number; leave: number };
const W = 320; // the meadow is drawn in a 320 x 52 box and stretched to the button
const H = 52;
const GROUND = 46;
const LANE: [number, number] = [52, 296]; // where the label sits (in the 320-wide box): only short flowers here
/** The stems of the drawn meadow, left to right. */
const STEMS: Stem[] = (() => {
  const r = rng(21);
  const out: Stem[] = [];
  const n = 30;
  for (let i = 0; i < n; i++) {
    const x = 6 + (i / (n - 1)) * (W - 12) + (r() - 0.5) * 6;
    out.push({
      x,
      h: x > LANE[0] && x < LANE[1] ? 4 + r() * 5 : 13 + r() * 12, // short behind the label, tall at the two ends
      lean: (r() - 0.5) * 7,
      size: 0.3 + r() * 0.22,
      color: BLUES[Math.floor(r() * 4)],
      petals: r() > 0.72 ? 6 : 5,
      spin: Math.round(r() * 72),
      leaf: r() > 0.5 ? 1 : -1,
      delay: Math.round(x * 3.2 + r() * 120), // grows left to right
      leave: Math.round((W - x) * 1.1), // lowers right to left
    });
  }
  return out;
})();
/** Blades of grass along the ground. */
const GRASS: { x: number; h: number }[] = (() => {
  const r = rng(5);
  return Array.from({ length: 46 }, () => ({ x: 2 + r() * (W - 4), h: 2.5 + r() * 3.5 }));
})();

function Garden() {
  const ink = "#24406f";
  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="magic-garden">
      <defs>
        <linearGradient id="mg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcebff" />
          <stop offset="1" stopColor="#bdd8fb" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#mg-sky)" />
      {/* soft clouds that drift */}
      <g className="magic-cloud magic-cloud-a" fill="#ffffff" opacity=".75">
        <ellipse cx="58" cy="9" rx="16" ry="3.2" />
        <ellipse cx="72" cy="7.4" rx="10" ry="3" />
      </g>
      <g className="magic-cloud magic-cloud-b" fill="#ffffff" opacity=".75">
        <ellipse cx="238" cy="12" rx="18" ry="3.2" />
        <ellipse cx="252" cy="10.2" rx="9" ry="2.8" />
      </g>
      {/* little stars that twinkle in the pale sky */}
      {[
        [112, 8, 0],
        [182, 5, 0.7],
        [286, 9, 1.3],
        [28, 8, 0.4],
      ].map(([x, y, d], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path className="magic-twinkle" style={{ ["--td" as string]: `${d}s` }} d="M0 -3C.4 -.9 .9 -.4 3 0C.9 .4 .4 .9 0 3C-.4 .9 -.9 .4 -3 0C-.9 -.4 -.4 -.9 0 -3Z" fill="#ffffff" />
        </g>
      ))}
      {/* far and near hills, with a pen line along the top */}
      <path d={`M0 41 C40 36 84 40 130 37 S 226 36 ${W} 40 V${H} H0 Z`} fill="#b9dcb4" stroke={ink} strokeWidth=".7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={`M0 ${GROUND - 1} C44 ${GROUND - 4} 92 ${GROUND + 1} 142 ${GROUND - 2} S 238 ${GROUND - 4} ${W} ${GROUND - 1} V${H} H0 Z`} fill="#86c08a" stroke={ink} strokeWidth=".7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {/* grass */}
      <g fill="#5fae78" stroke={ink} strokeWidth=".35" vectorEffect="non-scaling-stroke" strokeLinejoin="round">
        {GRASS.map((g, i) => (
          <path key={i} d={`M${g.x} ${GROUND + 2} l1.2 -${g.h} l1.4 ${g.h} Z`} />
        ))}
      </g>
      {/* stems with leaves and flowers: each grows from the ground, then sways */}
      {STEMS.map((st, i) => {
        const top = GROUND - st.h;
        const tx = st.x + st.lean;
        const step = 360 / st.petals;
        return (
          <g key={i} className="magic-stem" style={{ ["--d" as string]: `${st.delay}ms`, ["--rd" as string]: `${st.leave}ms`, ["--sway-delay" as string]: `${i * 120}ms`, transformOrigin: `${st.x}px ${GROUND + 2}px` }}>
            <path d={`M${st.x} ${GROUND + 2} Q${st.x + st.lean * 0.2} ${GROUND - st.h * 0.5} ${tx} ${top}`} fill="none" stroke="#3f8a5a" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <ellipse cx={st.x + st.leaf * 2.6 + st.lean * 0.3} cy={GROUND - st.h * 0.42} rx="3" ry="1.2" transform={`rotate(${st.leaf * -28} ${st.x + st.lean * 0.3} ${GROUND - st.h * 0.42})`} fill="#5fae78" stroke={ink} strokeWidth=".35" vectorEffect="non-scaling-stroke" />
            <g transform={`translate(${tx} ${top}) scale(${st.size}) rotate(${st.spin})`}>
              {Array.from({ length: st.petals }, (_, k) => (
                <ellipse key={k} cx="0" cy="-6.6" rx="4.2" ry="6.4" transform={`rotate(${(k * step).toFixed(1)})`} fill={st.color} stroke={ink} strokeWidth=".75" vectorEffect="non-scaling-stroke" />
              ))}
              <circle r="2.7" fill="#f4f9ff" stroke={ink} strokeWidth=".6" vectorEffect="non-scaling-stroke" />
              <circle r="1.1" fill="#f3cf6a" />
            </g>
          </g>
        );
      })}
      {/* two butterflies cross the sky */}
      {[
        { cls: "magic-bf1", color: "#cdb9ff" },
        { cls: "magic-bf2", color: "#ffe9a6" },
      ].map((b) => (
        <g key={b.cls} className={`magic-butterfly ${b.cls}`}>
          <g className="magic-wings">
            <ellipse cx="-2.4" cy="-1" rx="2.8" ry="2" fill={b.color} stroke={ink} strokeWidth=".35" vectorEffect="non-scaling-stroke" />
            <ellipse cx="2.4" cy="-1" rx="2.8" ry="2" fill={b.color} stroke={ink} strokeWidth=".35" vectorEffect="non-scaling-stroke" />
            <ellipse cx="-1.9" cy="1.2" rx="1.8" ry="1.4" fill={b.color} stroke={ink} strokeWidth=".35" vectorEffect="non-scaling-stroke" />
            <ellipse cx="1.9" cy="1.2" rx="1.8" ry="1.4" fill={b.color} stroke={ink} strokeWidth=".35" vectorEffect="non-scaling-stroke" />
          </g>
          <path d="M0 -2.2V2.4" stroke={ink} strokeWidth=".8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </g>
      ))}
      {/* petals fall through the garden */}
      {[
        [40, 0, 14],
        [118, 1.6, -10],
        [176, 0.8, 12],
        [232, 2.6, -14],
        [290, 1.2, 9],
      ].map(([x, d, dx], i) => (
        <ellipse key={i} className="magic-petal" cx={x} cy="-3" rx="1.7" ry="0.95" fill="#ffffff" stroke={ink} strokeWidth=".3" vectorEffect="non-scaling-stroke" style={{ ["--pd" as string]: `${d}s`, ["--px" as string]: `${dx}px` }} />
      ))}
    </svg>
  );
}

function Flower({ color, petals = 5, className = "" }: { color: string; petals?: number; className?: string }) {
  return <span aria-hidden className={`block ${className}`} dangerouslySetInnerHTML={{ __html: flowerSvg(color, petals) }} />;
}

export default function MagicLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const host = useRef<HTMLSpanElement>(null);
  const last = useRef(0);

  /** Let loose `count` flowers that drift up from the button, swaying, spinning and fading. */
  const release = (count: number) => {
    const el = host.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    for (let i = 0; i < count; i++) {
      const f = document.createElement("span");
      const px = 9 + Math.round(Math.random() * 11);
      Object.assign(f.style, {
        position: "absolute",
        left: `${Math.random() * (w - px)}px`,
        top: `${h * (0.2 + Math.random() * 0.6)}px`,
        width: `${px}px`,
        height: `${px}px`,
        pointerEvents: "none",
      });
      f.innerHTML = flowerSvg(BLUES[Math.floor(Math.random() * BLUES.length)], Math.random() > 0.7 ? 6 : 5);
      el.appendChild(f);
      const rise = 50 + Math.random() * 90;
      const sway = (Math.random() - 0.5) * 70;
      const spin = (Math.random() - 0.5) * 360;
      f.animate(
        [
          { transform: "translate(0, 0) rotate(0deg) scale(0.2)", opacity: 0 },
          { transform: `translate(${sway * 0.4}px, ${-rise * 0.3}px) rotate(${spin * 0.3}deg) scale(1)`, opacity: 1, offset: 0.2 },
          { transform: `translate(${-sway * 0.5}px, ${-rise * 0.65}px) rotate(${spin * 0.65}deg) scale(0.9)`, opacity: 0.9, offset: 0.6 },
          { transform: `translate(${sway}px, ${-rise}px) rotate(${spin}deg) scale(0.5)`, opacity: 0 },
        ],
        { duration: 1500 + Math.random() * 1100, easing: "cubic-bezier(0.25, 0.6, 0.35, 1)" },
      ).onfinish = () => f.remove();
    }
  };

  const onEnter = () => {
    const now = Date.now();
    if (now - last.current < 700) return;
    last.current = now;
    release(8);
  };

  const corners: { c: string; color: string }[] = [
    { c: "tl", color: BLUES[1] },
    { c: "tr", color: BLUES[3] },
    { c: "br", color: BLUES[0] },
    { c: "bl", color: BLUES[2] },
  ];
  return (
    <span className="magic group/magic relative inline-block" onPointerEnter={onEnter} onPointerLeave={() => release(6)} onPointerDown={() => release(24)}>
      {/* targeting frame: four brackets around the button at rest; on hover each one turns into a flower */}
      {corners.map(({ c, color }, i) => (
        <span key={c} aria-hidden data-c={c} className="magic-corner" style={{ ["--cd" as string]: `${i * 90}ms` }}>
          <span className="magic-bracket" />
          <Flower color={color} className="magic-cornerflower" />
        </span>
      ))}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-hs
        aria-label={`${label} (opens in a new tab)`}
        className="magic-btn relative flex h-[52px] items-center overflow-hidden pl-[50px] pr-6 text-[14px] font-bold tracking-[0.56px] whitespace-nowrap focus-visible:outline-none"
      >
        {/* light streak */}
        <span aria-hidden className="magic-streak absolute inset-y-0 -left-1/3 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {/* the garden, drawn: grows out of the spark on hover */}
        <Garden />
        {/* the spark: a twinkling sparkle at rest, it blooms into a flower on hover */}
        <span aria-hidden className="magic-spark absolute left-[18px] top-1/2 size-[19px] -translate-y-1/2">
          <svg viewBox="0 0 24 24" className="magic-star absolute inset-0 size-full" fill="currentColor">
            <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" />
          </svg>
          <Flower color={BLUES[2]} className="magic-sparkflower absolute inset-0 size-full" />
        </span>
        {/* two copies of the label: white over the black, deep blue over the garden. The blue one is revealed by the same
            widening circle as the garden, so every letter changes colour exactly where the garden's edge passes it. */}
        <span className="relative">
          <span className="magic-label">{children}</span>
          <span aria-hidden className="magic-label-sky absolute inset-0">
            {children}
          </span>
        </span>
      </a>

      {/* drifting flowers start here (not clipped by the button) */}
      <span ref={host} aria-hidden className="pointer-events-none absolute inset-0" />
    </span>
  );
}
