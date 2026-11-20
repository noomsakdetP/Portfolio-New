/** Hero art files, shared by HeroFresco / HeroFrescoRive and the Cloud welcome loader (which preloads them). */
const BASE = import.meta.env.BASE_URL

export const HERO_POSTER = `${BASE}creation-of-sakdidet-final.webp`
export const HERO_RIV = `${BASE}hero-fresco.riv`

/**
 * Master switch for the Rive animation. Off for now: our Rive plan watermarks every
 * export with a splash screen that covers the hero for several seconds. Flip to `true`
 * after re-exporting public/hero-fresco.riv from a plan without the watermark
 * (rive/hero-fresco: `rive . --publish=local`). While false, only the static WebP shows
 * and the Rive chunk, wasm and .riv are never downloaded.
 */
export const HERO_ANIMATED = true

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } }
export const saveData = () => (navigator as NavigatorWithConnection).connection?.saveData === true
