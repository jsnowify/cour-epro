"use client";

import { useRef, type ReactNode } from "react";

/**
 * The portfolio button. At rest it is the site's ordinary crimson button (label and arrow). The magic only shows on hover or
 * keyboard focus, and it is the field of blue flowers (moonweed) that grows around Himmel's statue in Frieren. Two looks:
 *  - variant="sci" (default): the site's own moves. The black sweep runs in from the left, a light streak glides across, a
 *    targeting frame (corner brackets, like the grid's crosshairs) flies outward, and a row of flowers grows up from the
 *    bottom edge and sways;
 *  - variant="sky": the crimson melts into a pale morning sky, the label turns deep blue and a whole field grows across the
 *    button, left to right like wind, some flowers reaching past the top edge.
 * In both, the arrow gives way on hover (sci: the label slides into its place and a flower blooms at the left, like a spark;
 * sky: a flower blooms in the arrow's own slot), so the button never changes size. Hovering or pressing lets loose flowers that drift up, sway, spin and fade (pressing lets go of more), and the cursor becomes a small blue flower.
 * The sci look has a second act: if you keep hovering, about a second after the spark blooms the button turns into a garden.
 * A drawn meadow grows out of the spark like a widening circle: pale sky, soft hills, grass, and moonweed on stems with
 * leaves and fine ink outlines, each stem growing up in turn and then swaying. The label turns deep blue. Leave, and it all
 * folds back into the plain crimson button.
 * Drifting flowers are throw-away elements animated with the Web Animations API (transform and opacity only). "Reduce
 * motion" shows the grown field at once and turns the sway and the drifting off. It is a real <a>: keyboard, middle click and
 * screen readers all work.
 */
const BLUES = ["#3f7be0", "#5b93ee", "#7fb2f5", "#a9cbf8", "#d6e6fc"];

/** One moonweed: five or six rounded petals around a pale heart with a touch of gold. */
function flowerSvg(color: string, petals = 5) {
  const step = 360 / petals;
  const ps = Array.from({ length: petals }, (_, i) => `<ellipse cx="0" cy="-6.6" rx="4.2" ry="6.4" transform="rotate(${(i * step).toFixed(1)})" fill="${color}"/>`).join("");
  return `<svg viewBox="-12 -12 24 24" width="100%" height="100%" aria-hidden="true">${ps}<circle r="2.7" fill="#f4f9ff"/><circle r="1.1" fill="#f3cf6a"/></svg>`;
}

/** Tiny seeded generator, so the field is the same on the server and in the browser (no hydration mismatch). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Bloom = { left: number; bottom: number; size: number; delay: number; color: string; petals: number; rot: number };
/** The field: ~34 flowers across the button. All of them stay hidden until the button is hovered or focused. */
const FIELD: Bloom[] = (() => {
  const r = rng(7);
  const out: Bloom[] = [];
  for (let i = 0; i < 34; i++) {
    const left = 2 + r() * 96;
    const bottom = i < 12 ? -4 + r() * 14 : -2 + r() * 92; // the first dozen form the front row; the rest fill the field
    out.push({
      left,
      bottom,
      size: Math.round(11 + r() * 12),
      delay: Math.round(left * 4.2 + r() * 140), // left to right, like wind
      color: BLUES[Math.floor(r() * BLUES.length)],
      petals: r() > 0.7 ? 6 : 5,
      rot: Math.round(r() * 72),
    });
  }
  return out;
})();

type Stem = { x: number; h: number; lean: number; size: number; color: string; petals: number; spin: number; leaf: number; delay: number };
const W = 320; // the meadow is drawn in a 320 x 52 box and stretched to the button
const H = 52;
const GROUND = 45;
/** The stems of the drawn meadow, left to right. */
const STEMS: Stem[] = (() => {
  const r = rng(21);
  const out: Stem[] = [];
  const n = 30;
  for (let i = 0; i < n; i++) {
    const x = 6 + (i / (n - 1)) * (W - 12) + (r() - 0.5) * 6;
    out.push({
      x,
      h: 9 + r() * 20,
      lean: (r() - 0.5) * 7,
      size: 0.3 + r() * 0.22,
      color: BLUES[Math.floor(r() * 4)],
      petals: r() > 0.72 ? 6 : 5,
      spin: Math.round(r() * 72),
      leaf: r() > 0.5 ? 1 : -1,
      delay: Math.round(x * 3.2 + r() * 120), // grows left to right
    });
  }
  return out;
})();
/** Blades of grass along the ground. */
const GRASS: { x: number; h: number }[] = (() => {
  const r = rng(5);
  return Array.from({ length: 46 }, () => ({ x: 2 + r() * (W - 4), h: 3 + r() * 5 }));
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
      {/* soft clouds */}
      <g fill="#ffffff" opacity=".75">
        <ellipse cx="58" cy="9" rx="16" ry="3.2" />
        <ellipse cx="72" cy="7.4" rx="10" ry="3" />
        <ellipse cx="238" cy="12" rx="18" ry="3.2" />
        <ellipse cx="252" cy="10.2" rx="9" ry="2.8" />
      </g>
      {/* far and near hills, with a pen line along the top */}
      <path d={`M0 36 C40 27 84 33 130 29 S 226 27 ${W} 33 V${H} H0 Z`} fill="#b9dcb4" stroke={ink} strokeWidth=".7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={`M0 ${GROUND - 1} C44 ${GROUND - 7} 92 ${GROUND + 1} 142 ${GROUND - 3} S 238 ${GROUND - 6} ${W} ${GROUND - 1} V${H} H0 Z`} fill="#86c08a" stroke={ink} strokeWidth=".7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
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
          <g key={i} className="magic-stem" style={{ ["--d" as string]: `${st.delay}ms`, ["--sway-delay" as string]: `${i * 120}ms`, transformOrigin: `${st.x}px ${GROUND + 2}px` }}>
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
    </svg>
  );
}

function Flower({ color, petals = 5, className = "" }: { color: string; petals?: number; className?: string }) {
  return <span aria-hidden className={`block ${className}`} dangerouslySetInnerHTML={{ __html: flowerSvg(color, petals) }} />;
}

export default function MagicLink({ href, label, children, variant = "sci" }: { href: string; label: string; children: ReactNode; variant?: "sci" | "sky" }) {
  const sci = variant === "sci";
  const bloomers = sci ? FIELD.slice(0, 12) : FIELD; // the sci look only grows the front row along the bottom edge
  const host = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLSpanElement>(null);
  const last = useRef(0);
  const act = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** The garden appears after you have hovered (or focused) for a moment, and folds away the moment you leave. */
  const startGarden = () => {
    if (!sci) return;
    clearTimeout(act.current);
    act.current = setTimeout(() => root.current?.classList.add("is-garden"), 1100);
  };
  const stopGarden = () => {
    clearTimeout(act.current);
    root.current?.classList.remove("is-garden");
  };

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

  const corner = "magic-corner pointer-events-none absolute size-[9px] border-crimson opacity-0 transition-all duration-300 ease-out group-hover/magic:size-[16px] group-hover/magic:opacity-100";
  return (
    <span
      ref={root}
      data-v={variant}
      className="magic group/magic relative inline-block"
      onPointerEnter={() => {
        onEnter();
        startGarden();
      }}
      onPointerLeave={stopGarden}
      onFocus={startGarden}
      onBlur={stopGarden}
      onPointerDown={() => release(24)}
    >
      {sci && (
        <>
          {/* targeting frame: appears and flies outward on hover */}
          <span aria-hidden className={`${corner} -left-[3px] -top-[3px] border-l-2 border-t-2 group-hover/magic:-left-[10px] group-hover/magic:-top-[10px]`} />
          <span aria-hidden className={`${corner} -right-[3px] -top-[3px] border-r-2 border-t-2 group-hover/magic:-right-[10px] group-hover/magic:-top-[10px]`} />
          <span aria-hidden className={`${corner} -bottom-[3px] -left-[3px] border-b-2 border-l-2 group-hover/magic:-bottom-[10px] group-hover/magic:-left-[10px]`} />
          <span aria-hidden className={`${corner} -bottom-[3px] -right-[3px] border-b-2 border-r-2 group-hover/magic:-bottom-[10px] group-hover/magic:-right-[10px]`} />
        </>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-hs
        aria-label={`${label} (opens in a new tab)`}
        className={`magic-btn relative flex h-[52px] items-center gap-[14px] pl-5 pr-4 text-[14px] font-bold tracking-[0.56px] whitespace-nowrap focus-visible:outline-none ${sci ? "overflow-hidden" : ""}`}
      >
        {sci ? (
          <>
            {/* black sweep, in from the left and out to the right */}
            <span aria-hidden className="magic-sweep absolute inset-0" />
            {/* light streak */}
            <span aria-hidden className="magic-streak absolute inset-y-0 -left-1/3 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          </>
        ) : (
          /* the morning sky: fades in over the crimson */
          <span aria-hidden className="magic-sky absolute inset-0" />
        )}
        {sci && <Garden />}
        {/* sci: the spark. A flower blooms at the left on hover and the label slides over to make room */}
        {sci && <Flower color={BLUES[2]} className="magic-spark absolute left-[18px] top-1/2 size-[19px] -translate-y-1/2" />}
        {/* the field: hidden until the button is hovered or focused */}
        {bloomers.map((b, i) => (
          <span
            key={i}
            aria-hidden
            className="magic-grow absolute"
            style={{ left: `${b.left}%`, bottom: `${b.bottom}%`, width: b.size, height: b.size, ["--d" as string]: `${b.delay}ms`, ["--sway-delay" as string]: `${i * 140}ms`, ["--rot" as string]: `${b.rot}deg` }}
          >
            <Flower color={b.color} petals={b.petals} className="magic-sway size-full" />
          </span>
        ))}
        <span className="magic-label relative">{children}</span>
        {/* one slot, two states: the arrow at rest, a flower in bloom on hover */}
        <span aria-hidden className="relative size-[22px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/v3/arrow-white.svg" alt="" width={22} height={22} className="magic-arrow absolute inset-0 size-full" />
          {!sci && <Flower color={BLUES[3]} className="magic-bloom absolute inset-0 size-full" />}
        </span>
      </a>

      {/* drifting flowers start here (not clipped by the button) */}
      <span ref={host} aria-hidden className="pointer-events-none absolute inset-0" />
    </span>
  );
}
