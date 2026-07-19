// scenes/04-fetch.ts — Act 4: inside the CPU, the Fetch stage.
// Holds the CPU-scene skeleton (die, station positions, program list) that the
// later acts (decode/execute) build on. Fetch itself = reading the next
// instruction from the program list (RAM) under the Control Unit.

import type { Vec2 } from '../../../chapter-loader/types'

// ---- CPU-scene geometry --------------------------------------------------
export const BBOX_CPU = { minX: 70, maxX: 1130, minY: 46, maxY: 624 }
export const STAGE_TRACKER_Y = 100
export const DIE = { x: 470, y: 152, w: 640, h: 420 }
export const CU_POS: Vec2 = { x: 790, y: 260 }
export const REG_POS: Vec2 = { x: 790, y: 365 }
export const ALU_POS: Vec2 = { x: 790, y: 470 }

// Program list (the program as it sits in RAM) — left column of the CPU scene.
export const LIST_X = 90
export const LIST_W = 330
export const LIST_TOP = DIE.y + 30
export const ROW_H = 42
export const LIST_RIGHT = LIST_X + LIST_W

export function rowY(i: number): number {
  return LIST_TOP + i * ROW_H + ROW_H / 2
}
