/**
 * The yarn through the collection, desktop (Figma 451:2817, wall coordinates 1440 x 3084);
 * source: design/figma-exports/projects/thread.svg. Paths verbatim.
 */
export const YARN_D = 'M60 31C169.5 132 315.5 132 425 62C602 204 838 204 1015 134C975 224 640 428.5 720 488.5C680 518.5 728 550.5 752 524.5C768 506.5 545 713 425 843C602 913 838 913 1015 771C975 861 640 1065.5 720 1125.5C680 1155.5 728 1187.5 752 1161.5C768 1143.5 545 1350 425 1480C602 1622 838 1622 1015 1552C975 1642 787.5 1810.5 867.5 1870.5C827.5 1900.5 875.5 1932.5 899.5 1906.5C915.5 1888.5 840 2059 720 2189'
/** One knot per work, in WORKS order: centred over each frame, 34px above its top. */
export const KNOTS: { x: number; y: number }[] = [
  { x: 425, y: 62 }, { x: 1015, y: 134 }, { x: 425, y: 843 }, { x: 1015, y: 771 },
  { x: 425, y: 1480 }, { x: 1015, y: 1552 }, { x: 720, y: 2189 },
]
export const YARN_TAIL_D = 'M720 2189C770 2129 830 2209 890 2139'
export const HEART_D = 'M894.881 2133.89C873.281 2119.49 876.881 2101.49 894.881 2112.29C912.881 2101.49 916.481 2119.49 894.881 2133.89Z'


/**
 * Flatten an "M x y C ... C ..." path (all the thread paths are absolute cubics) into a
 * polyline with each point's fraction of the total length. Pure maths, so it costs nothing
 * on the main thread (SVG getPointAtLength took ~2s for the desktop yarn).
 */
export function flattenCubicPath(d: string, perCurve = 48) {
  const n = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number)
  const xs = [n[0]], ys = [n[1]], len = [0]
  for (let i = 2; i + 5 < n.length; i += 6) {
    const x0 = xs[xs.length - 1], y0 = ys[ys.length - 1]
    const [x1, y1, x2, y2, x3, y3] = n.slice(i, i + 6)
    for (let s = 1; s <= perCurve; s++) {
      const t = s / perCurve, u = 1 - t
      const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3
      const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
      len.push(len[len.length - 1] + Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]))
      xs.push(x); ys.push(y)
    }
  }
  const total = len[len.length - 1] || 1
  return { xs, ys, frac: len.map((l) => l / total) }
}
