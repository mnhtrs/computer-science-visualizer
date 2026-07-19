// Chapter 2 — coming soon. Only metadata; no scenes/story yet.
import type { ChapterMeta } from '../../chapter-loader/types'
import thumb from './assets/thumbnail.jpg'

const meta: ChapterMeta = {
  id: 'chapter-02-browser-loading',
  slug: 'chapter-02-browser-loading',
  order: 2,
  status: 'coming-soon',
  thumbnail: thumb,
  title: { en: 'How does a website reach my screen?', vi: 'Một trang web đến màn hình của mình như thế nào?' },
  subtitle: { en: "A packet's journey from server to browser.", vi: 'Hành trình của một gói tin từ server đến trình duyệt.' },
  accent: '#22d3ee',
}
export default meta
