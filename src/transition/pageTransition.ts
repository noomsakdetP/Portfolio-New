/**
 * Page transition: shared context, hook and lazy-chunk tracking.
 * The curtain itself lives in PageTransitionProvider.tsx; links use TransitionLink.tsx.
 */
import { createContext, lazy, useContext } from 'react'
import type { To } from 'react-router-dom'

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
