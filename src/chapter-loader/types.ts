// chapter-loader/types.ts
// The GENERIC chapter contract — the single surface the Engine and Renderer
// consume. Chapters describe; they never render and never advance state.
//
// Phase 4 additions: the contract now carries overlays, the program (if any),
// per-scene bounding boxes + camera padding, hit-zones, and a small set of
// "dynamic state" hooks the chapter provides and the engine/renderer read.
// This removes the last Chapter-1 dependencies from the runtime.

import type { Lang, LocalizedText, Vec2, BBox } from '../shared/types'
export type { Lang, LocalizedText, Vec2, BBox }

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
  travel?: { from: number; to: number; holdAt?: { index: number; from: number; to: number } }
  rest?: { at: number }
  /** v1.4.3 (F71, owner round 16): narration must RIDE WITH the spark. When
      set, the panel swaps to the NEXT beat's line as soon as this beat's
      elapsed fraction reaches `nextLineFrom` — e.g. the "HTTP request" line
      appears while the spark is still closing in on the HTTPS lock. Line
      ownership stays with the beat; only the panel display shifts earlier. */
  nextLineFrom?: number
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
  /**
   * Compute chapter-specific execution state from generic timing data.
   * Called by the engine every frame during the 'run' beat.
   * Returns the execution state object that renderers and orchestrator read,
   * or null if no execution is active.
   *
   * The engine computes generic timing (instrIdx, ft, stage, sp, finished)
   * using the chapter's StageModel. This hook adds chapter-specific state
   * (register values, memory values, etc.) on top of that timing.
   */
  computeExecution?: (timing: {
    instrIdx: number
    ft: number
    stage: string
    sp: number
    finished: boolean
    execTime: number
  }) => unknown
  /**
   * Provide the spark's seam position when fading out of a scene.
   * Called by the engine during scene transitions. Returns the world-space
   * position where the spark should hold during the fade-out, or null to
   * use the generic fallback (last point of the scene's path).
   *
   * This hook replaces hardcoded scene-name checks in the engine.
   */
  seamPosition?: (scene: string) => Vec2 | null
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
  /**
   * Chapter-specific entity renderers. The orchestrator merges these with the
   * shared registry before passing to the scene renderer. Each renderer
   * conforms to the EntityRenderer signature from rendering/types.ts.
   * Typed as Record<string, unknown> to avoid circular dependency;
   * consumers cast to EntityRenderer at the call site.
   */
  entityRenderers?: Record<string, unknown>
}
