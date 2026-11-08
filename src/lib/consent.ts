import { useSyncExternalStore } from "react";

/**
 * The visitor's cookie choice, kept in localStorage (not a cookie): "yes" | "no" | null (not chosen yet).
 * "yes" lets the visitor map count the visit and set its one-day cookie; "no" counts nothing and sets no cookie.
 */
const KEY = "cour_consent";
const EVENT = "cour-consent";

export type Consent = "yes" | "no" | null;

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null; // storage blocked: behave as "not chosen" and never count
  }
}

export function setConsent(v: "yes" | "no") {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* storage blocked: the choice only lasts until the page closes */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Live consent value. `undefined` on the server and during hydration, so nothing flashes. */
export function useConsent(): Consent | undefined {
  return useSyncExternalStore<Consent | undefined>(subscribe, read, () => undefined);
}
