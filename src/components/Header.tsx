import Link from "next/link";
import type { CSSProperties } from "react";
import { COLS, NAV, type NavKey } from "@/lib/design";

/**
 * Shared header: giant COUR wordmark + six nav tabs (identical on every page).
 * The tab row is sticky; only the tabs themselves have a (frosted) background.
 * Hovering a tab fills it white from left to right with an ease-out.
 * Desktop heights: wordmark block 378 + tabs 19 + gap 13 = 410 (Figma).
 */
export default function Header({ active }: { active: NavKey }) {
  return (
    <>
      <header className="relative w-full bg-black md:h-[378px]">
        <div className="max-md:px-5 max-md:pt-6 md:absolute md:left-0 md:top-[36px] md:w-[1438px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/cour-wordmark.svg" alt="COUR" width={1438} height={293} className="block h-auto w-full" />
        </div>
      </header>
      <nav
        aria-label="Primary"
        className="sticky top-0 z-50 w-full max-md:grid max-md:grid-cols-3 max-md:gap-px max-md:px-5 max-md:py-4 md:h-[19px]"
      >
        {NAV.map((item, i) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative block overflow-hidden text-[12px] leading-normal max-md:h-10 max-md:px-2 max-md:pt-3 md:absolute md:left-[var(--x)] md:top-0 md:h-[19px] md:w-[218px] md:pt-[2px] ${
                isActive
                  ? "bg-white text-black"
                  : "bg-white/10 text-white backdrop-blur-md before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-white before:transition-transform before:duration-500 before:ease-out hover:before:scale-x-100"
              }`}
              style={{ "--x": `${COLS[i]}px` } as CSSProperties}
            >
              <span className={`relative ${isActive ? "" : "transition-colors duration-500 ease-out group-hover:text-black"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div aria-hidden className="bg-black md:h-[13px]" />
    </>
  );
}
