// scenes/03-hardware.ts — the Chapter-01 hardware row, reinforced not re-taught.
// NIC → RAM → CPU → GPU: the learner has met all of them before.

import type { PartSpec } from '../types'

export const nic: PartSpec = {
  id: 'nic',
  kind: 'nic',
  pos: { x: 260, y: 805 },
  color: '#a5b4fc',
  name: 'NIC',
  gloss: {
    en: 'The Network Interface Card, the computer\u2019s door to the network. Every byte in or out passes through it. You met it in Chapter 1.',
    vi: 'Network Interface Card, cánh cửa của máy tính ra mạng. Mọi byte ra vào đều qua nó. Bạn đã gặp nó ở Chapter 1.',
  },
}

export const ram: PartSpec = {
  id: 'ram',
  kind: 'ram',
  pos: { x: 430, y: 805 },
  color: '#facc15',
  name: 'RAM',
  gloss: {
    en: 'Fast working memory, exactly like in Chapter 1. The freshly downloaded HTML waits here.',
    vi: 'Bộ nhớ làm việc nhanh, y như Chapter 1. Tệp HTML vừa tải xuống chờ ở đây.',
  },
}

export const cpu: PartSpec = {
  id: 'cpu',
  kind: 'cpu-chip',
  pos: { x: 590, y: 805 },
  color: '#fb923c',
  name: 'CPU',
  gloss: {
    en: 'The CPU runs the Browser like any other program, one instruction at a time, just as you saw in Chapter 1.',
    vi: 'CPU chạy Browser như mọi chương trình khác, từng lệnh một, đúng như bạn đã thấy ở Chapter 1.',
  },
}

export const gpu: PartSpec = {
  id: 'gpu',
  kind: 'gpu',
  pos: { x: 740, y: 805 },
  color: '#4ade80',
  name: 'GPU',
  gloss: {
    en: 'The GPU assembles the final image and sends it to the monitor, same job as in Chapter 1.',
    vi: 'GPU lắp ráp bức ảnh cuối cùng và gửi ra màn hình, đúng vai trò ở Chapter 1.',
  },
}
