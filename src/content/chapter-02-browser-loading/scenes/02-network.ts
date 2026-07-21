// scenes/02-network.ts — Act 2's outside world: the DNS, the server, the
// private channel. Geometry anti-misconception notes (frozen in the design):
// - the DNS sits ABOVE and OFF the browser–server route (M2),
// - the HTTPS lock sits ON the link, owned by both ends (M4).

import type { InfrastructureDescription } from '../../../chapter-loader/types'
import type { PartSpec } from '../types'
import { CASE } from './01-navigation'

// ---- the outside services ---------------------------------------------------
export const dns: PartSpec = {
  id: 'dns',
  kind: 'service-box',
  pos: { x: 1180, y: 175 },
  color: '#a78bfa',
  name: 'DNS',
  gloss: {
    en: 'The web\u2019s address book. You give it a name, it gives you back a number. It sits off to the side, never in the middle of the road.',
    vi: 'Sổ địa chỉ của web. Bạn đưa nó một cái tên, nó trả bạn một con số. Nó ngồi lệch sang một bên, không bao giờ nằm giữa đường.',
  },
}

export const server: PartSpec = {
  id: 'server',
  kind: 'service-box',
  pos: { x: 1180, y: 520 },
  color: '#22d3ee',
  name: 'Server',
  gloss: {
    en: 'A faraway computer whose whole job is answering. Sometimes it finds a stored file, sometimes it builds the bytes right on the spot.',
    vi: 'Một máy tính ở xa mà cả công việc của nó là trả lời. Đôi khi nó tìm một tệp có sẵn, đôi khi nó dựng bytes ngay tại chỗ.',
  },
}

export const httpsLock: PartSpec = {
  id: 'httpslock',
  kind: 'https-lock',
  pos: { x: 980, y: 520 },
  color: '#facc15',
  name: 'HTTPS',
  gloss: {
    en: 'The private deal between Browser and server. They agree on the rules of the conversation, then scramble every word for outsiders. The secret keys are made on both ends, never sent across.',
    vi: 'Thỏa thuận riêng giữa Browser và server. Hai bên thống nhất luật chơi, rồi làm rối mọi lời trao đổi với người ngoài. Chìa khóa bí mật được tạo ra ở cả hai đầu, không hề được gửi đi.',
  },
}

// ---- scene A infrastructure -------------------------------------------------
export const WEB_INFRASTRUCTURE: InfrastructureDescription[] = [
  { id: 'case', kind: 'case', rect: CASE },
  {
    // LAYOUT v1.3.3: rail tips 1110 → 1102 — they overlapped the (now wider)
    // service boxes' boundaries; R10: connectors terminate exactly at the wall
    // (= the path's own door points 1102).
    id: 'rail-dns',
    kind: 'bus-rail',
    points: [
      { x: 850, y: 300 },
      { x: 1040, y: 300 },
      { x: 1040, y: 175 },
      { x: 1102, y: 175 },
    ],
  },
  {
    id: 'rail-srv',
    kind: 'bus-rail',
    points: [
      { x: 850, y: 520 },
      { x: 1102, y: 520 },
    ],
  },
  {
    id: 'hw-rail',
    kind: 'bus-rail',
    points: [
      { x: 260, y: 805 },
      { x: 740, y: 805 },
    ],
  },
]
