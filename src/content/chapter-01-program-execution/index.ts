// content/chapter-01-program-execution/index.ts
// Chapter 1 — assembled into the declarative Chapter contract.
//
// The Viewer, Engine, and Renderer consume ONLY this Chapter object. They
// never import this folder's geometry/program directly. Everything they need
// — scenes, entities, infrastructure, overlays, program, runtime hooks, hit
// zones, UI labels — is declared here.

import type {
  Chapter,
  ChapterRuntime,
  EntityDescription,
  HitZone,
  NarrationHooks,
  ProgramInstruction,
  SceneDescription,
} from '../../chapter-loader/types'
import meta from './meta'

// ---- runtime re-exports (for any transitional consumers; Phase 4 viewers
//      should not need these — they should use `chapter` only) -------------
export * from './types'
export * from './scenes/01-desktop'
export * from './scenes/02-storage'
export * from './scenes/03-memory'
export * from './scenes/04-fetch'
export * from './scenes/05-decode'
export * from './scenes/06-execute'
export * from './scenes/07-result'
export * from './narration/labels'
export * from './narration/cycle'
export * from './narration/operations'
export * from './narration/beats'

// ---- geometry + content imports for assembly -----------------------------
import {
  monitor, bus, cpu,
  BBOX_PC, CASE, BUS_RAIL, CABLE_FROM, CABLE_TO, SCREEN, FILE_BTN, PATH,
} from './scenes/01-desktop'
import { ssd } from './scenes/02-storage'
import { ram } from './scenes/03-memory'
import { gpu } from './scenes/07-result'
import {
  BBOX_CPU, DIE, CU_POS, REG_POS, ALU_POS,
  LIST_X, LIST_W, LIST_TOP, ROW_H, LIST_RIGHT, STAGE_TRACKER_Y, rowY,
} from './scenes/04-fetch'
import { cu } from './scenes/05-decode'
import {
  registers, alu, PROGRAM, REG_NAMES, REG_STATES, freshState, applyInstr as applyInstrLocal,
} from './scenes/06-execute'
import {
  STAGES, STAGE_LABEL, STAGE_BOUNDS, PER_INSTR, EXEC_OFFSET, TOTAL_STEPS,
  stageLine as stageLineLocal,
} from './narration/cycle'
import { currentOpText as currentOpTextOp } from './narration/operations'
import { beats as beatsLocal, RUN_I } from './narration/beats'
import {
  chapterTitle, waitingLine, finaleLine, insideCpuTag,
  programLabel, pcLabel, memLabel, doneLabel,
} from './narration/labels'

// ---- part records (still useful for the Viewer's gloss lookup) -----------
export const parts = { monitor, ssd, ram, cpu, gpu, bus }
export const cpuParts = { cu, registers, alu }

// ---- build declarative scenes --------------------------------------------
const toEntity = (
  p: typeof monitor,
  sceneId: string,
  extra?: Record<string, unknown>,
): EntityDescription => ({
  id: String(p.id),
  kind: p.kind ?? String(p.id),
  pos: p.pos,
  color: p.color,
  name: p.name,
  gloss: p.gloss,
  scene: sceneId,
  extra,
})

const desktopScene: SceneDescription = {
  id: 'pc',
  bbox: BBOX_PC,
  cameraPad: 0.9,
  path: PATH,
  entities: [
    toEntity(monitor, 'pc', {
      screen: SCREEN,
      fileBtn: FILE_BTN,
      doneLabel,
    }),
    toEntity(ssd, 'pc'),
    toEntity(ram, 'pc'),
    toEntity(cpu, 'pc'),
    toEntity(gpu, 'pc'),
    toEntity(bus, 'pc'),
  ],
  infrastructure: [
    { id: 'case', kind: 'case', rect: CASE },
    { id: 'cable', kind: 'cable', points: [CABLE_FROM, CABLE_TO], color: bus.color } as never,
    { id: 'bus-rail', kind: 'bus-rail', points: BUS_RAIL, color: bus.color } as never,
  ],
}

const cpuScene: SceneDescription = {
  id: 'cpu',
  bbox: BBOX_CPU,
  cameraPad: 0.94,
  entities: [
    toEntity({ ...cu, pos: CU_POS } as never, 'cpu'),
    toEntity({ ...registers, pos: REG_POS } as never, 'cpu'),
    toEntity({ ...alu, pos: ALU_POS } as never, 'cpu'),
  ],
  infrastructure: [
    { id: 'die', kind: 'die', rect: DIE },
    { id: 'die-internal-rail', kind: 'die-internal-rail', points: [{ x: CU_POS.x, y: CU_POS.y + 30 }, { x: ALU_POS.x, y: ALU_POS.y - 34 }] },
  ],
  overlays: [
    { id: 'stage-tracker', kind: 'stage-tracker' },
    { id: 'program-list', kind: 'program-list' },
  ],
  extra: {
    listX: LIST_X,
    listW: LIST_W,
    listTop: LIST_TOP,
    rowH: ROW_H,
    railColor: ram.color,
    trackerY: STAGE_TRACKER_Y,
  },
}

// ---- program -------------------------------------------------------------
const programInstructions: ProgramInstruction[] = PROGRAM.map((ins) => ({
  text: ins.text,
  kind: ins.kind,
  usesAlu: ins.usesAlu,
  op: ins.op,
  dst: ins.dst,
  src: ins.src,
  imm: ins.imm,
  plain: ins.plain,
  stageEndpoints: stageEndpointsFor(ins),
}))

function stageEndpointsFor(ins: typeof PROGRAM[number]): Record<string, [string, string]> {
  const k = ins.kind
  const m: Record<string, [string, string]> = {}
  m.fetch = ['list', 'cu']
  m.decode = ['cu', 'cu']
  if (k === 'arith') {
    m.execute = ['cu', 'alu']
    m.writeback = ['alu', 'reg']
    m.pcinc = ['reg', 'listNext']
  } else if (k === 'store') {
    m.execute = ['cu', 'reg']
    m.writeback = ['reg', 'mem']
    m.pcinc = ['mem', 'listNext']
  } else if (k === 'halt') {
    m.execute = ['cu', 'cu']
    m.writeback = ['cu', 'cu']
    m.pcinc = ['cu', 'cu']
  } else {
    // load, mov
    m.execute = ['cu', 'reg']
    m.writeback = ['reg', 'reg']
    m.pcinc = ['reg', 'listNext']
  }
  return m
}

// ---- runtime hooks (the chapter provides, engine/renderer call) ----------
function nodePos(id: string, instrIdx: number) {
  switch (id) {
    case 'cu': return CU_POS
    case 'reg': return REG_POS
    case 'alu': return ALU_POS
    case 'list': return { x: LIST_RIGHT, y: rowY(instrIdx) }
    case 'listNext': return { x: LIST_RIGHT, y: rowY(Math.min(instrIdx + 1, PROGRAM.length - 1)) }
    case 'mem': {
      const memY = LIST_TOP + PROGRAM.length * ROW_H + 22
      return { x: LIST_X + 115, y: memY }
    }
    default: return CU_POS
  }
}
function stateAfter(k: number) {
  return REG_STATES[Math.max(0, Math.min(k, REG_STATES.length - 1))]
}
function displayStateHook(instrIdx: number, ft: number) {
  const base = REG_STATES[instrIdx]
  const regs = base.regs.slice()
  let mem = base.mem
  if (ft >= STAGE_BOUNDS[3] && instrIdx < PROGRAM.length) {
    const ins = PROGRAM[instrIdx]
    const next = REG_STATES[instrIdx + 1]
    if (ins.mn === 'STORE') mem = next.mem
    else if (ins.dst !== undefined) regs[ins.dst] = next.regs[ins.dst]
  }
  return { regs, mem }
}

const runtime: ChapterRuntime = {
  nodePos,
  stateAfter,
  applyInstr: (state, ins) => applyInstrLocal(state, ins as never),
  displayState: displayStateHook,
  totalSteps: () => TOTAL_STEPS,
  labels: { programLabel, pcLabel, memLabel },
}

// ---- narration hooks -----------------------------------------------------
const narration: NarrationHooks = {
  stageLine: (ins, stage, lang) => stageLineLocal(ins as never, stage as never, lang),
  currentOp: (ins, _regs, lang, done) => {
    const idx = programInstructions.indexOf(ins)
    const preState = idx >= 0 ? stateAfter(idx) : { regs: _regs, mem: null }
    return currentOpTextOp(ins as never, preState, lang, done)
  },
}

// ---- hit zones -----------------------------------------------------------
const hitZones: HitZone[] = [
  {
    id: 'file',
    hits: (w) => Math.abs(w.x - FILE_BTN.x) < 40 && Math.abs(w.y - FILE_BTN.y) < 48,
  },
]

// ---- the assembled Chapter -----------------------------------------------
export const chapter: Chapter = {
  meta,
  scenes: [desktopScene, cpuScene],
  timeline: {
    beats: beatsLocal.map((b) => ({
      ...b,
      active: (b.active ?? null) as string | null,
    })),
    fadeDuration: 450,
  },
  program: {
    instructions: programInstructions,
    registerNames: REG_NAMES,
    stageModel: {
      stages: [...STAGES] as string[],
      labels: STAGE_LABEL,
      bounds: STAGE_BOUNDS,
      perInstr: PER_INSTR,
      execOffset: EXEC_OFFSET,
    },
  },
  narration,
  runtime,
  hitZones,
  ui: {
    chapterTitle,
    waitingLine,
    finaleLine,
    insideCpuTag,
    doneLabel,
  },
}

// Runtime constants the Viewer needs for playback logic.
export { RUN_I }
export const EXEC_DURATION = PROGRAM.length * PER_INSTR
