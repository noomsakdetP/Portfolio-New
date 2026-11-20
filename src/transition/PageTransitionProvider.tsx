/**
 * PageTransitionProvider: the curtain between pages (Curtain.tsx). This is the only place
 * the curtain is used; the first load of Home has the Cloud welcome intro instead.
 *
 * go(to), started by a TransitionLink click:
 * 1. Close: both panels slide in from the sides and meet in the centre (0.45s).
 *    The valance fades in place and never moves.
 * 2. Behind the closed curtain: change the route, scroll to the top (or to the #hash target),
 *    then wait for the new page's first visible image and any lazyTracked() chunk, at most 0.8s.
 * 3. Open like the intro, faster: gather to scaleX(0.14) with the curved corners (0.6s), then
 *    slide off (0.3s). Clicks pass through from the moment it starts opening.
 *
 * prefers-reduced-motion: a 0.2s cross-fade (View Transitions API) instead of the curtain;
 * browsers without it just switch pages.
 * Only one transition runs at a time. Back/forward (POP) and the first load never use it,
 * since it only runs from go(). Starting one also finishes the Cloud welcome intro, so
 * coming back to Home never replays it.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate, type To } from 'react-router-dom'
import { finishIntro } from '../components/firstLoadIntro'
import Curtain from './Curtain'
import { PageTransitionContext, TRANSITION_OPENED_EVENT, pendingChunks, type PageTransitionApi } from './pageTransition'
import './PageTransition.css'

const CLOSE_MS = 450
const WAIT_CAP_MS = 800
const OPEN_MS = 600
const SLIDE_MS = 300
const COMMIT_CAP_MS = 1000 // safety net if the route update never commits
const BASE = import.meta.env.BASE_URL

type Phase = 'idle' | 'closing' | 'closed' | 'opening' | 'sliding'

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()))
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scroll to the URL's #hash target if it exists, otherwise to the top. Never smooth. */
function scrollToTarget() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  const el = id ? document.getElementById(id) : null
  if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' })
  else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

/** The first image in the viewport (navbar excluded); resolves once it's decoded. */
function firstImageReady(): Promise<void> {
  const img = Array.from(document.images).find((i) => {
    if (i.closest('nav')) return false
    const r = i.getBoundingClientRect()
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
  })
  if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve()
  return img.decode().catch(() => undefined)
}

const SCROLL_KEYS = new Set([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'])

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState<Phase>('idle')
  const busy = useRef(false)
  const commitWaiters = useRef<(() => void)[]>([])

  // Resolve "route committed" waiters once the new location has rendered.
  useLayoutEffect(() => {
    const waiters = commitWaiters.current
    commitWaiters.current = []
    waiters.forEach((resolve) => resolve())
  }, [location.key])

  // Navigate and resolve once the new route is in the DOM.
  const swapRoute = useCallback(async (to: To) => {
    const committed = new Promise<void>((r) => commitWaiters.current.push(r))
    navigate(to)
    await Promise.race([committed, sleep(COMMIT_CAP_MS)])
  }, [navigate])

  const go = useCallback((to: To) => {
    if (busy.current) return
    busy.current = true
    finishIntro() // the Cloud welcome is for the first view of Home only

    const curtain = async () => {
      setPhase('closing')
      await sleep(CLOSE_MS)
      setPhase('closed')
      await swapRoute(to)
      await nextFrame()
      await nextFrame() // let the page's own effects (e.g. smooth scrollTo(0,0)) run first
      scrollToTarget()
      await Promise.race([
        Promise.all([firstImageReady(), ...pendingChunks()]).catch(() => undefined),
        sleep(WAIT_CAP_MS),
      ])
      setPhase('opening')
      await sleep(OPEN_MS)
      setPhase('sliding')
      await sleep(SLIDE_MS)
    }

    const crossFade = async () => {
      const update = async () => {
        await swapRoute(to)
        await sleep(30) // rAF is paused during a view transition; give page effects a tick
        scrollToTarget()
      }
      if (!('startViewTransition' in document)) return update()
      const root = document.documentElement
      root.classList.add('pt-fade')
      try {
        await document.startViewTransition(update).finished
      } finally {
        root.classList.remove('pt-fade')
      }
    }

    ;(reducedMotion() ? crossFade() : curtain())
      .catch(() => undefined)
      .finally(() => {
        setPhase('idle')
        busy.current = false
        window.dispatchEvent(new Event(TRANSITION_OPENED_EVENT)) // e.g. the Projects portrait drop
      })
  }, [swapRoute])

  // While the curtain is closing/closed, keep the page from scrolling under it.
  const blocking = phase === 'closing' || phase === 'closed'
  useEffect(() => {
    if (!blocking) return
    const stop = (e: Event) => e.preventDefault()
    const stopKeys = (e: KeyboardEvent) => { if (SCROLL_KEYS.has(e.key)) e.preventDefault() }
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    window.addEventListener('keydown', stopKeys)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', stopKeys)
    }
  }, [blocking])

  // Warm the fabric so the first transition doesn't show the flat fallback colour.
  useEffect(() => {
    const id = window.setTimeout(() => {
      for (const f of ['curtain-tile.webp', 'curtain-valance.webp']) new Image().src = `${BASE}${f}`
    }, 1500)
    return () => window.clearTimeout(id)
  }, [])

  const api = useMemo<PageTransitionApi>(() => ({ go, isBusy: () => busy.current }), [go])

  return (
    <PageTransitionContext.Provider value={api}>
      {children}
      {phase !== 'idle' && <Curtain className={`page-curtain pt-${phase}`} />}
    </PageTransitionContext.Provider>
  )
}
