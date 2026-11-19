import { useEffect, useRef } from 'react'

/**
 * Drives a scroll-drawn timeline from native scroll:
 * - sets `--p` (0 → 1) on the timeline element; CSS uses it to "draw" the progress line
 * - sets `--seg-p` (0 → 1) on each item: how far the line has got through that item's
 *   stretch (from its top to the next item's top, or to the end for the last one)
 * - adds `.is-reached` to each item once the line gets to it
 * Reduced motion: everything is shown immediately.
 *
 * @param itemSelector the timeline items (default `.timeline-item`)
 */
export function useScrollTimeline<T extends HTMLElement>(itemSelector = '.timeline-item') {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>(itemSelector))

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1')
      items.forEach(it => { it.style.setProperty('--seg-p', '1'); it.classList.add('is-reached') })
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      // the line tip follows a point 65% down the viewport
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height))
      el.style.setProperty('--p', p.toFixed(4))
      const tip = p * el.offsetHeight
      items.forEach((it, i) => {
        const start = it.offsetTop
        const end = i < items.length - 1 ? items[i + 1].offsetTop : el.offsetHeight
        const seg = Math.min(1, Math.max(0, (tip - start) / Math.max(1, end - start)))
        it.style.setProperty('--seg-p', seg.toFixed(4))
        it.classList.toggle('is-reached', p >= start / el.offsetHeight + 0.02)
      })
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
  }, [itemSelector])

  return ref
}
