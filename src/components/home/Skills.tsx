/**
 * Skills & Capabilities: two playing-card decks. Figma: Home v2 / Desktop › Skills
 * (364:2704), cards from the "Skill Playing Card" component (Rest / Active).
 * Replaces the old SkillsOrb + skills grid; data from src/data/skills.ts.
 *
 * Development annotations:
 * - On scroll into view each deck starts as a tight stack and fans out
 *   (useExplodeOnScroll: --e drives each card's x, y and rotation). Reduced motion:
 *   the fan is shown statically.
 * - Hover / focus / tap lifts a card to the front (translateY(-40px), rotate(0),
 *   Active variant with the description); the cards after it shift right.
 * - Each card is a real <button> in a <ul>; description linked with aria-describedby.
 * - Mobile: one deck per row as a horizontal scroll-snap fan; tap to lift, tap again
 *   or swipe to close.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useT } from '../../i18n/lang'
import { HARD_SKILLS, SOFT_SKILLS, type Skill } from '../../data/skills'
import { useExplodeOnScroll } from '../../hooks/useExplodeOnScroll'
import { ArrowPickACard, UnderlineCapabilities } from './SkillsArt'
import './Skills.css'

// fresco illustrations: src/assets/skills/<slug>.webp
const ART = import.meta.glob<string>('../../assets/skills/*.webp', { eager: true, import: 'default' })
const artFor = (slug: string) => ART[`../../assets/skills/${slug}.webp`]

/** Figma fan geometry (1120 × 340 frame): cards evenly spaced over `span` px, rotated
 *  −7° → +7° around their top-left corner, on an arc of radius ≈ 3490px.
 *  Spans from Figma: Hard 800 (8 cards, 114.3 apart; +120 shift when one is lifted
 *  still ends at the frame edge), Soft 920 (6 cards, 184 apart). */
const R = 3490
const SPAN: Record<Kind, number> = { hard: 800, soft: 920 }
function fan(n: number, i: number, span: number) {
  const deg = n === 1 ? 0 : -7 + (14 * i) / (n - 1)          // CSS rotation (Figma uses the opposite sign)
  const x = n === 1 ? span / 2 : (span * i) / (n - 1)
  const y = 66 - R * (Math.cos((deg * Math.PI) / 180) - Math.cos((7 * Math.PI) / 180))
  return { x, y, deg }
}

type Kind = 'hard' | 'soft'

function Deck({ kind, skills, emoji, title, note }: { kind: Kind; skills: Skill[]; emoji: string; title: string; note: ReactNode }) {
  const t = useT()
  const deckRef = useExplodeOnScroll<HTMLDivElement>({ hold: true, reducedValue: 1 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const pointerType = useRef<string>('mouse')

  // Mobile: swiping the strip closes the lifted card; Esc closes it anywhere
  useEffect(() => {
    const strip = scrollRef.current
    if (!strip) return
    const onScroll = () => setActive(null)
    strip.addEventListener('scroll', onScroll, { passive: true })
    return () => strip.removeEventListener('scroll', onScroll)
  }, [])

  const n = skills.length
  const kindLabel = kind === 'hard' ? t("Hard skill") : t("Soft skill")

  return (
    <div
      ref={deckRef}
      className={`deck deck--${kind}`}
      style={{ '--xc': SPAN[kind] / 2 } as CSSProperties}
      onPointerLeave={e => { if (e.pointerType === 'mouse') setActive(null) }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null) }}
      onKeyDown={e => { if (e.key === 'Escape') setActive(null) }}
    >
      <div className="deck-label">
        <h3 className="deck-title">
          <span className="deck-emoji" aria-hidden="true">{emoji}</span>
          <span>{t(title)}</span>
          <span className="deck-count">{n} {t("cards")}</span>
        </h3>
      </div>
      {note}

      <div className="deck-scroll" ref={scrollRef}>
        <ul className="deck-fan">
          {skills.map((s, i) => {
            const { x, y, deg } = fan(n, i, SPAN[kind])
            const isActive = active === i
            const descId = `skill-desc-${s.slug}`
            const num = String(i + 1).padStart(2, '0')
            return (
              <li
                key={s.slug}
                className={`deck-slot${isActive ? ' is-active' : ''}${active !== null && i > active ? ' is-after-active' : ''}`}
                style={{ '--x': x, '--y': y, '--r': deg, '--i': i } as CSSProperties}
              >
                <button
                  type="button"
                  className="skill-card"
                  aria-describedby={descId}
                  aria-expanded={isActive}
                  onPointerDown={e => { pointerType.current = e.pointerType }}
                  onPointerEnter={e => { if (e.pointerType === 'mouse') setActive(i) }}
                  onFocus={() => { if (pointerType.current !== 'touch') setActive(i) }}
                  onClick={() => {
                    if (pointerType.current === 'touch') setActive(a => (a === i ? null : i))
                    else setActive(i)
                    pointerType.current = 'mouse'
                  }}
                >
                  <span className="skill-kind" aria-hidden="true">{kindLabel}</span>
                  <span className="skill-num" aria-hidden="true">{num}</span>
                  <span className="skill-title">{t(s.title)}</span>
                  <span className="skill-desc" id={descId} aria-hidden="true">{t(s.desc)}</span>
                  <span className="skill-num skill-num--corner" aria-hidden="true">{num}</span>
                  {artFor(s.slug)
                    ? <img className="skill-art" src={artFor(s.slug)} alt="" width={96} height={96} loading="lazy" decoding="async" />
                    : <span className="skill-art skill-art--empty" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default function Skills() {
  const t = useT()
  return (
    <section className="skills" id="skills" aria-labelledby="skills-title">
      <header className="skills-header">
        <p className="skills-kicker">{t("MY EXPERTISE")}</p>
        <h2 id="skills-title" className="skills-title">
          {t("Skills & Capabilities")}
          <UnderlineCapabilities />
        </h2>
      </header>

      <Deck
        kind="hard"
        skills={HARD_SKILLS}
        emoji="🎨"
        title="Hard Skills"
        note={<>
          <p className="deck-note deck-note--pick" aria-hidden="true">{t("pick a card!")}</p>
          <ArrowPickACard />
        </>}
      />
      <Deck
        kind="soft"
        skills={SOFT_SKILLS}
        emoji="🧠"
        title="Soft Skills"
        note={<p className="deck-note deck-note--human" aria-hidden="true">{t("& the human side")}</p>}
      />
    </section>
  )
}
