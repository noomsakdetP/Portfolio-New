/**
 * "What I do: Between design and code". Figma: Home v2 / Desktop ›
 * Role: Between Design & Code (364:2594): cloud bank, header, Design → Code
 * spectrum (364:2598) and the three side cards (364:2608).
 *
 * Spectrum (Development annotation): the line draws on scroll (pathLength=1 +
 * stroke-dashoffset), then the stops pop in left to right and the red "me" dot
 * pulses once. Everything is shown complete under prefers-reduced-motion.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useT } from '../../i18n/lang'
import CloudBank from './CloudBank'
import SpectrumArt from './SpectrumArt'
import './WhatIDo.css'

/** Labels at their Figma positions in the 1120 × 360 spectrum frame. */
type Label = { text: string; x: number; y: number; kind: 'hand' | 'end' | 'me' | 'pointer'; stop?: number }
const LABELS: Label[] = [
  { text: 'Design', x: 46, y: 240, kind: 'end' },
  { text: 'Code', x: 1033, y: 240, kind: 'end' },
  { text: 'user flows & UX', x: 90.6, y: 128.71, kind: 'hand', stop: 1 },
  { text: 'UI design in Figma', x: 235.1, y: 258.09, kind: 'hand', stop: 2 },
  { text: 'Figma variables to tokens', x: 322.3, y: 123.67, kind: 'hand', stop: 3 },
  { text: 'Angular + PrimeNG', x: 618.1, y: 262.45, kind: 'hand', stop: 4 },
  { text: 'Storybook docs', x: 759, y: 125.74, kind: 'hand', stop: 5 },
  { text: 'dev-ready handoff', x: 862.6, y: 258.78, kind: 'hand', stop: 6 },
  { text: 'Design Technologist', x: 519.9, y: 247.69, kind: 'me' },
  { text: 'where I work', x: 436.4, y: 10, kind: 'pointer' },
]

/** Scroll-scrubbed draw progress (0 → 1, never goes back), from the spectrum's top at
 *  90% of the viewport to 40%. Reduced motion: complete immediately. */
function useDrawProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [drawn, setDrawn] = useState(reduced)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.style.setProperty('--draw', '1')
      return
    }
    let max = 0
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.5)))
      if (p > max) {
        max = p
        el.style.setProperty('--draw', max.toFixed(4))
        if (max >= 1) {
          setDrawn(true)
          window.removeEventListener('scroll', onScroll)
        }
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll) }
  }, [reduced])
  return { ref, drawn }
}

/** When the spectrum is wider than the screen (phones scroll it sideways), start
 *  with the red "me" dot (x 595 of 1120) in the middle instead of at the left edge. */
function useCenterOnMe<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    el.scrollLeft = (595 / 1120) * el.scrollWidth - el.clientWidth / 2
  }, [])
  return ref
}

export default function WhatIDo() {
  const t = useT()
  const { ref: spectrumRef, drawn } = useDrawProgress<HTMLDivElement>()
  const scrollRef = useCenterOnMe<HTMLDivElement>()

  return (
    <section className="what-i-do" aria-labelledby="what-i-do-title">
      <CloudBank />

      <header className="what-i-do-header">
        <p className="what-i-do-kicker">{t("What I do")}</p>
        <h2 id="what-i-do-title" className="what-i-do-title">{t("Between design and code")}</h2>
      </header>

      <div className="spectrum-scroll" ref={scrollRef}>
        <div
          ref={spectrumRef}
          className={`spectrum${drawn ? ' is-drawn' : ''}`}
          role="img"
          aria-label={t("A line from design to code. Along it: user flows and UX, UI design in Figma, Figma variables to tokens, Angular and PrimeNG, Storybook docs, and dev-ready handoff. I work in the middle, as a Design Technologist.")}
        >
          <SpectrumArt />
          {LABELS.map(l => (
            <span
              key={l.text}
              aria-hidden="true"
              className={`spectrum-label spectrum-label--${l.kind}`}
              style={{ left: `${(l.x / 1120) * 100}%`, top: `${(l.y / 360) * 100}%`, ...(l.stop ? { '--i': l.stop } : {}) } as CSSProperties}
            >
              {t(l.text)}
            </span>
          ))}
        </div>
      </div>

      {/* Figma note: "Check the wording of the three cards". Copy below is as in Figma. */}
      <div className="what-i-do-sides">
        <article className="side-card">
          <h3 className="side-card-title">{t("On the design side")}</h3>
          <ul className="side-card-list">
            <li>{t("User flows and UX for complex HR workflows")}</li>
            <li>{t("UI design in Figma")}</li>
            <li>{t("Figma Variables: primitive to semantic tokens")}</li>
          </ul>
        </article>
        <article className="side-card side-card--me">
          <h3 className="side-card-title">{t("Where I sit")}</h3>
          <p className="side-card-text">
            {t("I turn design decisions into tokens and components developers can ship directly, so both teams work from one source of truth.")}
          </p>
        </article>
        <article className="side-card">
          <h3 className="side-card-title">{t("On the dev side")}</h3>
          <ul className="side-card-list">
            <li>{t("Angular component library (PrimeNG)")}</li>
            <li>{t("Storybook documentation")}</li>
            <li>{t("Dev-ready specs and handoff")}</li>
          </ul>
        </article>
      </div>
    </section>
  )
}
