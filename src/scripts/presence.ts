// Is someone there? Tracks the pointer for the header owl and the hero owl, and blinks every
// few seconds while the pointer has moved in the last eight seconds.
// Blink: `blink` class on <body> for 140ms, with `logbook:blink` events on document
// (detail: { on: true } then { on: false }). Nothing runs under reduced motion.

export const IDLE_MS = 8000;
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let lastMove = Date.now();
export const idle = () => Date.now() - lastMove > IDLE_MS;
/** Count something other than pointer movement (a click on the owl) as someone being there. */
export const poke = () => { lastMove = Date.now(); };

/** Last pointer position, or null before the pointer has moved. */
export const pointer: { x: number; y: number } | { x: null; y: null } = { x: null, y: null };

type Look = (x: number, y: number) => void;
const lookers = new Set<Look>();
export const onLook = (fn: Look) => lookers.add(fn);

let started = false;
export function startPresence() {
  if (started || reduceMotion) return;
  started = true;

  // A touch counts as a look.
  const track = (e: PointerEvent) => {
    lastMove = Date.now();
    Object.assign(pointer, { x: e.clientX, y: e.clientY });
    for (const fn of lookers) fn(e.clientX, e.clientY);
  };
  addEventListener('pointermove', track, { passive: true });
  addEventListener('pointerdown', track, { passive: true });

  const blink = (on: boolean) => {
    document.body.classList.toggle('blink', on);
    document.dispatchEvent(new CustomEvent('logbook:blink', { detail: { on } }));
  };
  const loop = (ms: number) =>
    setTimeout(() => {
      if (!document.hidden && !idle()) {
        blink(true);
        setTimeout(() => blink(false), 140);
      }
      loop(2400 + Math.random() * 3600);
    }, ms);
  loop(2200);
}
