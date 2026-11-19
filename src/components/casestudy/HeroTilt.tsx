import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Case-study hero image that "lands" in 3D: it starts tilted back and flattens as you
 * scroll, and leans slightly toward the mouse on desktop. CSS transforms only (no WebGL).
 * A project without an image yet (src === '') shows `placeholder` instead of an <img>
 * with an empty src (which React warns about and browsers may refetch the page for).
 */
export default function HeroTilt({ src, alt, className, placeholder }: { src: string; alt: string; className?: string; placeholder?: ReactNode }) {
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
      {src ? <img src={src} alt={alt} className={className} /> : placeholder}
      <span className="cs-hero-glare" aria-hidden="true" />
    </div>
  )
}
