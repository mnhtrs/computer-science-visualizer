// rendering/parts/registry.ts
// Shared entity renderer dispatch table. Contains only renderers that are
// chapter-agnostic (shared across all chapters). Chapter-specific renderers
// are registered in the chapter's own content folder and merged at runtime.

import type { EntityRenderer } from '../types'
import { drawSSD } from './storage-renderer'
import { drawRAM, drawRegisters } from './memory-renderer'
import { drawCPUChip, drawControlUnit, drawALU } from './processor-renderer'
import { drawGPU, drawMonitor } from './display-renderer'
import { drawGeneric } from './generic-renderer'

/** Shared entity renderers — available to all chapters. */
export const sharedEntityRenderers: Record<string, EntityRenderer> = {
  ssd: drawSSD,
  ram: drawRAM,
  'cpu-chip': drawCPUChip,
  'control-unit': drawControlUnit,
  registers: drawRegisters,
  alu: drawALU,
  gpu: drawGPU,
  monitor: drawMonitor,
}

/**
 * Render an entity by kind, using the provided renderer map.
 * Falls back to drawGeneric for unknown kinds.
 */
export function renderEntity(
  ctx: CanvasRenderingContext2D,
  kind: string,
  s: import('../types').PresentationState,
  e: import('../types').Renderable,
  active: boolean,
  registry: Record<string, EntityRenderer> = sharedEntityRenderers,
) {
  const fn = registry[kind] ?? drawGeneric
  fn(ctx, s, e, active)
}
