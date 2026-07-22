// rendering/primitives/canvas-utils.ts
// Canvas-specific utilities + re-exports from shared.
// Pure geometry (polylinePoint, fit, hexA) is re-exported from shared/geometry.ts.
// Canvas-specific utilities (rrPath, FONT) remain here.

export { polylinePoint, fit, hexA } from '../../shared/geometry'
export { clamp, lerp } from '../../shared/math'

export const FONT = "'Quicksand', system-ui, sans-serif"

/** Rounded-rectangle path. Canvas-specific. */
export function rrPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  if (w <= 0 || h <= 0) { ctx.beginPath(); return }
  const rad = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
  ctx.closePath()
}
