/**
 * CloudWelcome: the first-load intro on Home. Figma: "Loader / Cloud welcome: 1 Loading",
 * "2 Opening 40%", "3 Opening 80%".
 *
 * Plays once per session, only when the page load started on "/" (see firstLoadIntro.ts);
 * otherwise it renders nothing. No scroll interaction.
 *
 * 1. Loading: full-screen clouds (cloud.webp; desktop = the 27 clouds of Figma frame 1,
 *    12 flipped; under 768px 10 larger ones) over a --color-cream veil, "Welcome to / my
 *    portfolio" centred. Scroll is locked and the navbar hidden. Loading is tracked (fonts,
 *    hero poster, cloud image, the Rive file when the hero will animate) but not shown.
 *    Stays at least CW.minShowMs, at most CW.capMs.
 * 2. At 100%: wait CW.holdMs, then open over CW.openMs (ease-in-out), progress p 0 -> 1.
 *    Per cloud (Figma annotation): dx = cx - 50vw, dy = (cy - 50vh) * 1.7, dir = unit(dx, dy),
 *    near = 1 - min(1, dist / 800px), push = p^1.3 * (320 + 680 * near) px,
 *    translate = (dir.x * push, dir.y * push * 0.75), scale = 1 + 0.45p.
 *    Veil fades out by p 0.4; text scales 1 -> 1.6, rises 160px and fades out by p 0.45;
 *    hero art scales 1.12 -> 1; navbar fades in over p 0.6 -> 0.9.
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
  distCentre: 1000,      // px a cloud at the centre travels by p = 1 (320 + 680)
  distEdge: 320,         // px a cloud at or beyond CW.nearRadius travels by p = 1
  nearRadius: 800,       // px: near = 1 - min(1, dist / nearRadius)
  dirYScale: 1.7,        // dy is stretched by this before taking the direction
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

/** Figma "Loader / Cloud welcome: 1 Loading" (1440 x 810), clouds 458:1266..1292 in layer order. */
const DESKTOP_CLOUDS: Cloud[] = [
  { x: 9.61, y: 10.21, w: 54.66 }, { x: 37.99, y: 9.67, w: 53.68, flip: true }, { x: 68.14, y: 11.78, w: 56.72, flip: true },
  { x: 96.16, y: 13.34, w: 58.14 }, { x: 125.93, y: 13.75, w: 58.44 }, { x: 19.48, y: 32.92, w: 48.12, flip: true },
  { x: 50.25, y: 32.59, w: 46.96 }, { x: 83.12, y: 33.41, w: 53.18 }, { x: 112.11, y: 30.45, w: 47.99 },
  { x: 8.92, y: 52.79, w: 55.84, flip: true }, { x: 36.16, y: 50.97, w: 51.77, flip: true }, { x: 67.12, y: 52.06, w: 49.42 },
  { x: 97.4, y: 56.2, w: 57.01, flip: true }, { x: 120.72, y: 51.2, w: 47.28 }, { x: 20.15, y: 72.67, w: 45.44, flip: true },
  { x: 58.28, y: 78.22, w: 64.34 }, { x: 84.92, y: 74.44, w: 53.59 }, { x: 108.93, y: 74.59, w: 49.95 },
  { x: 8.46, y: 96.19, w: 50.08, flip: true }, { x: 44.99, y: 100.52, w: 63.75, flip: true }, { x: 65.63, y: 95.66, w: 56 },
  { x: 93.32, y: 94.93, w: 48.93, flip: true }, { x: 126.15, y: 91.96, w: 50 }, { x: 25.91, y: 113.26, w: 56.65, flip: true },
  { x: 56.13, y: 114.75, w: 53.95 }, { x: 81.4, y: 113.81, w: 47.05 }, { x: 105.97, y: 112.13, w: 44.95, flip: true },
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

    // Each cloud's full travel at p = 1 (Figma annotation formula, see the header).
    const cx = window.innerWidth / 2 // 50vw
    const cy = window.innerHeight / 2 // 50vh
    const clouds = cloudRefs.current.flatMap((el) => {
      if (!el) return []
      const r = el.getBoundingClientRect()
      if (!r.width) return [] // the other breakpoint's set
      const dx = r.left + r.width / 2 - cx
      const dy = (r.top + r.height / 2 - cy) * CW.dirYScale
      const dist = Math.hypot(dx, dy)
      const [ux, uy] = dist < 1 ? [0, 1] : [dx / dist, dy / dist]
      const near = 1 - Math.min(1, dist / CW.nearRadius)
      const reach = lerp(CW.distEdge, CW.distCentre, near)
      return [{ el, x: ux * reach, y: uy * reach * CW.vertical }]
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
