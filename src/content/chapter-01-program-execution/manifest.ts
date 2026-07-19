// content/chapter-01-program-execution/manifest.ts
// Optional asset manifest. Chapter 1 draws everything procedurally, so this
// is empty for now — the slot exists so a future chapter can list images,
// fonts, or sounds without inventing a new convention.

export interface ChapterManifest {
  images: string[]
  fonts: string[]
  audio: string[]
}

const manifest: ChapterManifest = {
  images: [],
  fonts: [],
  audio: [],
}

export default manifest
