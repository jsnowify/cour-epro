const SYMBOLS = "*>?/{;$&";
const SYMBOL_CHANCE = 0.12; // the odd regex-style symbol keeps the "code" feel without overwhelming the text

/** Noise for one character that stays close to it: a neighbouring letter/digit (same case, 1-2 steps), rarely a symbol. */
export function nearGlyph(c: string): string {
  if (Math.random() < SYMBOL_CHANCE) return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const code = c.charCodeAt(0);
  const [lo, hi] = code >= 97 && code <= 122 ? [97, 122] : code >= 65 && code <= 90 ? [65, 90] : [48, 57];
  const step = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2));
  let next = code + step;
  if (next < lo || next > hi) next = code - step; // bounce back inside the range
  return String.fromCharCode(Math.min(hi, Math.max(lo, next)));
}
