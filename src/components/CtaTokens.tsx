/**
 * CtaTokens — the design tokens from the hero "fall" into the yellow CTA box and pile up
 * in its bottom corners, closing the story that starts at the top of the page.
 *
 * - Starts when the CTA box scrolls into view (once).
 * - Desktop: tokens hop when the mouse passes over them. Touch: tap near a token to make it hop.
 * - Renders on demand only (no GPU work once everything has settled).
 * - Sits behind the text (z-index) and never captures pointer events, so links stay clickable.
 * - Reduced motion: tokens are simply placed at rest.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { webglOK } from './three/shapes'
import { TOKENS, type Token } from './three/tokens'
import TokenBody from './three/TokenBody'

type Body = {
  t: Token
  x: number; y: number; vy: number
  rz: number; spin: number
  restY: number; restRz: number
  moving: boolean
}

// deterministic "random" so the pile looks the same on every visit
const rnd = (i: number, s = 1) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v) }

function layout(list: Token[], u: number, vw: number, vh: number, mobile: boolean): Body[] {
  const hw = vw / 2, floor = -vh / 2 + u * 0.15
  const inner = hw * (mobile ? 0.12 : 0.3) // keep the middle (under the text/links) free
  const side = { l: { x: -hw + u * 0.4, y: floor, row: 0 }, r: { x: hw - u * 0.4, y: floor, row: 0 } }
  return list.map((t, i) => {
    const w = t.w * u, h = t.h * u
    const key = i % 2 === 0 ? 'l' : 'r'
    const s = side[key], dir = key === 'l' ? 1 : -1
    // wrap to a new row when the pile reaches the middle zone
    if ((dir === 1 && s.x + w > -inner) || (dir === -1 && s.x - w < inner)) {
      s.row++; s.y += u * 1.25; s.x = dir === 1 ? -hw + u * (0.6 + s.row * 0.5) : hw - u * (0.6 + s.row * 0.5)
    }
    const x = s.x + (dir * w) / 2
    s.x += dir * (w + u * 0.12)
    const restY = s.y + h / 2
    return {
      t, x, restY,
      restRz: (rnd(i) - 0.5) * (s.row ? 0.35 : 0.16),
      y: vh / 2 + h + u * (1 + i * 1.1), // start above the box, staggered
      vy: 0, rz: (rnd(i, 2) - 0.5) * 3, spin: (rnd(i, 3) - 0.5) * 6, moving: true,
    }
  })
}

function Pile({ started, still, mobile, host }: { started: boolean; still: boolean; mobile: boolean; host: HTMLElement | null }) {
  const { viewport, invalidate } = useThree()
  const list = useMemo(() => TOKENS.filter(t => !mobile || t.mobile), [mobile])
  const u = mobile ? viewport.width / 10 : Math.min(viewport.width / 17, viewport.height / 8)
  const bodies = useRef<Body[]>([])
  const groups = useRef<(THREE.Group | null)[]>([])

  // (re)build the pile whenever the box size changes
  useEffect(() => {
    bodies.current = layout(list, u, viewport.width, viewport.height, mobile)
    if (still) bodies.current.forEach(b => { b.y = b.restY; b.rz = b.restRz; b.moving = false })
    invalidate()
  }, [list, u, viewport.width, viewport.height, mobile, still, invalidate])

  useEffect(() => { if (started) invalidate() }, [started, invalidate])

  // hop interaction
  useEffect(() => {
    if (!host || still) return
    const toWorld = (cx: number, cy: number) => {
      const r = host.getBoundingClientRect()
      return [((cx - r.left) / r.width - 0.5) * viewport.width, -((cy - r.top) / r.height - 0.5) * viewport.height]
    }
    const hop = (b: Body, power = 1) => {
      b.vy = u * 9 * power; b.spin = (Math.random() - 0.5) * 8; b.moving = true
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !started) return
      const [wx, wy] = toWorld(e.clientX, e.clientY)
      let any = false
      for (const b of bodies.current) {
        if (b.moving) continue
        const w = b.t.w * u, h = b.t.h * u
        if (Math.abs(wx - b.x) < w / 2 + u * 0.15 && Math.abs(wy - b.y) < h / 2 + u * 0.3) { hop(b, 0.8); any = true }
      }
      if (any) invalidate()
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || !started) return
      const [wx, wy] = toWorld(e.clientX, e.clientY)
      let best: Body | null = null, bd = u * 1.8
      for (const b of bodies.current) { const d = Math.hypot(wx - b.x, wy - b.y); if (d < bd) { bd = d; best = b } }
      if (best) { hop(best); invalidate() }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerdown', onDown, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); host.removeEventListener('pointerdown', onDown) }
  }, [host, still, started, u, viewport.width, viewport.height, invalidate])

  useFrame((_, delta) => {
    if (!started) return
    const dt = Math.min(delta, 1 / 30)
    const g = u * 32
    let moving = false
    bodies.current.forEach((b, i) => {
      if (b.moving) {
        b.vy -= g * dt
        b.y += b.vy * dt
        b.rz += b.spin * dt
        if (b.y <= b.restY) {
          b.y = b.restY
          if (b.vy < -u * 2.2) { b.vy = -b.vy * 0.32; b.spin *= 0.4 } // bounce
          else { b.vy = 0; b.moving = false }
        }
        if (!b.moving || b.y - b.restY < u * 0.6) b.rz += (b.restRz - b.rz) * Math.min(1, dt * 10)
        moving ||= b.moving || Math.abs(b.rz - b.restRz) > 0.001
      }
      const grp = groups.current[i]
      if (grp) { grp.position.set(b.x, b.y, 0); grp.rotation.set(0, 0, b.rz) }
    })
    if (moving) invalidate() // keep rendering only while something moves
  })

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 5, 6]} intensity={1.6} />
      {list.map((t, i) => (
        <group key={t.id} ref={el => { groups.current[i] = el }} position={[0, viewport.height * 2, 0]}>
          <TokenBody t={t} u={u} />
        </group>
      ))}
    </>
  )
}

export default function CtaTokens() {
  const wrap = useRef<HTMLDivElement>(null)
  const [ok] = useState(webglOK)
  const [started, setStarted] = useState(false)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const still = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const mobile = useMemo(() => matchMedia('(max-width: 860px), (pointer: coarse)').matches, [])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    setHost(el.parentElement) // the .cta-box
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect() } }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!ok) return null

  return (
    <div ref={wrap} className="cta-tokens" aria-hidden="true">
      <Canvas
        flat
        frameloop="demand"
        dpr={[1, mobile ? 1.5 : 2]}
        gl={{ antialias: !mobile, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 35 }}
        style={{ pointerEvents: 'none' }}
      >
        <Pile started={started || still} still={still} mobile={mobile} host={host} />
      </Canvas>
    </div>
  )
}
