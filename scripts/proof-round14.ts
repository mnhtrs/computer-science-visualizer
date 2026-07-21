// proof-round14.ts — round 14 (F62) evidence at the owner's stage size.
// beat 21 'screen': 0.15 (waiting, spark only just left the GPU) → 0.45
// (cross-fade begins, spark inside the window) → 0.7 (page nearly full,
// spark at the center) → 1.0 (full page) · beat 22 recap 0.3 (rests full).
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
  [21, 0.15, 836, 570, 'r14a-b21-wait1'],
  [21, 0.3, 836, 570, 'r14a-b21-wait2'],
  [21, 0.45, 836, 570, 'r14a-b21-land1'],
  [21, 0.7, 836, 570, 'r14a-b21-land2'],
  [21, 0.9, 836, 570, 'r14a-b21-almost'],
  [21, 1.0, 836, 570, 'r14a-b21-full'],
  [22, 0.3, 836, 570, 'r14a-b22-recap'],
  [8, 0.9, 836, 570, 'r14a-b08-regress'],
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
writeFileSync('snapshots/r14-after.png', m.toBuffer('image/png'))
console.log('montage → snapshots/r14-after.png')
