// scenes/03-story.ts — the micro-content the renderers animate: the cables of
// the Router web, the packet chips and their routes, the NIC tray, and the
// bench stages. One file = one source of truth for the pipeline data
// (mirrors Ch-02's scenes/05-story.ts).

import type { Vec2 } from '../../../chapter-loader/types'
import { DOOR, R4, R3, R2, R2B, R1, DROP_TOP, DROP_MID, UNDER, PLUG, NIC_POS, HOVER } from './01-the-wire'

// ---- the mesh cables (painted by wire-traffic; revealed during b1) -----------
export interface Cable {
  a: Vec2
  b: Vec2
  /** reveal window inside beat 1 (fractions of the beat) */
  reveal: [number, number]
}
export const CABLES: Cable[] = [
  { a: DOOR, b: R4, reveal: [0.04, 0.2] },
  { a: R4, b: R3, reveal: [0.18, 0.34] },
  { a: R3, b: R2, reveal: [0.32, 0.48] },
  { a: R3, b: R2B, reveal: [0.5, 0.64] },
  { a: R2, b: R1, reveal: [0.46, 0.6] },
  { a: R2B, b: R1, reveal: [0.56, 0.7] },
  { a: R1, b: DROP_TOP, reveal: [0.58, 0.7] },
  { a: DROP_TOP, b: DROP_MID, reveal: [0.66, 0.78] },
  { a: DROP_MID, b: UNDER, reveal: [0.74, 0.88] },
  { a: UNDER, b: PLUG, reveal: [0.84, 0.96] },
]

/** Routers pop in during b1 at these beat fractions (router renderer reads this). */
export const ROUTER_REVEAL: Record<string, number> = {
  router4: 0.08,
  router3: 0.26,
  router2: 0.42,
  router2b: 0.52,
  router1: 0.62,
}

// ---- the packet routes (polylines; chips interpolate by arc length) ----------
export const MAIN_PATH: Vec2[] = [DOOR, R4, R3, R2, R1, DROP_TOP, DROP_MID, UNDER, PLUG, NIC_POS]
export const BRANCH_PATH: Vec2[] = [DOOR, R4, R3, R2B, R1, DROP_TOP, DROP_MID, UNDER, PLUG, NIC_POS]

/** arc-length fraction of `pts` at vertex `idx` (so the drop marker lands exactly on R2). */
function arcFraction(pts: Vec2[], idx: number): number {
  const segs: number[] = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y)
    segs.push(d)
    total += d
  }
  let before = 0
  for (let i = 0; i < idx; i++) before += segs[i]
  return total > 0 ? before / total : 0
}

/** Packet 4 fizzles at this arc-length fraction of MAIN_PATH (== R2, the congested one). */
export const DROP_PARAM = arcFraction(MAIN_PATH, 3)

/** Where the five chips settle after the slice — derived in the layout system
 *  (scenes/layout.ts) from the file's hover point + the inbox pitch (R06). */
export { FORMATION as CHIP_FORMATION } from './layout'

/** b4 travel windows per chip (fractions of the beat). Chip 1 rides the spark. */
export const CHIP_WINDOWS: { from: number; to: number; path: 'main' | 'branch'; drop?: boolean }[] = [
  { from: 0, to: 0.7, path: 'main' }, //              1 — rides the spark (park at 0.7)
  { from: 0.5, to: 0.94, path: 'branch' }, //         2 — the long way around
  { from: 0.3, to: 0.8, path: 'main' }, //            3
  { from: 0.24, to: 0.6, path: 'main', drop: true }, // 4 — fizzles at R2
  { from: 0.42, to: 0.87, path: 'main' }, //          5
]

/** b5: the NIC inbox. Chips land in ARRIVAL order 1, 3, 5, 2; the ghost waits for 4.
 *  The tray lives in the floor band below the (shortened) browser window, above
 *  the hardware row — never inside the viewport (the pile is at the NIC, not in
 *  the Browser). */
export const TRAY_LANDING: { chip: number; from: number; to: number }[] = [
  { chip: 1, from: 0.05, to: 0.2 },
  { chip: 3, from: 0.22, to: 0.37 },
  { chip: 5, from: 0.39, to: 0.54 },
  { chip: 2, from: 0.56, to: 0.71 },
]
// (the inbox slot coordinates live in the layout system — TRAY — derived from the
// NIC; the renderer maps each landing entry to TRAY.pos by its array index.)

/** The file block spec (same block at the server door and on the bench). */
export const FILE_BLOCK = { w: 156, h: 48, tag: '<html>', label: 'All About Cats' }

/** Continuity callback: the IP the DNS handed over in Chapter 2 — printed on every header. */
export const SERVER_IP = '93.184.216.34'

// ---- bench stages (deterministic beat → stage mapping) ------------------------
export const STAGE_AT_BEAT: Record<number, string> = {
  6: 'slot1',
  7: 'park',
  8: 'counter',
  9: 'ask',
  10: 'merge',
}

export const STAGE_CAPTIONS: Record<string, string> = {
  slot1: 'piece 1 \u2192 slot 1',
  park: 'out-of-order pieces park in their own slots',
  counter: 'the ACK moves forward, in order',
  ask: 'ask for exactly the missing piece',
  merge: 'stitched in order: 1, 2, 3, 4, 5',
}

/** Slots already filled (chip present, settled) at the START of each bench beat. */
export const SLOTS_AT_BEAT: Record<number, number[]> = {
  6: [],
  7: [1],
  8: [1, 3, 5],
  9: [1, 2, 3, 5],
  10: [1, 2, 3, 4, 5],
}

/** Pieces descending from the port THIS beat, with their descent window [a, b].
 *  The keeper (spark) walks slot-to-slot and dwells where each piece lands
 *  (beats.ts holdAt), so the descent-end matches the keeper's arrival. */
export interface Incoming { n: number; a: number; b: number }
export const INCOMING: Record<string, Incoming[]> = {
  slot1: [{ n: 1, a: 0, b: 1 }],
  park: [
    { n: 3, a: 0.1, b: 0.5 },
    { n: 5, a: 0.55, b: 0.98 },
  ],
  counter: [{ n: 2, a: 0.05, b: 0.6 }],
  ask: [{ n: 4, a: 0.45, b: 0.85 }],
}

/** ACK counter value at each bench beat's START / END, and the in-beat flip time. */
export const ACK_START: Record<number, number> = { 6: 0, 7: 1, 8: 1, 9: 3, 10: 5 }
export const ACK_AT_BEAT: Record<number, number> = { 6: 1, 7: 1, 8: 3, 9: 5, 10: 5 }
export const ACK_FLIP: Record<number, number> = { 6: 0.97, 7: 2, 8: 0.62, 9: 0.88, 10: 2 }
