// scenes/04-engine-hall.ts
// v1.3.15 (F69, owner round 16): every station label 15 -> 18 world px
// (netport 12 -> 14) — 'cho chu trong may block to len ti'. — Act 3's world: inside the Browser Engine.
// A station chain on top — the workbench at the center — the finishing chain at
// the bottom. Every station hands the page to the next, nothing teleports.

import type { InfrastructureDescription } from '../../../chapter-loader/types'
import type { Vec2 } from '../../../chapter-loader/types'
import type { PartSpec, Rect } from '../types'

// ---- engine-scene geometry --------------------------------------------------
export const BBOX_ENGINE = { minX: 30, maxX: 1300, minY: -8, maxY: 960 }

// LAYOUT v1.3.2 (F22): 820 → 1084 — the bench's east edge now aligns with the
// GPU column (1180); the scene's right dead band is gone and stage content
// gets a bigger canvas. Spark route moved to the east corridor (below).
export const WORKBENCH: Rect = { x: 96, y: 270, w: 1084, h: 500 }

// ---- stations (top chain) ----------------------------------------------------
export const decode: PartSpec = {
  id: 'decode',
  kind: 'station',
  pos: { x: 330, y: 170 },
  color: '#38bdf8',
  name: 'Decoder',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Turns raw bytes into readable characters, using the file\u2019s encoding rulebook.',
    vi: 'Đổi các byte thô thành chữ đọc được, theo đúng quy ước ghi tệp.',
  },
}

export const tokens: PartSpec = {
  id: 'tokens',
  kind: 'station',
  pos: { x: 500, y: 170 },
  color: '#818cf8',
  name: 'Tokenizer',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Cuts the character stream into meaningful pieces: tokens.',
    vi: 'Thái dòng ký tự ra thành những mảnh có nghĩa, gọi là token.',
  },
}

export const parser: PartSpec = {
  id: 'parser',
  kind: 'station',
  pos: { x: 670, y: 170 },
  color: '#22d3ee',
  name: 'HTML Parser',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Reads tokens one by one and grows the DOM Tree. It can be paused by scripts, never by CSS.',
    vi: 'Đọc từng token một rồi nuôi DOM Tree lớn dần. Chỉ script mới chặn được nó, CSS thì không bao giờ.',
  },
}

export const netport: PartSpec = {
  id: 'netport',
  kind: 'station',
  pos: { x: 670, y: 55 },
  color: '#94a3b8',
  name: 'Network Port',
  labelSize: 14, // v1.3.15 (F69): 12 -> 14 with the hall-wide label upsize
  gloss: {
    en: 'The Engine\u2019s little door back onto the network, the same road the HTML arrived on.',
    vi: 'Cánh cửa nhỏ của Engine quay lại mạng, đúng con đường HTML đã tới.',
  },
}

export const js: PartSpec = {
  id: 'js',
  kind: 'station',
  pos: { x: 920, y: 170 },
  color: '#facc15',
  name: 'JavaScript Engine',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Runs scripts immediately. A script can read and rewrite the page, so the Parser waits. Some scripts are allowed to wait politely instead, but that is a story for another journey.',
    vi: 'Chạy script ngay lập tức. Script đọc được, sửa được cả trang, nên Parser đành chờ. Cũng có script biết xếp hàng lịch sự, nhưng chuyện đó để hành trình khác kể.',
  },
}

// ---- stations (bottom finishing chain) ----------------------------------------
export const style: PartSpec = {
  id: 'style',
  kind: 'station',
  pos: { x: 340, y: 850 },
  color: '#c084fc',
  name: 'Style',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Matches every CSS rule to its nodes. Structure from the DOM, outfits from the CSSOM.',
    vi: 'Ghép mỗi quy tắc CSS với đúng node. Cấu trúc từ DOM, quần áo từ CSSOM.',
  },
}

export const layout: PartSpec = {
  id: 'layout',
  kind: 'station',
  pos: { x: 550, y: 850 },
  color: '#4ade80',
  name: 'Layout',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Computes exact geometry: the position and size of every box.',
    vi: 'Tính ra vị trí và kích thước chính xác của từng chiếc hộp.',
  },
}

export const paint: PartSpec = {
  id: 'paint',
  kind: 'station',
  pos: { x: 760, y: 850 },
  color: '#fb7185',
  name: 'Paint',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Decides the order of the drawing commands. Still zero pixels.',
    vi: 'Quyết định thứ tự của các lệnh vẽ. Vẫn chưa có pixel nào.',
  },
}

export const raster: PartSpec = {
  id: 'raster',
  kind: 'station',
  pos: { x: 970, y: 850 },
  color: '#fb923c',
  name: 'Rasterizer',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Executes the commands, coloring a real grid of pixels.',
    vi: 'Đi theo danh sách lệnh và tô màu lên lưới pixel thật.',
  },
}

export const gpuEngine: PartSpec = {
  id: 'gpuEngine',
  kind: 'gpu',
  pos: { x: 1180, y: 850 },
  color: '#4ade80',
  name: 'GPU',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'The compositor’s desk: stacks the finished layers into the single frame headed for your monitor. The page was already drawn. This is just assembly.',
    vi: 'Chỗ làm việc của compositor: xếp các lớp hoàn thiện thành một khung hình duy nhất rồi gửi ra màn hình. Trang vẽ xong rồi, ở đây chỉ lắp ráp thôi.',
  },
}

export const workbench: PartSpec = {
  id: 'workbench',
  kind: 'workbench',
  pos: { x: WORKBENCH.x + WORKBENCH.w / 2, y: WORKBENCH.y + WORKBENCH.h / 2 },
  color: '#e2e8f0',
  name: 'Workbench',
  labelSize: 18, // v1.3.15 (F69, owner round 16): station names upsized 15 -> 18 world px
  gloss: {
    en: 'Watch the page transform here, from bytes to pixels.',
    vi: 'Nhìn kỹ nhé, trang web biến hình ngay đây: từ bytes ra pixels.',
  },
}

// ---- protagonist path -----------------------------------------------------------
export const PATH_B: Vec2[] = [
  { x: 330, y: 170 }, // 0 decode
  { x: 500, y: 170 }, // 1 tokenize
  { x: 670, y: 170 }, // 2 parser
  { x: 670, y: 55 }, //  3 net-port (CSS detour, up through the ceiling door)
  { x: 670, y: 170 }, // 4 parser (CSS returns)
  { x: 920, y: 170 }, // 5 JS engine
  // v1.3.2 (F22): with the bench widened to x≤1180 the old (966,793) leg would
  // tunnel through it, the page now takes the East Corridor instead:
  { x: 1230, y: 170 }, // 6 corridor mouth (along the top rail line)
  { x: 1230, y: 793 }, // 7 drop: 50 px east of the bench, 37 above the GPU chip top
  { x: 450, y: 793 },  // 8 under the bench (23 px below it, 28 above station tops)
  { x: 340, y: 850 }, // 9 style
  { x: 550, y: 850 }, // 10 layout
  { x: 760, y: 850 }, // 11 paint
  { x: 970, y: 850 }, // 12 raster
  { x: 1180, y: 850 }, // 13 GPU (compositor)
  { x: 1180, y: 850 }, // 14 GPU dup, hold for the fade-out seam
]

// ---- infrastructure -----------------------------------------------------------
export const ENGINE_INFRASTRUCTURE: InfrastructureDescription[] = [
  {
    id: 'bench-top-rail',
    kind: 'bus-rail',
    points: [
      { x: 330, y: 170 },
      { x: 920, y: 170 },
    ],
  },
  {
    id: 'bench-bottom-rail',
    kind: 'bus-rail',
    points: [
      { x: 340, y: 850 },
      { x: 1180, y: 850 },
    ],
  },
  {
    id: 'port-cable',
    kind: 'cable',
    points: [
      { x: 670, y: 26 },
      { x: 670, y: 22 },
    ],
  },
  // v1.3.13 (F61, owner round 13 "phải có ranh giới giữa CPU và GPU chứ gộp
  // lại dễ hiểu nhầm"): the silicon boundary, drawn hairline-dashed between
  // the Rasterizer (970) and the GPU (1180) at mid-gap x = 1075; the
  // composite spark CROSSES it along the y=850 rail = the hand-off to
  // GPU-land. Top stays 7 px below the fly-under route (y=793); the label
  // sits below the line, 30 px from the scene floor (bbox maxY 960).
  {
    id: 'cpu-gpu-boundary',
    kind: 'zone-divider',
    points: [
      { x: 1075, y: 800 },
      { x: 1075, y: 902 },
    ],
    label: 'CPU -> GPU',
  } as InfrastructureDescription & { label?: string },
]
