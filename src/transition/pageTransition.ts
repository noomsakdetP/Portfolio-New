/**
 * Page transition: shared context, hook and lazy-chunk tracking.
 * The curtain itself lives in PageTransitionProvider.tsx; links use TransitionLink.tsx.
 */
import { createContext, lazy, useContext, useEffect, useState } from 'react'
import type { To } from 'react-router-dom'

/** Dispatched on window when a page transition has fully finished (curtain gone / fade done). */
export const TRANSITION_OPENED_EVENT = 'pagetransition:opened'

export type PageTransitionApi = {
  /** Run the curtain transition to `to`. Ignored while a transition is already running. */
  go: (to: To) => void
  /** True from the moment a transition starts until its curtain has fully left. */
  isBusy: () => boolean
}

export const PageTransitionContext = createContext<PageTransitionApi | null>(null)

export function usePageTransition(): PageTransitionApi {
  const api = useContext(PageTransitionContext)
  if (!api) throw new Error('usePageTransition must be used inside <PageTransitionProvider>')
  return api
}

/**
 * True once the page can start its entrance animation: when this page was reached through a
 * page transition, after the curtain has fully opened; otherwise `fallbackMs` after mount.
 */
export function useCurtainSettled(fallbackMs: number) {
  const { isBusy } = usePageTransition()
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    if (isBusy()) {
      const done = () => setSettled(true)
      window.addEventListener(TRANSITION_OPENED_EVENT, done, { once: true })
      return () => window.removeEventListener(TRANSITION_OPENED_EVENT, done)
    }
    const id = window.setTimeout(() => setSettled(true), fallbackMs)
    return () => window.clearTimeout(id)
  }, [isBusy, fallbackMs])
  return settled
}

// ── lazy chunks the curtain waits for (at most 0.8s) before it opens ──
const pending = new Set<Promise<unknown>>()

export const pendingChunks = () => [...pending]

/** React.lazy() whose chunk download holds the page-transition curtain closed (capped). */
export const lazyTracked: typeof lazy = (factory) =>
  lazy(() => {
    const p = factory()
    pending.add(p)
    const done = () => { pending.delete(p) }
    p.then(done, done)
    return p
  })
