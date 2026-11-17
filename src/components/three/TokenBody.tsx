import { useEffect, useMemo } from 'react'
import { roundedSlab, slabFront } from './shapes'
import { useFaceTexture, type Token } from './tokens'

/** A design token as a 3D object: rounded body + textured face. Size is in layout units (u). */
export default function TokenBody({ t, u }: { t: Token; u: number }) {
  const tex = useFaceTexture(t)
  const w = t.w * u, h = t.h * u, d = 0.16 * u
  const pill = t.kind === 'button' || t.kind === 'input' || t.kind === 'toggle'
  const r = Math.min(w, h) * (pill ? 0.46 : 0.16)
  const geo = useMemo(() => roundedSlab(w, h, r, d), [w, h, r, d])
  useEffect(() => () => geo.dispose(), [geo])
  return (
    <>
      <mesh geometry={geo}>
        <meshStandardMaterial color={t.body} roughness={0.55} metalness={0} />
      </mesh>
      <mesh position={[0, 0, slabFront(d)]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </>
  )
}
