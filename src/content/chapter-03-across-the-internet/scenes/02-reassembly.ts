// scenes/02-reassembly.ts — Scene B geometry: INSIDE the receiving machine.
// The bench / slot row / port / RAM door are the container; the bbox and the
// port-cable stub are derived from metrics (R10: the stub starts exactly at the
// port's top edge; R13: bbox = content + clip inset).

import * as M from './metrics'
import type { InfrastructureDescription, Vec2 } from '../../../chapter-loader/types'
import type { PartSpec, Rect } from '../types'

export const BENCH: Rect = { x: 140, y: 260, w: 1120, h: 420 }

// five numbered slots, one pitch (R06), centered in the bench
export const SLOT_W = M.SLOT.w
export const SLOT_X = [340, 520, 700, 880, 1060]
export const SLOT_POS: Vec2[] = SLOT_X.map((x) => ({ x, y: 430 }))
export const SLOT = { w: SLOT_W, h: SLOT_W, r: M.SLOT.r }

export const PORT = { x: 700, y: 80 } as Vec2
export const MERGE = { x: 700, y: 600 } as Vec2
export const RAM_DOOR = { x: 700, y: 860 } as Vec2

// R10: the stub starts AT the port's top edge and rises by a named length
const PORT_TOP = PORT.y - M.PORT.h / 2
const STUB_LEN = 32
export const BENCH_INFRASTRUCTURE: InfrastructureDescription[] = [
  { id: 'port-cable', kind: 'cable', points: [{ x: PORT.x, y: PORT_TOP }, { x: PORT.x, y: PORT_TOP - STUB_LEN }] },
]

// bbox derived: x from the bench + R13; y from the port stub top to the RAM-door
// label bottom, each inset by CLIP_INSET (R09 verified ≥ 80 % span in 12_)
export const BBOX_BENCH = {
  minX: BENCH.x - M.CLIP_INSET,
  maxX: BENCH.x + BENCH.w + M.CLIP_INSET,
  minY: PORT_TOP - STUB_LEN - M.CLIP_INSET,
  maxY: RAM_DOOR.y + M.LABEL_GAP + M.LABEL_TEXT_H + M.CLIP_INSET,
}

// ---- protagonist path (9 points): the keeper's attention walks slot to slot ----
export const PATH_B: Vec2[] = [
  PORT, //        0  in through the ceiling door (escorts Piece 1)
  SLOT_POS[0], // 1  slot 1
  SLOT_POS[2], // 2  slot 3 (Piece 3)
  SLOT_POS[4], // 3  slot 5 (Piece 5)
  SLOT_POS[1], // 4  slot 2 (Piece 2 — counter jumps)
  SLOT_POS[3], // 5  slot 4 (Piece 4 — the gap closes)
  MERGE, //       6  the merge zone
  RAM_DOOR, //    7  the floor exit — the file settles into RAM
  RAM_DOOR, //    8  dup — fade-out seam
]

export const nicport: PartSpec = {
  id: 'nicport',
  kind: 'port',
  pos: PORT,
  color: '#a5b4fc',
  name: 'NIC Port',
  gloss: {
    en: 'The door seen from inside, the same NIC. Pieces come in through it, and the ACKs leave through it.',
    vi: 'Cánh cửa nhìn từ bên trong, chính là NIC đó. Các mảnh đi vào qua nó, và các ACK đi ra qua nó.',
  },
}

export const bench: PartSpec = {
  id: 'bench',
  kind: 'reassembly-bench',
  pos: { x: BENCH.x + BENCH.w / 2, y: BENCH.y + BENCH.h / 2 },
  color: '#e2e8f0',
  name: 'Reassembly Buffer',
  gloss: {
    en: 'TCP\u2019s bench: a numbered slot for every piece, where the file waits to be stitched whole.',
    vi: 'Chiếc bàn của TCP: mỗi mảnh một ô đánh số, nơi tệp chờ được khâu lại nguyên vẹn.',
  },
}

export const ramDoor: PartSpec = {
  id: 'ramDoor',
  kind: 'ram',
  pos: RAM_DOOR,
  color: '#facc15',
  name: 'RAM',
  gloss: {
    en: 'Fast working memory from Chapter 1. The finished file waits here, ready for the Browser.',
    vi: 'Bộ nhớ làm việc nhanh từ Chapter 1. Tệp hoàn chỉnh chờ ở đây, sẵn sàng cho Browser.',
  },
}
