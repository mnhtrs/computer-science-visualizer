// layout-snapshots.ts — render real PNG snapshots per beat for the layout audit.
// Not part of the build; run via esbuild bundle like smoke-chapters.
import { createCanvas } from '@napi-rs/canvas'
import { writeFileSync, mkdirSync } from 'node:fs'
import { assembleChapter } from '../src/content/chapter-02-browser-loading/assemble'
import { createPresentationState, update } from '../src/engine'
import { render } from '../src/rendering/composer/renderer'

const W = 1280
const H = 860

const metaStub = {
  id: 'chapter-02-browser-loading',
  title: { en: 'x', vi: 'x' },
  description: { en: '', vi: '' },
  thumbnail: '',
  status: 'available',
} as any

const chapter = assembleChapter(metaStub)
const beats = chapter.timeline.beats

const SAMPLES: Array<[number, number]> = [
  [1, 0.6], [3, 0.95], [4, 0.5], [5, 0.5], [6, 0.6], [7, 0.4], [8, 0.5],
  [9, 0.8], [10, 0.8], [11, 0.9], [12, 0.5], [13, 0.7], [14, 0.6], [15, 0.7],
  [16, 0.7], [17, 0.7], [18, 0.8], [19, 0.6], [20, 0.7], [21, 0.8], [22, 0.3],
]

mkdirSync('snapshots', { recursive: true })

for (const [bi, frac] of SAMPLES) {
  const s = createPresentationState(chapter.scenes[0].path[0], chapter.scenes[0].id)
  s.phase = 'playing'
  s.beatIndex = bi
  s.scene = beats[bi].scene ?? chapter.scenes[0].id
  s.W = W
  s.H = H
  s.dpr = 1
  const target = beats[bi].duration * frac
  let sim = 0
  while (s.beatElapsed < target && sim < 20000) {
    update(s, 16, chapter)
    sim += 16
    if (s.beatIndex !== bi) break
  }
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D
  render(ctx, s, chapter)
  const name = `snapshots/b${String(bi).padStart(2, '0')}-${beats[bi].id}.png`
  writeFileSync(name, canvas.toBuffer('image/png'))
  console.log('wrote', name, `(beat ${bi}, elapsed ${Math.round(s.beatElapsed)}ms)`)
}
