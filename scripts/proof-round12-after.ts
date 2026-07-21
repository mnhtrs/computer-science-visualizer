// proof-round12-after.ts — round 12 AFTER-evidence at the owner's stage sizes.
//   (a) beat 8 'to-engine' rerouted: RAM → LOADING SCREEN (0.25 AT the
//       spinner) → CPU park → engine door
//   (b) beat 12 'css-fetch': the <link> pulse alive at beat start, GONE once
//       body/h1 exist and at beat end
//   (c) beat 13 opening: residue carries the parcel ONLY (no ring)
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
  [8, 0.12, 836, 570, 'r12a-b08-hop1'],
  [8, 0.25, 836, 570, 'r12a-b08-page'],
  [8, 0.63, 836, 570, 'r12a-b08-cpupark'],
  [8, 0.9, 836, 570, 'r12a-b08-door'],
  [12, 0.1, 775, 536, 'r12a-b12-blink'],
  [12, 0.55, 775, 536, 'r12a-b12-nopulse'],
  [12, 0.9, 775, 536, 'r12a-b12-end'],
  [13, 0.04, 775, 536, 'r12a-b13-noring'],
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
writeFileSync('snapshots/r12-after.png', m.toBuffer('image/png'))
console.log('montage → snapshots/r12-after.png')
