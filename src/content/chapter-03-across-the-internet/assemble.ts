// content/chapter-03-across-the-internet/assemble.ts
// The full declarative assembly of Chapter 03 — everything except the meta
// import. Kept meta-free so the chapter can be built and verified outside
// Vite's asset pipeline (mirrors Ch-02's assemble.ts).

import type {
  Chapter,
  ChapterMeta,
  EntityDescription,
  HitZone,
  SceneDescription,
  Vec2,
} from '../../chapter-loader/types'

import {
  BBOX_WIRE, PATH_A, WIRE_INFRASTRUCTURE, SERVER_RECT,
  browser, nic, ram, cpu, gpu, server,
  router1, router2, router2b, router3, router4,
} from './scenes/01-the-wire'
import {
  BBOX_BENCH, PATH_B, BENCH_INFRASTRUCTURE,
  nicport, bench, ramDoor,
} from './scenes/02-reassembly'
import { ROUTER_REVEAL } from './scenes/03-story'
import { NIC_POS, RAM_DOOR_POS } from './scenes/seam'
import { beats } from './narration/beats'
import {
  chapterTitle, waitingLine, startButton, sceneTag, tipText, doneLabel,
} from './narration/labels'
import type { PartSpec } from './types'
import {
  drawServiceBox, drawRouter, drawNIC, drawRamFilled, drawBrowserLite,
  drawPort, drawWireTraffic, drawReassemblyBench,
} from './renderers'

// ---- helpers ----------------------------------------------------------------
const toEntity = (
  p: PartSpec,
  sceneId: string,
  extra?: Record<string, unknown>,
): EntityDescription => ({
  id: p.id,
  kind: p.kind ?? p.id,
  pos: p.pos,
  color: p.color,
  name: p.name,
  gloss: p.gloss,
  scene: sceneId,
  extra: { ...p.extra, ...extra },
  labelSize: p.labelSize,
})

// ---- scene A: the road (the Internet between the machines) --------------------
const wireScene: SceneDescription = {
  id: 'wire',
  bbox: BBOX_WIRE,
  cameraPad: 0.95,
  path: PATH_A,
  entities: [
    toEntity(browser, 'wire'),
    toEntity(nic, 'wire'),
    toEntity(ram, 'wire', { fillFromBeat: 11, fillDur: 3200 }),
    toEntity(cpu, 'wire'),
    toEntity(gpu, 'wire'),
    toEntity(server, 'wire', { icon: 'files' }),
    toEntity(router4, 'wire', { revealAt: ROUTER_REVEAL.router4 }),
    toEntity(router3, 'wire', { revealAt: ROUTER_REVEAL.router3 }),
    toEntity(router2, 'wire', { revealAt: ROUTER_REVEAL.router2 }),
    toEntity(router2b, 'wire', { revealAt: ROUTER_REVEAL.router2b }),
    toEntity(router1, 'wire', { revealAt: ROUTER_REVEAL.router1 }),
    // the beat-driven payload painter (labelless; no gloss)
    toEntity(
      {
        id: 'traffic',
        kind: 'wire-traffic',
        pos: { x: 1300, y: 520 },
        color: '#a78bfa',
        name: '',
        gloss: { en: '', vi: '' },
      },
      'wire',
    ),
  ],
  infrastructure: WIRE_INFRASTRUCTURE,
}

// ---- scene B: inside the receiving machine --------------------------------------
const benchScene: SceneDescription = {
  id: 'bench',
  bbox: BBOX_BENCH,
  cameraPad: 0.97,
  path: PATH_B,
  entities: [toEntity(nicport, 'bench'), toEntity(bench, 'bench'), toEntity(ramDoor, 'bench')],
  infrastructure: BENCH_INFRASTRUCTURE,
}

// ---- hit zone (the waiting phase starts by sending the response) ----------------
const hitZones: HitZone[] = [
  {
    id: 'server-box',
    hits: (w: Vec2) =>
      w.x >= SERVER_RECT.x &&
      w.x <= SERVER_RECT.x + SERVER_RECT.w &&
      w.y >= SERVER_RECT.y &&
      w.y <= SERVER_RECT.y + SERVER_RECT.h,
  },
]

// ---- the assembled Chapter --------------------------------------------------------
export function assembleChapter(m: ChapterMeta): Chapter {
  return {
    meta: m,
    scenes: [wireScene, benchScene],
    timeline: {
      beats,
      fadeDuration: 450,
    },
    hitZones,
    runtime: {
      // The spark holds at the NIC while fading out of `wire` (b5's end point)
      // and at the RAM door while fading out of `bench` (PATH_B end) — the
      // seams designed in 04_STORY_ARCHITECTURE §5.
      seamPosition: (scene: string): Vec2 | null => {
        if (scene === 'wire') return NIC_POS
        if (scene === 'bench') return RAM_DOOR_POS
        return null
      },
    },
    ui: {
      chapterTitle,
      waitingLine,
      startButton,
      sceneTag,
      tipText,
      doneLabel,
    },
    entityRenderers: {
      'service-box': drawServiceBox,
      router: drawRouter,
      nic: drawNIC,
      'ram-filled': drawRamFilled,
      'browser-lite': drawBrowserLite,
      port: drawPort,
      'wire-traffic': drawWireTraffic,
      'reassembly-bench': drawReassemblyBench,
    },
  }
}
