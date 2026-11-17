import { useEffect, useRef } from 'react'

/**
 * Drives the Work Experience timeline from native scroll:
 * - sets `--p` (0 → 1) on the timeline element; CSS uses it to "draw" the progress line
 * - adds `.is-reached` to each `.timeline-item` once the line gets to it
 * Reduced motion: everything is shown immediately.
 */
export function useScrollTimeline<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('.timeline-item'))

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1')
      items.forEach(it => it.classList.add('is-reached'))
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      // the line tip follows a point 65% down the viewport
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height))
      el.style.setProperty('--p', p.toFixed(4))
      items.forEach(it => it.classList.toggle('is-reached', p >= it.offsetTop / el.offsetHeight + 0.02))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return ref
}
