// rendering/parts/registry.ts
// Dispatch table: EntityDescription.kind → entity renderer.
// A future chapter adds its own kinds here (or a chapter-scoped registry in a
// later phase). The Viewer never switches on kind.

import type { EntityRenderer } from '../types'
import { drawSSD } from './storage-renderer'
import { drawRAM } from './memory-renderer'
import { drawCPUChip } from './processor-renderer'
import { drawGPU, drawMonitor } from './display-renderer'
import { drawGeneric } from './generic-renderer'

export const entityRenderers: Record<string, EntityRenderer> = {
  ssd: drawSSD,
  ram: drawRAM,
  'cpu-chip': drawCPUChip,
  gpu: drawGPU,
  monitor: drawMonitor,
}

export function renderEntity(
  ctx: CanvasRenderingContext2D,
  kind: string,
  s: import('../types').PresentationState,
  e: import('../types').Renderable,
  active: boolean,
) {
  const fn = entityRenderers[kind] ?? drawGeneric
  fn(ctx, s, e, active)
}
