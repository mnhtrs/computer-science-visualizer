// rendering/parts/infrastructure-renderer.ts
// Scene infrastructure: desktop case, external cable, system bus rail.
// Geometry now comes from the chapter's SceneDescription.infrastructure entries
// — this renderer no longer imports Chapter 1.

import { FONT, hexA, rrPath } from '../primitives/canvas-utils'
import type { InfrastructureDescription } from '../../chapter-loader/types'

/** Draw all infrastructure entries of the given kind for a scene. */
export function drawInfrastructure(
  ctx: CanvasRenderingContext2D,
  items: InfrastructureDescription[],
  active: boolean,
  t: number,
) {
  for (const it of items) {
    if (it.kind === 'case') drawCase(ctx, it)
    else if (it.kind === 'cable') drawCable(ctx, it, active)
    else if (it.kind === 'bus-rail') drawBusRail(ctx, it, active, t)
    else if (it.kind === 'zone-divider') drawZoneDivider(ctx, it)
    // unknown infra kinds are ignored (a future chapter ships its own renderer)
  }
}

function drawCase(ctx: CanvasRenderingContext2D, it: InfrastructureDescription) {
  const r = it.rect
  if (!r) return
  const rad = 30
  ctx.save()
  rrPath(ctx, r.x, r.y, r.w, r.h, rad)
  ctx.fillStyle = 'rgba(20,26,54,0.5)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(150,170,255,0.16)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = 'rgba(170,180,224,0.5)'
  ctx.font = `600 13px ${FONT}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('Desktop', r.x + 18, r.y + 14)
  ctx.restore()
}

function drawCable(
  ctx: CanvasRenderingContext2D,
  it: InfrastructureDescription,
  active: boolean,
) {
  const pts = it.points
  if (!pts || pts.length < 2) return
  // color is inferred from the bus color, passed via `extra.busColor`
  const color = (it as InfrastructureDescription & { color?: string }).color ?? '#6b8cff'
  ctx.save()
  ctx.strokeStyle = hexA(color, active ? 0.9 : 0.3)
  ctx.lineWidth = active ? 6 : 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  ctx.lineTo(pts[1].x, pts[1].y)
  ctx.stroke()
  ctx.restore()
}

// v1.3.13 (F61, owner round 13): a hairline marking a conceptual boundary
// (Chapter 02 uses it for the CPU/GPU silicon split inside the engine hall —
// "phải có ranh giới giữa CPU và GPU chứ gộp lại dễ hiểu nhầm"). Chapter 01
// ships no zone-divider items; the kind is ignored anywhere else anyway.
function drawZoneDivider(ctx: CanvasRenderingContext2D, it: InfrastructureDescription) {
  const pts = it.points
  if (!pts || pts.length < 2) return
  ctx.save()
  ctx.strokeStyle = 'rgba(226,232,240,0.25)'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  ctx.lineTo(pts[1].x, pts[1].y)
  ctx.stroke()
  ctx.setLineDash([])
  const label = (it as InfrastructureDescription & { label?: string }).label
  if (label) {
    ctx.fillStyle = 'rgba(226,232,240,0.45)'
    ctx.font = `600 12px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(label, (pts[0].x + pts[1].x) / 2, pts[1].y + 16)
  }
  ctx.restore()
}

function drawBusRail(
  ctx: CanvasRenderingContext2D,
  it: InfrastructureDescription,
  active: boolean,
  t: number,
) {
  const pts = it.points
  if (!pts || pts.length < 2) return
  const color = (it as InfrastructureDescription & { color?: string }).color ?? '#6b8cff'
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (active) {
    ctx.shadowColor = color
    ctx.shadowBlur = 18
  }
  ctx.strokeStyle = hexA(color, active ? 0.95 : 0.26)
  ctx.lineWidth = active ? 7 : 5
  if (active) {
    ctx.setLineDash([2, 16])
    ctx.lineDashOffset = -t * 0.06
  }
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.restore()
}
