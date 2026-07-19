// rendering/parts/hud-renderer.ts
// Stage tracker + program list — CPU-scene overlays. All geometry + program
// data now come from the chapter contract, never from the Chapter 1 barrel.

import type { PresentationState, Renderable } from '../types'
import type { Chapter, Vec2, BBox } from '../../chapter-loader/types'
import { FONT, hexA, rrPath } from '../primitives/canvas-utils'
import { glow } from '../primitives/glow'

export function drawStageTracker(
  ctx: CanvasRenderingContext2D,
  s: PresentationState,
  chapter: Chapter,
) {
  const prog = chapter.program
  if (!prog) return
  const sm = prog.stageModel
  const labels = sm.stages.map((st) => sm.labels[st][s.lang].toUpperCase())
  const pillH = 28
  const gap = 8
  const pad = 18
  // tracker top-centred on the CPU scene bbox
  const cpuScene = chapter.scenes.find((sc) => sc.id === 'cpu')
  const bbox: BBox | undefined = cpuScene?.bbox
  const trackerY = (cpuScene?.extra?.trackerY as number | undefined) ?? 56
  ctx.save()
  ctx.font = `700 11px ${FONT}`
  const widths = labels.map((lab) => ctx.measureText(lab).width + pad * 2)
  const totalW = widths.reduce((a, b) => a + b, 0) + (labels.length - 1) * gap
  const cx = bbox ? (bbox.minX + bbox.maxX) / 2 : s.W / 2
  const x0 = cx - totalW / 2
  const y = trackerY
  let cursor = x0
  labels.forEach((lab, i) => {
    const x = cursor
    const pillW = widths[i]
    const on = i === s.execStageIdx
    rrPath(ctx, x, y, pillW, pillH, 14)
    ctx.fillStyle = on ? hexA('#facc15', 0.95) : 'rgba(255,255,255,0.05)'
    ctx.fill()
    ctx.strokeStyle = on ? hexA('#facc15', 1) : hexA('#aab4d0', 0.25)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = on ? '#0a0f24' : hexA('#aab4d0', 0.7)
    ctx.font = `700 11px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(lab, x + pillW / 2, y + pillH / 2)
    if (i < labels.length - 1) {
      ctx.fillStyle = hexA('#7e8bc4', 0.5)
      ctx.font = `700 12px ${FONT}`
      ctx.fillText('\u2192', x + pillW + gap / 2, y + pillH / 2)
    }
    cursor += pillW + gap
  })
  ctx.restore()
}

export function drawProgramList(
  ctx: CanvasRenderingContext2D,
  s: PresentationState,
  chapter: Chapter,
) {
  const prog = chapter.program
  if (!prog) return
  const cpuScene = chapter.scenes.find((sc) => sc.id === 'cpu')
  const ex = cpuScene?.extra as
    | { listX?: number; listW?: number; listTop?: number; rowH?: number; railColor?: string }
    | undefined
  const LIST_X = ex?.listX ?? 90
  const LIST_W = ex?.listW ?? 330
  const LIST_TOP = ex?.listTop ?? 182
  const ROW_H = ex?.rowH ?? 42
  const railColor = ex?.railColor ?? '#a78bfa'
  const rowY = (i: number) => LIST_TOP + i * ROW_H + ROW_H / 2
  const cur = s.execInstrIdx
  const stage = s.execStage
  const fetching = stage === 'fetch'
  const executing = stage === 'execute' || stage === 'writeback'
  const PROGRAM = prog.instructions
  const rowsBottom = LIST_TOP + PROGRAM.length * ROW_H
  const memY = rowsBottom + 22
  const panelH = PROGRAM.length * ROW_H + 78
  const labels = chapter.runtime?.labels ?? {}
  const programLabel = (labels.programLabel ?? { en: 'PROGRAM (in RAM)', vi: 'CHƯƠNG TRÌNH (trong RAM)' })[
    s.lang
  ]
  const pcLabel = (labels.pcLabel ?? { en: 'Counter', vi: 'Bộ đếm' })[s.lang]
  const memLabel = (labels.memLabel ?? { en: 'Memory', vi: 'Bộ nhớ' })[s.lang]
  ctx.save()
  rrPath(ctx, LIST_X - 8, LIST_TOP - 30, LIST_W + 16, panelH, 16)
  ctx.fillStyle = 'rgba(10,14,32,0.92)'
  ctx.fill()
  ctx.strokeStyle = hexA(railColor, 0.4)
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = hexA('#aab4d0', 0.9)
  ctx.font = `700 11px ${FONT}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(programLabel, LIST_X, LIST_TOP - 14)
  ctx.textAlign = 'right'
  ctx.fillStyle = hexA('#facc15', 0.95)
  ctx.fillText(`${pcLabel}: ${Math.min(cur + 1, PROGRAM.length)}/${PROGRAM.length}`, LIST_X + LIST_W, LIST_TOP - 14)

  PROGRAM.forEach((ins, i) => {
    const y = rowY(i)
    const done = i < cur || s.execDone
    const isCur = i === cur && !s.execDone
    if (isCur) glow(ctx, { x: LIST_X + LIST_W / 2, y } as Vec2, railColor, 70, 0.18 + 0.1 * Math.sin(s.t * 0.008))
    rrPath(ctx, LIST_X, y - ROW_H / 2 + 3, LIST_W, ROW_H - 6, 9)
    ctx.fillStyle = isCur ? hexA(railColor, 0.18) : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)'
    ctx.fill()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    if (isCur) {
      ctx.fillStyle = hexA('#facc15', 1)
      ctx.font = `700 16px ${FONT}`
      ctx.fillText('\u25BA', LIST_X - 4, y)
    }
    ctx.fillStyle = done ? hexA('#34d399', 0.7) : isCur ? '#fff' : hexA('#7e8bc4', 0.5)
    ctx.font = `700 12px ${FONT}`
    ctx.fillText(`${i + 1}`, LIST_X + 14, y)
    ctx.fillStyle = done ? hexA('#d7def0', 0.75) : isCur ? '#fff' : hexA('#aab4d0', 0.5)
    ctx.font = `700 ${isCur ? 15 : 13}px ${FONT}`
    ctx.fillText(ins.text, LIST_X + 36, y)
    ctx.textAlign = 'right'
    if (done) {
      ctx.fillStyle = hexA('#34d399', 0.95)
      ctx.font = `700 13px ${FONT}`
      ctx.fillText('\u2713', LIST_X + LIST_W - 12, y)
    } else if (isCur && fetching) {
      ctx.fillStyle = hexA('#facc15', 0.9)
      ctx.font = `700 11px ${FONT}`
      ctx.fillText('...', LIST_X + LIST_W - 12, y)
    } else if (isCur && executing) {
      ctx.fillStyle = hexA('#fb7185', 0.9)
      ctx.font = `700 11px ${FONT}`
      ctx.fillText('run', LIST_X + LIST_W - 12, y)
    }
  })

  ctx.fillStyle = hexA('#aab4d0', 0.6)
  ctx.font = `700 11px ${FONT}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(memLabel, LIST_X, memY)
  rrPath(ctx, LIST_X + 70, memY - 13, 90, 26, 7)
  ctx.fillStyle = hexA('#22d3ee', 0.14)
  ctx.fill()
  ctx.strokeStyle = hexA('#22d3ee', 0.5)
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.font = `700 14px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText(s.execMem === null || s.execMem === undefined ? '\u00B7' : String(s.execMem), LIST_X + 115, memY)
  ctx.restore()
}
