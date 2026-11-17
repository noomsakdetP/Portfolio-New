import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { roundRect } from './shapes'

export type Kind = 'color' | 'type' | 'space' | 'radius' | 'button' | 'toggle' | 'input'
export type Token = {
  id: string
  kind: Kind
  w: number // in "u" (layout unit)
  h: number
  body: string // colour of the 3D body
  label?: string
  sub?: string
  scatter: [number, number, number] // normalised position (-1..1 of half-viewport) + z
  tilt: [number, number, number]
  slot: [number, number] // [col,row] in the assembled 3×3 grid
  mobile: boolean // show on mobile?
}

export const C = {
  yellow: '#EAB308',
  dark: '#1B1C19',
  cream: '#FAF9F4',
  deep: '#251A00',
  border: '#D3C5AC',
  muted: '#555F6F',
  white: '#FFFFFF',
}

export const TOKENS: Token[] = [
  { id: 'yellow', kind: 'color', w: 1.15, h: 1.15, body: C.yellow, label: 'yellow/500', sub: '#EAB308', scatter: [-0.86, 0.58, 0.6], tilt: [0.25, 0.45, -0.18], slot: [0, 0], mobile: true },
  { id: 'dark', kind: 'color', w: 1.15, h: 1.15, body: C.dark, label: 'dark/900', sub: '#1B1C19', scatter: [0.88, 0.74, 0.2], tilt: [-0.2, -0.5, 0.15], slot: [1, 0], mobile: true },
  { id: 'cream', kind: 'color', w: 1.15, h: 1.15, body: C.cream, label: 'cream/50', sub: '#FAF9F4', scatter: [0.94, -0.1, 0.9], tilt: [0.1, -0.6, 0.2], slot: [2, 0], mobile: false },
  { id: 'type', kind: 'type', w: 1.15, h: 1.15, body: C.white, label: 'Aa', sub: 'Heading / 64', scatter: [-0.93, -0.08, 1.0], tilt: [-0.15, 0.55, 0.1], slot: [0, 1], mobile: true },
  { id: 'space', kind: 'space', w: 1.15, h: 1.15, body: C.white, label: 'space', sub: '8 · 16 · 24', scatter: [0.8, -0.72, 0.4], tilt: [0.3, -0.35, -0.12], slot: [1, 1], mobile: false },
  { id: 'radius', kind: 'radius', w: 1.15, h: 1.15, body: C.white, label: 'radius', sub: '8px', scatter: [-0.35, 0.92, 0.1], tilt: [0.35, 0.2, 0.2], slot: [2, 1], mobile: false },
  { id: 'button', kind: 'button', w: 1.9, h: 0.72, body: C.yellow, label: 'SAY HI', scatter: [-0.72, -0.72, 1.2], tilt: [-0.25, 0.4, 0.12], slot: [0, 2], mobile: true },
  { id: 'toggle', kind: 'toggle', w: 1.3, h: 0.72, body: C.white, scatter: [0.4, 0.95, 0.7], tilt: [0.3, -0.3, -0.2], slot: [1, 2], mobile: true },
  { id: 'input', kind: 'input', w: 2.2, h: 0.72, body: C.white, label: 'hello@you.com', scatter: [0.1, -0.95, 0.8], tilt: [-0.3, -0.25, 0.08], slot: [2, 2], mobile: true },
]

/* ---------- canvas textures (the "face" of each token) ---------- */
export function drawFace(t: Token, cv: HTMLCanvasElement) {
  const x = cv.getContext('2d')!
  const W = cv.width, H = cv.height, s = W / 256 // scale helper
  const r = Math.min(W, H) * (t.kind === 'button' || t.kind === 'input' || t.kind === 'toggle' ? 0.5 : 0.16)
  x.clearRect(0, 0, W, H)
  x.save()
  roundRect(x, W, H, r)
  x.clip()
  x.fillStyle = t.body
  x.fillRect(0, 0, W, H)
  const ink = t.body === C.dark ? C.cream : C.dark
  x.fillStyle = ink
  x.textBaseline = 'alphabetic'

  switch (t.kind) {
    case 'color': {
      x.font = `700 ${22 * s}px "Space Grotesk", sans-serif`
      x.fillText(t.label!, 22 * s, H - 46 * s)
      x.globalAlpha = 0.65
      x.font = `500 ${18 * s}px Inter, sans-serif`
      x.fillText(t.sub!, 22 * s, H - 20 * s)
      break
    }
    case 'type': {
      x.font = `italic 700 ${118 * s}px "Hanken Grotesk", sans-serif`
      x.fillStyle = '#785A00'
      x.fillText('Aa', 22 * s, 140 * s)
      x.fillStyle = C.muted
      x.font = `500 ${18 * s}px Inter, sans-serif`
      x.fillText(t.sub!, 22 * s, H - 20 * s)
      break
    }
    case 'space': {
      x.fillStyle = C.yellow
      ;[8, 16, 24].forEach((v, i) => x.fillRect(22 * s, (40 + i * 44) * s, v * 6 * s, 26 * s))
      x.fillStyle = C.muted
      x.font = `500 ${18 * s}px Inter, sans-serif`
      x.fillText(t.sub!, 22 * s, H - 20 * s)
      break
    }
    case 'radius': {
      x.strokeStyle = C.dark
      x.lineWidth = 6 * s
      x.beginPath(); x.moveTo(40 * s, 170 * s); x.lineTo(40 * s, 90 * s); x.arcTo(40 * s, 40 * s, 90 * s, 40 * s, 50 * s); x.lineTo(170 * s, 40 * s); x.stroke()
      x.fillStyle = C.muted
      x.font = `500 ${18 * s}px Inter, sans-serif`
      x.fillText(`${t.label} · ${t.sub}`, 22 * s, H - 20 * s)
      break
    }
    case 'button': {
      x.fillStyle = C.deep
      x.font = `700 ${34 * s}px "Space Grotesk", sans-serif`
      x.textAlign = 'center'
      x.textBaseline = 'middle'
      x.fillText(t.label!, W / 2, H / 2 + 2 * s)
      break
    }
    case 'toggle': {
      const th = H * 0.5, tw = th * 1.8, tx = (W - tw) / 2, ty = (H - th) / 2
      x.fillStyle = C.yellow
      x.save(); x.translate(tx, ty); roundRect(x, tw, th, th / 2); x.fill(); x.restore()
      x.fillStyle = C.white
      x.beginPath(); x.arc(tx + tw - th / 2, H / 2, th * 0.38, 0, Math.PI * 2); x.fill()
      break
    }
    case 'input': {
      x.strokeStyle = C.border
      x.lineWidth = 6 * s
      x.save(); x.translate(3 * s, 3 * s); roundRect(x, W - 6 * s, H - 6 * s, r - 3 * s); x.stroke(); x.restore()
      x.fillStyle = '#9AA1AC'
      x.font = `400 ${24 * s}px Inter, sans-serif`
      x.textBaseline = 'middle'
      x.fillText(t.label!, 34 * s, H / 2)
      x.fillStyle = C.dark
      x.fillRect(W - 60 * s, H / 2 - 16 * s, 3 * s, 32 * s)
      break
    }
  }
  x.restore()
}

export function useFaceTexture(t: Token) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas')
    cv.width = 512
    cv.height = Math.round((512 * t.h) / t.w)
    drawFace(t, cv)
    const tx = new THREE.CanvasTexture(cv)
    tx.colorSpace = THREE.SRGBColorSpace
    tx.anisotropy = 4
    return tx
  }, [t])
  // redraw once the web fonts are ready (canvas can't use them before)
  useEffect(() => {
    let alive = true
    document.fonts?.ready.then(() => {
      if (!alive) return
      drawFace(t, tex.image as HTMLCanvasElement)
      tex.needsUpdate = true
    })
    return () => { alive = false; tex.dispose() }
  }, [t, tex])
  return tex
}

