// rendering/primitives/text.ts
import type { Vec2 } from '../../chapter-loader/types'
import { FONT, hexA } from './canvas-utils'

export function drawName(
  ctx: CanvasRenderingContext2D,
  p: Vec2,
  name: string,
  color: string,
  active: boolean,
  dy = 26,
  fontSize = 15,
) {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = active ? '#ffffff' : hexA('#aab4d0', 0.55)
  ctx.font = `700 ${fontSize}px ${FONT}`
  if (active) {
    ctx.shadowColor = color
    ctx.shadowBlur = 10
  }
  ctx.fillText(name, p.x, p.y + dy)
  ctx.restore()
}
