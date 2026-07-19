// rendering/primitives/spark.ts
// The protagonist ("payload") + vignette is in background.ts.
// This draws the glowing spark and its trail. Scene-agnostic.

import type { Vec2 } from '../../chapter-loader/types'
import { TAU } from './math'
import { hexA } from './canvas-utils'

export function drawSpark(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  scale: number,
  trail: Vec2[],
) {
  if (scale <= 0.02 && trail.length === 0) return
  ctx.save()
  for (let i = 0; i < trail.length; i++) {
    const f = i / trail.length
    ctx.fillStyle = hexA('#ffd24a', scale * f * 0.45)
    ctx.beginPath()
    ctx.arc(trail[i].x, trail[i].y, (1.5 + f * 6) * scale, 0, TAU)
    ctx.fill()
  }
  if (scale > 0.02) {
    const R = 44 * scale
    const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, R)
    g.addColorStop(0, hexA('#fff3c0', 0.95 * scale))
    g.addColorStop(0.4, hexA('#ffcf5a', 0.55 * scale))
    g.addColorStop(1, hexA('#ffcf5a', 0))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, R, 0, TAU)
    ctx.fill()
    ctx.fillStyle = hexA('#fff6c8', scale)
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 8 * scale, 0, TAU)
    ctx.fill()
    ctx.fillStyle = hexA('#ffffff', scale)
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 4 * scale, 0, TAU)
    ctx.fill()
  }
  ctx.restore()
}
