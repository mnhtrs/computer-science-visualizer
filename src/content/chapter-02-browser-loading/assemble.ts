// content/chapter-02-browser-loading/assemble.ts
// The full declarative assembly of Chapter 02 — everything except the meta
// import. Kept meta-free so the chapter can be built and verified outside
// Vite's asset pipeline (see scripts/smoke-chapters.ts).

import type {
  Chapter,
  ChapterMeta,
  EntityDescription,
  HitZone,
  SceneDescription,
} from '../../chapter-loader/types'

import {
  BBOX_WEB, WINDOW, URLBAR, VIEWPORT, LINK_RECT,
  SEARCH_QUERY, RESULT, EXTRA_RESULTS, URL_TEXT, PATH_A, browser,
} from './scenes/01-navigation'
import { dns, server, httpsLock, WEB_INFRASTRUCTURE } from './scenes/02-network'
import { nic, ram, cpu, gpu } from './scenes/03-hardware'
import {
  BBOX_ENGINE, WORKBENCH, PATH_B, ENGINE_INFRASTRUCTURE,
  decode, tokens, parser, netport, js,
  style, layout, paint, raster, gpuEngine, workbench,
} from './scenes/04-engine-hall'
import {
  HEX_GRID, CHAR_LINES, DECODE_LINES, TOKENS, DOM_NODES, SCRIPT_NODE,
  MUTATION_BASE, MUTATION_APPEND, CSSOM_RULES, RENDER_NODES,
  PAINT_COMMANDS, PAGE, STAGE_AT_BEAT, STAGE_CAPTIONS,
} from './scenes/05-story'
import { beats } from './narration/beats'
import {
  chapterTitle, waitingLine, startButton, sceneTag, tipText, doneLabel,
} from './narration/labels'
import type { PartSpec } from './types'

// ---- helpers ------------------------------------------------------------------
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
  extra,
  labelSize: p.labelSize,
})

// ---- scene A: the Browser's world ----------------------------------------------
const webScene: SceneDescription = {
  id: 'web',
  bbox: BBOX_WEB,
  cameraPad: 0.92,
  path: PATH_A,
  entities: [
    toEntity(browser, 'web', {
      bounds: WINDOW,
      viewport: VIEWPORT,
      urlBar: URLBAR,
      linkRect: LINK_RECT,
      query: SEARCH_QUERY,
      url: URL_TEXT,
      resultTitle: RESULT.title,
      resultUrl: RESULT.url,
      resultSnippet: RESULT.snippet,
      extraResults: EXTRA_RESULTS,
      page: PAGE,
      urlFromBeat: 1,
      finalFromBeat: 21,
    }),
    toEntity(dns, 'web', { icon: 'book', ipLabel: '93.184.216.34', ipFromBeat: 3 }),
    toEntity(server, 'web', { icon: 'files' }),
    toEntity(httpsLock, 'web', { fromBeat: 4 }),
    toEntity(nic, 'web'),
    toEntity(ram, 'web'),
    toEntity(cpu, 'web'),
    toEntity(gpu, 'web'),
  ],
  infrastructure: WEB_INFRASTRUCTURE,
}

// ---- scene B: inside the Browser Engine -------------------------------------------
const engineScene: SceneDescription = {
  id: 'engine',
  bbox: BBOX_ENGINE,
  cameraPad: 0.94,
  path: PATH_B,
  entities: [
    // v1.3.3 (F27): HTML/CSS/JS stations wear the real-world word badges —
    // the three pillars read instantly (owner directive; assistant's call on
    // Style→CSS to complete the trio). `short` stays as a dormant fallback.
    toEntity(decode, 'engine', { short: 'DEC', glyph: 'hex' }),
    toEntity(tokens, 'engine', { short: 'TOK', glyph: 'cut' }),
    toEntity(parser, 'engine', { short: 'PAR', glyph: 'html', pausedBeats: [14] }),
    toEntity(netport, 'engine', { short: 'NET', glyph: 'door' }),
    toEntity(js, 'engine', { short: 'JS', glyph: 'js' }),
    toEntity(style, 'engine', { short: 'STY', glyph: 'css' }),
    toEntity(layout, 'engine', { short: 'LAY', glyph: 'ruler' }),
    toEntity(paint, 'engine', { short: 'PNT', glyph: 'roller' }),
    toEntity(raster, 'engine', { short: 'RAS', glyph: 'pixels' }),
    toEntity(gpuEngine, 'engine'),
    toEntity(workbench, 'engine', {
      rect: WORKBENCH,
      stageAtBeat: STAGE_AT_BEAT,
      captions: STAGE_CAPTIONS,
      // v1.3.6 (F38): real per-beat durations so every stage can complete its
      // own tail fade (drawWorkbench used to hardcode /3000 — a 2800 ms beat
      // could never finish a fade).
      durAtBeat: Object.fromEntries(beats.map((b, i) => [i, b.duration])),
      story: {
        hexGrid: HEX_GRID,
        charLines: CHAR_LINES,
        decodeLines: DECODE_LINES,
        tokens: TOKENS,
        domNodes: DOM_NODES,
        scriptNode: SCRIPT_NODE,
        cssomRules: CSSOM_RULES,
        renderNodes: RENDER_NODES,
        paintCommands: PAINT_COMMANDS,
        mutationBase: MUTATION_BASE,
        mutationAppend: MUTATION_APPEND,
        page: PAGE,
      },
    }),
  ],
  infrastructure: ENGINE_INFRASTRUCTURE,
}

// ---- hit zones (the waiting phase starts with a click on the search result) --------
const hitZones: HitZone[] = [
  {
    id: 'result-link',
    hits: (w) =>
      w.x >= LINK_RECT.x &&
      w.x <= LINK_RECT.x + LINK_RECT.w &&
      w.y >= LINK_RECT.y &&
      w.y <= LINK_RECT.y + LINK_RECT.h,
  },
]

// ---- the assembled Chapter -----------------------------------------------------------
export function assembleChapter(m: ChapterMeta): Chapter {
  return {
    meta: m,
    scenes: [webScene, engineScene],
    timeline: {
      beats,
      fadeDuration: 450,
    },
    hitZones,
    ui: {
      chapterTitle,
      waitingLine,
      startButton,
      sceneTag,
      tipText,
      doneLabel,
    },
  }
}
