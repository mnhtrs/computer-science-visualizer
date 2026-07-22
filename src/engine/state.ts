// engine/state.ts
// Engine state types + factory. Pure data — no React, no DOM, no canvas.

import type { Lang, Vec2 } from '../chapter-loader/types'

export type Phase = 'waiting' | 'playing' | 'paused' | 'done'
export type FadeDir = 'none' | 'out' | 'in'

/** The full per-frame state the Engine owns and the Renderer reads. */
export interface PresentationState {
  phase: Phase
  beatIndex: number
  beatElapsed: number
  lastTs: number
  t: number
  scene: string
  fade: number
  fading: FadeDir
  active: string | null
  sparkPos: Vec2
  sparkScale: number
  looping: boolean
  programDone: boolean
  trail: Vec2[]
  lang: Lang
  /** Chapter-specific execution state. The engine stores this but does not
   *  interpret its shape. The chapter's computeExecution hook produces it.
   *  Renderers and orchestrator read it with chapter-specific typing. */
  executionState: unknown
  W: number
  H: number
  dpr: number
}

// `sceneId` lets any chapter declare its own first scene (Ch-01 passes 'pc';
// the default keeps every older call site valid).
export function createPresentationState(sparkStart: Vec2, sceneId = 'pc'): PresentationState {
  return {
    phase: 'waiting',
    beatIndex: 0,
    beatElapsed: 0,
    lastTs: 0,
    t: 0,
    scene: sceneId,
    fade: 0,
    fading: 'none',
    active: null,
    sparkPos: { ...sparkStart },
    sparkScale: 0,
    looping: false,
    programDone: false,
    trail: [],
    lang: 'en',
    executionState: null,
    W: 0,
    H: 0,
    dpr: 1,
  }
}
