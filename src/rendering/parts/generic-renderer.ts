// rendering/parts/generic-renderer.ts
// Fallback renderer for any entity kind the rendering layer doesn't recognise.
// Ensures a future chapter's unknown entities never crash the frame loop.

import type { EntityRenderer } from '../types'
import { drawName } from '../primitives/text'

export const drawGeneric: EntityRenderer = (ctx, _s, e, _active) => {
  drawName(ctx, e.pos, e.name, e.color, false, 26, e.labelSize ?? 15)
}
