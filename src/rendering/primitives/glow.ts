// rendering/primitives/glow.ts
import type { Vec2 } from '../../chapter-loader/types'
import { TAU } from './math'
import { hexA } from './canvas-utils'

export function glow(
  ctx: CanvasRenderingContext2D,
  p: Vec2,
  color: string,
  r: number,
  a: number,
) {
  const g = ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, r)
  g.addColorStop(0, hexA(color, a))
  g.addColorStop(1, hexA(color, 0))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, TAU)
  ctx.fill()
}
