// proof-round8.ts — ONE montage image proving round-7 behavior is in the code:
//   Row 1: beat 7 (response, web 836x570) — the packet DWELLS on the NIC
//          (holdAt 0.52→0.79): parked mid-beat, gone by the tail.
//   Row 2: beat 11 (DOM tree, engine 775x536) — F43 restored pacing: the tree
//          grows gradually across the whole beat (window (frac-0.24)/0.76).
// Dev-only; bundle with esbuild like ui-check.
import { createCanvas } from '@napi-rs/canvas'
import { writeFileSync, mkdirSync } from 'node:fs'
import { assembleChapter } from '../src/content/chapter-02-browser-loading/assemble'
import { createPresentationState, update } from '../src/engine'
import { render } from '../src/rendering/composer/renderer'

const metaStub = {
  id: 'chapter-02-browser-loading',
  title: { en: 'x', vi: 'x' },
  description: { en: '', vi: '' },
  thumbnail: '',
  status: 'available',
} as any

const chapter = assembleChapter(metaStub)
const beats = chapter.timeline.beats

function frame(bi: number, frac: number, W: number, H: number) {
  const s = createPresentationState(chapter.scenes[0].path[0], chapter.scenes[0].id)
  s.phase = 'playing'
  s.beatIndex = bi
  s.scene = beats[bi].scene ?? chapter.scenes[0].id
  s.W = W
  s.H = H
  s.dpr = 1
  const target = beats[bi].duration * frac
  let sim = 0
  while (s.beatElapsed < target && s.beatIndex === bi && sim < 20000) { update(s, 16, chapter); sim += 16 }
  const c = createCanvas(W, H)
  render(c.getContext('2d') as unknown as CanvasRenderingContext2D, s, chapter as any)
  return c
}

const GAP = 12
const LABEL = 34
const sTop = 0.55
const sBot = 0.6
const tW = 836, tH = 570
const bW = 775, bH = 536

const topRow: Array<[number, number, string]> = [
  [7, 0.45, 't=0.45: chua toi NIC'],
  [7, 0.66, 't=0.66: DUNG YEN tren NIC'],
  [7, 0.95, 't=0.95: da vao RAM'],
]
const botRow: Array<[number, number, string]> = [
  [11, 0.08, 't=0.08: cay 0%'],
  [11, 0.3, 't=0.30: cay ~8%'],
  [11, 0.5, 't=0.50: cay ~34%'],
  [11, 0.7, 't=0.70: cay ~61%'],
  [11, 0.9, 't=0.90: cay ~87%, chua xong'],
]

const rowW = (n: number, w: number) => n * w + (n - 1) * GAP
const W = Math.max(rowW(3, tW * sTop), rowW(5, bW * sBot)) + 2 * GAP
const H = GAP + LABEL + tH * sTop + GAP + LABEL + bH * sBot + GAP + 34

const out = createCanvas(Math.ceil(W), Math.ceil(H))
const ctx = out.getContext('2d')
ctx.fillStyle = '#0b0f1a'
ctx.fillRect(0, 0, W, H)

function drawRow(row: Array<[number, number, string]>, y: number, fw: number, fh: number, scale: number, W: number, H: number, title: string) {
  ctx.fillStyle = '#ffd75a'
  ctx.font = 'bold 18px sans-serif'
  ctx.fillText(title, GAP, y - 10)
  let x = GAP
  for (const [bi, frac, label] of row) {
    const c = frame(bi, frac, W, H)
    ctx.drawImage(c as any, x, y, fw, fh)
    ctx.fillStyle = '#e8ecf4'
    ctx.font = '15px sans-serif'
    const dur = beats[bi].duration
    ctx.fillText(`${label}   (${Math.round(frac * dur)}ms / ${dur}ms)`, x, y + fh + 20)
    x += fw + GAP
  }
}

drawRow(topRow, GAP + LABEL, tW * sTop, tH * sTop, sTop, tW, tH, 'BEAT 7 (response): goi tin dung lai ~0.8s tren NIC truoc khi vao RAM')
drawRow(botRow, GAP + LABEL + tH * sTop + GAP + LABEL, bW * sBot, bH * sBot, sBot, bW, bH, 'BEAT 11 (DOM): cay moc CHAM suot ca beat (pacing goc da khoi phuc)')

mkdirSync('snapshots', { recursive: true })
writeFileSync('snapshots/r8-proof.png', out.toBuffer('image/png'))
console.log('wrote snapshots/r8-proof.png  size', Math.ceil(W), 'x', Math.ceil(H))
