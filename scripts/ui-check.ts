// ui-check.ts — reproduce the user's REAL viewer conditions (canvas at stage size)
// with estimated chrome rect overlays (Home pill, sceneTag) for collision evidence.
// Dev-only; bundle with esbuild like layout-snapshots.
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

const SAMPLES: Array<[number, number, number, number, string]> = [
  // web scene at the user's browser-stage size
  [0, 0.9, 836, 570, 'u-b00'], [1, 0.6, 836, 570, 'u-b01'], [3, 0.95, 836, 570, 'u-b03'],
  [4, 0.5, 836, 570, 'u-b04'], [21, 0.8, 836, 570, 'u-b21'], [22, 0.3, 836, 570, 'u-b22'],
  // engine scene at the user's engine-stage size
  [9, 0.8, 775, 536, 'u-b09'], [10, 0.8, 775, 536, 'u-b10'], [11, 0.9, 775, 536, 'u-b11'],
  [12, 0.5, 775, 536, 'u-b12'], [13, 0.7, 775, 536, 'u-b13'], [14, 0.6, 775, 536, 'u-b14'],
  [15, 0.7, 775, 536, 'u-b15'], [16, 0.7, 775, 536, 'u-b16'], [17, 0.7, 775, 536, 'u-b17'],
  [18, 0.25, 775, 536, 'u-b18a'], [18, 0.85, 775, 536, 'u-b18b'], [19, 0.6, 775, 536, 'u-b19'],
  [20, 0.7, 775, 536, 'u-b20'],
  // v1.3.3 seam-early samples (settle + ghost evidence, R16: ≥3 samples/beat incl. early)
  [13, 0.12, 775, 536, 'v-b13-early'], [14, 0.1, 775, 536, 'v-b14-early'],
  // v1.3.4 (F30): the live crash window — cssom cards once drew with negative
  // width for frac ∈ (0, 0.063); sample INSIDE it so it can never regress
  [13, 0.02, 775, 536, 'v-b13-crashwin'], [13, 0.06, 775, 536, 'v-b13-settle'],
  [16, 0.15, 775, 536, 'v-b16-early'], [17, 0.15, 775, 536, 'v-b17-early'],
  [19, 0.1, 775, 536, 'v-b19-early'], [20, 0.15, 775, 536, 'v-b20-early'],
  [10, 0.08, 775, 536, 'v-b10-early'], [11, 0.06, 775, 536, 'v-b11-early'],
  // v1.3.14 (F62): the page is gated on the delivery — at frac 0.25 the
  // screen still WAITS (bar + spinner + text, no page), at 0.6 the cross-fade
  // is landing (spark inside the window), full page at 1.0.
  [21, 0.25, 836, 570, 'w-b21-waiting'], [21, 0.6, 836, 570, 'w-b21-landing'],
  [21, 1.0, 836, 570, 'v-b21-full'],
  // v1.3.6 (F38/F41): zero-residue proofs — tokenize mid-beat shows chips on
  // an EMPTY bench (no byte ghost); layout's blueprint fades in its own tail;
  // the NIC flashes when the response packet sweeps it (owner round 6)
  [10, 0.5, 775, 536, 'w-b10-mid'], [17, 0.93, 775, 536, 'v-b17-tail'],
  [7, 0.72, 836, 570, 'v-b07-nic-ping'],
  // v1.3.7 (F45) + v1.3.9 (F50): the packet DWELLS on the NIC (holdAt
  // 0.52→0.60 of the response beat, ~0.24 s) — one sample inside the hold
  // (parked, NIC bright), one after it (en route to RAM).
  [7, 0.45, 836, 570, 'w-b07-pre'], [7, 0.56, 836, 570, 'w-b07-hold'],
  [7, 0.8, 836, 570, 'w-b07-post'],
  // v1.3.8 (F46): FULL-PRESENCE holds — every stage must reach beat end
  // intact (F38's tailA is gone: cards/chips/receipts/pixels all visible at
  // 0.9+); the b15 tree-kill regression guard (F46b: the bench must NEVER
  // sit empty at js-run's mid-beat); the ONLY dissolve left happens at the
  // new dot's opening (b11 head shows tokenize's residue at ~35 % alpha).
  [10, 0.95, 775, 536, 'w-b10-full'], [13, 0.9, 775, 536, 'w-b13-fullcards'],
  [15, 0.5, 775, 536, 'w-b15-tree'], [18, 0.95, 775, 536, 'w-b18-full'],
  [19, 0.98, 775, 536, 'w-b19-fullpage'], [11, 0.06, 775, 536, 'w-b11-residue'],
  // v1.3.9 (round 9): F48 — the decode script line reads REAL DOM API
  // (p.textContent, 6 lines, no clipping); F49 — paint owns the blueprint
  // (mini left at 55 % + receipts right); F51 — the raster page must be
  // VISIBLE-DIMMED under the composite layers (never an empty bench), the
  // crisp page pops over it.
  [9, 0.9, 775, 536, 'w-b09-jscode'], [18, 0.7, 775, 536, 'w-b18-miniblue'],
  [19, 0.06, 775, 536, 'w-b19-residue'], [20, 0.4, 775, 536, 'w-b20-underlay'],
  // v1.3.11 (round 11): F55 — the SERP gains 4 more greyed rows (+ the
  // hardcoded 2nd = 5) with a measured 12 px viewport margin; F57 — NIC hold
  // 0.52→0.57. b07-hold at 0.56 stays inside the window.
  [0, 0.9, 836, 570, 'w-b00-serp'],
  // v1.3.13 (round 13): F60 — to-engine now ENDS on the CPU (park 0.50→1.0,
  // no window climb); 'w-b08-endpark' locks: at frac 0.9 the spark must STILL
  // sit on the chip (590,805). F61 — the CPU/GPU divider hairline at x=1075
  // with the 'CPU -> GPU' tag; the composite spark crosses it.
  [8, 0.12, 836, 570, 'w-b08-hop1'], [8, 0.25, 836, 570, 'w-b08-page'],
  [8, 0.45, 836, 570, 'w-b08-appcpu'], [8, 0.63, 836, 570, 'w-b08-cpu'],
  [8, 0.9, 836, 570, 'w-b08-endpark'], [12, 0.55, 775, 536, 'w-b12-nopulse'],
  [13, 0.04, 775, 536, 'w-b13-noring'], [20, 0.3, 775, 536, 'w-b20-divider'],
]

mkdirSync('snapshots', { recursive: true })

for (const [bi, frac, W, H, name] of SAMPLES) {
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

  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D
  render(ctx, s, chapter as any)

  writeFileSync(`snapshots/${name}.png`, canvas.toBuffer('image/png'))
  console.log(`wrote snapshots/${name}.png  scene=${s.scene}`)
}
