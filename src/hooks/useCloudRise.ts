import { useEffect, useRef } from 'react'

const WIDE = '(min-width: 768px)'

/**
 * JS driver for the cloud-bank parallax (see CloudBank.css). Used when the CSS view()
 * timeline isn't: in browsers without scroll-driven animations, and in layouts under
 * 768px wide (phones and narrow desktop windows). Off under prefers-reduced-motion.
 *
 * Progress runs from scroll 0 to the moment the Wall Label's bottom leaves the top of
 * the screen: p = scrollY / (Wall Label bottom in page coordinates). With the
 * full-bleed hero (≥768px) that's the same curve as the CSS timeline's
 * entry 0% → exit 100%; in narrow layouts it makes the clouds move from the first
 * wheel notch instead of waiting for the Wall Label to reach the top.
 * Writes --cloud-p (0 → 1) on the returned ref and adds .is-cloud-js.
 */
export function useCloudRise<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const label = root.querySelector<HTMLElement>('.wall-label')
    if (!label) return
    const cssTimeline = CSS.supports('animation-timeline: view()')
    const wide = window.matchMedia(WIDE)

    let raf = 0
    let active = false
    const update = () => {
      raf = 0
      const bottom = label.getBoundingClientRect().bottom + window.scrollY
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, bottom)))
      root.style.setProperty('--cloud-p', p.toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const start = () => {
      if (active) return
      active = true
      root.classList.add('is-cloud-js')
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
    }
    const stop = () => {
      if (!active) return
      active = false
      cancelAnimationFrame(raf)
      raf = 0
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.classList.remove('is-cloud-js')
      root.style.removeProperty('--cloud-p')
    }
    // the CSS timeline handles wide layouts where supported; JS everywhere else
    const choose = () => (cssTimeline && wide.matches ? stop() : start())
    choose()
    wide.addEventListener('change', choose)
    return () => { wide.removeEventListener('change', choose); stop() }
  }, [])

  return ref
}
