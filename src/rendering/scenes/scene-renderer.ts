// rendering/scenes/scene-renderer.ts
// Composes one scene from the chapter contract. The renderer picks the scene
// by id from `chapter.scenes`, draws its infrastructure, dispatches entities
// via the kind registry, draws overlays, then the payload.
//
// This file imports ZERO chapter barrels. It reads only:
//   - PresentationState (what is happening now)
//   - Chapter (the declarative description)
//   - rendering/primitives and rendering/parts (the draw routines)

import type { Chapter } from '../../chapter-loader/types'
import type { PresentationState, Renderable } from '../types'
import { drawSpark } from '../primitives/spark'
import { drawInfrastructure } from '../parts/infrastructure-renderer'
import { drawDie, dieGeometryFrom } from '../parts/die-renderer'
import { drawStageTracker, drawProgramList } from '../parts/hud-renderer'
import { drawRegistersBox } from '../parts/memory-renderer'
import { drawCUBox, drawALUBox } from '../parts/processor-renderer'
import { renderEntity } from '../parts/registry'

function toRenderable(e: Chapter['scenes'][number]['entities'][number]): Renderable {
  return { pos: e.pos, color: e.color, name: e.name, extra: e.extra, labelSize: e.labelSize } as Renderable & {
    extra?: Record<string, unknown>
  }
}

function renderScene(ctx: CanvasRenderingContext2D, s: PresentationState, chapter: Chapter) {
  const sc = chapter.scenes.find((x) => x.id === s.scene) ?? chapter.scenes[0]
  if (!sc) return

  // active entity rule: during fade-out the CPU is highlighted; otherwise the
  // beat's active entity, unless it belongs to a different scene.
  const activeId =
    s.fading === 'out'
      ? findEntityIdByKind(chapter, sc.id, 'cpu-chip')
      : s.active && entityBelongsTo(chapter, s.active, sc.id)
        ? s.active
        : null

  // ---- backdrop infrastructure ----
  if (sc.infrastructure) {
    // split: 'die' is handled specially (needs color); rest go through the
    // generic infrastructure renderer
    const dieGeo = dieGeometryFrom(sc.infrastructure, cpuColorOf(chapter))
    if (dieGeo) drawDie(ctx, dieGeo)
    const nonDie = sc.infrastructure.filter((i) => i.kind !== 'die' && i.kind !== 'die-internal-rail')
    if (nonDie.length) {
      const busActive = activeId === 'bus'
      drawInfrastructure(ctx, nonDie, busActive, s.t)
    }
  }

  // ---- overlays that belong to the scene's backdrop (stage tracker, etc.) ----
  for (const ov of sc.overlays ?? []) {
    if (ov.kind === 'stage-tracker') drawStageTracker(ctx, s, chapter)
    else if (ov.kind === 'program-list') drawProgramList(ctx, s, chapter)
  }

  // ---- entities ----
  for (const e of sc.entities) {
    // CPU-internal entity kinds are rendered via their specialised functions
    // because they need the chapter program/runtime; route them accordingly.
    if (e.kind === 'control-unit') {
      drawCUBox(ctx, s, s.t, toRenderable(e), chapter)
      continue
    }
    if (e.kind === 'registers') {
      drawRegistersBox(ctx, s, s.t, toRenderable(e), chapter)
      continue
    }
    if (e.kind === 'alu') {
      drawALUBox(ctx, s, s.t, toRenderable(e), chapter)
      continue
    }
    renderEntity(ctx, e.kind, s, toRenderable(e), activeId === e.id)
  }

  // ---- payload (the protagonist) ----
  drawSpark(ctx, s.sparkPos, s.sparkScale, s.trail)
}

// helpers -------------------------------------------------------------------
function cpuColorOf(chapter: Chapter): string {
  const cpu = chapter.scenes.flatMap((s) => s.entities).find((e) => e.kind === 'cpu-chip')
  return cpu?.color ?? '#fb923c'
}
function findEntityIdByKind(chapter: Chapter, sceneId: string, kind: string): string | null {
  const sc = chapter.scenes.find((s) => s.id === sceneId)
  const e = sc?.entities.find((e) => e.kind === kind)
  return e ? e.id : null
}
function entityBelongsTo(chapter: Chapter, entityId: string, sceneId: string): boolean {
  const sc = chapter.scenes.find((s) => s.id === sceneId)
  return !!sc?.entities.some((e) => e.id === entityId)
}

export { renderScene }
