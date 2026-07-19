// rendering/parts/display-renderer.ts
// GPU (entity-driven) + Monitor. The Monitor reads its screen geometry from
// the entity's `extra` bag (rect + fileBtn + done label key), so this file no
// longer imports Chapter 1.

import type { EntityRenderer, PresentationState, Renderable } from '../types'
import type { LocalizedText } from '../../chapter-loader/types'
import { FONT, hexA, rrPath } from '../primitives/canvas-utils'
import { glow } from '../primitives/glow'
import { drawName } from '../primitives/text'
import { TAU } from '../primitives/math'

interface MonitorExtra {
  screen: { x: number; y: number; w: number; h: number }
  fileBtn: { x: number; y: number }
  doneLabel?: LocalizedText
}

function readMonitorExtra(e: Renderable): MonitorExtra | null {
  const ex = (e as Renderable & { extra?: Record<string, unknown> }).extra
  if (!ex) return null
  const screen = ex.screen as MonitorExtra['screen'] | undefined
  const fileBtn = ex.fileBtn as MonitorExtra['fileBtn'] | undefined
  if (!screen || !fileBtn) return null
  return { screen, fileBtn, doneLabel: ex.doneLabel as LocalizedText | undefined }
}

// ---- GPU (generic) -------------------------------------------------------
export const drawGPU: EntityRenderer = (ctx, s, e, active) => {
  const t = s.t
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.5
  if (active) glow(ctx, e.pos, e.color, 100, 0.4 + 0.12 * Math.sin(t * 0.006))
  const w = 104
  const h = 40
  const x = e.pos.x - w / 2
  const y = e.pos.y - h / 2
  rrPath(ctx, x, y, w, h, 8)
  ctx.fillStyle = hexA(e.color, active ? 0.22 : 0.12)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.95 : 0.5)
  ctx.lineWidth = 2
  ctx.stroke()
  const cols = 8
  const rows = 3
  const cw = 8
  const gap = 2
  const blockW = cols * cw + (cols - 1) * gap
  const blockH = rows * cw + (rows - 1) * gap
  const px = x + (w - blockW) / 2
  const py = y + (h - blockH) / 2
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = px + c * (cw + gap)
      const cy = py + r * (cw + gap)
      const lit = active ? 0.35 + 0.65 * Math.abs(Math.sin(t * 0.012 + c * 0.7 + r * 1.3)) : 0.4
      rrPath(ctx, cx, cy, cw, cw, 2)
      ctx.fillStyle = active ? hexA('#ffffff', lit) : hexA(e.color, 0.5)
      ctx.fill()
    }
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, 26)
}

// ---- Monitor (contract-driven via entity.extra) --------------------------
function drawFileWindow(
  ctx: CanvasRenderingContext2D,
  s: PresentationState,
  color: string,
  ex: MonitorExtra,
) {
  const SCREEN = ex.screen
  const FILE = ex.fileBtn
  const wx = SCREEN.x + 14
  const wy = SCREEN.y + 14
  const ww = SCREEN.w - 28
  const wh = SCREEN.h - 28
  ctx.save()
  rrPath(ctx, wx, wy, ww, wh, 10)
  ctx.fillStyle = 'rgba(16,22,48,0.92)'
  ctx.fill()
  ctx.strokeStyle = hexA(color, 0.5)
  ctx.lineWidth = 1.5
  ctx.stroke()
  rrPath(ctx, wx, wy, ww, 22, 10)
  ctx.fillStyle = hexA(color, 0.18)
  ctx.fill()
  const dy = wy + 11
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = ['#ff6b6b', '#ffd24a', '#34d399'][i]
    ctx.beginPath()
    ctx.arc(wx + 12 + i * 12, dy, 3.5, 0, TAU)
    ctx.fill()
  }
  const pulse = 0.18 + 0.14 * Math.sin(s.t * 0.005)
  const pg = ctx.createRadialGradient(FILE.x, FILE.y, 6, FILE.x, FILE.y, 60)
  pg.addColorStop(0, hexA('#ffffff', pulse))
  pg.addColorStop(1, hexA('#ffffff', 0))
  ctx.fillStyle = pg
  ctx.beginPath()
  ctx.arc(FILE.x, FILE.y, 60, 0, TAU)
  ctx.fill()
  const pw = 58
  const ph = 74
  const px = FILE.x - pw / 2
  const py = FILE.y - ph / 2 - 4
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(px + pw - 14, py)
  ctx.lineTo(px + pw, py + 14)
  ctx.lineTo(px + pw, py + ph)
  ctx.lineTo(px, py + ph)
  ctx.closePath()
  ctx.fillStyle = hexA('#eaf0ff', 0.95)
  ctx.fill()
  ctx.strokeStyle = hexA(color, 0.9)
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(px + pw - 14, py)
  ctx.lineTo(px + pw, py + 14)
  ctx.lineTo(px + pw - 14, py + 14)
  ctx.closePath()
  ctx.fillStyle = hexA('#aab4d0', 0.8)
  ctx.fill()
  ctx.fillStyle = hexA(color, 0.55)
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(px + 8, py + 26 + i * 9, pw - 16 - (i % 2) * 10, 4)
  }
  ctx.fillStyle = '#fff'
  ctx.font = `600 13px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('my_program', FILE.x, py + ph + 6)
  ctx.restore()
}

function drawMonitorSuccess(
  ctx: CanvasRenderingContext2D,
  s: PresentationState,
  e: Renderable,
  ex: MonitorExtra,
) {
  ctx.save()
  glow(ctx, { x: e.pos.x, y: e.pos.y - 6 }, '#4ade80', 90, 0.35 + 0.15 * Math.sin(s.t * 0.004))
  ctx.translate(e.pos.x, e.pos.y - 18)
  ctx.scale(1 + 0.04 * Math.sin(s.t * 0.005), 1 + 0.04 * Math.sin(s.t * 0.005))
  ctx.strokeStyle = '#86efac'
  ctx.shadowColor = '#4ade80'
  ctx.shadowBlur = 18
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(-22, 2)
  ctx.lineTo(-6, 18)
  ctx.lineTo(26, -18)
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#bbf7d0'
  ctx.font = `700 18px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(ex.doneLabel ? ex.doneLabel[s.lang] : 'Done', e.pos.x, e.pos.y + 30)
}

export const drawMonitor: EntityRenderer = (ctx, s, e, active) => {
  const ex = readMonitorExtra(e)
  if (!ex) return // a monitor entity without screen geometry can't render
  const SCREEN = ex.screen
  const waiting = s.phase === 'waiting'
  const showDone = s.programDone
  ctx.save()
  ctx.globalAlpha = active || waiting ? 1 : 0.6
  if (active) glow(ctx, e.pos, e.color, 120, 0.35 + 0.1 * Math.sin(s.t * 0.005))
  ctx.fillStyle = hexA(e.color, 0.5)
  ctx.beginPath()
  ctx.moveTo(e.pos.x - 22, SCREEN.y + SCREEN.h)
  ctx.lineTo(e.pos.x + 22, SCREEN.y + SCREEN.h)
  ctx.lineTo(e.pos.x + 14, SCREEN.y + SCREEN.h + 22)
  ctx.lineTo(e.pos.x - 14, SCREEN.y + SCREEN.h + 22)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(e.pos.x - 38, SCREEN.y + SCREEN.h + 20, 76, 6)
  rrPath(ctx, SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, 16)
  ctx.fillStyle = 'rgba(8,12,30,0.92)'
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active || waiting ? 0.9 : 0.5)
  ctx.lineWidth = 2.5
  ctx.stroke()
  if (waiting) drawFileWindow(ctx, s, e.color, ex)
  else if (showDone) drawMonitorSuccess(ctx, s, e, ex)
  else {
    ctx.fillStyle = hexA('#aab4e0', 0.6)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `600 14px ${FONT}`
    const dots = 1 + Math.floor((s.t / 300) % 3)
    ctx.fillText((s.lang === 'vi' ? 'Đang chạy' : 'Running') + '.'.repeat(dots), e.pos.x, e.pos.y)
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active || waiting, SCREEN.h / 2 + 38)
}
