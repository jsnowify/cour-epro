"use client";

import { setConsent, useConsent } from "@/lib/consent";

/**
 * Cookie notice in the COUR \ style: a black card with a crimson kicker and two solid buttons that sweep on hover.
 * It appears only until the visitor chooses. Accept = the visit is counted on the visitor map (city level) and a one-day
 * cookie stops the same browser being counted twice. No thanks = nothing is counted and no cookie is set.
 */
const sweep =
  "absolute inset-0 origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none";

export default function ConsentNotice() {
  const consent = useConsent();
  if (consent !== null) return null; // undefined (server / hydration) or already chosen

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      data-hs
      className="fixed bottom-4 left-4 z-[60] w-[340px] bg-black p-5 text-white shadow-[0_0_0_1px_rgb(255_255_255/0.12)] max-md:inset-x-3 max-md:bottom-[156px] max-md:left-3 max-md:w-auto"
    >
      <span className="text-[11px] font-bold tracking-[0.88px] text-crimson">{"// COOKIES"}</span>
      <p className="mt-2 text-[13px] leading-[1.6] text-white/80">
        We show where our visitors come from on the map. If you accept, your city is counted once a day and one small cookie
        remembers it. We never store your IP address.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setConsent("yes")}
          className="group relative h-[40px] flex-1 overflow-hidden bg-crimson px-4 text-[12px] font-bold tracking-[0.48px] text-white"
        >
          <span aria-hidden className={`${sweep} bg-white`} />
          <span className="relative transition-colors duration-500 group-hover:text-crimson">ACCEPT</span>
        </button>
        <button
          type="button"
          onClick={() => setConsent("no")}
          className="group relative h-[40px] flex-1 overflow-hidden bg-white/10 px-4 text-[12px] font-bold tracking-[0.48px] text-white"
        >
          <span aria-hidden className={`${sweep} bg-white`} />
          <span className="relative transition-colors duration-500 group-hover:text-black">NO THANKS</span>
        </button>
      </div>
    </div>
  );
}
