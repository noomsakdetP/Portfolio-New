import { useEffect, useRef } from 'react'

/**
 * The "S" logo as a CSS 3D cube (no WebGL).
 * - Desktop: the cube turns to "look at" the mouse; hovering spins it once.
 * - Touch / no hover: it slowly idles.
 * - Reduced motion: static, shows the front "S" face.
 * It lives inside the footer logo link (which already scrolls back to the top).
 */
export default function FooterCube() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!matchMedia('(pointer: fine)').matches) { el.classList.add('is-idle'); return }

    let raf = 0, x = 0, y = 0
    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return // footer not near the screen
        const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2)
        const ry = Math.max(-55, Math.min(55, dx * 0.12))
        const rx = Math.max(-55, Math.min(55, -dy * 0.12))
        el.style.setProperty('--rx', `${rx}deg`)
        el.style.setProperty('--ry', `${ry}deg`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [])

  return (
    <span className="footer-cube" aria-hidden="true">
      <span className="footer-cube-body" ref={ref}>
        <span className="fc fc-front">S</span>
        <span className="fc fc-back">↑</span>
        <span className="fc fc-right">S</span>
        <span className="fc fc-left" />
        <span className="fc fc-top" />
        <span className="fc fc-bottom" />
      </span>
    </span>
  )
}
