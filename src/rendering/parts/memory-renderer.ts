// rendering/parts/memory-renderer.ts
// RAM (entity-driven, generic) + Registers panel (CPU-specific, contract-driven).

import type { EntityRenderer, PresentationState, Renderable } from '../types'
import type { Chapter } from '../../chapter-loader/types'
import { FONT, hexA, rrPath } from '../primitives/canvas-utils'
import { glow } from '../primitives/glow'
import { drawName } from '../primitives/text'

// ---- RAM (generic) -------------------------------------------------------
export const drawRAM: EntityRenderer = (ctx, s, e, active) => {
  const t = s.t
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.5
  if (active) glow(ctx, e.pos, e.color, 90, 0.4 + 0.1 * Math.sin(t * 0.005))
  const x = e.pos.x - 30
  const y = e.pos.y - 14
  rrPath(ctx, x, y, 60, 28, 6)
  ctx.fillStyle = hexA(e.color, active ? 0.22 : 0.12)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.95 : 0.5)
  ctx.lineWidth = 2
  ctx.stroke()
  for (let i = 0; i < 4; i++) {
    rrPath(ctx, x + 8 + i * 12, y + 7, 7, 14, 2)
    ctx.fillStyle = hexA(e.color, active ? 0.9 : 0.5)
    ctx.fill()
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active)
}

// ---- Registers (CPU-specific, contract-driven) ---------------------------
export function drawRegistersBox(
  ctx: CanvasRenderingContext2D,
  s: PresentationState,
  t: number,
  e: Renderable,
  chapter: Chapter,
) {
  const prog = chapter.program
  if (!prog) return
  const ins = prog.instructions[s.execInstrIdx]
  if (!ins) return
  const regNames = prog.registerNames
  const wb = s.execStage === 'writeback'
  const w = 360
  const h = 64
  ctx.save()
  glow(ctx, e.pos, e.color, 80, wb ? 0.35 + 0.12 * Math.sin(t * 0.01) : 0.14)
  rrPath(ctx, e.pos.x - w / 2, e.pos.y - h / 2, w, h, 12)
  ctx.fillStyle = hexA(e.color, 0.16)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, 0.9)
  ctx.lineWidth = 2.5
  ctx.stroke()
  const n = regNames.length
  const sw = 72
  const gap = 10
  const totalW = n * sw + (n - 1) * gap
  const x0 = e.pos.x - totalW / 2
  regNames.forEach((nm, i) => {
    const cx = x0 + i * (sw + gap)
    const val = s.execRegs[i]
    const isDst = wb && ins.dst === i
    rrPath(ctx, cx, e.pos.y - 20, sw, 40, 8)
    ctx.fillStyle = isDst ? hexA('#ffffff', 0.95) : hexA(e.color, 0.12)
    ctx.fill()
    ctx.strokeStyle = isDst ? '#fff' : hexA(e.color, 0.7)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = isDst ? '#0a0f24' : hexA('#aab4d0', 0.9)
    ctx.font = `700 9px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(nm, cx + sw / 2, e.pos.y - 9)
    ctx.fillStyle = isDst ? '#0a0f24' : '#fff'
    ctx.font = `700 17px ${FONT}`
    ctx.fillText(val === null || val === undefined ? '\u00B7' : String(val), cx + sw / 2, e.pos.y + 9)
  })
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, true, h / 2 + 8)
}
