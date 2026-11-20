/**
 * Feature portrait in the Projects header (Figma 452:2816): the curator's portrait in a
 * gold frame (gold-frame.webp as border-image), wall label, "yes, that's me" note + arrow.
 *
 * Portrait drop (Development annotation), once per visit to /projects, after the page
 * curtain has fully opened (300ms after mount when there was no curtain):
 *   fall 0-520ms from translateY(-120vh) rotate(-8deg), shadow 0 -> 1; impact 520-640ms
 *   scaleY .96 -> 1 + dust; damped swing 640-1800ms; glow 1200-1800ms; wall label
 *   1500-1900ms; note + arrow draw on 1800-2400ms. Hover afterwards: gentle swing (CSS).
 * Reduced motion: no fall, swing or dust; everything fades in. Phones: fall from -60vh.
 * Timings: PROJECTS_MOTION.portrait.
 */
import { useLayoutEffect, useRef, useState } from 'react'
import { useT } from '../../i18n/lang'
import { useCurtainSettled } from '../../transition/pageTransition'
import { FEATURE_PORTRAIT } from '../../data/projects'
import portraitGlow from '../../assets/gallery/portrait-glow.svg'
import { ArrowToPortrait } from './GalleryArt'
import { PORTRAIT_DONE_EVENT, PROJECTS_MOTION } from './motion'

const M = PROJECTS_MOTION.portrait
// deterministic dust: horizontal spread (px) and rise (px) per dot
const DUST = [[-62, -10], [-30, -18], [4, -22], [36, -16], [66, -8], [-12, -6]]

/** waiting: CSS holds the pre-fall state; the drop's animations then take over; idle: plain CSS (hover swing). */
type State = 'waiting' | 'idle'

export default function FeaturePortrait() {
  const t = useT()
  const settled = useCurtainSettled(M.fallbackMs)
  const [state, setState] = useState<State>('waiting')
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!settled || state !== 'waiting') return
    const el = root.current
    if (!el) return
    const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!
    const pivot = q<HTMLElement>('.fp-pivot')
    const squash = q<HTMLElement>('.fp-squash')
    const shadow = q<HTMLElement>('.fp-shadow')
    const glow = q<HTMLElement>('.fp-glow')
    const label = q<HTMLElement>('.fp-label')
    const note = q<HTMLElement>('.fp-note')
    const arrow = q<SVGPathElement>('.fp-arrow path')
    const dust = Array.from(el.querySelectorAll<HTMLElement>('.fp-dust i'))
    const anims: Animation[] = []
    const run = (target: Element, frames: Keyframe[], opts: KeyframeAnimationOptions) => { anims.push(target.animate(frames, { fill: 'both', ...opts })) }

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      for (const e of [pivot, shadow, glow, label, note]) run(e, [{ opacity: 0 }, { opacity: 1 }], { duration: M.reducedFadeMs })
      run(arrow, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: M.reducedFadeMs })
    } else {
      const vh = matchMedia('(max-width: 767.98px)').matches ? M.fallFromVhMobile : M.fallFromVh
      const total = M.swingEndMs
      const impactEnd = M.fallMs + M.impactMs
      const step = (total - impactEnd) / M.swingDeg.length
      run(pivot, [
        { offset: 0, transform: `translateY(-${vh}vh) rotate(${M.fallRotateDeg}deg)`, easing: M.fallEase },
        { offset: M.fallMs / total, transform: 'translateY(0) rotate(0deg)' },
        { offset: impactEnd / total, transform: 'translateY(0) rotate(0deg)', easing: 'ease-in-out' },
        ...M.swingDeg.map((deg, i) => ({ offset: (impactEnd + step * (i + 1)) / total, transform: `translateY(0) rotate(${deg}deg)`, easing: 'ease-in-out' })),
      ], { duration: total })
      run(shadow, [{ opacity: 0 }, { opacity: 1 }], { duration: M.fallMs, easing: M.fallEase })
      anims.push(squash.animate([{ transform: `scaleY(${M.impactScaleY})` }, { transform: 'scaleY(1)' }],
        { duration: M.impactMs, delay: M.fallMs, easing: 'ease-out' }))
      dust.forEach((d, i) => {
        const [dx, dy] = DUST[i % DUST.length]
        anims.push(d.animate([
          { opacity: 1, transform: 'translate(-50%, 0) scale(1)' },
          { opacity: 0, transform: `translate(calc(-50% + ${dx}px), ${dy}px) scale(.5)` },
        ], { duration: M.dustMs, delay: M.fallMs, easing: 'ease-out', fill: 'forwards' }))
      })
      run(glow, [{ opacity: 0 }, { opacity: 1 }], { delay: M.glowFromMs, duration: M.glowToMs - M.glowFromMs })
      run(label, [{ opacity: 0, transform: `translateY(${M.labelRisePx}px)` }, { opacity: 1, transform: 'translateY(0)' }],
        { delay: M.labelFromMs, duration: M.labelToMs - M.labelFromMs, easing: 'ease-out' })
      run(arrow, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: M.noteFromMs, duration: M.noteToMs - M.noteFromMs, easing: 'ease-out' })
      run(note, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { delay: M.noteFromMs, duration: M.noteToMs - M.noteFromMs, easing: 'ease-out' })
    }

    // When everything has played, hand over to plain CSS (idle state) so hover can swing.
    let cancelled = false
    Promise.all(anims.map((a) => a.finished)).then(() => {
      if (cancelled) return
      setState('idle')
      window.dispatchEvent(new Event(PORTRAIT_DONE_EVENT)) // the gallery draws the first view's yarn
      requestAnimationFrame(() => anims.forEach((a) => a.cancel()))
    }, () => undefined)
    return () => { cancelled = true }
  }, [settled, state])

  return (
    <div className="fp" ref={root} data-state={state}>
      <img className="fp-glow" src={portraitGlow} alt="" aria-hidden="true" width={520} height={520} decoding="async" />
      <p className="fp-note" aria-hidden="true">{t("yes, that's me")}</p>
      <ArrowToPortrait className="fp-arrow" />
      <div className="fp-pivot">
        <div className="fp-shadow" aria-hidden="true" />
        <div className="fp-squash">
          <div className="fp-frame">
            {FEATURE_PORTRAIT.src
              ? <img className="fp-art" src={FEATURE_PORTRAIT.src} alt={FEATURE_PORTRAIT.alt} width={220} height={328} decoding="async" />
              : <div className="fp-art fp-art--placeholder" role="img" aria-label={FEATURE_PORTRAIT.alt} />}
          </div>
        </div>
      </div>
      <div className="fp-dust" aria-hidden="true">{Array.from({ length: M.dustCount }, (_, i) => <i key={i} />)}</div>
      <div className="fp-label">
        <p className="fp-label-kicker">{t('THE CURATOR')}</p>
        <p className="fp-label-title">Mona Sakdidet</p>
        <p className="fp-label-meta">{t('2026, oil on AI. Still smiling.')}</p>
      </div>
    </div>
  )
}
