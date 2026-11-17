import { useEffect, useRef } from 'react'

/**
 * "Magnetic" hover: the element drifts toward the cursor when it comes close.
 * Desktop (fine pointer) only, and disabled for prefers-reduced-motion.
 *
 * @param strength how far it follows the cursor (0–1)
 * @param reach    extra distance (px) around the element where the pull starts
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3, reach = 90) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1), opacity .2s'
    el.style.willChange = 'transform'
    let raf = 0, x = 0, y = 0

    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2)
        const inside = Math.abs(dx) < r.width / 2 + reach && Math.abs(dy) < r.height / 2 + reach
        el.style.transform = inside ? `translate(${dx * strength}px, ${dy * strength}px)` : ''
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      el.style.transform = ''
    }
  }, [strength, reach])

  return ref
}
