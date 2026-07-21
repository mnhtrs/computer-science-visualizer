// proof-round13.ts — round 13 AFTER-evidence at the owner's stage sizes.
//   Row 1: beat 8 (F60) — RAM → loading screen (0.25) → arrives CPU (0.52)
//          → mid-park (0.75) → STILL parked at beat end (0.9) — no climb.
//   Row 2: F61 divider — composite crossing the CPU/GPU hairline (0.3/0.75),
//          + finale re-entry at the physical GPU chip (web, screen beat 0.2).
import { createCanvas, loadImage } from '@napi-rs/canvas'
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

const SAMPLES: Array<[number, number, number, number, string]> = [
  [8, 0.25, 836, 570, 'r13a-b08-page'],
  [8, 0.52, 836, 570, 'r13a-b08-arrived'],
  [8, 0.75, 836, 570, 'r13a-b08-midpark'],
  [8, 0.9, 836, 570, 'r13a-b08-endpark'],
  [20, 0.3, 775, 536, 'r13a-b20-slide'],
  [20, 0.75, 775, 536, 'r13a-b20-cross'],
  [17, 0.5, 775, 536, 'r13a-b17-divider'],
  [21, 0.2, 836, 570, 'r13a-b21-gpureturn'],
]

mkdirSync('snapshots', { recursive: true })
const files: string[] = []

for (const [bi, frac, W, H, name] of SAMPLES) {
  const s = createPresentationState(chapter.scenes[0].path[0], chapter.scenes[0].id)
  s.phase = 'playing'
  s.beatIndex = bi
  s.W = W
  s.H = H
  const scene = beats[bi].scene ?? beats[0].scene ?? chapter.scenes[0].id
  s.scene = scene
  const cv = createCanvas(W * 2, H * 2)
  const ctx = cv.getContext('2d')
  ctx.scale(2, 2)
  s.dpr = 2
  const dur = beats[bi].duration
  const target = frac * dur
  while (s.beatElapsed < target && s.beatIndex === bi) update(s, 16, chapter)
  render(ctx, s, chapter)
  const out = `snapshots/${name}.png`
  writeFileSync(out, cv.toBuffer('image/png'))
  files.push(out)
  console.log(`${name}  spark=(${s.sparkPos.x.toFixed(0)},${s.sparkPos.y.toFixed(0)})  beatElapsed=${s.beatElapsed.toFixed(0)}`)
}

const cols = 4
const cw = 836
const chh = 570
const m = createCanvas(cols * cw, 2 * chh)
const mc = m.getContext('2d')
mc.fillStyle = '#0b1120'
mc.fillRect(0, 0, m.width, m.height)
for (let i = 0; i < files.length; i++) {
  const img = await loadImage(files[i])
  mc.drawImage(img, (i % cols) * cw, Math.floor(i / cols) * chh, cw, chh)
}
writeFileSync('snapshots/r13-after.png', m.toBuffer('image/png'))
console.log('montage → snapshots/r13-after.png')
