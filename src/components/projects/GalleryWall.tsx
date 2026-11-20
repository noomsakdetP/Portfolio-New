/**
 * The gallery wall on /projects (Figma 441:2725): plaster wall, works in gold frames with wall
 * labels, the yarn thread through the collection, floor with velvet rope, hand-drawn notes.
 *
 * Development annotations:
 * - Thread (451:2817): 6px yarn draws on scroll (pathLength=1 + stroke-dashoffset). Reaching a
 *   knot pops it in, shows its hanging wires and fades the work from 30% to 100%. Covered works
 *   get a knot too; their sign sways once when reached. Ends in a heart after the oldest work.
 *   Phones: one column, the line runs down the left edge. Reduced motion: fully drawn.
 * - First view: works already in view on load don't wait for scroll. Once the portrait drop
 *   has finished, the yarn draws to the last knot in view (600ms ease-out) and reveals them;
 *   works further down keep the scroll behaviour.
 * - Spotlight (Work 03): hover / keyboard focus fades in the lamp cone, lifts the frame 6px and
 *   dims every other work to 70%. Click runs the page curtain into the case study. Touch: off.
 * - Under restoration (Work 02): not a link, no spotlight, drape in curtain-tile.webp, the sign
 *   sways once; screen readers hear "<title>, case study coming soon".
 * - Floor: decorative, rope sags a bit more in view, phones show two posts.
 * Layout: >= 1180px the wall is Figma's 1440 x 3084 stage (so the yarn path matches the frames);
 * below that a single column.
 */
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useT } from '../../i18n/lang'
import TransitionLink from '../../transition/TransitionLink'
import { WORKS, type Work } from '../../data/projects'
import sconceGlow from '../../assets/gallery/sconce-glow.svg'
import spotlightCone from '../../assets/gallery/spotlight-cone.svg'
import {
  ArrowToFirstWork, ArrowToFirstWorkHead, ArrowToLamp, ArrowToLampHead, Crack, FloorBoard, Knot, Nail,
  PostBase, PostFinial, SconceShade, SignFoot, SignString, TieBackRope, VelvetRope, YearUnderline,
} from './GalleryArt'
import { HEART_D, KNOTS, YARN_D, YARN_TAIL_D, flattenCubicPath } from './threadGeometry'
import { PORTRAIT_DONE_EVENT, PROJECTS_MOTION } from './motion'

const DESKTOP_QUERY = '(min-width: 1180px)'
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'
/** Figma: these works hang 72px lower than their row neighbour. */
const HANGS_LOW = [false, true, true, false, false, true, false]
const ROWS = [[0, 1], [2, 3], [4, 5], [6]]
/** Phones: the yarn lane (x) and where each knot sits below its frame's top edge. */
const LANE_X = 6
const MOBILE_KNOT_DY = 14

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => { const m = matchMedia(query); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) },
    () => matchMedia(query).matches,
    () => false,
  )
}

type Geo = { w: number; h: number; d: string; knots: { x: number; y: number }[] }
const DESKTOP_GEO: Geo = { w: 1440, h: 3084, d: YARN_D, knots: KNOTS }

/** Phones: a gently wobbling thread down the left edge, through one knot per frame. */
function mobileGeo(col: HTMLElement): Geo {
  const knots = Array.from(col.querySelectorAll<HTMLElement>('.gw-work')).map((w) => {
    const frame = w.querySelector<HTMLElement>('.gw-frame')!
    return { x: LANE_X, y: w.offsetTop + frame.offsetTop + MOBILE_KNOT_DY }
  })
  const h = col.offsetHeight
  let d = `M${LANE_X} ${Math.max(0, knots[0].y - 32)}`
  const ys = [...knots.map((k) => k.y), Math.min(h, knots[knots.length - 1].y + 64)]
  for (let i = 1; i < ys.length; i++) {
    const a = ys[i - 1], b = ys[i], s = i % 2 ? 4 : -4
    d += ` C${LANE_X + s} ${a + (b - a) / 3} ${LANE_X - s} ${a + (2 * (b - a)) / 3} ${LANE_X} ${b}`
  }
  return { w: 12, h, d, knots }
}

export default function GalleryWall() {
  const t = useT()
  const desktop = useMedia(DESKTOP_QUERY)
  const stageRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const knotSvgRef = useRef<SVGSVGElement>(null)
  const tailRef = useRef<SVGGElement>(null)
  const workEls = useRef<(HTMLDivElement | null)[]>([])
  const floorRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState<Geo | null>(null)
  const firstViewKnot = useRef(-1) // last knot drawn by the first-view draw (survives geometry changes)
  const geo = desktop ? DESKTOP_GEO : mobile

  // Phones: measure the column and lay the thread along the frames.
  useLayoutEffect(() => {
    if (desktop) return
    const col = colRef.current
    if (!col) return
    const measure = () => setMobile(mobileGeo(col))
    const ro = new ResizeObserver(measure)
    ro.observe(col)
    return () => ro.disconnect()
  }, [desktop])

  // Draw the yarn up to the scroll tip; mark knots / works as reached.
  useEffect(() => {
    const path = pathRef.current
    const svg = path?.ownerSVGElement
    if (!geo || !path || !svg) return
    const knotEls = Array.from(knotSvgRef.current?.querySelectorAll<SVGGElement>('.gw-knot') ?? [])
    const reach = (i: number, on: boolean) => {
      knotEls[i]?.classList.toggle('is-reached', on)
      const w = workEls.current[i]
      if (!w) return
      w.classList.toggle('is-reached', on)
      if (on) w.classList.add('has-been-reached') // the restoration sign sways once
    }
    if (matchMedia(REDUCE_QUERY).matches) {
      path.style.strokeDashoffset = '0'
      geo.knots.forEach((_, i) => reach(i, true))
      tailRef.current?.classList.add('is-reached')
      return
    }

    // max y reached so far along the path, sampled by length: tip y -> drawn fraction
    // tip y -> drawn fraction: the max y reached so far along the (flattened) path
    const { xs: px, ys: py, frac } = flattenCubicPath(geo.d)
    const last = py.length - 1
    const ys = new Float32Array(py.length)
    let maxY = -Infinity
    py.forEach((y, i) => { maxY = Math.max(maxY, y); ys[i] = maxY })
    const fractionAt = (tip: number) => {
      if (tip <= ys[0]) return 0
      if (tip >= ys[last]) return 1
      let lo = 0, hi = last
      while (lo < hi) { const mid = (lo + hi) >> 1; if (ys[mid] >= tip) hi = mid; else lo = mid + 1 }
      return frac[lo]
    }
    // where each knot sits along the yarn (the path dips below knots before reaching them,
    // so "tip passed the knot's y" would fire too early): nearest point to the knot
    const knotFrac = geo.knots.map((k) => {
      let best = 0, bestD = Infinity
      px.forEach((x, i) => { const d = (x - k.x) ** 2 + (py[i] - k.y) ** 2; if (d < bestD) { bestD = d; best = i } })
      return frac[best]
    })

    let raf = 0
    // first-view draw: the yarn never shows less than this (restored if the geometry is rebuilt)
    let floor = firstViewKnot.current >= 0 ? knotFrac[Math.min(firstViewKnot.current, knotFrac.length - 1)] : 0
    const scrollFraction = () => fractionAt(window.innerHeight * PROJECTS_MOTION.thread.tipViewport - svg.getBoundingClientRect().top)
    const update = () => {
      raf = 0
      const drawn = Math.max(scrollFraction(), floor)
      path.style.strokeDashoffset = String(1 - drawn)
      geo.knots.forEach((_, i) => reach(i, drawn >= knotFrac[i] - 0.002))
      tailRef.current?.classList.toggle('is-reached', drawn >= knotFrac[knotFrac.length - 1] - 0.002)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    // After the portrait drop: draw to the last knot whose frame is in view, revealing those works.
    let firstViewRaf = 0
    const onPortraitDone = () => {
      let last = -1
      workEls.current.forEach((w, i) => {
        const f = w?.querySelector('.gw-frame')?.getBoundingClientRect()
        if (f && f.top < window.innerHeight && f.bottom > 0) last = Math.max(last, i)
      })
      if (last < 0) return
      firstViewKnot.current = last
      const from = Math.max(scrollFraction(), floor)
      const target = knotFrac[last]
      if (target <= from) return
      const start = performance.now()
      const duration = PROJECTS_MOTION.thread.firstViewDrawMs
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        floor = from + (target - from) * (1 - (1 - t) ** 3)
        update()
        if (t < 1) firstViewRaf = requestAnimationFrame(step)
      }
      firstViewRaf = requestAnimationFrame(step)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener(PORTRAIT_DONE_EVENT, onPortraitDone, { once: true })
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(firstViewRaf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener(PORTRAIT_DONE_EVENT, onPortraitDone)
    }
  }, [geo])

  // Floor: the rope sags a little more once it is in view.
  useEffect(() => {
    const el = floorRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-inview'); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const thread = geo && (
    <svg className="gw-thread" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} fill="none" aria-hidden="true" focusable="false">
      <path ref={pathRef} className="gw-yarn ga-stroke-accent" d={geo.d} pathLength={1} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {desktop && (
        <g ref={tailRef} className="gw-tail">
          <path className="ga-stroke-accent" d={YARN_TAIL_D} pathLength={1} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ga-fill-accent gw-heart" d={HEART_D} />
        </g>
      )}
    </svg>
  )
  const knots = geo && (
    <svg ref={knotSvgRef} className="gw-knots" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} fill="none" aria-hidden="true" focusable="false">
      {geo.knots.map((k, i) => <Knot key={i} x={k.x} y={k.y} small={!desktop} />)}
    </svg>
  )

  return (
    <section className="gw" aria-label={t('The collection')}>
      <div className="gw-rail" aria-hidden="true" />
      <div className="gw-stage" ref={stageRef}>
        <WallDressing />
        {desktop && <>{thread}{knots}</>}

        <div className="gw-works" ref={colRef}>
          {!desktop && thread}
          {ROWS.map((row, r) => (
            <div className="gw-row" key={r}>
              {row.map((i) => (
                <WorkItem key={WORKS[i].no} work={WORKS[i]} low={HANGS_LOW[i]} setRef={(el) => { workEls.current[i] = el }} />
              ))}
            </div>
          ))}
          {!desktop && knots}
        </div>

        <WallDoodles />
      </div>
      <Floor floorRef={floorRef} />
    </section>
  )
}

function WorkItem({ work, low, setRef }: { work: Work; low: boolean; setRef: (el: HTMLDivElement | null) => void }) {
  const t = useT()
  const live = work.caseStudyId !== null
  const label = (
    <div className="gw-label">
      <span className="gw-label-rule" aria-hidden="true" />
      <div className="gw-label-text">
        <p className="gw-label-no">{t('NO.')} {work.no}{!live && <>&nbsp;&nbsp;&nbsp;{t('UNDER RESTORATION')}</>}</p>
        <h2 className="gw-label-title">{t(work.title)}</h2>
        <p className="gw-label-meta">{t(work.year)}, {t(work.role)}</p>
        <p className="gw-label-tools">{t(work.tools)}</p>
      </div>
    </div>
  )
  const className = `gw-work ${live ? 'gw-work--live' : 'gw-work--covered'}${low ? ' gw-work--low' : ''}`

  if (!live) {
    return (
      <div className={className} ref={setRef}>
        <div className="gw-frame" role="img" aria-label={`${t(work.title)}, ${t('case study coming soon')}`}>
          <div className="gw-mat">
            <div className="gw-drape">
              <span className="gw-drape-shade" />
              <div className="gw-sign-group">
                <SignString className="gw-sign-string" />
                <Nail className="gw-nail" />
                <div className="gw-sign">
                  <span className="gw-sign-kicker">{t('UNDER RESTORATION')}</span>
                  <span className="gw-sign-note">{t('Case study coming soon')}</span>
                </div>
              </div>
              <TieBackRope className="gw-tieback" />
            </div>
          </div>
        </div>
        {label}
      </div>
    )
  }

  return (
    <div className={className} ref={setRef}>
      <span className="gw-lamp" aria-hidden="true" />
      <img className="gw-cone" src={spotlightCone} alt="" aria-hidden="true" width={676} height={502} decoding="async" />
      <TransitionLink to={`/projects/${work.caseStudyId}`} className="gw-work-link">
        <div className="gw-frame">
          <div className="gw-mat">
            {work.image
              ? <img className="gw-art" src={work.image} alt="" width={380} height={238} loading="lazy" decoding="async" />
              : <div className="gw-art gw-art--placeholder" />}
          </div>
        </div>
        {label}
      </TransitionLink>
    </div>
  )
}

function WallDressing() {
  return (
    <div className="gw-dressing" aria-hidden="true">
      <Crack n={0} className="gw-crack gw-crack--1" />
      <Crack n={1} className="gw-crack gw-crack--2" />
      <Crack n={2} className="gw-crack gw-crack--3" />
      <Crack n={3} className="gw-crack gw-crack--4" />
      {[1, 2, 3].map((n) => (
        <div key={n} className={`gw-sconce gw-sconce--${n}`}>
          <img className="gw-sconce-glow" src={sconceGlow} alt="" width={140} height={160} decoding="async" />
          <span className="gw-sconce-plate" />
          <SconceShade className="gw-sconce-shade" />
        </div>
      ))}
    </div>
  )
}

function WallDoodles() {
  const t = useT()
  return (
    <div className="gw-doodles" aria-hidden="true">
      {(['2026', '2025', '2024', '2023'] as const).map((y) => (
        <div key={y} className={`gw-year gw-year--${y}`}>
          <p className="gw-hand">{y}</p>
          <YearUnderline className="gw-year-underline" />
        </div>
      ))}
      <p className="gw-hand gw-note gw-note--easel">{t('fresh off the easel!')}</p>
      <span className="gw-washi" />
      <p className="gw-hand gw-note gw-note--hover">{t('hover me, I light up!')}</p>
      <ArrowToLamp className="gw-arrow-lamp" />
      <ArrowToLampHead className="gw-arrow-lamp-head" />
      <p className="gw-hand gw-note gw-note--started">{t('where it all started')}</p>
      <ArrowToFirstWork className="gw-arrow-first" />
      <ArrowToFirstWorkHead className="gw-arrow-first-head" />
    </div>
  )
}

function Floor({ floorRef }: { floorRef: React.RefObject<HTMLDivElement | null> }) {
  const t = useT()
  return (
    <div className="gw-floor" ref={floorRef} aria-hidden="true">
      <div className="gw-floor-band">
        <span className="gw-baseboard-trim" />
        <span className="gw-baseboard" />
        <svg className="gw-floorboards" width="100%" height="146" fill="none" focusable="false">
          <defs>
            <pattern id="gw-board" x="-60" width="120" height="146" patternUnits="userSpaceOnUse">
              <FloorBoard />
            </pattern>
          </defs>
          <rect width="100%" height="146" fill="url(#gw-board)" />
        </svg>
      </div>
      <div className="gw-floor-stage">
        <VelvetRope wide className="gw-rope gw-rope--1" />
        <VelvetRope wide={false} className="gw-rope gw-rope--2" />
        <VelvetRope wide className="gw-rope gw-rope--3" />
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`gw-post gw-post--${n}`}>
            <PostFinial className="gw-post-finial" />
            <span className="gw-post-pole" />
            <PostBase className="gw-post-base" />
          </div>
        ))}
        <div className="gw-touch">
          <span className="gw-touch-pole" />
          <SignFoot className="gw-touch-foot" />
          <div className="gw-touch-sign">
            <span className="gw-touch-kicker">{t('PLEASE TOUCH')}</span>
            <span className="gw-touch-kicker">{t('THE ARTWORK')}</span>
            <span className="gw-touch-note">{t("(it's clickable)")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
