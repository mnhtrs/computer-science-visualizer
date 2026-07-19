// rendering/parts/storage-renderer.ts
// Long-term storage (SSD). Entity-driven: position/color/name come from the
// passed entity, so this renderer is reusable by any chapter that ships a
// storage-like entity with kind 'ssd'.

import type { EntityRenderer } from '../types'
import { hexA, rrPath } from '../primitives/canvas-utils'
import { glow } from '../primitives/glow'
import { drawName } from '../primitives/text'

export const drawSSD: EntityRenderer = (ctx, s, e, active) => {
  const t = s.t
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.5
  if (active) glow(ctx, e.pos, e.color, 90, 0.4 + 0.1 * Math.sin(t * 0.005))
  const x = e.pos.x - 26
  const y = e.pos.y - 14
  rrPath(ctx, x, y, 52, 28, 6)
  ctx.fillStyle = hexA(e.color, active ? 0.22 : 0.12)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.95 : 0.5)
  ctx.lineWidth = 2
  ctx.stroke()
  for (const cx of [x + 12, x + 30]) {
    rrPath(ctx, cx, y + 7, 10, 14, 2)
    ctx.fillStyle = hexA(e.color, active ? 0.9 : 0.5)
    ctx.fill()
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active)
}
