// scenes/02-storage.ts — Act 2: long-term storage (SSD).
// Where the operating system reads the program from before the CPU ever runs.

import { BUS_Y } from './01-desktop'
import type { PartSpec } from '../types'

export const ssd: PartSpec = {
  id: 'ssd',
  kind: 'ssd',
  pos: { x: 320, y: BUS_Y },
  color: '#22d3ee',
  name: 'SSD',
  gloss: {
    en: 'This box keeps all your files and programs. It remembers them even when the computer is off.',
    vi: 'Cái hộp này giữ toàn bộ tệp và chương trình. Nó nhớ hết, kể cả khi máy đã tắt.',
  },
}
