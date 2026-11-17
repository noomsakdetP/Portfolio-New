import { useEffect, useRef } from 'react'

/**
 * Exploded-view driver for a layered element.
 * Sets CSS variables on the element:
 *   --e   0 → 1 → 0  : how "exploded" the layers are (peaks when the element is centred on screen)
 *   --mx, --my       : pointer position over the element (-0.5 … 0.5), desktop only
 * Reduced motion: --e stays 0 (flat, no motion).
 */
export function useExplodeOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // t: 0 when the element's top enters from below, 1 when its bottom leaves at the top
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      // hold the fully exploded state for a while around the centre
      const e = Math.min(1, Math.sin(Math.PI * t) * 1.35)
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
  }, [])

  return ref
}
