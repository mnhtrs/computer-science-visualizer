// scenes/03-memory.ts — Act 3: working memory (RAM).
// Where the program lands after being loaded, ready for the CPU.

import { BUS_Y } from './01-desktop'
import type { PartSpec } from '../types'

export const ram: PartSpec = {
  id: 'ram',
  kind: 'ram',
  pos: { x: 590, y: BUS_Y },
  color: '#a78bfa',
  name: 'RAM',
  gloss: {
    en: 'A fast little shelf. It holds the program the brain is running right now, one line at a time.',
    vi: 'Một cái kệ nhỏ, rất nhanh. Nó giữ chương trình mà não đang chạy, từng dòng một.',
  },
}
