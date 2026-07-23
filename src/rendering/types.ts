// rendering/types.ts
// The contract between the Viewer and the rendering layer. The Viewer owns a
// state object structurally compatible with PresentationState and hands it to
// Renderer.render(). Rendering never imports the Viewer.

import type { Lang, Vec2 } from '../chapter-loader/types'

export interface PresentationState {
  phase: string
  beatIndex: number
  beatElapsed: number
  t: number
  scene: string
  fade: number
  fading: string
  active: string | null
  sparkPos: Vec2
  sparkScale: number
  looping: boolean
  programDone: boolean
  trail: Vec2[]
  lang: Lang
  /** Chapter-specific execution state. Renderers cast to the appropriate type. */
  executionState: unknown
  W: number
  H: number
  dpr: number
  /** Composed camera transform (T_user ∘ T_fit), written by the engine each frame
   *  (Global Canvas Navigation). The renderer only reads the composed values; it
   *  never owns pan/zoom. See docs/architecture/CANVAS_NAVIGATION.md §9. */
  camera: { zoomTotal: number; offX: number; offY: number }
}

/** Minimal shape every entity renderer needs from the thing it draws. */
export interface Renderable {
  pos: Vec2
  color: string
  name: string
  labelSize?: number
  extra?: Record<string, unknown>
}

export type EntityRenderer = (
  ctx: CanvasRenderingContext2D,
  s: PresentationState,
  e: Renderable,
  active: boolean,
) => void
