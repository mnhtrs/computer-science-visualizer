// content/chapter-03-across-the-internet/meta.ts
// Metadata for Chapter 3 (the complete redesign — the former
// chapter-03-click-to-action storyboard is retired). Consumed eagerly by the
// chapter registry; adding this folder was the ONLY change needed outside
// docs (DESIGN.md §14.6 auto-discovery claim, verified again here).

import type { ChapterMeta } from '../../chapter-loader/types'
import thumb from './assets/thumbnail.jpg'

const meta: ChapterMeta = {
  id: 'chapter-03-across-the-internet',
  slug: 'chapter-03-across-the-internet',
  order: 3,
  status: 'available',
  thumbnail: thumb,
  title: {
    en: 'How does data travel from Server to Browser?',
    vi: 'Dữ liệu đi từ Server đến Browser như thế nào?',
  },
  subtitle: {
    en: "Follow the page's bytes across the Internet.",
    vi: 'Theo những byte của trang web vượt qua Internet.',
  },
  accent: '#a78bfa',
  loadStory: () => import('./index').then((m) => m.chapter),
}
export default meta
