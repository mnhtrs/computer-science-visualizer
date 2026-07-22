// shared/geometry.ts
// Pure geometry utilities shared across all layers. No canvas dependency.
// Moved from rendering/primitives/canvas-utils.ts to eliminate Engine → Rendering dependency.

import type { Vec2 } from './types'
import { clamp, lerp } from './math'

/** Position along a polyline at parameter t in [0,1] (by segment length). */
export function polylinePoint(pts: Vec2[], t: number): Vec2 {
  if (pts.length === 0) return { x: 0, y: 0 }
  if (pts.length < 2) return pts[0]
  const segs: number[] = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y)
    segs.push(d)
    total += d
  }
  if (total === 0) return pts[0]
  let dist = clamp(t, 0, 1) * total
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i] || i === segs.length - 1) {
      const f = segs[i] === 0 ? 0 : dist / segs[i]
      return { x: lerp(pts[i].x, pts[i + 1].x, f), y: lerp(pts[i].y, pts[i + 1].y, f) }
    }
    dist -= segs[i]
  }
  return pts[pts.length - 1]
}

/** Camera fit: zoom + origin so a bounding box fills the viewport with padding. */
export function fit(
  bbox: { minX: number; maxX: number; minY: number; maxY: number },
  W: number,
  H: number,
  pad: number,
) {
  const bw = bbox.maxX - bbox.minX
  const bh = bbox.maxY - bbox.minY
  const zoom = Math.min(W / bw, H / bh) * pad
  const ox = (W - bw * zoom) / 2 - bbox.minX * zoom
  const oy = (H - bh * zoom) / 2 - bbox.minY * zoom
  return { zoom, ox, oy }
}

/** Convert a hex color + alpha into an rgba() string. */
export function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}
