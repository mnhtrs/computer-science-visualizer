// chapter-loader/types.ts
// The GENERIC chapter contract — the single surface the Engine and Renderer
// consume. Chapters describe; they never render and never advance state.
//
// Phase 4 additions: the contract now carries overlays, the program (if any),
// per-scene bounding boxes + camera padding, hit-zones, and a small set of
// "dynamic state" hooks the chapter provides and the engine/renderer read.
// This removes the last Chapter-1 dependencies from the runtime.

export type Lang = 'en' | 'vi'

/** A piece of text in both supported languages. */
export interface LocalizedText {
  en: string
  vi: string
}

export type Vec2 = { x: number; y: number }

export interface BBox {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export type ChapterStatus = 'available' | 'coming-soon'

/** Lightweight metadata — all the Home page needs. */
export interface ChapterMeta {
  /** Must match the chapter's folder name. */
  id: string
  /** URL-safe identifier used in the hash route. */
  slug: string
  /** Sort key on the Home page. */
  order: number
  status: ChapterStatus
  title: LocalizedText
  subtitle: LocalizedText
  /** Hex color used for the card accent + viewer chrome. */
  accent: string
  /** Thumbnail image URL (Vite-imported). Absent for coming-soon chapters. */
  thumbnail?: string
  /** Lazy-load the full Chapter. Absent for coming-soon chapters. */
  loadStory?: () => Promise<Chapter>
}

// ---------------------------------------------------------------------------
// Entities + scenes (declarative)
// ---------------------------------------------------------------------------

/**
 * One drawable thing. `kind` selects a renderer from the rendering registry;
 * chapters never call the canvas. `extra` is a chapter-defined bag of
 * supplementary fields a renderer may need (e.g. register count for the
 * registers panel). Renderers read it defensively.
 */
export interface EntityDescription {
  id: string
  kind: string
  pos: Vec2
  color: string
  name: string
  gloss: LocalizedText
  scene?: string
  extra?: Record<string, unknown>
  labelSize?: number
}

/** An overlay the chapter wants drawn on top of the scene (HUD-style). */
export interface OverlayDescription {
  id: string
  /** Renderer key, e.g. 'stage-tracker', 'program-list'. */
  kind: string
  /** When to show it (e.g. 'always' | 'run'). */
  when?: string
}

/** Scene-level infrastructure that isn't a point entity (case, bus, die…). */
export interface InfrastructureDescription {
  id: string
  kind: string
  /** Geometry the renderer needs (polyline, rect, etc.). */
  points?: Vec2[]
  rect?: { x: number; y: number; w: number; h: number }
}

export interface SceneDescription {
  id: string
  bbox: BBox
  /** Camera padding for fit(). */
  cameraPad?: number
  entities: EntityDescription[]
  infrastructure?: InfrastructureDescription[]
  overlays?: OverlayDescription[]
  /** The protagonist's continuous path inside this scene. */
  path?: Vec2[]
  /** Arbitrary chapter-defined fields the renderers read (e.g. list geometry,
   *  tracker y, scene colors). Renderers read defensively. */
  extra?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Program / instruction cycle (only CPU-style chapters populate this)
// ---------------------------------------------------------------------------

export interface ProgramInstruction {
  text: string
  kind: string // 'load' | 'mov' | 'arith' | 'store' | 'halt'
  usesAlu?: boolean
  op?: string
  dst?: number
  src?: number
  imm?: number
  plain: LocalizedText
  /** Stage endpoints (node ids) per stage of the cycle. Optional: chapters
   *  that don't have a fetch/decode/… cycle leave this absent. */
  stageEndpoints?: Record<string, [string, string]>
}

export interface StageModel {
  stages: string[] // ['fetch','decode','execute','writeback','pcinc']
  labels: Record<string, LocalizedText>
  bounds: number[] // fractions of PER_INSTR each stage occupies
  perInstr: number // ms per instruction
  execOffset: number // ms of intro before execution begins
}

// ---------------------------------------------------------------------------
// Timeline + narration
// ---------------------------------------------------------------------------

export interface BeatDescription {
  id: string
  line: LocalizedText
  duration: number
  scene?: string
  active?: string | null
  travel?: { from: number; to: number }
  rest?: { at: number }
  emerge?: boolean
  effect?: string // 'run' | 'loop' | …
}

export interface NarrationHooks {
  /** Per-stage line, given the current instruction + stage + language. */
  stageLine?: (ins: ProgramInstruction, stage: string, lang: Lang) => string
  /** "Now doing" hint, given the instruction + register state + language. */
  currentOp?: (ins: ProgramInstruction, regs: (number | null)[], lang: Lang, done?: boolean) => string
}

// ---------------------------------------------------------------------------
// Dynamic state (what the engine computes each frame for CPU-style chapters)
// ---------------------------------------------------------------------------

/** Engine-owned per-frame state for a CPU-style chapter. */
export interface ExecutionState {
  instrIdx: number
  stage: string
  stageProgress: number
  stageIndex: number
  regs: (number | null)[]
  mem: number | null
  done: boolean
}

export interface HitZone {
  id: string
  /** World-space hit test. */
  hits: (w: Vec2) => boolean
}

// ---------------------------------------------------------------------------
// Chapter → engine hooks (the chapter provides, the engine calls)
// ---------------------------------------------------------------------------

export interface ChapterRuntime {
  /** Node position by id (e.g. 'cu', 'reg', 'alu', 'list', 'listNext'). */
  nodePos?: (id: string, instrIdx: number) => Vec2
  /** Precomputed register/memory state after `k` instructions. */
  stateAfter?: (k: number) => { regs: (number | null)[]; mem: number | null }
  /** Apply one instruction to a state, returning the next state. */
  applyInstr?: (state: { regs: (number | null)[]; mem: number | null }, ins: ProgramInstruction) => { regs: (number | null)[]; mem: number | null }
  /** Display state at a given (instrIdx, ft) — for live register display. */
  displayState?: (instrIdx: number, ft: number) => { regs: (number | null)[]; mem: number | null }
  /** The number of micro-steps in the cycle (instructions × stages). */
  totalSteps?: () => number
  /** Labels reused by overlays (program/PC/memory/etc.). */
  labels?: Record<string, LocalizedText>
}

// ---------------------------------------------------------------------------
// The full Chapter object
// ---------------------------------------------------------------------------

export interface Chapter {
  meta: ChapterMeta
  scenes: SceneDescription[]
  timeline: {
    beats: BeatDescription[]
    fadeDuration: number
  }
  /** Present only for chapters with an instruction cycle. */
  program?: {
    instructions: ProgramInstruction[]
    registerNames: string[]
    stageModel: StageModel
  }
  narration?: NarrationHooks
  runtime?: ChapterRuntime
  /** Hit zones for click handling (file icon, etc.). */
  hitZones?: HitZone[]
  /** UI text the Viewer itself needs (titles, button labels, …). */
  ui?: Record<string, LocalizedText>
}
