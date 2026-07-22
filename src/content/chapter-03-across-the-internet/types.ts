// content/chapter-03-across-the-internet/types.ts
// Chapter-local types. The generic interfaces live in chapter-loader/types.

import type { LocalizedText, Vec2 } from '../../chapter-loader/types'

export type Scene = 'wire' | 'bench'

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** A part as the chapter describes it (mirrors Ch-01/Ch-02 PartSpec). */
export interface PartSpec {
  id: string
  kind?: string
  pos: Vec2
  color: string
  name: string
  gloss: LocalizedText
  labelSize?: number
  extra?: Record<string, unknown>
}
