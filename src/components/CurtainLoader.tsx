/**
 * CurtainLoader — a theatre curtain over the Home page while the hero's assets load.
 *
 * Sequence (once per browser session; skipped on later loads and client-side navigation):
 * 1. Closed curtain under the valance, with a gold rope progress bar a little below the
 *    middle. Progress is real: the rope fills one equal share per finished item (web
 *    fonts, the hero poster, the curtain tile, the valance) and creeps slowly toward the
 *    next step while waiting.
 * 2. At 100%, or at the 2.5 s cap (rope fills to 100% in 0.2 s), wait 150 ms, fade the
 *    rope, then open: each panel gathers to its outer edge (scaleX 0.14) with dark
 *    shading building toward that edge.
 * 3. Panels slide fully off-screen (translateX ±100%, 0.4 s) while the valance stays;
 *    then the valance lifts out of view (translateY -100%, 0.5 s) and the loader unmounts.
 *
 * Click or Esc (while closed) skips the wait: the same open runs at once, with the
 * gather sped up to 0.4 s. Under reduced motion, skip fades the curtain out in 0.25 s.
 * prefers-reduced-motion: the rope just jumps to each value (no width transition, no
 * creep) and the curtain fades out instead of opening, sliding and lifting.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import './CurtainLoader.css'

const BASE = import.meta.env.BASE_URL
const TRACKED_IMAGES = [
  `${BASE}creation-of-sakdidet-final.webp`,
  `${BASE}curtain-tile.webp`,
  `${BASE}curtain-valance.webp`,
]
const SESSION_KEY = 'curtain-played'

const CAP_MS = 2500        // never hold the page longer than this
const FILL_MS = 400        // rope "pull" between steps
const CAP_FILL_MS = 200    // rope fill to 100% when the cap hits
const HOLD_MS = 150        // pause at 100% before the rope fades
const ROPE_FADE_MS = 300
const OPEN_MS = 1200       // panels gather to scaleX(0.14)
const SLIDE_MS = 400       // gathered panels slide off-screen
const LIFT_MS = 500        // valance lifts away
const FADE_OUT_MS = 400    // reduced-motion exit
const SKIP_OPEN_MS = 400   // click / Esc: gather in 0.4 s, then the normal slide + lift
const SKIP_FADE_MS = 250   // click / Esc under prefers-reduced-motion
const CREEP_TICK_MS = 250
const CREEP_SHARE = 0.85   // creep covers at most 85% of the gap to the next step
const CREEP_TAU_S = 1.5    // creep time constant

type Phase = 'loading' | 'rope-out' | 'opening' | 'sliding' | 'lifting' | 'skipping' | 'done'

let playedThisPageLoad = false

function playedThisSession() {
  try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
}
function markPlayed() {
  playedThisPageLoad = true
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* storage blocked: page-load flag still applies */ }
}

function loadImage(src: string): Promise<void> {
  const img = new Image()
  img.src = src
  // decode() resolves once the image is loaded and decodable; a failure still
  // counts as "finished" so a missing file can't stall the curtain.
  return img.decode().catch(() => undefined)
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CurtainLoader() {
  const [show] = useState(() => !playedThisPageLoad && !playedThisSession())
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const [fillMs, setFillMs] = useState(FILL_MS)
  const [reduced] = useState(prefersReducedMotion)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }
  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)) }

  // Progress tracking and the open sequence.
  useEffect(() => {
    if (!show) return
    markPlayed()

    const tasks: Promise<unknown>[] = [document.fonts.ready, ...TRACKED_IMAGES.map(loadImage)]
    const total = tasks.length
    let done = 0
    let finished = false
    let cancelled = false
    let stepStart = performance.now()

    const finish = (capped: boolean) => {
      if (finished) return
      finished = true
      const fill = reduced ? 0 : capped ? CAP_FILL_MS : FILL_MS
      setFillMs(fill)
      setProgress(100)
      let t = fill + HOLD_MS
      later(t, () => setPhase('rope-out'))
      t += ROPE_FADE_MS
      later(t, () => setPhase('opening'))
      if (reduced) {
        later(t + FADE_OUT_MS, () => setPhase('done'))
        return
      }
      t += OPEN_MS
      later(t, () => setPhase('sliding'))
      t += SLIDE_MS
      later(t, () => setPhase('lifting'))
      later(t + LIFT_MS, () => setPhase('done'))
    }

    tasks.forEach((task) => {
      task.then(() => {
        if (cancelled || finished) return
        done += 1
        stepStart = performance.now()
        setProgress((done / total) * 100)
        if (done === total) finish(false)
      })
    })
    later(CAP_MS, () => finish(true))

    // Creep toward (never past) the next step so the rope never looks frozen.
    const creep = reduced ? undefined : window.setInterval(() => {
      if (finished || done >= total) return
      const t = (performance.now() - stepStart) / 1000
      const base = (done / total) * 100
      const next = ((done + 1) / total) * 100
      setProgress(base + (next - base) * CREEP_SHARE * (1 - Math.exp(-t / CREEP_TAU_S)))
    }, CREEP_TICK_MS)

    return () => {
      cancelled = true
      clearTimers()
      if (creep !== undefined) window.clearInterval(creep)
    }
  }, [show, reduced])

  // Click or Esc while the curtain is still closed: open it now with the normal
  // animation, gather sped up to 0.4 s (then the usual slide and valance lift).
  // Reduced motion: fade the whole curtain out instead. Once it's opening, skip is a no-op.
  const phaseRef = useRef(phase)
  useEffect(() => { phaseRef.current = phase }, [phase])
  const [fast, setFast] = useState(false)
  const skip = useCallback(() => {
    if (phaseRef.current !== 'loading' && phaseRef.current !== 'rope-out') return
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    const at = (ms: number, p: Phase) => { timers.current.push(window.setTimeout(() => setPhase(p), ms)) }
    if (reduced) {
      setPhase('skipping')
      at(SKIP_FADE_MS, 'done')
      return
    }
    setFast(true)
    setPhase('opening')
    at(SKIP_OPEN_MS, 'sliding')
    at(SKIP_OPEN_MS + SLIDE_MS, 'lifting')
    at(SKIP_OPEN_MS + SLIDE_MS + LIFT_MS, 'done')
  }, [reduced])

  const active = show && phase !== 'done'
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, skip])

  // Lock scrolling while the curtain is closed; release as soon as it starts opening.
  const locked = show && (phase === 'loading' || phase === 'rope-out')
  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = prev }
  }, [locked])

  if (!active) return null

  const classes = ['curtain', `is-${phase}`, reduced ? 'is-reduced' : '', fast ? 'is-fast' : ''].join(' ')

  return (
    <div className={classes} onClick={skip}>
      <div className="curtain-panel curtain-panel--left" aria-hidden="true" />
      <div className="curtain-panel curtain-panel--right" aria-hidden="true" />
      <div className="curtain-valance" aria-hidden="true" />

      <div
        className="curtain-rope"
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span className="curtain-rope-track" />
        <span
          className="curtain-rope-fill"
          style={{ width: `${progress}%`, transitionDuration: reduced ? '0ms' : `${fillMs}ms` }}
        >
          <span className="curtain-rope-knot" />
        </span>
      </div>
    </div>
  )
}
