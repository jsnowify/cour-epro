"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Arrow } from "@/components/Arrow";
import { STORIES } from "@/lib/stories";
import { DISCORD_URL } from "@/lib/links";

/**
 * A reader dialog in the COUR \ style for content that has no page of its own: news stories and the press kit.
 * The trigger is a real button that looks like the site's text links (crimson, with the arrow). The dialog is drawn in a
 * portal on <body> (so the page zoom cannot shift it), closes with Esc, the backdrop or the CLOSE button, traps focus on
 * its close button while open, locks the page scroll and gives focus back to the trigger.
 */
function Dialog({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const close = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "Tab") {
        // keep focus inside the dialog
        const f = [...(document.querySelectorAll<HTMLElement>("[data-reader] a[href], [data-reader] button"))];
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onNavigate = () => onCloseRef.current();
    window.addEventListener("keydown", onKey);
    window.addEventListener("cour:navigate", onNavigate);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cour:navigate", onNavigate);
      html.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  return createPortal(
    <div data-reader data-hs className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-code" role="presentation">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-label={label} className="relative flex max-h-[min(86vh,720px)] w-full max-w-[720px] flex-col bg-black text-white">
        <span aria-hidden className="absolute left-0 top-0 h-[10px] w-[10px] border-l-2 border-t-2 border-crimson" />
        <span aria-hidden className="absolute bottom-0 right-0 h-[10px] w-[10px] border-b-2 border-r-2 border-crimson" />
        <div className="overflow-y-auto p-6 pb-4 md:p-10 md:pb-6">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4 md:px-10">
          <span className="text-[10px] tracking-[0.8px] text-white/40">ESC TO CLOSE</span>
          <button
            ref={close}
            type="button"
            onClick={onClose}
            className="group relative h-[40px] overflow-hidden bg-crimson px-6 text-[12px] font-bold tracking-[0.48px] text-white"
          >
            <span aria-hidden className="absolute inset-0 origin-right scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
            <span className="relative transition-colors duration-500 group-hover:text-crimson">CLOSE</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Text-link look: crimson, bold, tracking, with the sci-fi arrow. */
const LINK = "text-[13px] font-bold tracking-[0.52px] text-crimson hover:underline underline-offset-4";

function useOpen() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false) };
}

/** Opens a news story in the reader. */
export function StoryLink({ id, label = "READ STORY" }: { id: string; label?: string }) {
  const { open, show, hide } = useOpen();
  const s = STORIES[id];
  if (!s) return null;
  const cta = s.cta;
  return (
    <>
      <button type="button" onClick={show} className={LINK} aria-haspopup="dialog">
        {label}
        <Arrow />
      </button>
      {open && (
        <Dialog label={s.title} onClose={hide}>
          <p className="text-[11px] font-bold tracking-[0.88px] text-crimson">
            {"// "}
            {s.tag} · {s.date} · {s.read} READ
          </p>
          <h2 className="mt-3 font-display text-[24px] leading-[1.15] md:text-[30px]">{s.title}</h2>
          <div className="mt-5 flex flex-col gap-4 text-[14px] leading-[1.75] text-white/80 md:text-[15px]">
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {cta && (
              <Link
                href={cta.href}
                onClick={hide}
                className="group relative flex h-[44px] items-center gap-3 overflow-hidden bg-white px-5 text-[12px] font-bold tracking-[0.48px] text-black"
              >
                <span aria-hidden className="absolute inset-0 origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
                <span className="relative transition-colors duration-500 group-hover:text-white">{cta.label}</span>
                <span className="relative text-[16px] transition-colors duration-500 group-hover:text-white">
                  <Arrow />
                </span>
              </Link>
            )}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[44px] items-center bg-white/10 px-5 text-[12px] font-bold tracking-[0.48px] transition-colors duration-300 hover:bg-white/20"
            >
              JOIN THE DISCORD
            </a>
          </div>
        </Dialog>
      )}
    </>
  );
}

const FACTS: [string, string][] = [
  ["Name", "COUR E-PRO"],
  ["Formerly", "Aeronova Esport"],
  ["Game", "Mobile Legends: Bang Bang"],
  ["Region", "Philippines, PH server only"],
  ["Established", "January 2026"],
  ["Squads", "COUR UNO (active), COUR DOS (forming)"],
  ["Motto", "Beyond the horizon. Beyond ourselves."],
  ["Contact", "Our Discord server"],
];

const COLORS: [string, string, string][] = [
  ["Crimson", "#C8102E", "bg-crimson text-white"],
  ["Black", "#0A0A0A", "bg-[#0a0a0a] text-white"],
  ["White", "#FFFFFF", "bg-white text-black"],
];

/** Opens the press kit: facts, colours, fonts and downloadable logos. */
export function PressKitLink({ label = "PRESS KIT" }: { label?: string }) {
  const { open, show, hide } = useOpen();
  return (
    <>
      <button type="button" onClick={show} className={LINK} aria-haspopup="dialog">
        {label}
        <Arrow />
      </button>
      {open && (
        <Dialog label="Press kit" onClose={hide}>
          <p className="text-[11px] font-bold tracking-[0.88px] text-crimson">{"// PRESS KIT"}</p>
          <h2 className="mt-3 font-display text-[24px] leading-[1.15] md:text-[30px]">COUR E-PRO</h2>

          <dl className="mt-5 text-[13px]">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/10 py-2.5">
                <dt className="text-white/50">{k}</dt>
                <dd className="text-right font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[11px] font-bold tracking-[0.88px] text-white/50">LOGO</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {[
              { name: "Black on crimson", file: "cour-e-pro-logo.svg", bg: "bg-crimson" },
              { name: "White on black", file: "cour-e-pro-logo-white.svg", bg: "bg-[#141414]" },
            ].map((l) => (
              <div key={l.file} className="flex flex-col">
                <div className={`flex h-[110px] items-center justify-center ${l.bg}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/press/${l.file}`} alt={`COUR E-PRO logo, ${l.name.toLowerCase()}`} className="h-[64px] w-auto" />
                </div>
                <a
                  href={`/assets/press/${l.file}`}
                  download
                  className="group relative flex h-[40px] items-center justify-between overflow-hidden bg-white/10 px-4 text-[11px] font-bold tracking-[0.48px]"
                >
                  <span aria-hidden className="absolute inset-0 origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
                  <span className="relative">DOWNLOAD SVG</span>
                  <span className="relative text-[10px] text-white/60 group-hover:text-white">{l.name.toUpperCase()}</span>
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[11px] font-bold tracking-[0.88px] text-white/50">COLOURS</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {COLORS.map(([name, hex, cls]) => (
              <div key={hex} className={`flex h-[64px] flex-col justify-end p-3 ${cls} ${hex === "#0A0A0A" ? "outline outline-1 -outline-offset-1 outline-white/15" : ""}`}>
                <span className="text-[11px] font-bold">{name}</span>
                <span className="text-[10px] opacity-70">{hex}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[11px] font-bold tracking-[0.88px] text-white/50">TYPE</p>
          <p className="mt-2 text-[13px] leading-[1.7] text-white/80">
            Zen Dots for headlines and numbers, JetBrains Mono for everything else.
          </p>
          <p className="mt-6 text-[13px] leading-[1.7] text-white/60">For interviews, partnerships or anything else, message us on Discord.</p>
        </Dialog>
      )}
    </>
  );
}
