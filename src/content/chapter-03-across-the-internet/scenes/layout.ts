// scenes/layout.ts — the Chapter 03 derived *layout system*: every container
// interior, the inbox tray, the slice fan, the merge columns and the cut lines
// are computed HERE from named metrics + the geometry rects, so the renderers
// contain no eyeballed coordinates (Layout Constitution R03/R04/R06/R07/R08/R10/
// R11/R18). Imports metrics (pure) + geometry (01/02); no cycle (neither imports
// this file).

import * as M from './metrics'
import {
  WINDOW, URLBAR, VIEWPORT, NIC_POS, HOVER,
} from './01-the-wire'
import { BENCH, SLOT } from './02-reassembly'
import type { Vec2 } from '../../../chapter-loader/types'

// ---- browser-window interior (derived from WINDOW / URLBAR / VIEWPORT) --------
const W = WINDOW
const U = URLBAR
const V = VIEWPORT
const pcy = U.y + U.h / 2
export const BROWSER = {
  chromeX: W.x + M.CHROME.insetX,
  chromeY: W.y + M.CHROME.insetY,
  dotR: M.CHROME.dotR,
  dotPitch: M.CHROME.dotPitch,
  lockX: U.x + M.URL.lockGap,
  lockW: M.URL.lockW,
  lockH: M.URL.lockH,
  shackleR: M.URL.shackleR,
  shackleY: pcy - M.URL.lockH / 2 - 1,
  urlTextX: U.x + M.URL.lockGap + M.URL.lockW / 2 + M.URL.leftPad - 4,
  urlTextY: pcy,
  progX: V.x + M.PROGRESS.insetX,
  progY: V.y + M.PROGRESS.topGap,
  progW: V.w - 2 * M.PROGRESS.insetX,
  progH: M.PROGRESS.h,
  progR: M.PROGRESS.r,
  spinX: V.x + V.w / 2,
  spinY: V.y + V.h / 2 + M.SPINNER.dy,
  spinR: M.SPINNER.r,
  spinW: M.SPINNER.width,
  waitX: V.x + V.w / 2,
  waitY: V.y + V.h / 2 + M.WAITING.baselineDy,
  nameX: W.x + W.w / 2,
  nameY: W.y + W.h + M.WINDOW_NAME_DY,
}

// ---- the NIC inbox tray (R06 one pitch; R07 row alignment; hugs the NIC by
//      construction — R02 breathing to the NIC box top, stacked upward) ---------
const trayRow2Y = NIC_POS.y - M.NIC.h / 2 - M.BREATH - M.CHIP.h / 2
const trayRow1Y = trayRow2Y - M.CHIP.h - M.BREATH
// arrival order 1,3,5,2 → row1 = [1,3,5], row2 = [2]
export const TRAY: { pos: Vec2[]; ghost: Vec2; hover: (chip: number) => Vec2 } = {
  pos: [
    { x: NIC_POS.x - M.TRAY_PITCH, y: trayRow1Y }, // 1
    { x: NIC_POS.x, y: trayRow1Y }, // 3
    { x: NIC_POS.x + M.TRAY_PITCH, y: trayRow1Y }, // 5
    { x: NIC_POS.x - M.TRAY_PITCH / 2, y: trayRow2Y }, // 2
  ],
  ghost: { x: NIC_POS.x + M.TRAY_PITCH / 2, y: trayRow2Y },
  // pieces rise from the NIC face into their slot
  hover: (chip: number) => ({
    x: NIC_POS.x + (chip * 17 - 34),
    y: NIC_POS.y - M.NIC.h / 2 - (chip % 2) * M.BREATH,
  }),
}

// ---- the slice fan (chips pop out around the file's hover point) --------------
const fanRowGap = M.CHIP.h + M.BREATH
export const FORMATION: Vec2[] = [
  { x: HOVER.x, y: HOVER.y },
  { x: HOVER.x + M.TRAY_PITCH, y: HOVER.y },
  { x: HOVER.x + 2 * M.TRAY_PITCH, y: HOVER.y },
  { x: HOVER.x + M.TRAY_PITCH / 2, y: HOVER.y - fanRowGap },
  { x: HOVER.x + (1.5 * M.TRAY_PITCH), y: HOVER.y - fanRowGap },
]

// ---- bench interior -----------------------------------------------------------
export const BENCH_CAP = { x: BENCH.x + M.BENCH_PAD.x, y: BENCH.y + M.BENCH_PAD.y }
export const ACK_BOX = {
  x: BENCH.x + BENCH.w - M.BENCH_PAD.x - M.ACK.w,
  y: BENCH.y + M.BENCH_PAD.y,
}
// R11: the ask pill's reserved top-right band (clear of the slot row)
export const ASK_BAND = { x: BENCH.x + BENCH.w - M.ASK.bandX, y: BENCH.y + M.ASK.bandY }
export const slotLabelY = (slotY: number) => slotY + SLOT.h / 2 + M.SLOT_LABEL_GAP

// five merge columns spread evenly across the bench interior (R06 one pitch)
export function mergeCol(k: number): Vec2 {
  const innerX = BENCH.x + M.BENCH_PAD.x
  const innerW = BENCH.w - 2 * M.BENCH_PAD.x
  return { x: innerX + (innerW * (k + 0.5)) / 5, y: BENCH.y + BENCH.h * 0.66 }
}

// cut lines at the file's quarter points, kept inside the block (R02)
export function cutXs(bx: number): number[] {
  const step = M.FILE.w / (M.CUT.count + 1)
  return Array.from({ length: M.CUT.count }, (_, i) => bx - M.FILE.w / 2 + step * (i + 1))
}
export const CUT_HALF = M.FILE.h / 2 - M.BREATH
