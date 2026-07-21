// content/chapter-02-browser-loading/types.ts
// Chapter-local types. The generic interfaces live in chapter-loader/types.

import type { LocalizedText, Vec2 } from '../../chapter-loader/types'

/** Legacy alias so narration/geometry code reads like Chapter 01. */
export type L = LocalizedText
export type Scene = 'web' | 'engine'

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** A part as the chapter describes it (mirrors Ch-01's PartSpec). */
export interface PartSpec {
  id: string
  kind?: string
  pos: Vec2
  color: string
  name: string
  gloss: LocalizedText
  labelSize?: number
}
