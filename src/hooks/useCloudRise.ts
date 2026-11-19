import { useEffect, useRef } from 'react'

/**
 * JS fallback for the cloud-bank parallax (see CloudBank.css). Browsers with
 * scroll-driven animations (`animation-timeline: view()`) don't need it, and it stays
 * off under prefers-reduced-motion (the bank is static there).
 *
 * Progress matches the CSS timeline: the Wall Label's view range from entry 0%
 * (its top at the bottom of the viewport) to exit 100% (its bottom at the top);
 * on phones exit 0% → exit 100%.
 * Writes --cloud-p (0 → 1) on the returned ref and adds .is-cloud-js.
 */
export function useCloudRise<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (CSS.supports('animation-timeline: view()')) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const label = root.querySelector<HTMLElement>('.wall-label')
    if (!label) return

    root.classList.add('is-cloud-js')
    const phone = window.matchMedia('(max-width: 767px)')
    let raf = 0
    const update = () => {
      raf = 0
      const r = label.getBoundingClientRect()
      const vh = window.innerHeight
      // desktop: entry 0% → exit 100%; phones: exit 0% → exit 100% (see CloudBank.css)
      const p = phone.matches
        ? Math.min(1, Math.max(0, -r.top / r.height))
        : Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      root.style.setProperty('--cloud-p', p.toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.classList.remove('is-cloud-js')
      root.style.removeProperty('--cloud-p')
    }
  }, [])

  return ref
}
