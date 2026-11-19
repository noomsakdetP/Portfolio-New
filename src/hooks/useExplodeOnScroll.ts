import { useEffect, useRef } from 'react'

type Options = {
  /** keep --e at its highest value instead of going back to 0 as the element leaves */
  hold?: boolean
  /** --e under prefers-reduced-motion (default 0: flat, no motion) */
  reducedValue?: number
}

/**
 * Exploded-view driver for a layered element.
 * Sets CSS variables on the element:
 *   --e   0 → 1 → 0  : how "exploded" the layers are (peaks when the element is centred on screen)
 *                      with `hold`: 0 → 1, then stays at 1
 *   --mx, --my       : pointer position over the element (-0.5 … 0.5), desktop only
 * Reduced motion: --e is fixed at `reducedValue` (default 0), no motion.
 *
 * Used by the Skills card decks (stack → fan); Figma: "Reuse useExplodeOnScroll".
 */
export function useExplodeOnScroll<T extends HTMLElement>({ hold = false, reducedValue = 0 }: Options = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--e', String(reducedValue))
      return
    }

    let raf = 0
    let max = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // t: 0 when the element's top enters from below, 1 when its bottom leaves at the top
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      // hold the fully exploded state for a while around the centre
      let e = Math.min(1, Math.sin(Math.PI * t) * 1.35)
      if (hold) { if (t > 0.5) e = 1; max = Math.max(max, e); e = max }
      el.style.setProperty('--e', e.toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    const fine = matchMedia('(pointer: fine)').matches
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', ((ev.clientX - r.left) / r.width - 0.5).toFixed(3))
      el.style.setProperty('--my', ((ev.clientY - r.top) / r.height - 0.5).toFixed(3))
    }
    const onLeave = () => { el.style.setProperty('--mx', '0'); el.style.setProperty('--my', '0') }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    if (fine) { el.addEventListener('pointermove', onMove); el.addEventListener('pointerleave', onLeave) }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [hold, reducedValue])

  return ref
}
