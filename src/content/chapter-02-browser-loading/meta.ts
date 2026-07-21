// content/chapter-02-browser-loading/meta.ts
// Metadata for Chapter 2. Consumed eagerly by the chapter registry.

import type { ChapterMeta } from '../../chapter-loader/types'
import thumb from './assets/thumbnail.jpg'

const meta: ChapterMeta = {
  id: 'chapter-02-browser-loading',
  slug: 'chapter-02-browser-loading',
  order: 2,
  status: 'available',
  thumbnail: thumb,
  title: { en: 'How does a website reach my screen?', vi: 'Một trang web đến màn hình của mình như thế nào?' },
  subtitle: { en: "A packet's journey from server to browser.", vi: 'Hành trình của một gói tin từ server đến trình duyệt.' },
  accent: '#22d3ee',
  // Lazy-load the full declarative Chapter — the Viewer loads it through the
  // registry; adding this line (plus the chapter folder) was the only edit
  // needed to ship the chapter (DESIGN.md §14.6 claim verified in practice).
  loadStory: () => import('./index').then((m) => m.chapter),
}
export default meta
