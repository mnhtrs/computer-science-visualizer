// proof-round12.ts — round 12 BEFORE-evidence at the owner's stage sizes.
//   (a) beat 8 'to-engine' current path: RAM → CPU park → door (no page visit)
//   (b) beat 12 'css-fetch': the <link> pulse rings on while body/h1/p exist
//   (c) beat 13 opening: the ring even survives into the cssom residue
// Montage cells sized to fit EVERY sample (loadImage pattern — round-11 rule).
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
  // (a) the current to-engine flight — owner: "Sai rồi ... phải đi từ RAM
  // nhảy lên màn hình loading sau đó đi vào CPU"
  [8, 0.1, 836, 570, 'r12b-b08-hopram'],
  [8, 0.35, 836, 570, 'r12b-b08-tocpu'],
  [8, 0.6, 836, 570, 'r12b-b08-cpupark'],
  [8, 0.9, 836, 570, 'r12b-b08-door'],
  // (b) the <link> pink pulse living on into the other branch's growth
  [12, 0.1, 775, 536, 'r12b-b12-start'],
  [12, 0.55, 775, 536, 'r12b-b12-h1'],
  [12, 0.9, 775, 536, 'r12b-b12-end'],
  // (c) and the ring is even part of the cssom beat's opening residue
  [13, 0.04, 775, 536, 'r12b-b13-residue'],
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

// montage: 2 rows of 4
const cols = 4
const rows = 2
const cw = 836
const chh = 570
const m = createCanvas(cols * cw, rows * chh)
const mc = m.getContext('2d')
mc.fillStyle = '#0b1120'
mc.fillRect(0, 0, m.width, m.height)
for (let i = 0; i < files.length; i++) {
  const img = await loadImage(files[i])
  const x = (i % cols) * cw
  const y = Math.floor(i / cols) * chh
  mc.drawImage(img, x, y, cw, chh)
}
writeFileSync('snapshots/r12-before.png', m.toBuffer('image/png'))
console.log('montage → snapshots/r12-before.png')
