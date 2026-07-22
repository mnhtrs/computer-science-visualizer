// scenes/01-the-wire.ts — Scene A geometry. The HOME side (case / window /
// hardware row) is fixed by the Ch-02 continuity contract; everything NEW in
// this chapter (the Router web, the home-drop route, the bbox) is DERIVED from
// scenes/metrics.ts so it follows the Layout Constitution rather than magic
// numbers (see 12_LAYOUT_REVISION_v1.0.4.md).

import * as M from './metrics'
import type { InfrastructureDescription, Vec2 } from '../../../chapter-loader/types'
import type { PartSpec, Rect } from '../types'

// ---- home (Ch-02 continuity coordinates, verbatim) ----------------------------
export const CASE = { x: 60, y: 80, w: 840, h: 790 }
export const WINDOW = { x: 90, y: 130, w: 760, h: 470 }
export const URLBAR = { x: 190, y: 152, w: 600, h: 36 } as Rect
export const VIEWPORT = { x: 106, y: 212, w: 728, h: 372 } as Rect
export const URL_TEXT = 'https://best-cats.example'
export const NIC_POS = { x: 260, y: 805 } as Vec2
export const RAM_POS = { x: 430, y: 805 } as Vec2
export const CPU_POS = { x: 590, y: 805 } as Vec2
export const GPU_POS = { x: 740, y: 805 } as Vec2

// ---- the road: Server + Routers (west-bound; bytes' direction) ----------------
export const SERVER = { x: 1650, y: 520 } as Vec2
export const DOOR = { x: SERVER.x - M.SERVER.w / 2, y: SERVER.y } as Vec2 // box west face
// the file's hover / clog spots float ABOVE the cable, clear of the box top (R02)
export const HOVER = { x: DOOR.x - M.FILE.w / 2, y: SERVER.y - M.SERVER.h / 2 - M.BREATH - M.FILE.h / 2 } as Vec2
export const CLOG = { x: HOVER.x - 80, y: HOVER.y } as Vec2
export const R4 = { x: 1450, y: 520 } as Vec2
export const R3 = { x: 1280, y: 610 } as Vec2
export const R2 = { x: 1110, y: 430 } as Vec2 // the congested one (drops Packet 4)
export const R2B = { x: 1110, y: 710 } as Vec2 // the alternate branch
// R1 is derived so its box clears the Desktop case border (R02/R10)
export const R1 = { x: CASE.x + CASE.w + M.R1_CLEAR, y: 520 } as Vec2

// ---- the home-drop route: a DEDICATED external cable that loops below the case
//      and plugs into the NIC only (never rides the internal NIC-RAM-CPU-GPU bus).
//      Every coordinate is derived from the window / case / NIC + a named gap. ----
const DROP_X = WINDOW.x + WINDOW.w + M.RIGHT_MARGIN_GAP // in the case's right margin
const BELOW_Y = CASE.y + CASE.h + M.UNDER_GAP // below the case
const PLUG_X = NIC_POS.x - M.PLUG_DX // left of the NIC label (R02)
export const DROP_TOP = { x: DROP_X, y: SERVER.y } as Vec2
export const DROP_MID = { x: DROP_X, y: BELOW_Y } as Vec2
export const UNDER = { x: PLUG_X, y: BELOW_Y } as Vec2
export const PLUG = { x: PLUG_X, y: NIC_POS.y } as Vec2

// ---- bbox derived from content + R13 clip inset (no dead third, R09) ----------
export const BBOX_WIRE = {
  minX: CASE.x - M.CLIP_INSET,
  maxX: SERVER.x + M.SERVER.w / 2 + M.CLIP_INSET,
  minY: CASE.y - M.CLIP_INSET,
  maxY: BELOW_Y + M.CLIP_INSET,
}

// ---- protagonist path (14 points; every beat resumes at the prior end) --------
export const PATH_A: Vec2[] = [
  HOVER, //       0  the file hovers above the door (b0 emerge, b1 reveal)
  CLOG, //        1  the whole-file attempt stalls here (b2)
  HOVER, //       2  dup — the block retreats, gets sliced (b3)
  R4, //          3  hop 1
  R3, //          4  hop 2 (the branch point)
  R2, //          5  hop 3 (the congested one)
  R1, //          6  hop 4 (last before home)
  DROP_TOP, //    7  the home drop, outside the window (right margin)
  DROP_MID, //    8  down the right margin and below the case
  UNDER, //       9  below the case, under the NIC
  PLUG, //       10  up into the NIC (left of its label)
  NIC_POS, //    11  the NIC (b4 arrives + dwells here; b5 rests here)
  RAM_POS, //    12  RAM — the hand-off rest (b11)
  RAM_POS, //    13  dup — recap rest (b12 loop)
]

// ---- the machines -------------------------------------------------------------
export const browser: PartSpec = {
  id: 'browser',
  kind: 'browser-lite',
  pos: { x: 470, y: 410 },
  color: '#22d3ee',
  name: 'Browser',
  gloss: {
    en: 'The main character of the last journey. Right now it simply waits: its page is still on the road.',
    vi: 'Nhân vật chính của hành trình trước. Lúc này nó chỉ đơn giản là chờ: trang của nó vẫn còn trên đường.',
  },
}

export const nic: PartSpec = {
  id: 'nic',
  kind: 'nic',
  pos: NIC_POS,
  color: '#a5b4fc',
  name: 'NIC',
  gloss: {
    en: 'Your computer\u2019s door to the network; you met it before. Every byte that enters lands here first.',
    vi: 'Cánh cửa ra mạng của máy tính; bạn đã gặp nó rồi. Mọi byte đi vào đều hạ cánh ở đây trước tiên.',
  },
}

export const ram: PartSpec = {
  id: 'ram',
  kind: 'ram-filled',
  pos: RAM_POS,
  color: '#facc15',
  name: 'RAM',
  gloss: {
    en: 'Fast working memory from Chapter 1. The finished file waits here, ready for the Browser.',
    vi: 'Bộ nhớ làm việc nhanh từ Chapter 1. Tệp hoàn chỉnh chờ ở đây, sẵn sàng cho Browser.',
  },
}

export const cpu: PartSpec = {
  id: 'cpu',
  kind: 'cpu-chip',
  pos: CPU_POS,
  color: '#fb923c',
  name: 'CPU',
  gloss: {
    en: 'The CPU runs everything you are watching here, the Browser, TCP, the whole machine, one instruction at a time, just like Chapter 1.',
    vi: 'CPU chạy mọi thứ bạn đang thấy ở đây, Browser, TCP, cả cỗ máy, từng lệnh một, đúng như Chapter 1.',
  },
}

export const gpu: PartSpec = {
  id: 'gpu',
  kind: 'gpu',
  pos: GPU_POS,
  color: '#4ade80',
  name: 'GPU',
  gloss: {
    en: 'The GPU is resting: the page is not drawn yet. Its work belongs to the last journey.',
    vi: 'GPU đang nghỉ: trang vẫn chưa được vẽ. Việc của nó thuộc về hành trình trước.',
  },
}

export const server: PartSpec = {
  id: 'server',
  kind: 'service-box',
  pos: SERVER,
  color: '#22d3ee',
  name: 'Server',
  gloss: {
    en: 'The computer that answered your Browser. Right now it holds your page, and when a piece goes missing, it sends that piece again.',
    vi: 'Cỗ máy đã trả lời Browser của bạn. Lúc này nó giữ trang của bạn, và khi một mảnh thất lạc, nó gửi lại đúng mảnh đó.',
  },
}

const routerGloss = {
  en: 'A computer whose whole job is passing things along. It reads where a packet is headed, then hands it to the neighbor closest to that place. It keeps nothing: every packet moves on in a blink.',
  vi: 'Một máy tính mà cả công việc là chuyển tiếp. Nó đọc xem packet đang đi đâu, rồi trao cho người hàng xóm gần đích nhất. Nó không giữ lại gì: mọi packet đi tiếp trong chớp mắt.',
}

export const router4: PartSpec = { id: 'router4', kind: 'router', pos: R4, color: '#a78bfa', name: 'Router', gloss: routerGloss }
export const router3: PartSpec = { id: 'router3', kind: 'router', pos: R3, color: '#a78bfa', name: 'Router', gloss: routerGloss }
export const router2: PartSpec = { id: 'router2', kind: 'router', pos: R2, color: '#a78bfa', name: 'Router', gloss: routerGloss, extra: { congested: true } }
export const router2b: PartSpec = { id: 'router2b', kind: 'router', pos: R2B, color: '#a78bfa', name: 'Router', gloss: routerGloss }
export const router1: PartSpec = { id: 'router1', kind: 'router', pos: R1, color: '#a78bfa', name: 'Router', gloss: routerGloss }

// ---- infrastructure: the case + the INTERNAL bus only (NIC-RAM-CPU-GPU). The
//      external cable is painted by wire-traffic so the b1 reveal can animate it
//      and so it terminates at the NIC, not the bus. -----------------------------
export const WIRE_INFRASTRUCTURE: InfrastructureDescription[] = [
  { id: 'case', kind: 'case', rect: CASE },
  { id: 'hw-rail', kind: 'bus-rail', points: [NIC_POS, GPU_POS] },
]

// ---- hit-zone: the Server box (the learner sends the response) ----------------
export const SERVER_RECT = { x: SERVER.x - M.SERVER.w / 2, y: SERVER.y - M.SERVER.h / 2, w: M.SERVER.w, h: M.SERVER.h } as Rect
