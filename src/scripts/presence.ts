// Is someone there? Tracks the pointer for the header owl (and later the hero owl),
// and blinks every few seconds while the pointer has moved in the last eight seconds.
// Blink: `blink` class on <body> for 140ms, plus a `logbook:blink` event on document.
// Nothing runs under reduced motion.

export const IDLE_MS = 8000;
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let lastMove = Date.now();
export const idle = () => Date.now() - lastMove > IDLE_MS;

type Look = (x: number, y: number) => void;
const lookers = new Set<Look>();
export const onLook = (fn: Look) => lookers.add(fn);

let started = false;
export function startPresence() {
  if (started || reduceMotion) return;
  started = true;

  const track = (e: PointerEvent) => {
    lastMove = Date.now();
    for (const fn of lookers) fn(e.clientX, e.clientY);
  };
  addEventListener('pointermove', track, { passive: true });
  addEventListener('pointerdown', track, { passive: true });

  const loop = (ms: number) =>
    setTimeout(() => {
      if (!document.hidden && !idle()) {
        document.body.classList.add('blink');
        document.dispatchEvent(new CustomEvent('logbook:blink'));
        setTimeout(() => document.body.classList.remove('blink'), 140);
      }
      loop(2400 + Math.random() * 3600);
    }, ms);
  loop(2200);
}
