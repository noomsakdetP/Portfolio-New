import * as THREE from 'three'

/** Rounded-rectangle path on a 2D canvas (used to draw token / tile faces). */
export function roundRect(x: CanvasRenderingContext2D, w: number, h: number, r: number) {
  x.beginPath()
  x.moveTo(r, 0); x.arcTo(w, 0, w, h, r); x.arcTo(w, h, 0, h, r); x.arcTo(0, h, 0, 0, r); x.arcTo(0, 0, w, 0, r)
  x.closePath()
}

/** A rounded, slightly bevelled slab centred on the origin (front face at +z). */
export function roundedSlab(w: number, h: number, r: number, d: number) {
  const s = new THREE.Shape()
  const x = -w / 2, y = -h / 2
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: d * 0.25, bevelSize: d * 0.25, bevelSegments: 3, curveSegments: 10 })
  g.translate(0, 0, -d / 2)
  return g
}

/** z offset of the slab's front face (depth/2 + bevel) — place face planes just in front of it. */
export const slabFront = (d: number) => d / 2 + d * 0.25 + 0.002

export function webglOK() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
