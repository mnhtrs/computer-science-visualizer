// chapter-loader/registry.ts
// Automatic chapter discovery via Vite's import.meta.glob.
// Adding a chapter = creating content/chapter-NN-…/meta.ts. No edit here.

import type { ChapterMeta } from './types'

// Eagerly import every chapter's meta so the Home page is synchronous.
const modules = import.meta.glob('../content/*/meta.ts', { eager: true }) as Record<
  string,
  { default: ChapterMeta }
>

function validate(meta: ChapterMeta, key: string): meta is ChapterMeta {
  const ok =
    !!meta &&
    typeof meta.id === 'string' &&
    typeof meta.slug === 'string' &&
    typeof meta.order === 'number' &&
    (meta.status === 'available' || meta.status === 'coming-soon')
  if (!ok) {
    // Fail loudly at boot if a chapter is malformed — better than a silent card.
    console.error(`[chapter-loader] invalid meta.ts at ${key}:`, meta)
  }
  return ok
}

export const chapters: ChapterMeta[] = Object.entries(modules)
  .filter(([key, m]) => validate(m.default, key))
  .map(([, m]) => m.default)
  .sort((a, b) => a.order - b.order)

export function getChapter(id: string): ChapterMeta | undefined {
  return chapters.find((c) => c.id === id)
}

export function isAvailable(id: string): boolean {
  return getChapter(id)?.status === 'available'
}
