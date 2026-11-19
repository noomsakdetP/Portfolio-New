/**
 * ProjectGallery — the /projects page as a 3D walk-through.
 *
 * Project banners hang in a dark gallery, alternating left/right along a path into the scene.
 * Scrolling the (tall) section moves the camera from one project to the next; the sticky
 * stage stays on screen while you scroll. Native scroll only — nothing is hijacked.
 *
 * - The current project's details + a real <Link> are HTML (keyboard / screen-reader friendly).
 * - Click (or tap) a banner to open its case study. Side ticks jump to a project.
 * - Desktop: banners tilt toward the mouse. Mobile: tighter path, lower DPR.
 * - Stops rendering when the section is off-screen. Reduced motion: no easing / floating.
 */
import { Canvas, useFrame, useLoader, type ThreeEvent } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { webglOK } from './three/shapes'
import { translate, useLang, useT, type Lang } from '../i18n/lang'
import { MUSEUM } from '../theme/museum'

export type GalleryProject = { id: string; title: string; image: string; roles: string[]; desc: string }

const PW = 3.2, PH = 2 // panel size (16:10)
const D = 7 // distance between projects along the path (must be > camera distance, so passed panels end up behind the camera)

// shared per-frame state (outside React: changes every frame)
const g = { p: 0, mx: 0, my: 0, time: 0 }
const LOOK = new THREE.Vector3()

function panelX(i: number, mobile: boolean) { return (i % 2 === 0 ? -1 : 1) * (mobile ? 0.35 : 1.25) }

/** rounded-rect panel geometry with 0..1 UVs */
function panelGeometry(w: number, h: number, r: number) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
  const geo = new THREE.ShapeGeometry(s, 12)
  const pos = geo.attributes.position, uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h)
  return geo
}

/** a title card for projects that have no banner image yet */
function placeholderTexture(title: string, comingSoon: string) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 640
  const x = c.getContext('2d')!
  x.fillStyle = MUSEUM.bgAccent; x.fillRect(0, 0, 1024, 640)
  x.fillStyle = MUSEUM.textOnAccent; x.font = '700 76px "Hanken Grotesk", sans-serif'
  const words = title.split(' '); let line = '', y = 300
  for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > 860) { x.fillText(line, 80, y); line = w; y += 90 } else line = t }
  x.fillText(line, 80, y)
  x.font = '700 28px "Space Grotesk", "IBM Plex Sans Thai", sans-serif'; x.fillText(comingSoon, 80, 540)
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** colour space, sharpness and object-fit: cover for a panel texture */
function prepare(t: THREE.Texture) {
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  cover(t)
  return t
}

/** object-fit: cover for a texture on a PW×PH panel */
function cover(tex: THREE.Texture) {
  const img = tex.image as { width: number; height: number } | undefined
  if (!img?.width) return
  const ia = img.width / img.height, pa = PW / PH
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  if (ia > pa) { tex.repeat.set(pa / ia, 1); tex.offset.set((1 - pa / ia) / 2, 0) }
  else { tex.repeat.set(1, ia / pa); tex.offset.set(0, 1 - ia / pa) } // keep the top of tall images
  tex.needsUpdate = true
}

function Panel({ p, i, tex, active, mobile, still, onOpen }: {
  p: GalleryProject; i: number; tex: THREE.Texture; active: number; mobile: boolean; still: boolean; onOpen: (id: string) => void
}) {
  const ref = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const geo = useMemo(() => panelGeometry(PW, PH, 0.12), [])
  const frame = useMemo(() => panelGeometry(PW + 0.08, PH + 0.08, 0.15), [])
  const [hover, setHover] = useState(false)
  const x = panelX(i, mobile), side = Math.sign(x)

  useEffect(() => () => { geo.dispose(); frame.dispose() }, [geo, frame])

  useFrame((_, dt) => {
    const grp = ref.current
    if (!grp) return
    const isActive = i === active
    const k = still ? 1 : 1 - Math.pow(0.002, dt)
    const base = mobile ? 0.8 : 1
    const s = grp.scale.x + (base * (isActive ? 1 : 0.82) * (hover ? 1.04 : 1) - grp.scale.x) * k
    grp.scale.setScalar(s)
    const turn = isActive ? -side * 0.12 + g.mx * 0.25 : -side * (mobile ? 0.25 : 0.55)
    grp.rotation.y += (turn - grp.rotation.y) * k
    grp.rotation.x += ((isActive ? -g.my * 0.15 : 0) - grp.rotation.x) * k
    grp.position.y = still ? 0 : Math.sin(g.time * 0.6 + i) * 0.05
    // passed projects fade away; upcoming ones stay dim until they arrive
    if (mat.current) { const o = isActive ? 1 : i < active ? 0 : 0.45; mat.current.opacity += (o - mat.current.opacity) * k }
    grp.visible = !(i < active && (mat.current?.opacity ?? 1) < 0.02)
  })

  return (
    <group position={[x, 0, -i * D]}>
      <group ref={ref}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onOpen(p.id) }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}
      >
        <mesh geometry={frame} position={[0, 0, -0.02]}>
          <meshBasicMaterial color={i === active ? MUSEUM.bgAccent : MUSEUM.bgInverseRaised} toneMapped={false} />
        </mesh>
        <mesh geometry={geo}>
          <meshBasicMaterial ref={mat} map={tex} transparent opacity={0.45} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Scene({ projects, active, mobile, still, onOpen, lang }: {
  projects: GalleryProject[]; active: number; mobile: boolean; still: boolean; onOpen: (id: string) => void; lang: Lang
}) {
  const withImg = projects.filter(p => p.image)
  const loaded = useLoader(THREE.TextureLoader, withImg.map(p => p.image))
  const textures = useMemo(() => {
    let n = 0
    return projects.map(p => {
      return prepare(p.image ? loaded[n++] : placeholderTexture(p.title, translate(lang, 'CASE STUDY: COMING SOON')))
    })
  }, [projects, loaded, lang])

  useFrame((state, dt) => {
    const camera = state.camera
    g.time += dt
    const s = g.p * (projects.length - 1)
    const i0 = Math.floor(s), f = s - i0, i1 = Math.min(projects.length - 1, i0 + 1)
    const e = f * f * (3 - 2 * f)
    // desktop: the current panel sits right of centre, leaving room for the text on the left
    const tx = THREE.MathUtils.lerp(panelX(i0, mobile), panelX(i1, mobile), e) - (mobile ? 0 : 1.05)
    const tz = -s * D + (mobile ? 6 : 5.4)
    const k = still ? 1 : 1 - Math.pow(0.0008, dt)
    camera.position.x += (tx + g.mx * 0.3 - camera.position.x) * k
    camera.position.y += (0.1 - g.my * 0.2 - camera.position.y) * k
    camera.position.z += (tz - camera.position.z) * k
    LOOK.set(camera.position.x, 0, camera.position.z - 6)
    camera.lookAt(LOOK)
  })

  return (
    <>
      <fog attach="fog" args={[MUSEUM.bgInverse, 5, 22]} />
      {projects.map((p, i) => (
        <Panel key={p.id} p={p} i={i} tex={textures[i]} active={active} mobile={mobile} still={still} onOpen={onOpen} />
      ))}
      {/* floor line for depth */}
      <gridHelper args={[60, 60, MUSEUM.borderStrong, MUSEUM.bgInverseRaised]} position={[0, -1.6, -D * (projects.length / 2)]} />
    </>
  )
}

export default function ProjectGallery({ projects }: { projects: GalleryProject[] }) {
  const section = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const t = useT()
  const { lang } = useLang()
  const [ok] = useState(webglOK)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(0)
  const still = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const mobile = useMemo(() => matchMedia('(max-width: 860px), (pointer: coarse)').matches, [])
  const N = projects.length

  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(el)
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)))
      g.p = p
      setActive(Math.round(p * (N - 1))) // React bails out when the value is unchanged
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || still) return
      g.mx = e.clientX / window.innerWidth - 0.5
      g.my = e.clientY / window.innerHeight - 0.5
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onMove) }
  }, [N, still])

  // jump to project i (user-initiated scroll)
  const goTo = (i: number) => {
    const el = section.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (i / (N - 1)) * (el.offsetHeight - window.innerHeight), behavior: still ? 'auto' : 'smooth' })
  }

  if (!ok) return null
  const p = projects[active]

  return (
    <section ref={section} className="gallery3d" style={{ height: `${N * (mobile ? 70 : 80) + 40}vh` }} aria-label={t('Project gallery')}>
      <div className="gallery3d-sticky">
        <div className="gallery3d-canvas" aria-hidden="true">
          <Canvas
            flat
            dpr={[1, mobile ? 1.5 : 2]}
            gl={{ antialias: !mobile, alpha: false }}
            camera={{ position: [0, 0, 6], fov: mobile ? 55 : 45 }}
            frameloop={visible ? 'always' : 'never'}
            onCreated={({ gl }) => gl.setClearColor(MUSEUM.bgInverse)}
          >
            <Suspense fallback={null}>
              <Scene projects={projects} active={active} mobile={mobile} still={still} lang={lang} onOpen={id => navigate(`/projects/${id}`)} />
            </Suspense>
          </Canvas>
        </div>

        <div className="gallery3d-info" key={p.id}>
          <p className="gallery3d-count">{String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</p>
          <div className="gallery3d-tags">{p.roles.map(r => <span key={r} className="detail-badge">{r}</span>)}</div>
          <h2 className="gallery3d-title">{p.title}</h2>
          <p className="gallery3d-desc">{p.desc}</p>
          <Link to={`/projects/${p.id}`} className="gallery3d-cta">{t('View Case Study →')}</Link>
        </div>

        <nav className="gallery3d-ticks" aria-label={t('Jump to project')}>
          {projects.map((q, i) => (
            <button key={q.id} className={i === active ? 'on' : ''} onClick={() => goTo(i)} aria-label={`${t('Go to')} ${q.title}`} aria-current={i === active} />
          ))}
        </nav>
        <p className="gallery3d-hint">{mobile ? t('Scroll to explore · tap a project') : t('Scroll to explore · click a project')}</p>
      </div>
    </section>
  )
}
