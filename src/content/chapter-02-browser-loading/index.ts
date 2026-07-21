// content/chapter-02-browser-loading/index.ts
// Chapter 02 — barrel. The real assembly lives in assemble.ts (meta-free, so
// tooling can build the chapter outside Vite's asset pipeline); here we marry
// it to the chapter's meta and export the Chapter the registry expects.

import meta from './meta'
import { assembleChapter } from './assemble'

export * from './assemble'
export * from './types'

export const chapter = assembleChapter(meta)

export default chapter
