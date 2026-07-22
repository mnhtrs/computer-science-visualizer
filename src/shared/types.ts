// shared/types.ts
// Generic shared types used across all layers. No dependencies.
// Moved from chapter-loader/types.ts to provide a neutral type foundation.

export type Lang = 'en' | 'vi'

/** A piece of text in both supported languages. */
export interface LocalizedText {
  en: string
  vi: string
}

export type Vec2 = { x: number; y: number }

export interface BBox {
  minX: number
  maxX: number
  minY: number
  maxY: number
}
