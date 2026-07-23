// rendering/composer/renderer.ts
// The single rendering entry point. The Orchestrator calls ONLY this.
//
//   render(ctx, presentationState, chapter, entityRegistry?)
//
// Pipeline:
//   drawBackground  →  applyCamera + renderScene  →  drawVignette  →  fadeOverlay
//
// The composer imports ZERO chapter barrels. It reads camera info from the
// chapter's active SceneDescription.

import type { Chapter } from '../../chapter-loader/types'
import type { EntityRenderer } from '../types'
import type { PresentationState } from '../types'
import { drawBackground, drawVignette } from '../primitives/background'
import { renderScene } from '../scenes/scene-renderer'

export function render(
  ctx: CanvasRenderingContext2D,
  s: PresentationState,
  chapter: Chapter,
  entityRegistry?: Record<string, EntityRenderer>,
) {
  // 1. background (screen-space)
  ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0)
  drawBackground(ctx, s.W, s.H, s.t)

  // 2. scene (world-space camera). The transform is owned by the engine camera
  //    (T_user ∘ T_fit, CANVAS_NAVIGATION §9); the composer only consumes it, so
  //    pan/zoom live exactly once in the platform and chapters never supply them.
  ctx.setTransform(
    s.dpr * s.camera.zoomTotal, 0, 0, s.dpr * s.camera.zoomTotal,
    s.dpr * s.camera.offX, s.dpr * s.camera.offY,
  )
  renderScene(ctx, s, chapter, entityRegistry)

  // 3. post (screen-space)
  ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0)
  if (s.fade > 0.001) {
    ctx.fillStyle = `rgba(7,10,28,${s.fade})`
    ctx.fillRect(0, 0, s.W, s.H)
  }
  drawVignette(ctx, s.W, s.H)
}
