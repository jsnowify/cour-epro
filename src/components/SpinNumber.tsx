"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Odometer / slot-reel number: every digit is a vertical strip of 0-9 (three laps) that rolls up and lands on its digit
 * when the stat scrolls into view, left digit first. Letters stay still. Runs once. Reduced motion: shows the number as is.
 */
const LAPS = 3;
const ROLL_MS = 1500;
const STAGGER_MS = 160;
const DIGITS = Array.from({ length: LAPS * 10 }, (_, i) => i % 10);

type Phase = "idle" | "reset" | "run";

export default function SpinNumber({ value }: { value: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPhase("reset"); // jump every strip back to 0 without a transition...
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => setPhase("run")); // ...then roll to the real digit
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  let digit = 0;
  return (
    <span ref={ref} aria-label={value} className="inline-flex">
      {Array.from(value).map((c, i) => {
        if (!/\d/.test(c)) {
          return (
            <span key={i} aria-hidden>
              {c}
            </span>
          );
        }
        const n = Number(c);
        const order = digit++;
        const y = phase === "reset" ? 0 : -((LAPS - 1) * 10 + n); // land on the last lap
        return (
          <span key={i} aria-hidden className="inline-block h-[1em] overflow-hidden">
            <span
              className="flex flex-col will-change-transform"
              style={{
                transform: `translateY(${y}em)`,
                transition: phase === "run" ? `transform ${ROLL_MS}ms cubic-bezier(0.16, 0.84, 0.3, 1) ${order * STAGGER_MS}ms` : "none",
              }}
            >
              {DIGITS.map((d, k) => (
                <span key={k} className="block h-[1em] text-center leading-none">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
