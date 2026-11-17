import { useEffect, useRef, useState } from 'react'

/**
 * Animates the numeric part of a metric when it scrolls into view:
 * "94.12%" → 0.00% … 94.12%, "3,400+" → 0+ … 3,400+, "22-page" → 0-page … 22-page.
 * Values without a leading number ("Storybook", "1:38", "🏆") are shown as-is.
 * Screen readers always get the final value.
 */
const RE = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const m = value.includes(':') ? null : RE.exec(value)
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!m || !el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const [, pre, num, post] = m
    const target = parseFloat(num.replace(/,/g, ''))
    const decimals = num.includes('.') ? num.split('.')[1].length : 0
    const commas = num.includes(',')
    const fmt = (v: number) => {
      const s = v.toFixed(decimals)
      return pre + (commas ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : s) + post
    }
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now(), dur = 1400
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur)
        const eased = 1 - Math.pow(1 - t, 3)
        setShown(t < 1 ? fmt(target * eased) : value)
        if (t < 1) raf = requestAnimationFrame(step)
      }
      setShown(fmt(0))
      raf = requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span className={className} aria-label={value}>
      <span ref={ref} aria-hidden="true">{shown}</span>
    </span>
  )
}
