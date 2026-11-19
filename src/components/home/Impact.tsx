/**
 * Impact: "What the Design System changed". Figma: Home v2 / Desktop › Results (364:2618).
 *
 * Development annotation: the yarn draws left → right on scroll; each number counts
 * up when the yarn reaches its knot (CountUp); the thread ends in a small heart.
 * Values live in src/data/impact.ts (placeholders until the real numbers are in).
 */
import { useEffect, useRef, useState } from 'react'
import { useT } from '../../i18n/lang'
import { IMPACT_STATS, IMPACT_TEAM } from '../../data/impact'
import CountUp from '../casestudy/CountUp'
import ImpactThread from './ImpactThread'
import './Impact.css'

const SEGMENTS = IMPACT_STATS.length // one yarn segment after each knot (the last ends in the heart)

/** Scroll-scrubbed yarn progress (0 → 1, never goes back) from the stats' top at 85%
 *  of the viewport to 35%. Returns how many knots the yarn has reached. */
function useYarn<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [reached, setReached] = useState(reduced ? SEGMENTS + 1 : 0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) { el.style.setProperty('--yarn', '1'); return }
    let max = 0
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5)))
      if (p <= max) return
      max = p
      el.style.setProperty('--yarn', max.toFixed(4))
      // knot i (0-based) is reached when the yarn has covered i segments; +1 for the heart at 100%
      const n = p >= 1 ? SEGMENTS + 1 : Math.floor(p * SEGMENTS) + 1
      setReached(prev => Math.max(prev, n))
      if (p >= 1) window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll) }
  }, [reduced])

  return { ref, reached }
}

export default function Impact() {
  const t = useT()
  const { ref, reached } = useYarn<HTMLDivElement>()

  return (
    <section className="impact" aria-labelledby="impact-title">
      <header className="impact-header">
        <p className="impact-kicker">{t("Impact")}</p>
        <h2 id="impact-title" className="impact-title">{t("What the Design System changed")}</h2>
      </header>

      <div ref={ref} className={`impact-stats${reached > SEGMENTS ? ' is-complete' : ''}`}>
        <ImpactThread />
        {IMPACT_STATS.map((s, i) => (
          <div key={s.label} className={`impact-stat${reached > i ? ' is-reached' : ''}`}>
            <span className="impact-knot" aria-hidden="true" />
            <CountUp value={s.value} start={reached > i} className="impact-value" />
            <h3 className="impact-label">{t(s.label)}</h3>
            <p className="impact-desc">{t(s.desc)}</p>
            {i === IMPACT_STATS.length - 1 && (
              <ul className="impact-avatars" aria-label={t("Team")}>
                {IMPACT_TEAM.map((a, j) => (
                  <li key={j} className={`impact-avatar impact-avatar--${a.tone}`} title={a.name}>
                    <span aria-hidden="true">{a.initial}</span>
                    {a.name && <span className="visually-hidden">{a.name}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
