// scripts/smoke-chapters.ts
// Integration smoke test (no DOM): builds every AVAILABLE chapter through its
// real assembly code and runs the full timeline through the pure engine
// (update) and the full renderer pipeline against a mock canvas.
//
// Verifies, deterministically, for each chapter:
//   1. beat/path integrity (indices in range; travel contiguous; consecutive
//      beats resume where the previous one left — no teleport)
//   2. a full simulated playthrough: spark always finite, reaches 'done',
//      and every sampled frame renders without throwing
//   3. beat-by-beat deterministic snapshots (fades allowed to complete):
//      jump to any beat and render it standalone (Constitution 02 §15)
//
// Run:  npm run smoke

import type { Chapter } from '../src/chapter-loader/types'
import { chapter as chapter01 } from '../src/content/chapter-01-program-execution'
import { chapter as chapter02 } from '../src/content/chapter-02-browser-loading'
import { createPresentationState, update } from '../src/engine'
import { render } from '../src/rendering/composer/renderer'

// ---------- mock canvas ctx --------------------------------------------------
function mockGradient() {
  return { addColorStop: () => {} }
}
function mockCtx(): CanvasRenderingContext2D {
  const target: Record<string, unknown> = {
    canvas: { width: 1280, height: 720 },
    measureText: (t: string) => ({ width: String(t).length * 7 }),
    createRadialGradient: mockGradient,
    createLinearGradient: mockGradient,
    getLineDash: () => [],
  }
  return new Proxy(target, {
    get(t, prop: string) {
      if (prop in t) return t[prop]
      return () => {}
    },
    set(t, prop: string, value) {
      t[prop] = value
      return true
    },
  }) as unknown as CanvasRenderingContext2D
}

let failures = 0
const check = (ok: boolean, msg: string) => {
  if (!ok) {
    failures++
    console.error('  FAIL:', msg)
  }
}

function checkChapter(chapter: Chapter, expectedBeats: number) {
  console.log(`\n=== ${chapter.meta.id} ===`)
  const beats = chapter.timeline.beats
  check(beats.length === expectedBeats, `expected ${expectedBeats} beats, got ${beats.length}`)
  const home = chapter.scenes[0].id

  // ---- 1. beat/path integrity ----
  let lastScene = home
  let lastPoint: { x: number; y: number } | null = null
  let lastIndex = 0
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i]
    const scene = b.scene ?? home
    const path = chapter.scenes.find((s) => s.id === scene)?.path ?? []
    // 'run'-style effect beats drive the spark through the chapter's program /
    // stageEndpoints machinery instead of the scene path (Ch-01 contract).
    if (b.effect) continue
    check(path.length > 0 || (!b.travel && !b.rest), `${b.id}: scene '${scene}' has no path`)
    const sceneChanged = i > 0 && scene !== lastScene
    if (b.travel) {
      check(b.travel.from <= b.travel.to, `${b.id}: travel.from>to`)
      check(b.travel.to < path.length, `${b.id}: travel.to ${b.travel.to} out of path (${path.length})`)
      if (!sceneChanged && lastPoint && !b.effect) {
        const start = path[b.travel.from]
        check(
          Math.abs(start.x - lastPoint.x) < 0.01 && Math.abs(start.y - lastPoint.y) < 0.01,
          `${b.id}: resumes at (${start.x},${start.y}) but spark was left at (${lastPoint.x},${lastPoint.y})`,
        )
      }
      lastPoint = path[b.travel.to]
      lastIndex = b.travel.to
    } else if (b.rest) {
      check(b.rest.at < path.length, `${b.id}: rest.at out of path`)
      if (!sceneChanged && lastPoint && i > 0 && !b.effect) {
        const at = path[b.rest.at]
        check(
          Math.abs(at.x - lastPoint.x) < 0.01 && Math.abs(at.y - lastPoint.y) < 0.01,
          `${b.id}: rests at (${at.x},${at.y}) but spark was left at (${lastPoint.x},${lastPoint.y})`,
        )
      }
      lastPoint = path[b.rest.at]
      lastIndex = b.rest.at
    }
    if (sceneChanged) {
      console.log(`  scene transition at beat ${b.id}: ${lastScene} → ${scene} (seam entry path[${lastIndex}])`)
    }
    lastScene = scene
  }

  // ---- 2. full simulated playthrough ----
  {
    const s = createPresentationState(chapter.scenes[0].path?.[0] ?? { x: 0, y: 0 }, home)
    s.phase = 'playing'
    s.W = 1280
    s.H = 720
    s.dpr = 1
    const ctx = mockCtx()
    let frames = 0
    const isDone = () => (s as { phase: string }).phase === 'done'
    const totalDuration = beats.reduce((a, b) => a + b.duration, 0)
    const maxFrames = Math.ceil(totalDuration / 16.7) + 300
    while (!isDone() && frames < maxFrames) {
      update(s, 16.7, chapter)
      if (!Number.isFinite(s.sparkPos.x) || !Number.isFinite(s.sparkPos.y)) {
        check(false, `spark non-finite at frame ${frames} (beat ${s.beatIndex}, scene ${s.scene})`)
        break
      }
      if (frames % 25 === 0) render(ctx, s, chapter)
      frames++
    }
    check(isDone(), `playthrough did not finish (phase=${s.phase} after ${frames} frames)`)
    console.log(`  playthrough OK: ${frames} frames (~${((frames * 16.7) / 1000).toFixed(1)} s), final beat ${s.beatIndex}/${beats.length - 1}`)
  }

  // ---- 3. beat-by-beat deterministic snapshots ----
  {
    const ctx = mockCtx()
    for (let i = 0; i < beats.length; i++) {
      const b = beats[i]
      const s = createPresentationState(chapter.scenes[0].path?.[0] ?? { x: 0, y: 0 }, home)
      s.phase = 'paused'
      s.W = 1280
      s.H = 720
      s.dpr = 1
      s.beatIndex = i
      for (let k = 0; k < 100; k++) update(s, 16.7, chapter) // complete any fade
      for (const at of [1, b.duration / 2, b.duration - 1]) {
        s.beatElapsed = at
        update(s, 0, chapter)
        render(ctx, s, chapter)
        if (!Number.isFinite(s.sparkPos.x + s.sparkPos.y)) {
          check(false, `${b.id} @${at}ms: non-finite spark`)
        }
      }
      check(
        s.scene === (b.scene ?? home),
        `${b.id}: expected scene '${b.scene ?? home}', got '${s.scene}' after fade`,
      )
    }
    console.log(`  ${beats.length} beats × 3 snapshots rendered OK`)
  }
}

checkChapter(chapter01, 11)
checkChapter(chapter02, 23)

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`)
  throw new Error(`${failures} smoke check(s) failed`)
}
console.log('\nALL SMOKE CHECKS PASSED')
