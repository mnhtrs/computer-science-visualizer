// engine/state.ts
// Engine state types + factory. Pure data — no React, no DOM, no canvas.

import type { Lang, Vec2 } from '../chapter-loader/types'

export type Phase = 'waiting' | 'playing' | 'paused' | 'done'
export type FadeDir = 'none' | 'out' | 'in'

// ---- Global Canvas Navigation (frozen contract: docs/architecture/CANVAS_NAVIGATION.md) ----
// The viewer owns ONE camera. Chapters never touch it. The transform the renderer
// applies is T_user ∘ T_fit (§9): the chapter's auto-fit, then the user's zoom about
// the cursor and pan. pan/zoom/offset are in CSS pixels; zoom is relative to the fit.
export const NAV = {
  ZOOM_MIN: 0.5, // §4: finite, relative to the default fit
  ZOOM_MAX: 4,
  WHEEL_FACTOR: 0.0015,
  CLICK_DRAG_PX: 4, // below this a pointerdown→up counts as a click, not a pan (§6)
} as const

export interface Camera {
  panX: number // user pan, CSS px
  panY: number
  zoom: number // user zoom, relative to fit (1 = default)
  sceneToken: string // camera resets when the scene changes (§8 orientation)
  baseZoom: number // the chapter auto-fit zoom (T_fit)
  baseOx: number // the chapter auto-fit origin (T_fit)
  baseOy: number
  zoomTotal: number // composed zoom = baseZoom * zoom (T_user ∘ T_fit)
  offX: number // composed offset x, CSS px
  offY: number // composed offset y, CSS px
}

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
  camera: Camera
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
    camera: {
      panX: 0, panY: 0, zoom: 1, sceneToken: sceneId,
      baseZoom: 1, baseOx: 0, baseOy: 0, zoomTotal: 1, offX: 0, offY: 0,
    },
  }
}
