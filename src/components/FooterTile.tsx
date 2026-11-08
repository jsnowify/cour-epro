"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow } from "@/components/Arrow";

/**
 * One sitemap tile in the footer. Hover sweeps crimson in from the left (and out to the right); the tile of the page you are
 * on stays filled crimson, like the active tab in the header. Long labels (TOURNAMENTS) get a smaller size so they never
 * run into the arrow or the next column.
 */
const SWEEP =
  "absolute inset-0 origin-right scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none";

export default function FooterTile({ href, label, n }: { href: string; label: string; n: number }) {
  const on = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className="group relative flex h-[73px] items-center justify-between gap-3 overflow-hidden px-5"
    >
      {on ? <span aria-hidden className="absolute inset-0 bg-crimson" /> : <span aria-hidden className={SWEEP} />}
      <span className="relative flex min-w-0 items-baseline gap-3 whitespace-nowrap">
        <span className={`text-[10px] font-normal transition-colors duration-300 ${on ? "text-white/80" : "text-white/40 group-hover:text-white/80"}`}>
          {String(n).padStart(2, "0")}
        </span>
        <span className={`font-display leading-none ${label.length > 9 ? "text-[16px]" : "text-[20px]"}`}>{label}</span>
      </span>
      <span className={`relative shrink-0 text-[16px] transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <Arrow />
      </span>
    </Link>
  );
}
