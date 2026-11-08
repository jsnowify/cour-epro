# Page transition: text scramble

Navigation between pages is instant (no fade, slide or delay). Only the text animates:

1. **Out.** Clicking an internal link scrambles the *current* page's text into noise (about 0.4 s).
2. **Navigate.** `router.push` runs right after, with no extra delay.
3. **In.** The new page mounts already scrambled and every character resolves to its real value (about 0.75 s),
   roughly in document order with some jitter.

Code: `src/components/PageScramble.tsx`, mounted once in `src/app/layout.tsx`.

## Behaviour

| Case | What happens |
| --- | --- |
| First page load | No effect (and nothing touches server-rendered text, so no hydration mismatch). |
| Click on an internal link | Out, navigate, in. |
| Ctrl/Cmd/Shift/Alt click, middle click, `target="_blank"`, `download`, external link | Untouched, browser default. |
| Link to the page you are already on, `#hash` links | Untouched. |
| Browser back / forward | Only the "in" part (there is no click to intercept). |
| `prefers-reduced-motion: reduce` | No effect at all, plain navigation. |
| Second click while scrambling out | Ignored (one transition at a time). |

Only characters `A-Z a-z 0-9` are scrambled. Spaces and punctuation stay, so text keeps its size and layout.
Tuning: `OUT_MS`, `IN_MS`, `TICK` at the top of the file.

## Bug: text stuck scrambled (fixed)

**Symptom.** Sometimes a page, seen most often on `/teams`, stayed scrambled and never resolved.

**Root cause.** `next.config.mjs` has `cacheComponents: true`. With it, Next.js does not unmount the page you
leave: it keeps it mounted but hidden inside a React `<Activity>` boundary, so it can be shown again instantly.
The first version of the scramble code broke in three ways because of that:

1. **The scrambled page stayed scrambled in the DOM.** "Out" deliberately leaves the old page's text as noise,
   and assumed the old page would be unmounted. It never was, so the noise stayed there. Going back to that
   page (for example `/teams`) revealed it still scrambled.
2. **Noise was read back as the real text.** `collect()` used each text node's *current* value as the original.
   For a node that was still noisy, the "original" was the noise, so "in" resolved noise into the same noise
   and the text was stuck for good. The same happened if you clicked a link while "in" was still running.
3. **It animated the wrong page.** `document.querySelector("main")` returns the *first* `<main>` in the document,
   which can be a hidden, retained page, not the one on screen.

A smaller issue made it worse: if the navigation after "out" never completed, the page stayed noisy and the
`leaving` flag stayed set, which also blocked every following link click.

**Fix.**

- A single `scrambled` map stores the real text of every node we have scrambled and not yet restored. The DOM
  value is never trusted as the original again.
- `restoreAll()` puts every tracked node back and cancels any running animation. It runs at the start of every
  animation (so two never overlap) and when a new route mounts (so a retained old page is repaired).
- Only the visible `<main>` elements are animated (`checkVisibility()`), so hidden retained pages are ignored.
- Failsafe: if the route has not changed 4 s after "out" finished, the noise is undone and links are unlocked.
- `pageshow` with `persisted` (bfcache restore) also restores everything.

## If it happens again

- In the console, `document.querySelectorAll("main")` shows how many pages Next is retaining.
- Any new feature that edits text nodes directly must go through the same `scrambled` map, or React and the
  scramble will fight over the same nodes.
- Run `npm run lint` and `npx tsc --noEmit` after touching `PageScramble.tsx`.
