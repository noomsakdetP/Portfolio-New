/**
 * Cloud bank at the top of "What I do". Figma: Home v2 / Desktop ›
 * Role: Between Design & Code › Cloud Bank (parallax) (414:3044) and the three
 * "Storyboard / Cloud transition" frames.
 *
 * At rest the back clouds peek 20px above the section, over the bottom of the Wall
 * Label. While the hero and Wall Label scroll out, the three layers rise faster than
 * the page (back −120px, mid −240px, front −380px at 1440, front carrying a solid
 * plaster body) and cover them; the hero photo dims 1 → .85. Motion lives in
 * CloudBank.css (scroll-driven view() timeline) with the JS fallback in
 * useCloudRise; static under prefers-reduced-motion.
 */
import cloudImg from '../../assets/hero/cloud.webp'
import './CloudBank.css'

type Cloud = { x: number; y: number; flip?: boolean }

// Positions in the 1440 × 300 Figma frame (px); converted to % in render.
const BACK: Cloud[] = [{ x: -60, y: 0 }, { x: 380, y: 14, flip: true }, { x: 820, y: 4 }, { x: 1180, y: 18, flip: true }]
const MID: Cloud[] = [{ x: 110, y: 36, flip: true }, { x: 590, y: 22 }, { x: 1040, y: 40, flip: true }]
const FRONT: Cloud[] = [{ x: -210, y: 70 }, { x: 290, y: 82, flip: true }, { x: 760, y: 66 }, { x: 1140, y: 80, flip: true }]

function Layer({ name, clouds, w }: { name: 'back' | 'mid' | 'front'; clouds: Cloud[]; w: number }) {
  return (
    <div className={`cloud-layer cloud-layer--${name}`}>
      {name === 'front' && <div className="cloud-body" />}
      {clouds.map((c, i) => (
        <img
          key={i}
          src={cloudImg}
          alt=""
          className={`cloud-bank-cloud${c.flip ? ' is-flipped' : ''}`}
          style={{ left: `${(c.x / 1440) * 100}%`, top: `${(c.y / 300) * 100}%`, width: `${(w / 1440) * 100}%` }}
          decoding="async"
          loading="lazy"
        />
      ))}
    </div>
  )
}

export default function CloudBank() {
  return (
    <div className="cloud-bank" aria-hidden="true">
      <div className="cloud-base-fade" />
      <Layer name="back" clouds={BACK} w={340} />
      <Layer name="mid" clouds={MID} w={470} />
      <Layer name="front" clouds={FRONT} w={640} />
    </div>
  )
}
