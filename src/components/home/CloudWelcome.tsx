/**
 * CloudWelcome: the first-load intro on Home. Figma: "Loader / Cloud welcome: 1 Loading",
 * "2 Opening 40%", "3 Opening 80%".
 *
 * Plays once per session, only when the page load started on "/" (see firstLoadIntro.ts);
 * otherwise it renders nothing. No scroll interaction.
 *
 * 1. Loading: full-screen clouds (cloud.webp, 18 on desktop / 10 larger ones under 768px,
 *    some flipped) over a cream veil, "Welcome to / my portfolio" in the centre. Scroll is
 *    locked and the navbar hidden. Loading is tracked (fonts, hero poster, cloud image,
 *    the Rive file when the hero will animate) but not shown. Stays at least CW.minShowMs.
 * 2. At 100%: wait CW.holdMs, then open over CW.openMs (ease-in-out), progress p 0 -> 1:
 *    clouds move outward from the centre by p^1.3 x (320px at the edges .. 1000px near the
 *    centre), vertical x0.75, scale 1 -> 1.45; veil fades out by p 0.4; text scales
 *    1 -> 1.6, rises 160px and fades out by p 0.45; hero art scales 1.12 -> 1; navbar fades
 *    in over p 0.6 -> 0.9.
 * 3. At p = 1: unmount the layer, unlock scroll, start the hero (Rive).
 * prefers-reduced-motion: no cloud travel or hero zoom; the layer fades out in 400ms.
 *
 * transform/opacity only, written straight to the DOM from one rAF loop.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import '@fontsource/architects-daughter/400.css'
import cloudImg from '../../assets/hero/cloud.webp'
import { HERO_ANIMATED, HERO_POSTER, HERO_RIV, saveData } from '../heroAssets'
import { finishIntro, isIntroPending, markIntroSeen } from '../firstLoadIntro'
import './CloudWelcome.css'

/** Every timing and distance of the intro. */
const CW = {
  minShowMs: 1200,       // loader stays at least this long
  holdMs: 300,           // pause at 100% before opening
  capMs: 6000,           // never wait longer than this for loading (slow network / stalled request)
  openMs: 1600,          // opening, eased in-out
  reducedFadeMs: 400,    // prefers-reduced-motion: layer fade-out
  distCentre: 1000,      // px a cloud at the centre travels by p = 1
  distEdge: 320,         // px a cloud at the screen edge travels by p = 1
  distExp: 1.3,          // travel = p ^ distExp
  vertical: 0.75,        // vertical travel factor
  cloudScaleTo: 1.45,
  veilGoneAt: 0.4,       // veil opacity 1 -> 0 over p 0 .. 0.4
  textGoneAt: 0.45,      // text scale / rise / fade over p 0 .. 0.45
  textScaleTo: 1.6,
  textRise: 160,         // px
  heroScaleFrom: 1.12,   // hero art 1.12 -> 1 over the whole opening
  navFadeFrom: 0.6,      // navbar opacity 0 -> 1 over p 0.6 .. 0.9
  navFadeTo: 0.9,
} as const

/** Cloud centre (x, y in % of the viewport), width in vw, mirrored or not. Later = on top. */
type Cloud = { x: number; y: number; w: number; flip?: boolean }

const DESKTOP_CLOUDS: Cloud[] = [
  { x: 10, y: 6, w: 44 }, { x: 47, y: 4, w: 48, flip: true }, { x: 88, y: 7, w: 46 },
  { x: -2, y: 27, w: 42, flip: true }, { x: 30, y: 25, w: 46 }, { x: 68, y: 27, w: 50, flip: true }, { x: 102, y: 29, w: 40 },
  { x: 34, y: 42, w: 38, flip: true },
  { x: 7, y: 50, w: 46, flip: true }, { x: 52, y: 53, w: 56 }, { x: 93, y: 49, w: 48, flip: true },
  { x: -4, y: 73, w: 40 }, { x: 28, y: 72, w: 48, flip: true }, { x: 68, y: 74, w: 46 }, { x: 103, y: 71, w: 42, flip: true },
  { x: 13, y: 95, w: 50, flip: true }, { x: 52, y: 96, w: 46 }, { x: 89, y: 94, w: 50, flip: true },
]

const MOBILE_CLOUDS: Cloud[] = [
  { x: 20, y: 4, w: 120, flip: true }, { x: 86, y: 15, w: 116 }, { x: 8, y: 27, w: 124 },
  { x: 82, y: 38, w: 120, flip: true }, { x: 18, y: 60, w: 120, flip: true }, { x: 55, y: 67, w: 110, flip: true },
  { x: 52, y: 51, w: 130 }, { x: 90, y: 73, w: 118 }, { x: 24, y: 85, w: 124, flip: true }, { x: 76, y: 97, w: 120 },
]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

function loadImage(src: string): Promise<void> {
  const img = new Image()
  img.src = src
  return img.decode().catch(() => undefined) // a failed image still counts as finished
}

type Phase = 'loading' | 'opening' | 'fading' | 'done'

export default function CloudWelcome({
  navRef,
  heroRef,
}: {
  navRef: RefObject<HTMLElement | null>
  heroRef: RefObject<HTMLElement | null>
}) {
  const [show] = useState(isIntroPending)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [phase, setPhase] = useState<Phase>('loading')
  const veilRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([])

  const active = show && phase !== 'done'

  // Before first paint and until the end: navbar hidden, hero art pre-zoomed, scroll locked
  // (overflow: hidden on <html>; html has scrollbar-gutter: stable in index.css, so the
  // layout doesn't shift when it unlocks). The cleanup (at p = 1) puts everything back.
  useLayoutEffect(() => {
    if (!active) return
    const nav = navRef.current
    const hero = heroRef.current
    const html = document.documentElement
    if (nav) { nav.style.opacity = '0'; nav.style.visibility = 'hidden' }
    if (hero && !reduced) hero.style.transform = `scale(${CW.heroScaleFrom})`
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      if (nav) { nav.style.opacity = ''; nav.style.visibility = '' }
      if (hero) hero.style.transform = ''
      html.style.overflow = prevOverflow
    }
  }, [active, reduced, navRef, heroRef])

  // Screen readers: announce the welcome once. The live region starts empty and is filled
  // after mount (a region rendered with its text already in it isn't reliably announced).
  const [announce, setAnnounce] = useState(false)
  useEffect(() => {
    if (!show) return
    const id = window.setTimeout(() => setAnnounce(true), 100)
    return () => window.clearTimeout(id)
  }, [show])

  // Track loading; at 100% (and after the minimum time) hold, then open.
  useEffect(() => {
    if (!show) return
    markIntroSeen()
    const t0 = performance.now()
    const tasks: Promise<unknown>[] = [
      document.fonts.load('italic 700 80px "Hanken Grotesk"'),
      document.fonts.load('400 28px "Architects Daughter"'),
      document.fonts.ready,
      loadImage(HERO_POSTER),
      loadImage(cloudImg),
    ]
    if (HERO_ANIMATED && !reduced && !saveData()) {
      tasks.push(fetch(HERO_RIV).then((r) => r.arrayBuffer())) // warms the cache Rive loads from
    }
    let cancelled = false
    let timer: number | undefined
    Promise.race([Promise.allSettled(tasks), sleep(CW.capMs)]).then(() => {
      if (cancelled) return
      const wait = Math.max(0, t0 + CW.minShowMs - performance.now()) + CW.holdMs
      timer = window.setTimeout(() => setPhase(reduced ? 'fading' : 'opening'), wait)
    })
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [show, reduced])

  // Opening: one rAF loop drives every layer from the eased progress p.
  useEffect(() => {
    if (phase !== 'opening') return
    const nav = navRef.current
    const hero = heroRef.current
    const veil = veilRef.current
    const text = textRef.current
    if (nav) nav.style.visibility = 'visible'

    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const halfDiagonal = Math.hypot(cx, cy)
    const clouds = cloudRefs.current.flatMap((el) => {
      if (!el) return []
      const r = el.getBoundingClientRect()
      if (!r.width) return [] // the other breakpoint's set
      let dx = r.left + r.width / 2 - cx
      let dy = r.top + r.height / 2 - cy
      const dist = Math.hypot(dx, dy)
      if (dist < 1) { dx = 0; dy = 1 }
      const len = Math.hypot(dx, dy)
      const reach = lerp(CW.distCentre, CW.distEdge, clamp01(dist / halfDiagonal))
      return [{ el, x: (dx / len) * reach, y: (dy / len) * reach * CW.vertical }]
    })

    const start = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const p = easeInOut(clamp01((now - start) / CW.openMs))
      const travel = p ** CW.distExp
      const scale = lerp(1, CW.cloudScaleTo, p)
      for (const c of clouds) {
        c.el.style.transform = `translate3d(${c.x * travel}px, ${c.y * travel}px, 0) scale(${scale})`
      }
      if (veil) veil.style.opacity = String(1 - clamp01(p / CW.veilGoneAt))
      if (text) {
        const q = clamp01(p / CW.textGoneAt)
        text.style.transform = `translate3d(0, ${-CW.textRise * q}px, 0) scale(${lerp(1, CW.textScaleTo, q)})`
        text.style.opacity = String(1 - q)
      }
      if (hero) hero.style.transform = `scale(${lerp(CW.heroScaleFrom, 1, p)})`
      if (nav) nav.style.opacity = String(clamp01((p - CW.navFadeFrom) / (CW.navFadeTo - CW.navFadeFrom)))
      if (p < 1) raf = requestAnimationFrame(frame)
      else setPhase('done')
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [phase, navRef, heroRef])

  // Reduced motion: navbar back at once (it sits under the layer), fade the layer out.
  useEffect(() => {
    if (phase !== 'fading') return
    const nav = navRef.current
    if (nav) { nav.style.opacity = ''; nav.style.visibility = '' }
    const id = window.setTimeout(() => setPhase('done'), CW.reducedFadeMs)
    return () => window.clearTimeout(id)
  }, [phase, navRef])

  // p = 1: the hero starts (HeroFresco subscribes to this).
  useEffect(() => {
    if (show && phase === 'done') finishIntro()
  }, [show, phase])

  if (!active) return null

  const cloud = (c: Cloud, i: number, set: 'desktop' | 'mobile', offset: number) => (
    <div
      key={`${set}-${i}`}
      ref={(el) => { cloudRefs.current[offset + i] = el }}
      className={`cw-cloud cw-cloud--${set}${c.flip ? ' is-flipped' : ''}`}
      style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}vw` }}
    >
      <img src={cloudImg} alt="" decoding="async" />
    </div>
  )

  return (
    <>
      {/* announced once (polite); the visual layer below is hidden from assistive tech */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {announce ? 'Welcome to my portfolio' : ''}
      </p>
      <div
        className={`cw is-${phase}`}
        style={phase === 'fading' ? { transitionDuration: `${CW.reducedFadeMs}ms` } : undefined}
        aria-hidden="true"
      >
      <div ref={veilRef} className="cw-veil" />
      <div className="cw-clouds">
        {DESKTOP_CLOUDS.map((c, i) => cloud(c, i, 'desktop', 0))}
        {MOBILE_CLOUDS.map((c, i) => cloud(c, i, 'mobile', DESKTOP_CLOUDS.length))}
      </div>
      <div ref={textRef} className="cw-text">
        <p className="cw-welcome">Welcome to</p>
        <p className="cw-title">
          <span className="cw-title-ink">my </span>
          <span className="cw-title-accent">portfolio</span>
        </p>
      </div>
      </div>
    </>
  )
}
