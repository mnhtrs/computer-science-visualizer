// scenes/01-desktop.ts — Act 1: the whole computer.
// Compact case (parts fit inside), generous gaps between case↔GPU↔monitor.

import type { PartSpec } from '../types'

// ---- PC-scene geometry ----------------------------------------------------
export const BUS_Y = 470
export const BBOX_PC = { minX: 200, maxX: 1130, minY: 280, maxY: 720 }
export const CASE = { x: 260, y: 340, w: 390, h: 360 }
export const SCREEN = { x: 920, y: 300, w: 200, h: 220 }
export const FILE_BTN = { x: 1020, y: 410 }
export const CABLE_FROM = { x: 650, y: BUS_Y }
export const CABLE_TO = { x: 920, y: BUS_Y }

// Bus rail: SSD (320) → RAM (590) → down to CPU (470,620) → back up.
export const BUS_RAIL = [
  { x: 320, y: BUS_Y },
  { x: 590, y: BUS_Y },
  { x: 590, y: 620 },
  { x: 470, y: 620 },
  { x: 470, y: BUS_Y },
]

// The protagonist's continuous circuit through the PC scene.
export const PATH = [
  { x: 1020, y: 410 },
  { x: 780, y: BUS_Y },
  { x: 320, y: BUS_Y },
  { x: 590, y: BUS_Y },
  { x: 590, y: 620 },
  { x: 470, y: 620 },
  { x: 590, y: 620 },
  { x: 590, y: BUS_Y },
  { x: 780, y: BUS_Y },
  { x: 920, y: BUS_Y },
  { x: 1020, y: 410 },
]

// ---- Desktop-level entities ----------------------------------------------
export const monitor: PartSpec = {
  id: 'monitor',
  kind: 'monitor',
  pos: { x: 1020, y: 410 },
  color: '#f472b6',
  name: 'Monitor',
  gloss: {
    en: 'This is the screen. It only shows things. It never thinks or works anything out.',
    vi: 'Đây là cái màn hình. Nó chỉ hiển thị thôi. Nó không bao giờ tính toán hay suy nghĩ gì cả.',
  },
}

export const bus: PartSpec = {
  id: 'bus',
  kind: 'bus',
  pos: { x: 455, y: BUS_Y },
  color: '#a5b4fc',
  name: 'System Bus',
  labelSize: 12,
  gloss: {
    en: 'This is the road. Information travels along it between the parts.',
    vi: 'Đây là con đường. Thông tin chạy dọc theo nó giữa các bộ phận.',
  },
}

export const cpu: PartSpec = {
  id: 'cpu',
  kind: 'cpu-chip',
  pos: { x: 470, y: 620 },
  color: '#fb923c',
  name: 'CPU',
  gloss: {
    en: 'This is the brain. It runs the program one instruction at a time, around and around.',
    vi: 'Đây là cái não. Nó chạy chương trình từng lệnh một, xoay vòng lại liên tục.',
  },
}
