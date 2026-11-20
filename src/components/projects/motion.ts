/**
 * Every animation timing on /projects, from the Development annotations of
 * Figma "Projects v2 / Desktop" (441:2696). CSS reads the CSS-side values through the
 * custom properties set by `motionCssVars()` on the page root.
 */
import type { CSSProperties } from 'react'

/** Dispatched on window when the portrait drop has finished (the first-view yarn waits for it). */
export const PORTRAIT_DONE_EVENT = 'projects:portrait-done'

export const PROJECTS_MOTION = {
  portrait: {
    fallbackMs: 300,           // start this long after mount when no curtain transition ran
    fallMs: 520,               // 0 to 520: fall
    fallFromVh: 120,           // translateY(-120vh) rotate(-8deg) -> 0
    fallFromVhMobile: 60,      // < 768px
    fallRotateDeg: -8,
    fallEase: 'cubic-bezier(.55,0,1,.45)',
    impactMs: 120,             // 520 to 640: scaleY .96 -> 1
    impactScaleY: 0.96,
    swingEndMs: 1800,          // 640 to 1800: damped swing
    swingDeg: [6, -4, 2.5, -1, 0],
    dustCount: 5,              // cream dots under the frame
    dustMs: 400,
    glowFromMs: 1200,          // glow fades in 1200 to 1800
    glowToMs: 1800,
    labelFromMs: 1500,         // wall label: 8px up + fade, 1500 to 1900
    labelToMs: 1900,
    labelRisePx: 8,
    noteFromMs: 1800,          // hand note + arrow draw on, 1800 to 2400
    noteToMs: 2400,
    hoverSwingDeg: [2, -1.5, 0],
    hoverSwingMs: 900,
    reducedFadeMs: 200,        // prefers-reduced-motion: everything fades in
  },
  spotlight: {
    coneFadeMs: 300,           // lamp cone opacity 0 -> 1
    liftPx: 6,                 // the lit frame lifts
    dimOpacity: 0.7,           // every other work
  },
  thread: {
    tipViewport: 0.65,         // the yarn tip follows this point down the viewport
    unreachedOpacity: 0.3,     // works fade 30% -> 100% when the yarn reaches them
    revealMs: 600,             // work fade-up / knot pop / wires
    tailMs: 700,               // tail + heart after the oldest work
    firstViewDrawMs: 600,      // after the portrait drop: draw to the last knot in view (cubic ease-out)
  },
  restorationSign: {
    swayMs: 1200,              // rotate -3deg -> 3deg -> 0, once when reached
    swayDeg: 3,
  },
  rope: {
    sagMs: 900,                // velvet rope sags a bit more when it scrolls into view
    sagScale: 1.18,
  },
} as const

/** The values CSS needs, as custom properties for the page root. */
export function motionCssVars() {
  const { spotlight: s, thread: t, restorationSign: r, rope, portrait: p } = PROJECTS_MOTION
  return {
    '--coll-cone-ms': `${s.coneFadeMs}ms`,
    '--coll-lift': `${s.liftPx}px`,
    '--coll-dim': String(s.dimOpacity),
    '--coll-unreached': String(t.unreachedOpacity),
    '--coll-reveal-ms': `${t.revealMs}ms`,
    '--coll-tail-ms': `${t.tailMs}ms`,
    '--coll-sway-ms': `${r.swayMs}ms`,
    '--coll-sway-deg': `${r.swayDeg}deg`,
    '--coll-sag-ms': `${rope.sagMs}ms`,
    '--coll-sag': String(rope.sagScale),
    '--coll-hover-swing-ms': `${p.hoverSwingMs}ms`,
    '--coll-hover-swing-a': `${p.hoverSwingDeg[0]}deg`,
    '--coll-hover-swing-b': `${p.hoverSwingDeg[1]}deg`,
  } as CSSProperties
}
