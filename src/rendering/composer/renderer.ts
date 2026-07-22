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
import { fit } from '../primitives/canvas-utils'
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

  // 2. scene (world-space camera, derived from the chapter's active scene)
  const sc = chapter.scenes.find((x) => x.id === s.scene) ?? chapter.scenes[0]
  const pad = sc?.cameraPad ?? 0.9
  const f = fit(sc?.bbox ?? { minX: 0, maxX: s.W, minY: 0, maxY: s.H }, s.W, s.H, pad)
  ctx.setTransform(s.dpr * f.zoom, 0, 0, s.dpr * f.zoom, s.dpr * f.ox, s.dpr * f.oy)
  renderScene(ctx, s, chapter, entityRegistry)

  // 3. post (screen-space)
  ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0)
  if (s.fade > 0.001) {
    ctx.fillStyle = `rgba(7,10,28,${s.fade})`
    ctx.fillRect(0, 0, s.W, s.H)
  }
  drawVignette(ctx, s.W, s.H)
}
