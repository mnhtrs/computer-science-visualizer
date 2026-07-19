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
  // CPU-style execution state (unused by non-CPU chapters)
  execInstrIdx: number
  execStage: string
  execStageSp: number
  execStageIdx: number
  execRegs: (number | null)[]
  execMem: number | null
  execDone: boolean
  W: number
  H: number
  dpr: number
}

export function createPresentationState(sparkStart: Vec2): PresentationState {
  return {
    phase: 'waiting',
    beatIndex: 0,
    beatElapsed: 0,
    lastTs: 0,
    t: 0,
    scene: 'pc',
    fade: 0,
    fading: 'none',
    active: null,
    sparkPos: { ...sparkStart },
    sparkScale: 0,
    looping: false,
    programDone: false,
    trail: [],
    lang: 'en',
    execInstrIdx: 0,
    execStage: '',
    execStageSp: 0,
    execStageIdx: -1,
    execRegs: [],
    execMem: null,
    execDone: false,
    W: 0,
    H: 0,
    dpr: 1,
  }
}
