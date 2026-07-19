// rendering/parts/die-renderer.ts
// The CPU die. Geometry comes from the chapter's SceneDescription — this file
// no longer imports Chapter 1.

import { hexA } from '../primitives/canvas-utils'
import type { Vec2, InfrastructureDescription } from '../../chapter-loader/types'

export interface DieGeometry {
  rect: { x: number; y: number; w: number; h: number }
  internalRail?: [Vec2, Vec2]
  cpuColor: string
}

export function drawDie(ctx: CanvasRenderingContext2D, geo: DieGeometry) {
  const { rect: DIE, internalRail, cpuColor } = geo
  ctx.save()
  ctx.fillStyle = hexA(cpuColor, 0.25)
  const pn = 13
  for (let i = 0; i < pn; i++) {
    const fx = DIE.x + 24 + (i / (pn - 1)) * (DIE.w - 48)
    ctx.fillRect(fx - 2, DIE.y - 12, 4, 12)
    ctx.fillRect(fx - 2, DIE.y + DIE.h, 4, 12)
  }
  for (let i = 0; i < 11; i++) {
    const fy = DIE.y + 24 + (i / 10) * (DIE.h - 48)
    ctx.fillRect(DIE.x - 12, fy - 2, 12, 4)
    ctx.fillRect(DIE.x + DIE.w, fy - 2, 12, 4)
  }
  if (internalRail) {
    ctx.strokeStyle = hexA(cpuColor, 0.2)
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(internalRail[0].x, internalRail[0].y)
    ctx.lineTo(internalRail[1].x, internalRail[1].y)
    ctx.stroke()
  }
  const r = 26
  ctx.beginPath()
  ctx.moveTo(DIE.x + r, DIE.y)
  ctx.arcTo(DIE.x + DIE.w, DIE.y, DIE.x + DIE.w, DIE.y + DIE.h, r)
  ctx.arcTo(DIE.x + DIE.w, DIE.y + DIE.h, DIE.x, DIE.y + DIE.h, r)
  ctx.arcTo(DIE.x, DIE.y + DIE.h, DIE.x, DIE.y, r)
  ctx.arcTo(DIE.x, DIE.y, DIE.x + DIE.w, DIE.y, r)
  ctx.closePath()
  ctx.fillStyle = 'rgba(24,30,58,0.7)'
  ctx.fill()
  ctx.strokeStyle = hexA(cpuColor, 0.5)
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.restore()
}

// helper: extract DieGeometry from a scene's infrastructure entries
export function dieGeometryFrom(
  items: InfrastructureDescription[] | undefined,
  cpuColor: string,
): DieGeometry | null {
  if (!items) return null
  const die = items.find((i) => i.kind === 'die' && i.rect)
  if (!die || !die.rect) return null
  const rail = items.find((i) => i.kind === 'die-internal-rail' && i.points && i.points.length >= 2)
  return {
    rect: die.rect,
    internalRail: rail && rail.points ? [rail.points[0], rail.points[1]] : undefined,
    cpuColor,
  }
}
