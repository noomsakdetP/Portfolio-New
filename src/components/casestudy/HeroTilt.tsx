import { useEffect, useRef } from 'react'

/**
 * Case-study hero image that "lands" in 3D: it starts tilted back and flattens as you
 * scroll, and leans slightly toward the mouse on desktop. CSS transforms only (no WebGL).
 */
export default function HeroTilt({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      // 0 while the image sits low on screen → 1 once its top reaches ~20% of the viewport
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.8)))
      el.style.setProperty('--land', p.toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const fine = matchMedia('(pointer: fine)').matches
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
      el.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
    }
    const onLeave = () => { el.style.setProperty('--tx', '0'); el.style.setProperty('--ty', '0') }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    if (fine) { el.addEventListener('pointermove', onMove); el.addEventListener('pointerleave', onLeave) }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [src])

  return (
    <div ref={ref} className="cs-hero-tilt">
      <img src={src} alt={alt} className={className} />
      <span className="cs-hero-glare" aria-hidden="true" />
    </div>
  )
}
