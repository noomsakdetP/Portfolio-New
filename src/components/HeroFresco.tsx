/**
 * HeroFresco — "The Creation of Components": me and my cat.
 *
 * Fills its parent (position it with CSS). Layers, bottom to top:
 * 1. Static WebP poster, object-fit: cover — the only thing first paint needs.
 * 2. The Rive canvas (Fit.Cover, Alignment.Center, so it frames exactly like the
 *    poster), fading in once the .riv has loaded.
 * 3. Two drifting clouds (Figma "Cloud / Large"), pointer-events off so hovering
 *    the cat still reaches the canvas.
 *
 * The Rive runtime + component live in a separate chunk (HeroFrescoRive) that is
 * only imported after the page has loaded and gone idle, and never imported at
 * all when prefers-reduced-motion is on or the browser asks to save data.
 */
import { lazy, Suspense, useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import cloudImg from '../assets/hero/cloud.webp'

/**
 * Master switch for the Rive animation. Off for now: our Rive plan watermarks every
 * export with a splash screen that covers the hero for several seconds. Flip to `true`
 * after re-exporting public/hero-fresco.riv from a plan without the watermark
 * (rive/hero-fresco: `rive . --publish=local`). While false, only the static WebP shows
 * and the Rive chunk, wasm and .riv are never downloaded.
 */
export const HERO_ANIMATED = true

const HeroFrescoRive = lazy(() => import('./HeroFrescoRive'))

const POSTER = `${import.meta.env.BASE_URL}creation-of-sakdidet-final.webp`
const LABEL = 'The Creation of Components: me and my cat'
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReduced(cb: () => void) {
  const mql = window.matchMedia(REDUCE_QUERY)
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}
const getReduced = () => window.matchMedia(REDUCE_QUERY).matches

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } }
const saveData = () => (navigator as NavigatorWithConnection).connection?.saveData === true

/** True once the window has loaded and the main thread has had an idle moment. */
function useAfterLoadIdle() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: number | undefined
    const arm = () => {
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1500 })
      else timeoutId = window.setTimeout(() => setReady(true), 200)
    }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
    return () => {
      window.removeEventListener('load', arm)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])
  return ready
}

export default function HeroFresco({ className = '' }: { className?: string }) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => true)
  const [lite] = useState(saveData)
  const afterLoad = useAfterLoadIdle()
  const [riveReady, setRiveReady] = useState(false)
  const onReady = useCallback(() => setRiveReady(true), [])

  const animate = HERO_ANIMATED && !reduced && !lite && afterLoad

  return (
    <div className={`hero-fresco ${riveReady && animate ? 'is-live' : ''} ${className}`} role="img" aria-label={LABEL}>
      <img className="hero-fresco-poster" src={POSTER} alt="" width={1672} height={941} fetchPriority="high" decoding="async" />
      {animate && (
        <Suspense fallback={null}>
          <HeroFrescoRive onReady={onReady} />
        </Suspense>
      )}
      {/* Clouds sit in fresco coordinates: the stage is cropped exactly like the
          cover-fitted art, so they stay over the same spots of the painting. */}
      <div className="hero-fresco-stage" aria-hidden="true">
        <img className="hero-cloud hero-cloud--left" src={cloudImg} alt="" />
        <img className="hero-cloud hero-cloud--right" src={cloudImg} alt="" />
      </div>
    </div>
  )
}
