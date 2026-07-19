// scenes/07-result.ts — Act 7: the GPU draws, the monitor shows, done.
// The GPU entity lives on the cable between case and monitor; the Monitor
// (declared in act 01) is what ultimately displays the result.

import { BUS_Y } from './01-desktop'
import type { PartSpec } from '../types'

export const gpu: PartSpec = {
  id: 'gpu',
  kind: 'gpu',
  pos: { x: 780, y: BUS_Y },
  color: '#4ade80',
  name: 'GPU',
  gloss: {
    en: 'A second brain, built to draw. When the computer needs to show a picture, it paints millions of tiny dots at once. That is how pictures and games appear.',
    vi: 'Một cái não thứ hai, chuyên để vẽ. Khi cần hiện hình lên, nó tô hàng triệu chấm nhỏ cùng lúc. Đó là cách hình ảnh và trò chơi hiện lên.',
  },
}
