/**
 * HeroTokens — 3D "Figma token → component" scene that floats around the hero photo.
 *
 * Story: design tokens (color, type, spacing, radius) and the components built from them
 * float loosely around the photo. As the visitor scrolls, they snap into an organised
 * 3×3 "design system" grid — tokens becoming a system.
 *
 * UX rules (mobile-first):
 * - Native scroll only; the canvas has pointer-events:none so it never blocks touch/scroll.
 * - Mobile: fewer tokens, DPR ≤ 1.5, no mouse parallax.
 * - prefers-reduced-motion: static layout, renders once.
 * - Stops rendering when the hero is off-screen.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { webglOK } from './three/shapes'
import { TOKENS, type Token } from './three/tokens'
import TokenBody from './three/TokenBody'

// Shared, mutable animation state. Lives outside React on purpose: it changes every frame
// and must never trigger a re-render.
const motion = { p: 0, mx: 0, my: 0, time: 0 }
const TMP = new THREE.Vector3() // scratch vector reused by every token each frame

function TokenMesh({ t, u, target, index, still }: { t: Token; u: number; target: { scatter: THREE.Vector3; grid: THREE.Vector3 }; index: number; still: boolean }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const { p, mx, my, time } = motion
    const e = p * p * (3 - 2 * p) // smoothstep
    TMP.copy(target.scatter).lerp(target.grid, e)
    if (!still) {
      const f = 1 - e
      TMP.y += Math.sin(time * 0.9 + index * 1.7) * 0.08 * u * f
      TMP.x += mx * (0.25 + target.scatter.z * 0.2) * u * f
      TMP.y += -my * (0.2 + target.scatter.z * 0.15) * u * f
    }
    const k = still ? 1 : 1 - Math.pow(0.001, dt) // frame-rate independent damping
    g.position.lerp(TMP, k)
    const f = 1 - e
    const wob = still ? 0 : Math.sin(time * 0.7 + index) * 0.08
    g.rotation.set(t.tilt[0] * f + wob * f, t.tilt[1] * f + mx * 0.3 * f, t.tilt[2] * f)
  })

  return (
    <group ref={ref} position={target.scatter}>
      <TokenBody t={t} u={u} />
    </group>
  )
}

function Scene({ mobile, still }: { mobile: boolean; still: boolean }) {
  const { viewport } = useThree()
  const list = useMemo(() => TOKENS.filter(t => !mobile || t.mobile), [mobile])
  const u = Math.min(viewport.width / (mobile ? 7.5 : 9), viewport.height / 9)

  // scattered (around the photo) and assembled (3×3 grid) positions, in world units
  const targets = useMemo(() => {
    const hw = viewport.width / 2, hh = viewport.height / 2
    const colW = 2.45 * u, rowH = 1.35 * u
    const cy = -hh * 0.48 // assemble below the face, over the lower half of the photo
    return list.map(t => ({
      scatter: new THREE.Vector3(t.scatter[0] * (hw - u * 0.9), t.scatter[1] * (hh - u * 0.7), t.scatter[2] * u * 0.6),
      grid: new THREE.Vector3((t.slot[0] - 1) * colW, cy + (1 - t.slot[1]) * rowH, 1.2 * u),
    }))
  }, [list, viewport.width, viewport.height, u])

  useFrame((_, dt) => { motion.time += dt })

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 5, 6]} intensity={1.6} />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} />
      {list.map((t, i) => (
        <TokenMesh key={t.id} t={t} u={u} target={targets[i]} index={i} still={still} />
      ))}
    </>
  )
}

export default function HeroTokens() {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [ok] = useState(webglOK)
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 860px), (pointer: coarse)').matches)
  const still = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    const mq = matchMedia('(max-width: 860px), (pointer: coarse)')
    const onMq = () => setMobile(mq.matches)
    mq.addEventListener('change', onMq)

    // pause rendering when the hero is off-screen
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)

    // scroll progress: 0 = page top, 1 = tokens fully assembled
    const onScroll = () => {
      if (still) return
      motion.p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)))
    }
    // mouse parallax (desktop, fine pointer only)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || still) return
      motion.mx = e.clientX / window.innerWidth - 0.5
      motion.my = e.clientY / window.innerHeight - 0.5
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      mq.removeEventListener('change', onMq)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
    }
  }, [still])

  if (!ok) return null

  return (
    <div ref={wrap} className="hero-tokens" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, mobile ? 1.5 : 2]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 10], fov: 35 }}
        frameloop={still ? 'demand' : visible ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
      >
        <Scene mobile={mobile} still={still} />
      </Canvas>
    </div>
  )
}
