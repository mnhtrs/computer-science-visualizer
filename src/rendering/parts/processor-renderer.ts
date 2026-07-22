// rendering/parts/processor-renderer.ts
// The processor family: CPU chip (entity-driven, generic), Control Unit, ALU.
// The CPU-specific ones read the chapter contract (program/runtime), never the
// Chapter 1 barrel.

import type { EntityRenderer, PresentationState, Renderable } from '../types'
import type { ExecutionState } from '../../chapter-loader/types'
import { FONT, hexA, rrPath } from '../primitives/canvas-utils'
import { glow } from '../primitives/glow'
import { drawName } from '../primitives/text'
import { TAU } from '../primitives/math'

/** Safely extract ExecutionState from the generic executionState field. */
function getExec(s: PresentationState): ExecutionState | null {
  return (s.executionState as ExecutionState) ?? null
}

// ---- CPU chip (generic, entity-driven) -----------------------------------
export const drawCPUChip: EntityRenderer = (ctx, s, e, active) => {
  const t = s.t
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.5
  if (active) glow(ctx, e.pos, e.color, 110, 0.45 + 0.12 * Math.sin(t * 0.006))
  const sz = 52
  const x = e.pos.x - sz / 2
  const y = e.pos.y - sz / 2
  ctx.fillStyle = hexA(e.color, active ? 0.6 : 0.3)
  const pn = 5
  for (let i = 0; i < pn; i++) {
    const f = (i / (pn - 1)) * (sz - 18) - (sz - 18) / 2
    ctx.fillRect(e.pos.x + f - 2, y - 9, 4, 9)
    ctx.fillRect(e.pos.x + f - 2, y + sz, 4, 9)
    ctx.fillRect(x - 9, e.pos.y + f - 2, 9, 4)
    ctx.fillRect(x + sz, e.pos.y + f - 2, 9, 4)
  }
  rrPath(ctx, x, y, sz, sz, 10)
  ctx.fillStyle = hexA(e.color, active ? 0.2 : 0.1)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.95 : 0.5)
  ctx.lineWidth = 2
  ctx.stroke()
  const cr = 16
  const cg = ctx.createRadialGradient(e.pos.x, e.pos.y, 2, e.pos.x, e.pos.y, cr)
  const inten = active ? 1 : 0.4
  cg.addColorStop(0, hexA('#fff3c0', 0.95 * inten))
  cg.addColorStop(1, hexA(e.color, 0.1))
  rrPath(ctx, e.pos.x - cr, e.pos.y - cr, cr * 2, cr * 2, 6)
  ctx.fillStyle = cg
  ctx.fill()
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, 34)
}

// ---- Control Unit (contract-driven via entity.extra) ---------------------
export const drawControlUnit: EntityRenderer = (ctx, s, e, active) => {
  const t = s.t
  const ex = (e.extra ?? {}) as {
    instructions?: { text: string; kind: string; dst?: number; src?: number; imm?: number }[]
    registerNames?: string[]
  }
  const instructions = ex.instructions
  const registerNames = ex.registerNames
  if (!instructions || !registerNames) return
  const exec = getExec(s)
  if (!exec) return
  const ins = instructions[exec.instrIdx]
  if (!ins) return
  const decoding = exec.stage === 'decode'
  const w = 320
  const h = 58
  ctx.save()
  glow(ctx, e.pos, e.color, 90, decoding ? 0.4 + 0.15 * Math.sin(t * 0.01) : 0.18)
  rrPath(ctx, e.pos.x - w / 2, e.pos.y - h / 2, w, h, 12)
  ctx.fillStyle = hexA(e.color, 0.18)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, 0.9)
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.save()
  ctx.translate(e.pos.x - w / 2 + 36, e.pos.y)
  ctx.rotate(t * 0.003)
  ctx.strokeStyle = hexA(e.color, 0.9)
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(0, 0, 12, 0, TAU)
  ctx.stroke()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU
    ctx.beginPath()
    ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12)
    ctx.lineTo(Math.cos(a) * 18, Math.sin(a) * 18)
    ctx.stroke()
  }
  ctx.restore()
  ctx.fillStyle = '#fff'
  ctx.font = `700 15px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(ins.text, e.pos.x + 24, e.pos.y - 6)
  if (decoding || exec.stage === 'execute' || exec.stage === 'writeback') {
    const sp = decoding ? exec.stageProgress : 1
    const chips = [
      (ins as { text: string }).text.split(' ')[0],
      ins.dst !== undefined ? registerNames[ins.dst] : null,
      ins.src !== undefined ? registerNames[ins.src] : null,
      ins.imm !== undefined ? String(ins.imm) : null,
    ].filter((c): c is string => !!c)
    chips.forEach((c, i) => {
      const a = Math.max(0, Math.min(1, (sp - i * 0.2) / 0.2))
      if (a <= 0) return
      const cx = e.pos.x - w / 2 + 112 + i * 44
      ctx.save()
      ctx.globalAlpha = a
      rrPath(ctx, cx - 18, e.pos.y + 6, 36, 18, 5)
      ctx.fillStyle = hexA('#ffffff', 0.9)
      ctx.fill()
      ctx.fillStyle = '#0a0f24'
      ctx.font = `700 10px ${FONT}`
      ctx.fillText(c, cx, e.pos.y + 15)
      ctx.restore()
    })
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, true, h / 2 + 8)
}

// ---- ALU (contract-driven via entity.extra) ---------------------------------
export const drawALU: EntityRenderer = (ctx, s, e, active) => {
  const t = s.t
  const ex = (e.extra ?? {}) as {
    instructions?: { text: string; kind: string; op?: string; dst?: number; src?: number }[]
    stateAfter?: (k: number) => { regs: (number | null)[]; mem: number | null }
  }
  const instructions = ex.instructions
  const stateAfter = ex.stateAfter
  if (!instructions) return
  const exec = getExec(s)
  if (!exec) return
  const ins = instructions[exec.instrIdx]
  if (!ins) return
  const working = exec.stage === 'execute' && ins.kind === 'arith'
  const done = exec.stage === 'writeback' && ins.kind === 'arith'
  const tw = 260
  const bw = 150
  const h = 68
  ctx.save()
  if (working) glow(ctx, e.pos, e.color, 110, 0.4 + 0.15 * Math.sin(t * 0.012))
  else if (done) glow(ctx, e.pos, e.color, 90, 0.3)
  ctx.beginPath()
  ctx.moveTo(e.pos.x - tw / 2, e.pos.y - h / 2)
  ctx.lineTo(e.pos.x + tw / 2, e.pos.y - h / 2)
  ctx.lineTo(e.pos.x + bw / 2, e.pos.y + h / 2)
  ctx.lineTo(e.pos.x - bw / 2, e.pos.y + h / 2)
  ctx.closePath()
  ctx.fillStyle = hexA(e.color, working ? 0.28 : done ? 0.22 : 0.1)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, working || done ? 1 : 0.4)
  ctx.lineWidth = 2.5
  ctx.stroke()
  if (working) {
    ctx.save()
    ctx.translate(e.pos.x, e.pos.y - 2)
    ctx.rotate(t * 0.008)
    ctx.strokeStyle = hexA('#ffffff', 0.85)
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (let k = 0; k < 4; k++) {
      ctx.beginPath()
      ctx.arc(0, 0, 22, k * (TAU / 4) + 0.2, k * (TAU / 4) + TAU / 4 - 0.2)
      ctx.stroke()
    }
    ctx.restore()
    ctx.fillStyle = '#fff'
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 12
    ctx.font = `700 26px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(ins.op === '*' ? '\u00D7' : '+', e.pos.x, e.pos.y - 2)
    ctx.shadowBlur = 0
  } else if (done) {
    const next = stateAfter
      ? stateAfter(exec.instrIdx + 1)
      : { regs: [], mem: null }
    const r = ins.dst !== undefined ? next.regs[ins.dst] ?? 0 : 0
    ctx.fillStyle = '#fff3c0'
    ctx.shadowColor = '#ffd24a'
    ctx.shadowBlur = 14
    ctx.font = `700 26px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(r), e.pos.x, e.pos.y - 2)
    ctx.shadowBlur = 0
  } else {
    ctx.fillStyle = hexA(e.color, 0.5)
    ctx.font = `700 15px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(s.lang === 'vi' ? 'nghỉ' : 'idle', e.pos.x, e.pos.y - 2)
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, working || done, h / 2 + 8)
}
