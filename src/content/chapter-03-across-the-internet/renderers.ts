// content/chapter-03-across-the-internet/renderers.ts
// Chapter 03 entity renderers. LAYOUT-SYSTEM DRIVEN: every coordinate is a named
// metric (scenes/metrics.ts) or a value derived in scenes/layout.ts from a
// container rect + measured text (R04/R18). No eyeballed pixel arithmetic lives
// in this file — only named specs, formulas of specs (e.g. box.h / 2), loop
// indices, alpha/clamp bounds and colours. See 12_LAYOUT_REVISION_v1.0.4.md.

import type { EntityRenderer } from '../../rendering/types'
import type { Vec2 } from '../../chapter-loader/types'
import { rrPath } from '../../rendering/primitives/canvas-utils'
import { glow } from '../../rendering/primitives/glow'
import { drawName } from '../../rendering/primitives/text'
import { TAU, clamp, easeInOutCubic, lerp } from '../../shared/math'
import { polylinePoint } from '../../shared/geometry'

import { beats } from './narration/beats'
import * as M from './scenes/metrics'
import * as L from './scenes/layout'
import {
  CABLES, ROUTER_REVEAL, MAIN_PATH, BRANCH_PATH, DROP_PARAM,
  CHIP_WINDOWS, TRAY_LANDING, SERVER_IP,
  STAGE_AT_BEAT, STAGE_CAPTIONS, ACK_AT_BEAT, ACK_START, ACK_FLIP,
  SLOTS_AT_BEAT, INCOMING,
} from './scenes/03-story'
import {
  WINDOW, URLBAR, VIEWPORT, URL_TEXT, SERVER, DOOR, NIC_POS,
} from './scenes/01-the-wire'
import { BENCH, SLOT_POS, SLOT, PORT, MERGE, RAM_DOOR } from './scenes/02-reassembly'

const lerpPt = (a: Vec2, b: Vec2, t: number): Vec2 => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) })
const DUR: Record<number, number> = Object.fromEntries(beats.map((b, i) => [i, b.duration]))
const beatFrac = (s: { beatIndex: number; beatElapsed: number }, bi = s.beatIndex) =>
  clamp(s.beatElapsed / (DUR[bi] ?? 3000), 0, 1)
// name label baseline for a box of half-height hh (R02 gap below the box)
const nameDy = (hh: number) => hh + M.LABEL_GAP

// ===========================================================================
// Shared payload painters (file block + packet chip — identical shapes at the
// server door, on the road, in the inbox, on the bench: structure vs state)
// ===========================================================================
function drawFileBlock(ctx: CanvasRenderingContext2D, pos: Vec2, alpha: number, scale = 1) {
  if (alpha <= 0.01) return
  const w = M.FILE.w * scale
  const h = M.FILE.h * scale
  const left = pos.x - w / 2 + M.FILE_PAD_X * scale
  ctx.save()
  ctx.globalAlpha = alpha
  rrPath(ctx, pos.x - w / 2, pos.y - h / 2, w, h, M.FILE.r)
  ctx.fillStyle = 'rgba(250,204,21,0.2)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(250,204,21,0.95)'
  ctx.lineWidth = 2.5
  ctx.stroke()
  // two centred text bands (R05/R07), derived from the line gap
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(250,204,21,0.95)'
  ctx.font = `700 ${M.F.fileTag * scale}px ${M.MONO}`
  ctx.fillText('<html>', left, pos.y - (M.FILE_LINE_GAP / 2) * scale)
  ctx.fillStyle = 'rgba(225,235,255,0.92)'
  ctx.font = `600 ${M.F.fileLabel * scale}px ${M.FONT}`
  ctx.fillText('All About Cats', left, pos.y + (M.FILE_LINE_GAP / 2) * scale)
  ctx.restore()
}

function drawChip(ctx: CanvasRenderingContext2D, pos: Vec2, k: number, alpha: number, scale = 1) {
  if (alpha <= 0.01) return
  const w = M.CHIP.w * scale
  const h = M.CHIP.h * scale
  const top = pos.y - h / 2
  ctx.save()
  ctx.globalAlpha = alpha
  rrPath(ctx, pos.x - w / 2, top, w, h, M.CHIP.r)
  ctx.fillStyle = 'rgba(250,204,21,0.16)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(250,204,21,0.9)'
  ctx.lineWidth = 2.2
  ctx.stroke()
  // header band (where from / where to / which number live)
  rrPath(ctx, pos.x - w / 2, top, w, M.CHIP.headerH * scale, M.CHIP.r)
  ctx.fillStyle = 'rgba(250,204,21,0.42)'
  ctx.fill()
  // number centred in the body band below the header (R07)
  ctx.fillStyle = '#fff'
  ctx.font = `800 ${M.F.chipNum * scale}px ${M.MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`#${k}`, pos.x, pos.y + (M.CHIP.headerH / 2) * scale)
  ctx.restore()
}

// ===========================================================================
// SERVICE BOX — the Server (disks glyph + R18 measured IP pill)
// ===========================================================================
export const drawServiceBox: EntityRenderer = (ctx, s, e, active) => {
  const w = M.SERVER.w
  const h = M.SERVER.h
  const x = e.pos.x - w / 2
  const y = e.pos.y - h / 2
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.55
  if (active) glow(ctx, e.pos, e.color, 110, 0.42 + 0.1 * Math.sin(s.t * 0.006))
  rrPath(ctx, x, y, w, h, M.SERVER.r)
  ctx.fillStyle = `rgba(34,211,238,${active ? 0.18 : 0.1})`
  ctx.fill()
  ctx.strokeStyle = `rgba(34,211,238,${active ? 0.95 : 0.45})`
  ctx.lineWidth = 2
  ctx.stroke()
  // disk glyph band, centred vertically via SERVER_GLYPH_DY
  const cy = e.pos.y + M.SERVER_GLYPH_DY
  for (let i = 0; i < 3; i++) {
    rrPath(ctx, e.pos.x - M.SERVER_DISK.half, cy - M.SERVER_DISK.topGap + i * M.SERVER_DISK.pitch, M.SERVER_DISK.w, M.SERVER_DISK.h, M.SERVER_DISK.r)
    ctx.fillStyle = 'rgba(34,211,238,0.35)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.lineWidth = 1.2
    ctx.stroke()
  }
  if (active) {
    for (let i = 0; i < 3; i++) {
      const a = s.t * 0.01 + (i * TAU) / 3
      ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.4 * Math.sin(a)})`
      ctx.beginPath()
      ctx.arc(e.pos.x - M.SERVER_CHURN.pitch + i * M.SERVER_CHURN.pitch, e.pos.y + M.SERVER_CHURN.dy, M.SERVER_CHURN.r, 0, TAU)
      ctx.fill()
    }
  }
  // R18: IP pill sized to measured text + padding (the HTML box model)
  ctx.font = `700 ${M.F.ipPill}px ${M.MONO}`
  const pillW = ctx.measureText(SERVER_IP).width + 2 * M.SERVER_PILL.padX
  const pillY = e.pos.y + h / 2 - M.SERVER_PILL.bottomGap - M.SERVER_PILL.h
  rrPath(ctx, e.pos.x - pillW / 2, pillY, pillW, M.SERVER_PILL.h, M.SERVER_PILL.r)
  ctx.fillStyle = 'rgba(8,12,30,0.95)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(250,204,21,0.8)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = '#facc15'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(SERVER_IP, e.pos.x, pillY + M.SERVER_PILL.h / 2)
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, nameDy(M.SERVER.h / 2), M.F.serverName)
}

// ===========================================================================
// ROUTER — box + westward chevrons (glyph scaled to the box), name derived
// ===========================================================================
export const drawRouter: EntityRenderer = (ctx, s, e, active) => {
  const bi = s.beatIndex
  const revealAt = Number((e.extra ?? {}).revealAt ?? 0)
  let appear = 1
  if (bi < 1) appear = 0
  else if (bi === 1) {
    const lin1 = beatFrac(s, 1)
    appear = easeInOutCubic(clamp((lin1 - revealAt) / 0.14, 0, 1))
  }
  if (appear <= 0.01) return

  const dSpark = Math.hypot(s.sparkPos.x - e.pos.x, s.sparkPos.y - e.pos.y)
  const pulse = Math.pow(clamp(1 - dSpark / 130, 0, 1), 2)
  const congested = (e.extra ?? {}).congested === true && bi >= 4

  ctx.save()
  ctx.globalAlpha = (active ? 1 : 0.55) * appear
  ctx.translate(e.pos.x, e.pos.y)
  ctx.scale(0.6 + 0.4 * appear, 0.6 + 0.4 * appear)
  if (active) glow(ctx, { x: 0, y: 0 }, e.color, 95, 0.4 + 0.1 * Math.sin(s.t * 0.006))
  if (pulse > 0.02) glow(ctx, { x: 0, y: 0 }, e.color, 105, 0.3 * pulse)
  rrPath(ctx, -M.ROUTER.w / 2, -M.ROUTER.h / 2, M.ROUTER.w, M.ROUTER.h, M.ROUTER.r)
  ctx.fillStyle = `rgba(167,139,250,${active || pulse > 0.3 ? 0.2 : 0.1})`
  ctx.fill()
  ctx.strokeStyle = `rgba(167,139,250,${active ? 0.95 : 0.45 + 0.4 * pulse})`
  ctx.lineWidth = active ? 2.5 : 2
  ctx.stroke()
  // chevrons centred on the box (R07), pointing west
  ctx.strokeStyle = `rgba(${active || pulse > 0.3 ? '255,255,255' : '167,139,250'},${active ? 0.9 : 0.55 + 0.35 * pulse})`
  ctx.lineWidth = M.ROUTER_CHEV.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const c0 = ((M.ROUTER_CHEV.count - 1) / 2) * M.ROUTER_CHEV.pitch
  for (let i = 0; i < M.ROUTER_CHEV.count; i++) {
    const cx = c0 - i * M.ROUTER_CHEV.pitch
    ctx.beginPath()
    ctx.moveTo(cx + M.ROUTER_CHEV.arm, -M.ROUTER_CHEV.half)
    ctx.lineTo(cx - M.ROUTER_CHEV.arm + 2, 0)
    ctx.lineTo(cx + M.ROUTER_CHEV.arm, M.ROUTER_CHEV.half)
    ctx.stroke()
  }
  if (congested) {
    for (let i = 0; i < 2; i++) {
      ctx.fillStyle = `rgba(251,146,60,${0.5 + 0.2 * Math.sin(s.t * 0.008 + i)})`
      ctx.beginPath()
      ctx.arc(M.ROUTER.w / 2 + M.ROUTER_CONG.gapX + i * M.ROUTER_CONG.pitchX, i === 0 ? M.ROUTER_CONG.dy0 : M.ROUTER_CONG.dy1, M.ROUTER_CONG.r, 0, TAU)
      ctx.fill()
    }
  }
  ctx.restore()
  ctx.save()
  ctx.globalAlpha = appear
  drawName(ctx, e.pos, e.name, e.color, active, nameDy(M.ROUTER.h / 2), M.F.routerName)
  ctx.restore()
}

// ===========================================================================
// NIC — network card; name derived
// ===========================================================================
export const drawNIC: EntityRenderer = (ctx, s, e, active) => {
  const dSpark = Math.hypot(s.sparkPos.x - e.pos.x, s.sparkPos.y - e.pos.y)
  const pulse = Math.pow(clamp(1 - dSpark / 110, 0, 1), 2)
  ctx.save()
  ctx.globalAlpha = active ? 1 : Math.max(0.55, 0.55 + 0.45 * pulse)
  if (active) glow(ctx, e.pos, e.color, 90, 0.4 + 0.1 * Math.sin(s.t * 0.005))
  if (pulse > 0.01) glow(ctx, e.pos, e.color, 100, 0.32 * pulse)
  rrPath(ctx, e.pos.x - M.NIC.w / 2, e.pos.y - M.NIC.h / 2, M.NIC.w, M.NIC.h, M.NIC.r)
  ctx.fillStyle = `rgba(165,180,252,${active ? 0.22 : 0.12})`
  ctx.fill()
  ctx.strokeStyle = `rgba(165,180,252,${active ? 0.95 : 0.5})`
  ctx.lineWidth = 2
  ctx.stroke()
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(${active ? '255,255,255' : '165,180,252'},${active ? 0.75 : 0.55})`
    ctx.fillRect(e.pos.x - M.NIC_PAD.half + i * M.NIC_PAD.pitch, e.pos.y - M.NIC_PAD.h / 2, M.NIC_PAD.w, M.NIC_PAD.h)
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, nameDy(M.NIC.h / 2), M.F.hwName)
}

// ===========================================================================
// RAM (filled) — shared look + golden "HTML" fill from the hand-off beat
// ===========================================================================
export const drawRamFilled: EntityRenderer = (ctx, s, e, active) => {
  const from = Number((e.extra ?? {}).fillFromBeat ?? 11)
  const fillDur = Number((e.extra ?? {}).fillDur ?? 3200)
  let fill = 0
  if (s.beatIndex === from) fill = easeInOutCubic(clamp(s.beatElapsed / fillDur, 0, 1))
  else if (s.beatIndex > from) fill = 1
  const x = e.pos.x - M.RAM.w / 2
  const y = e.pos.y - M.RAM.h / 2
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.5
  if (active || fill > 0) glow(ctx, e.pos, e.color, 100, (active ? 0.4 : 0.24) + 0.1 * Math.sin(s.t * 0.005) + 0.2 * fill)
  rrPath(ctx, x, y, M.RAM.w, M.RAM.h, M.RAM.r)
  ctx.fillStyle = `rgba(250,204,21,${active ? 0.22 : 0.12})`
  ctx.fill()
  ctx.strokeStyle = `rgba(250,204,21,${active ? 0.95 : 0.5})`
  ctx.lineWidth = 2
  ctx.stroke()
  for (let i = 0; i < 4; i++) {
    rrPath(ctx, x + M.RAM_CELL.padX + i * M.RAM_CELL.pitch, y + M.RAM_CELL.padY, M.RAM_CELL.w, M.RAM_CELL.h, M.RAM_CELL.r)
    ctx.fillStyle = `rgba(250,204,21,${active ? 0.9 : 0.5})`
    ctx.fill()
  }
  if (fill > 0.01) {
    ctx.save()
    rrPath(ctx, x, y, M.RAM.w, M.RAM.h, M.RAM.r)
    ctx.clip()
    ctx.fillStyle = `rgba(250,204,21,${0.3 * fill})`
    ctx.fillRect(x, y, M.RAM.w * fill, M.RAM.h)
    ctx.restore()
    ctx.fillStyle = `rgba(250,204,21,${fill})`
    ctx.font = `800 ${M.F.fileTag}px ${M.MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText('HTML', e.pos.x, y - M.BREATH)
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, nameDy(M.RAM.h / 2), M.F.hwName)
}

// ===========================================================================
// BROWSER (lite) — Ch-02 window frozen in its loading state; interior derived
// ===========================================================================
export const drawBrowserLite: EntityRenderer = (ctx, s, e, active) => {
  const b = L.BROWSER
  ctx.save()
  if (active) glow(ctx, e.pos, e.color, 160, 0.18 + 0.05 * Math.sin(s.t * 0.004))
  rrPath(ctx, WINDOW.x, WINDOW.y, WINDOW.w, WINDOW.h, 22)
  ctx.fillStyle = 'rgba(16,22,48,0.92)'
  ctx.fill()
  ctx.strokeStyle = `rgba(34,211,238,${active ? 0.75 : 0.35})`
  ctx.lineWidth = 2.5
  ctx.stroke()
  // chrome dots (R06 one pitch)
  ;['#fb7185', '#facc15', '#4ade80'].forEach((c, i) => {
    ctx.fillStyle = `rgba(${c === '#fb7185' ? '251,113,133' : c === '#facc15' ? '250,204,21' : '74,222,128'},0.85)`
    ctx.beginPath()
    ctx.arc(b.chromeX + i * b.dotPitch, b.chromeY, b.dotR, 0, TAU)
    ctx.fill()
  })
  // url pill + padlock + carried-over URL
  rrPath(ctx, URLBAR.x, URLBAR.y, URLBAR.w, URLBAR.h, URLBAR.h / 2)
  ctx.fillStyle = 'rgba(8,12,30,0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(150,170,255,0.18)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.strokeStyle = 'rgba(250,204,21,0.95)'
  ctx.lineWidth = 2
  rrPath(ctx, b.lockX - b.lockW / 2, b.shackleY, b.lockW, b.lockH, 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(b.lockX, b.shackleY - b.shackleR + 1, b.shackleR, Math.PI, TAU)
  ctx.stroke()
  ctx.fillStyle = 'rgba(225,235,255,0.92)'
  ctx.font = `600 ${M.F.url}px ${M.FONT}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(URL_TEXT, b.urlTextX, b.urlTextY)
  // viewport: loading — empty of page content
  rrPath(ctx, VIEWPORT.x, VIEWPORT.y, VIEWPORT.w, VIEWPORT.h, 14)
  ctx.fillStyle = 'rgba(10,14,32,0.96)'
  ctx.fill()
  ctx.save()
  rrPath(ctx, VIEWPORT.x, VIEWPORT.y, VIEWPORT.w, VIEWPORT.h, 14)
  ctx.clip()
  const prog = clamp(0.16 + s.beatIndex * 0.045 + 0.05 * Math.sin(s.t * 0.0009), 0.1, 0.9)
  rrPath(ctx, b.progX, b.progY, b.progW * prog, b.progH, b.progR)
  ctx.fillStyle = 'rgba(34,211,238,0.8)'
  ctx.fill()
  const a = s.t * 0.006
  ctx.strokeStyle = 'rgba(34,211,238,0.9)'
  ctx.lineWidth = b.spinW
  ctx.beginPath()
  ctx.arc(b.spinX, b.spinY, b.spinR, a, a + Math.PI * 1.4)
  ctx.stroke()
  ctx.fillStyle = 'rgba(170,180,224,0.55)'
  ctx.font = `500 ${M.F.waiting}px ${M.FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(`Waiting for ${URL_TEXT.replace('https://', '')}\u2026`, b.waitX, b.waitY)
  ctx.restore()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = active ? '#ffffff' : 'rgba(170,180,208,0.55)'
  ctx.font = `700 ${M.F.browserName}px ${M.FONT}`
  if (active) {
    ctx.shadowColor = e.color
    ctx.shadowBlur = 10
  }
  ctx.fillText(e.name, b.nameX, b.nameY)
  ctx.restore()
}

// ===========================================================================
// PORT — the NIC seen from inside; arrow + name derived
// ===========================================================================
export const drawPort: EntityRenderer = (ctx, s, e, active) => {
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.6
  if (active) glow(ctx, e.pos, e.color, 100, 0.4 + 0.1 * Math.sin(s.t * 0.006))
  rrPath(ctx, e.pos.x - M.PORT.w / 2, e.pos.y - M.PORT.h / 2, M.PORT.w, M.PORT.h, M.PORT.r)
  ctx.fillStyle = `rgba(165,180,252,${active ? 0.2 : 0.1})`
  ctx.fill()
  ctx.strokeStyle = `rgba(165,180,252,${active ? 0.95 : 0.5})`
  ctx.lineWidth = 2
  ctx.stroke()
  const ah = M.PORT.h * 0.27 // arrow half-extent, scaled to the box
  ctx.strokeStyle = `rgba(${active ? '255,255,255' : '165,180,252'},0.9)`
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(e.pos.x, e.pos.y - ah)
  ctx.lineTo(e.pos.x, e.pos.y + ah * 0.66)
  ctx.moveTo(e.pos.x - ah * 0.66, e.pos.y)
  ctx.lineTo(e.pos.x, e.pos.y + ah * 0.66)
  ctx.lineTo(e.pos.x + ah * 0.66, e.pos.y)
  ctx.stroke()
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, nameDy(M.PORT.h / 2), M.F.portName)
}

// ===========================================================================
// WIRE TRAFFIC — beat-driven payload painter (imagined road, mesh cables, file
// block, packet chips, other traffic, the NIC inbox). Pure f(beat, elapsed, t).
// ===========================================================================
export const drawWireTraffic: EntityRenderer = (ctx, s) => {
  const bi = s.beatIndex
  const lin = beatFrac(s)
  ctx.save()

  // the imagined straight road (the learner's Ch-02 picture), R10: ends at the door
  if (bi <= 1) {
    const ga = bi === 0 ? 0.32 : 0.32 * (1 - lin)
    if (ga > 0.01) {
      ctx.save()
      ctx.strokeStyle = `rgba(170,180,208,${ga})`
      ctx.lineWidth = 3
      ctx.setLineDash([4, 12])
      ctx.beginPath()
      ctx.moveTo(WINDOW.x + WINDOW.w, DOOR.y) // R10: from the home edge to the door
      ctx.lineTo(DOOR.x, DOOR.y)
      ctx.stroke()
      ctx.restore()
    }
  }

  // the mesh cables (revealed during b1, persistent after)
  if (bi >= 1) {
    const rf = bi === 1 ? easeInOutCubic(lin) : 1
    ctx.save()
    ctx.lineCap = 'round'
    for (const c of CABLES) {
      const f = easeInOutCubic(clamp((rf - c.reveal[0]) / (c.reveal[1] - c.reveal[0]), 0, 1))
      if (f <= 0.01) continue
      const end = lerpPt(c.a, c.b, f)
      ctx.strokeStyle = 'rgba(167,139,250,0.26)'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(c.a.x, c.a.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }
    ctx.restore()
  }

  // b0/b1: the file block hovers above the door
  if (bi <= 1) {
    drawFileBlock(ctx, { x: L.FORMATION[0].x, y: L.FORMATION[0].y + Math.sin(s.t * 0.004) * 4 }, 1)
  }

  // b2: the whole-file attempt (imagined failure)
  if (bi === 2) {
    drawFileBlock(ctx, s.sparkPos, 1)
    for (let k = 0; k < 2; k++) {
      ctx.fillStyle = `rgba(${k === 0 ? '34,211,238' : '165,180,252'},0.3)`
      ctx.beginPath()
      ctx.arc(s.sparkPos.x - M.QUEUE.dx - k * M.QUEUE.pitch, L.FORMATION[0].y + (k === 0 ? M.QUEUE.dy0 : M.QUEUE.dy1) + Math.sin(s.t * 0.005 + k * 2) * 3, M.QUEUE.r, 0, TAU)
      ctx.fill()
    }
    if (lin > 0.52) {
      const fl = Math.sin((lin - 0.52) * 40)
      ctx.fillStyle = `rgba(251,113,133,${0.55 + 0.4 * fl})`
      ctx.fillRect(s.sparkPos.x + M.CORRUPT.dx, s.sparkPos.y + M.CORRUPT.dy, M.CORRUPT.size, M.CORRUPT.size)
      if (lin > 0.7) {
        ctx.fillStyle = 'rgba(251,113,133,0.9)'
        ctx.font = `800 ${M.F.bang}px ${M.FONT}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText('!', s.sparkPos.x, s.sparkPos.y + M.CORRUPT.bangDy)
      }
    }
  }

  // b3: the slice (block holds; cut lines at quarter points; chips pop to fan)
  if (bi === 3) {
    const retreat = easeInOutCubic(clamp(lin / 0.25, 0, 1))
    const bx = lerp(L.FORMATION[0].x - 80, L.FORMATION[0].x, retreat) // CLOG → HOVER
    const by = L.FORMATION[0].y
    const blockA = 1 - easeInOutCubic(clamp((lin - 0.55) / 0.2, 0, 1))
    if (blockA > 0.01) drawFileBlock(ctx, { x: bx, y: by }, blockA)
    const cutAts = [0.3, 0.4, 0.5]
    L.cutXs(bx).forEach((cx, ci) => {
      const cutAt = cutAts[ci]
      if (lin > cutAt && lin < cutAt + 0.09 && blockA > 0.3) {
        const fa = Math.sin((Math.PI * (lin - cutAt)) / 0.09)
        ctx.strokeStyle = `rgba(255,255,255,${0.85 * fa})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx, by - L.CUT_HALF)
        ctx.lineTo(cx, by + L.CUT_HALF)
        ctx.stroke()
      }
    })
    for (let k = 0; k < 5; k++) {
      const at = 0.55 + 0.045 * k
      if (lin <= at) continue
      const f = easeInOutCubic(clamp((lin - at) / 0.18, 0, 1))
      drawChip(ctx, lerpPt({ x: bx, y: by }, L.FORMATION[k], f), k + 1, f, 0.6 + 0.4 * f)
    }
  }

  // b4: the road in motion (chip 1 rides the spark; siblings stream; #4 fizzles)
  if (bi === 4) {
    const join = easeInOutCubic(clamp(lin / 0.06, 0, 1))
    drawChip(ctx, lerpPt(L.FORMATION[0], s.sparkPos, join), 1, 0.95)
    for (let idx = 1; idx < CHIP_WINDOWS.length; idx++) {
      const w = CHIP_WINDOWS[idx]
      const k = idx + 1
      const path = w.path === 'main' ? MAIN_PATH : BRANCH_PATH
      if (lin < w.from) {
        drawChip(ctx, { x: L.FORMATION[idx].x, y: L.FORMATION[idx].y + Math.sin(s.t * 0.005 + k) * 3 }, k, 0.5, 0.9)
        continue
      }
      const param = easeInOutCubic(clamp((lin - w.from) / (w.to - w.from), 0, 1)) * (w.drop ? DROP_PARAM : 1)
      const blended = easeInOutCubic(clamp((lin - w.from) / 0.05, 0, 1))
      let pos = lerpPt(L.FORMATION[idx], polylinePoint(path, param), blended)
      if (lin >= w.from + 0.05) pos = polylinePoint(path, param)
      if (w.drop && lin > w.to) {
        const fz = clamp((lin - w.to) / 0.08, 0, 1)
        const dropPos = polylinePoint(path, DROP_PARAM)
        if (fz < 1) {
          ctx.strokeStyle = `rgba(251,113,133,${0.9 * (1 - fz)})`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(dropPos.x, dropPos.y, M.CHIP.w * 0.3 + M.CHIP.w * 0.25 * fz, 0, TAU)
          ctx.stroke()
          drawChip(ctx, dropPos, k, 1 - fz, 1 - 0.6 * fz)
        }
        const xA = clamp(1 - (lin - w.to - 0.08) / 0.25, 0, 1)
        if (xA > 0.01) {
          ctx.fillStyle = `rgba(251,113,133,${0.75 * xA})`
          ctx.font = `800 ${M.F.ghost}px ${M.FONT}`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('\u00D7', dropPos.x, dropPos.y)
        }
        continue
      }
      if (lin > w.to) {
        const off = { x: (idx - 2.5) * (M.CHIP.w * 0.28), y: -M.BREATH - 2 }
        drawChip(ctx, { x: NIC_POS.x + off.x, y: NIC_POS.y + off.y }, k, 0.5, 0.9)
        continue
      }
      drawChip(ctx, pos, k, 0.34)
    }
  }

  // b5: the disordered inbox (arrival order 1,3,5,2; ghost for 4)
  if (bi === 5) {
    for (let ai = 0; ai < TRAY_LANDING.length; ai++) {
      const land = TRAY_LANDING[ai]
      const slot = L.TRAY.pos[ai]
      const hover = L.TRAY.hover(land.chip)
      const fromPt = land.from === 0.05 ? s.sparkPos : hover
      let pos: Vec2
      let alpha = 0.9
      if (lin < land.from) {
        pos = land.chip === 1 ? s.sparkPos : hover
        alpha = 0.55
      } else if (lin < land.to) {
        pos = lerpPt(fromPt, slot, easeInOutCubic((lin - land.from) / (land.to - land.from)))
      } else {
        pos = slot
      }
      drawChip(ctx, pos, land.chip, alpha, 1)
    }
    if (lin > 0.72) {
      const pu = 0.35 + 0.25 * Math.sin(s.t * 0.007)
      const g = L.TRAY.ghost
      ctx.save()
      ctx.strokeStyle = `rgba(251,113,133,${pu})`
      ctx.lineWidth = 2.5
      ctx.setLineDash([6, 7])
      rrPath(ctx, g.x - M.CHIP.w / 2, g.y - M.CHIP.h / 2, M.CHIP.w, M.CHIP.h, M.CHIP.r)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = `rgba(251,113,133,${pu + 0.2})`
      ctx.font = `800 ${M.F.ghost}px ${M.FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('?', g.x, g.y)
      ctx.restore()
    }
  }

  // b12: the road stays alive (ambient dim traffic while the spark loops)
  if (bi >= 12) {
    for (let k = 0; k < 5; k++) {
      const c = CABLES[(k * 2) % CABLES.length]
      const f = (s.t * 0.00005 * (k + 1) + k * 0.37) % 1
      const p = lerpPt(c.a, c.b, f)
      ctx.fillStyle = `rgba(${k % 2 === 0 ? '34,211,238' : '165,180,252'},0.16)`
      ctx.beginPath()
      ctx.arc(p.x, p.y, M.ROUTER_CONG.r + 0.5, 0, TAU)
      ctx.fill()
    }
  }

  ctx.restore()
}

// ===========================================================================
// REASSEMBLY BENCH — TCP's workshop; interiors derived from BENCH + metrics
// ===========================================================================
export const drawReassemblyBench: EntityRenderer = (ctx, s, e, active) => {
  const bi = s.beatIndex
  const lin = beatFrac(s)
  const stage = STAGE_AT_BEAT[bi] ?? ''

  ctx.save()
  if (active) glow(ctx, e.pos, e.color, 140, 0.16)
  rrPath(ctx, BENCH.x, BENCH.y, BENCH.w, BENCH.h, 20)
  ctx.fillStyle = 'rgba(13,19,42,0.94)'
  ctx.fill()
  ctx.strokeStyle = `rgba(226,232,240,${active ? 0.5 : 0.22})`
  ctx.lineWidth = 2
  ctx.stroke()
  const cap = STAGE_CAPTIONS[stage]
  if (cap) {
    ctx.fillStyle = 'rgba(170,180,208,0.75)'
    ctx.font = `700 ${M.F.caption}px ${M.FONT}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(cap, L.BENCH_CAP.x, L.BENCH_CAP.y)
  }

  const settled = new Set<number>(SLOTS_AT_BEAT[bi] ?? [])
  const incoming = INCOMING[stage] ?? []
  const incomingN = new Set(incoming.map((x) => x.n))
  const leaveAt = (k: number) => 0.06 + k * 0.05

  // slots
  for (let k = 0; k < 5; k++) {
    const n = k + 1
    const p = SLOT_POS[k]
    const inMerge = stage === 'merge'
    const inc = incoming.find((x) => x.n === n)
    const inf = inc ? easeInOutCubic(clamp((lin - inc.a) / (inc.b - inc.a), 0, 1)) : 0
    const present = inMerge ? lin < leaveAt(k) : settled.has(n) || inf > 0.6
    const gapPulse = n === 4 && ((bi === 8 && lin > 0.62) || (bi === 9 && lin < 0.45))
    ctx.save()
    rrPath(ctx, p.x - SLOT.w / 2, p.y - SLOT.h / 2, SLOT.w, SLOT.h, SLOT.r)
    ctx.fillStyle = `rgba(250,204,21,${present ? 0.07 : 0.03})`
    ctx.fill()
    if (gapPulse) {
      ctx.strokeStyle = `rgba(251,113,133,${0.4 + 0.3 * Math.sin(s.t * 0.008)})`
      ctx.lineWidth = 2.5
      ctx.setLineDash([6, 7])
    } else {
      ctx.strokeStyle = 'rgba(226,232,240,0.3)'
      ctx.lineWidth = 1.8
      ctx.setLineDash(present ? [] : [6, 7])
    }
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(170,180,208,0.8)'
    ctx.font = `800 ${M.F.slotNum}px ${M.MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(String(n), p.x, L.slotLabelY(p.y))
    ctx.restore()
    if (settled.has(n) && !incomingN.has(n) && !(inMerge && lin >= leaveAt(k))) {
      drawChip(ctx, p, n, 0.95)
    }
  }

  // pieces descending from the port
  for (const inc of incoming) {
    if (lin < inc.a) continue
    const f = easeInOutCubic(clamp((lin - inc.a) / (inc.b - inc.a), 0, 1))
    drawChip(ctx, lerpPt(PORT, SLOT_POS[inc.n - 1], f), inc.n, 0.95)
    ackDrift(ctx, SLOT_POS[inc.n - 1], s.t, clamp((lin - inc.b) / 0.16, 0, 1))
  }

  // the ask rises out through the port (R11 reserved band)
  if (stage === 'ask' && lin < 0.35) {
    const f = easeInOutCubic(clamp(lin / 0.3, 0, 1))
    const pos = lerpPt(L.ASK_BAND, PORT, f)
    ctx.save()
    ctx.globalAlpha = 1 - clamp((lin - 0.24) / 0.11, 0, 1)
    rrPath(ctx, pos.x - M.ASK.w / 2, pos.y - M.ASK.h / 2, M.ASK.w, M.ASK.h, M.ASK.r)
    ctx.fillStyle = 'rgba(251,113,133,0.25)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(251,113,133,0.95)'
    ctx.lineWidth = 2.5
    ctx.stroke()
    ctx.fillStyle = '#fda4af'
    ctx.font = `800 ${M.F.ask}px ${M.MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('need #4', pos.x, pos.y)
    ctx.restore()
  }

  // merge: strips → column → converge → fuse → glide
  if (stage === 'merge') {
    for (let k = 0; k < 5; k++) {
      const n = k + 1
      const lv = leaveAt(k)
      if (lin >= 0.62) continue
      let pos: Vec2
      if (lin < lv) pos = SLOT_POS[k]
      else if (lin < 0.45) pos = lerpPt(SLOT_POS[k], L.mergeCol(k), easeInOutCubic(clamp((lin - lv) / (0.45 - lv), 0, 1)))
      else pos = lerpPt(L.mergeCol(k), MERGE, easeInOutCubic(clamp((lin - 0.45) / 0.17, 0, 1)))
      const fade = lin < 0.45 ? 1 : 1 - clamp((lin - 0.5) / 0.12, 0, 1)
      drawStrip(ctx, pos, n, fade)
    }
    const blockA = clamp((lin - 0.62) / 0.18, 0, 1)
    if (blockA > 0.01) {
      const glide = lin > 0.8 ? easeInOutCubic(clamp((lin - 0.8) / 0.2, 0, 1)) : 0
      const pos = lerpPt(MERGE, RAM_DOOR, glide)
      drawFileBlock(ctx, pos, blockA, lerp(0.7, 1, blockA))
      if (lin > 0.78 && lin < 0.92 && glide < 0.2) {
        const pop = easeInOutCubic(clamp((lin - 0.78) / 0.1, 0, 1))
        ctx.save()
        ctx.globalAlpha = pop
        rrPath(ctx, pos.x + M.WHOLE.dx, pos.y + M.WHOLE.dy, M.WHOLE.w, M.WHOLE.h, M.WHOLE.r)
        ctx.fillStyle = 'rgba(74,222,128,0.2)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(74,222,128,0.9)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = '#86efac'
        ctx.font = `800 ${M.F.whole}px ${M.MONO}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('whole \u2713', pos.x + M.WHOLE.dx + M.WHOLE.w / 2, pos.y + M.WHOLE.dy + M.WHOLE.h / 2)
        ctx.restore()
      }
    }
  }

  // ACK counter (R18 tag area; right-anchored inside the pad)
  let ack = ACK_START[bi] ?? 5
  const ff = ACK_FLIP[bi] ?? 2
  if (lin >= ff) ack = ACK_AT_BEAT[bi] ?? ack
  const justFlipped = lin >= ff && lin < ff + 0.15
  const pu = justFlipped ? 1 + 0.25 * (1 - (lin - ff) / 0.15) : 1
  ctx.save()
  rrPath(ctx, L.ACK_BOX.x, L.ACK_BOX.y, M.ACK.w, M.ACK.h, M.ACK.r)
  ctx.fillStyle = 'rgba(250,204,21,0.08)'
  ctx.fill()
  ctx.strokeStyle = `rgba(250,204,21,${justFlipped ? 0.9 : 0.45})`
  ctx.lineWidth = 1.8
  ctx.stroke()
  ctx.fillStyle = 'rgba(170,180,208,0.85)'
  ctx.font = `800 ${M.F.ackTag}px ${M.MONO}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('ACK', L.ACK_BOX.x + M.ACK.padX, L.ACK_BOX.y + M.ACK.tagDy)
  ctx.fillStyle = '#facc15'
  ctx.font = `800 ${Math.round(M.F.ackVal * pu)}px ${M.MONO}`
  ctx.textAlign = 'right'
  ctx.fillText(`have \u2713${ack}`, L.ACK_BOX.x + M.ACK.w - M.ACK.padX, L.ACK_BOX.y + M.ACK.valDy)
  ctx.restore()

  ctx.restore()
  drawName(ctx, { x: BENCH.x + BENCH.w / 2, y: BENCH.y + BENCH.h }, e.name, e.color, active, M.LABEL_GAP, M.F.benchName)
}

// a small dim checkmark drifting up to the port (the ACK foreshadow)
function ackDrift(ctx: CanvasRenderingContext2D, from: Vec2, t: number, f: number) {
  if (f <= 0.01 || f >= 1) return
  const pos = lerpPt({ x: from.x, y: from.y - M.PORT.h / 2 }, PORT, f)
  ctx.save()
  ctx.globalAlpha = 0.5 * (1 - f)
  ctx.fillStyle = '#4ade80'
  ctx.font = `800 ${M.F.slotNum + 2}px ${M.MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('\u2713', pos.x, pos.y)
  ctx.restore()
}

// a payload strip (a chip without its header band — the raw slice)
function drawStrip(ctx: CanvasRenderingContext2D, pos: Vec2, n: number, alpha: number) {
  if (alpha <= 0.01) return
  const w = M.CHIP.w * 0.83
  const h = M.CHIP.h * 0.6
  ctx.save()
  ctx.globalAlpha = alpha
  rrPath(ctx, pos.x - w / 2, pos.y - h / 2, w, h, M.CHIP.r * 0.8)
  ctx.fillStyle = 'rgba(250,204,21,0.22)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(250,204,21,0.85)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.font = `800 ${M.F.stripNum}px ${M.MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(n), pos.x, pos.y)
  ctx.restore()
}
