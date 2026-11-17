/**
 * SkillsOrb — every hard & soft skill as a tile on a slowly turning 3D sphere.
 *
 * - Scroll turns the orb (native scroll, nothing is hijacked).
 * - Desktop: hover a tile to read it; the orb leans toward the mouse.
 * - Touch: tap a tile. The canvas keeps the browser's default touch-action,
 *   so vertical swipes still scroll the page.
 * - When nobody is interacting, the front-most tile is highlighted every few seconds.
 * - The full list stays below as normal HTML (SEO / screen readers); this is an enhancement.
 */
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { HARD_SKILLS, SOFT_SKILLS, type Skill } from '../data/skills'
import { roundRect, roundedSlab, slabFront, webglOK } from './three/shapes'
import { useT } from '../i18n/lang'

type Tile = Skill & { kind: 'hard' | 'soft'; n: THREE.Vector3; q: THREE.Quaternion }

const R = 3 // sphere radius (world units)
const TW = 2.5, TH = 0.72, TD = 0.12 // tile size

const COLORS = {
  hard: { body: '#EAB308', ink: '#251A00' },
  soft: { body: '#FFFFFF', ink: '#1B1C19' },
}

// per-frame state kept outside React (changes every frame, must not re-render)
const orb = { p: 0, mx: 0, my: 0, time: 0, front: 0 }
const V = new THREE.Vector3()

function buildTiles(tr: (s: string) => string): Tile[] {
  const list = [
    ...HARD_SKILLS.map(s => ({ title: tr(s.title), desc: tr(s.desc), kind: 'hard' as const })),
    ...SOFT_SKILLS.map(s => ({ title: tr(s.title), desc: tr(s.desc), kind: 'soft' as const })),
  ]
  // interleave hard/soft so colours spread evenly over the sphere
  const mixed: typeof list = []
  const h = list.filter(t => t.kind === 'hard'), s = list.filter(t => t.kind === 'soft')
  while (h.length || s.length) { if (h.length) mixed.push(h.shift()!); if (s.length) mixed.push(s.shift()!) }

  const N = mixed.length, golden = Math.PI * (3 - Math.sqrt(5)), m = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0), o = new THREE.Vector3()
  return mixed.map((t, i) => {
    const y = 1 - ((i + 0.5) / N) * 2, r = Math.sqrt(1 - y * y), th = i * golden
    const n = new THREE.Vector3(Math.cos(th) * r, y * 0.9, Math.sin(th) * r).normalize()
    const q = new THREE.Quaternion().setFromRotationMatrix(m.lookAt(n, o, up)) // tile's +z faces outward, text stays upright
    return { ...t, n, q }
  })
}

function drawTile(t: Tile, cv: HTMLCanvasElement) {
  const x = cv.getContext('2d')!
  const W = cv.width, H = cv.height, c = COLORS[t.kind]
  x.clearRect(0, 0, W, H)
  x.save()
  roundRect(x, W, H, H * 0.3)
  x.clip()
  x.fillStyle = c.body
  x.fillRect(0, 0, W, H)
  if (t.kind === 'soft') { x.strokeStyle = '#D3C5AC'; x.lineWidth = 6; roundRect(x, W, H, H * 0.3); x.stroke() }
  let size = 46
  x.font = `700 ${size}px "Hanken Grotesk", "IBM Plex Sans Thai", sans-serif`
  while (x.measureText(t.title).width > W - 60 && size > 20) { size -= 2; x.font = `700 ${size}px "Hanken Grotesk", "IBM Plex Sans Thai", sans-serif` }
  x.fillStyle = c.ink
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  x.fillText(t.title, W / 2, H / 2 + 2)
  x.restore()
}

function TileMesh({ t, index, active, onHover, onPick, touch }: {
  t: Tile; index: number; active: boolean; touch: boolean
  onHover: (i: number | null) => void; onPick: (i: number) => void
}) {
  const ref = useRef<THREE.Group>(null)
  const geo = useMemo(() => roundedSlab(TW, TH, TH * 0.3, TD), [])
  const tex = useMemo(() => {
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = Math.round((512 * TH) / TW)
    drawTile(t, cv)
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4
    return tx
  }, [t])
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null)
  const faceMat = useRef<THREE.MeshBasicMaterial>(null)

  useEffect(() => {
    let alive = true
    document.fonts?.ready.then(() => { if (alive) { drawTile(t, tex.image as HTMLCanvasElement); tex.needsUpdate = true } })
    return () => { alive = false; tex.dispose(); geo.dispose() }
  }, [t, tex, geo])

  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    // push the active tile outward and scale it up
    const k = 1 - Math.pow(0.0005, dt)
    const out = active ? 0.55 : 0
    V.copy(t.n).multiplyScalar(R + out)
    g.position.lerp(V, k)
    const sc = g.scale.x + ((active ? 1.18 : 1) - g.scale.x) * k
    g.scale.setScalar(sc)
    // fade tiles on the far side so the front stays readable
    g.getWorldPosition(V)
    const facing = THREE.MathUtils.clamp(V.z / R, -1, 1)
    const a = 0.12 + 0.88 * THREE.MathUtils.smoothstep(facing, -0.4, 0.6)
    if (bodyMat.current) bodyMat.current.opacity = a
    if (faceMat.current) faceMat.current.opacity = a
    g.userData.facing = facing
    if (facing > 0.9) orb.front = index
  })

  const front = () => (ref.current?.userData.facing ?? 0) > 0.1
  return (
    <group ref={ref} position={t.n.clone().multiplyScalar(R)} quaternion={t.q}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { if (touch || !front()) return; e.stopPropagation(); onHover(index); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { if (touch) return; onHover(null); document.body.style.cursor = '' }}
      onClick={(e: ThreeEvent<MouseEvent>) => { if (!front()) return; e.stopPropagation(); onPick(index) }}
    >
      <mesh geometry={geo}>
        <meshStandardMaterial ref={bodyMat} color={COLORS[t.kind].body} roughness={0.5} transparent />
      </mesh>
      <mesh position={[0, 0, slabFront(TD)]}>
        <planeGeometry args={[TW, TH]} />
        <meshBasicMaterial ref={faceMat} map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

function Orb({ tiles, active, setHover, pick, still, touch }: {
  tiles: Tile[]; active: number; still: boolean; touch: boolean
  setHover: (i: number | null) => void; pick: (i: number) => void
}) {
  const g = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const fit = Math.min(1, (viewport.width * 0.96) / (2 * R + TW), (viewport.height * 0.92) / (2 * R + TH))

  useFrame((_, dt) => {
    orb.time += dt
    const grp = g.current
    if (!grp) return
    const spin = still ? 0 : orb.time * 0.12
    const ty = spin + orb.p * Math.PI * 1.4 + orb.mx * 0.5
    const tx = 0.18 + orb.my * 0.25
    const k = 1 - Math.pow(0.02, dt)
    grp.rotation.y += (ty - grp.rotation.y) * k
    grp.rotation.x += (tx - grp.rotation.x) * k
  })

  return (
    <group ref={g} scale={fit}>
      {tiles.map((t, i) => (
        <TileMesh key={t.title} t={t} index={i} active={i === active} touch={touch} onHover={setHover} onPick={pick} />
      ))}
    </group>
  )
}

export default function SkillsOrb() {
  const wrap = useRef<HTMLDivElement>(null)
  const t = useT()
  const tiles = useMemo(() => buildTiles(t), [t])
  const [ok] = useState(webglOK)
  const [visible, setVisible] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const [picked, setPicked] = useState(0)
  const [auto, setAuto] = useState(true) // auto-highlight until the user interacts
  const still = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const touch = useMemo(() => matchMedia('(pointer: coarse)').matches, [])
  const mobile = useMemo(() => matchMedia('(max-width: 860px)').matches || touch, [touch])

  const active = hover ?? picked
  const tile = tiles[active]

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      orb.p = (window.innerHeight - r.top) / (window.innerHeight + r.height) // 0 → 1 while the orb crosses the screen
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || still) return
      const r = el.getBoundingClientRect()
      orb.mx = THREE.MathUtils.clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5)
      orb.my = THREE.MathUtils.clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onMove) }
  }, [still])

  // gently highlight whichever tile is facing the viewer, until the user takes over
  useEffect(() => {
    if (!auto || still || !visible) return
    const id = setInterval(() => setPicked(orb.front), 2600)
    return () => clearInterval(id)
  }, [auto, still, visible])

  if (!ok) return null

  const pick = (i: number) => { setAuto(false); setPicked(i) }

  return (
    <div className="skills-orb">
      <div ref={wrap} className="skills-orb-stage" aria-hidden="true">
        <Canvas
          flat
          dpr={[1, mobile ? 1.5 : 2]}
          gl={{ antialias: !mobile, alpha: true }}
          camera={{ position: [0, 0, 11], fov: 35 }}
          frameloop={visible ? (still ? 'demand' : 'always') : 'never'}
          onPointerMissed={() => setHover(null)}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[3, 5, 6]} intensity={1.5} />
          <Orb tiles={tiles} active={active} setHover={i => { setHover(i); if (i !== null) setAuto(false) }} pick={pick} still={still} touch={touch} />
        </Canvas>
      </div>
      <div className="skills-orb-caption" aria-live="polite">
        <span className={`skills-orb-kind ${tile.kind}`}>{tile.kind === 'hard' ? t('Hard skill') : t('Soft skill')}</span>
        <p className="skills-orb-title">{tile.title}</p>
        <p className="skills-orb-desc">{tile.desc}</p>
        <p className="skills-orb-hint">{touch ? t('Tap a skill on the sphere') : t('Hover or click a skill on the sphere')}</p>
      </div>
    </div>
  )
}
