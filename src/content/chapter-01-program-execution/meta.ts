// content/chapter-01-program-execution/meta.ts
// Metadata for Chapter 1. Consumed eagerly by the chapter registry.

import type { ChapterMeta } from '../../chapter-loader/types'
import thumb from './assets/thumbnail.jpg'

const meta: ChapterMeta = {
  id: 'chapter-01-program-execution',
  slug: 'chapter-01-program-execution',
  order: 1,
  status: 'available',
  thumbnail: thumb,
  title: {
    en: 'How does a computer run my program?',
    vi: 'Máy tính chạy chương trình của mình như thế nào?',
  },
  subtitle: {
    en: 'Follow a single task from click to pixel.',
    vi: 'Theo dấu một tác vụ từ cú click đến điểm ảnh.',
  },
  accent: '#fb923c',
  // Lazy-load the full declarative Chapter (scenes). The current Viewer still
  // imports the runtime symbols statically from this folder's index; this
  // loadStory is the future-proof entry for a chapter-agnostic Viewer.
  loadStory: () => import('./index').then((m) => m.chapter),
}

export default meta
