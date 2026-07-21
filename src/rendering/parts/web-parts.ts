// rendering/parts/web-parts.ts
// Entity renderers for browser-level chapters (introduced by Chapter 02).
// Every renderer is a pure function of (PresentationState, entity.extra):
// beat-driven content is derived from s.beatIndex / s.beatElapsed, so timeline
// scrubbing and pausing stay perfectly deterministic (Constitution 02 §15).
//
// All chapter-specific CONTENT (tokens, trees, page spec, geometry) arrives
// through the entity `extra` bag — this file ships no chapter data itself.

import type { EntityRenderer } from '../types'
import type { LocalizedText } from '../../chapter-loader/types'
import { FONT, hexA, rrPath } from '../primitives/canvas-utils'
import { glow } from '../primitives/glow'
import { drawName } from '../primitives/text'
import { TAU, clamp, easeInOutCubic, lerp } from '../primitives/math'

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

interface Rect { x: number; y: number; w: number; h: number }

// ---- shared spec types (read defensively from entity.extra) --------------
interface PageSpec {
  bg: string
  headerColor: string
  headerText: string
  headerTextColor: string
  paraColor: string
  paraText: string
  buttonColor: string
  buttonText: string
}

interface BrowserWindowExtra {
  bounds: Rect
  viewport: Rect
  urlBar: Rect
  linkRect: Rect
  query: string
  url: string
  resultTitle: string
  resultUrl: string
  resultSnippet: string
  /** v1.3.11 (F55): extra greyed SERP rows, drawn at 64 px pitch with decay */
  extraResults?: { title: string; url: string }[]
  page: PageSpec
  /** beatIndex where the URL is considered entered (url bar fills up) */
  urlFromBeat: number
  /** beatIndex from which the viewport shows the final page */
  finalFromBeat: number
}

interface StorySpec {
  hexGrid: string[][]
  charLines: string[]
  /** decode-stage display lines (charLines soft-wrapped for the two-zone fit — F52) */
  decodeLines: string[]
  tokens: string[]
  domNodes: { id: string; label: string; depth: number; order: number; parent: string | null; tint?: string }[]
  scriptNode: { id: string; label: string; depth: number; parent: string }
  cssomRules: string[]
  renderNodes: { id: string; label: string; depth: number; parent: string | null; tint: string }[]
  paintCommands: string[]
  mutationBase: string
  mutationAppend: string
  page: PageSpec
}

interface WorkbenchExtra {
  rect: Rect
  story: StorySpec
  stageAtBeat: Record<number, string>
  captions: Record<string, string>
  // v1.3.6 (F38): per-beat durations — a 2800 ms beat must still reach frac
  // 1.0 (duration normalization, NOT a fade mechanism; kept in v1.3.8 F46).
  durAtBeat?: Record<number, number>
}

// ===========================================================================
// FINAL MINI PAGE — single drawing used by the workbench, the viewport, and
// (pixelated) by the raster stage.
//
// LAYOUT v1.3.3 (F28g): the mini page and the rasterizer share ONE metrics
// table — raster pixels must literally preview the composited frame (owner:
// "những pixel sinh ra không phải ngẫu nhiên, phải giống hình ảnh sắp chiếu
// trên GPU"). The old layout ended content at 0.66h and left a 34 % dead band
// at the bottom; pageColorAt's button band (v 0.70–0.82) didn't even match the
// drawn button (v 0.55–0.66). Bottom margin now equals the header height
// (0.20 / 0.20) and the raster derives from these same fractions.
// ===========================================================================
const MINI = {
  headerH: 0.2,
  paraY: 0.38, // center of the (first) paragraph line
  paraPitch: 0.105, // pitch for wrapped extra lines
  paraWrap: 0.82, // wrap width as a fraction of page width
  btnY: 0.68,
  btnH: 0.12,
  btnW: 0.42,
}

function drawMiniPage(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  page: PageSpec,
  alpha = 1,
) {
  ctx.save()
  ctx.globalAlpha *= alpha
  rrPath(ctx, r.x, r.y, r.w, r.h, 10)
  ctx.fillStyle = page.bg
  ctx.fill()
  ctx.clip()
  // header bar
  const hh = r.h * MINI.headerH
  ctx.fillStyle = page.headerColor
  ctx.fillRect(r.x, r.y, r.w, hh)
  ctx.fillStyle = page.headerTextColor
  ctx.font = `800 ${Math.max(13, r.w * 0.052)}px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(page.headerText, r.x + r.w / 2, r.y + hh / 2 + 1)
  // paragraph (wrapped, first line centered at MINI.paraY)
  ctx.fillStyle = page.paraColor
  ctx.font = `500 ${Math.max(10, r.w * 0.034)}px ${FONT}`
  const words = page.paraText.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w
    if (ctx.measureText(next).width > r.w * MINI.paraWrap && cur) { lines.push(cur); cur = w } else cur = next
  }
  if (cur) lines.push(cur)
  const py = r.y + r.h * MINI.paraY
  ctx.textBaseline = 'middle'
  lines.slice(0, 3).forEach((ln, i) => ctx.fillText(ln, r.x + r.w / 2, py + i * r.h * MINI.paraPitch))
  // button (fixed band — see MINI; bottom margin = header height)
  const bw = r.w * MINI.btnW
  const bh = r.h * MINI.btnH
  const bx = r.x + (r.w - bw) / 2
  const by = r.y + r.h * MINI.btnY
  rrPath(ctx, bx, by, bw, bh, bh / 2.6)
  ctx.fillStyle = page.buttonColor
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 ${Math.max(10, r.w * 0.034)}px ${FONT}`
  ctx.fillText(page.buttonText, bx + bw / 2, by + bh / 2 + 1)
  ctx.restore()
}

/** Color of the final page at relative (u,v) — the rasterizer's "source".
 *  v1.3.3: derived from the SAME MINI metrics the mini page draws with —
 *  deterministic bands that read as title / text lines / button, never noise. */
function pageColorAt(page: PageSpec, u: number, v: number): string {
  if (v < MINI.headerH) {
    // title glyphs ≈ a dark stripe in the middle of the gold header
    const inTitle = v > 0.055 && v < 0.145 && u > 0.28 && u < 0.72
    return inTitle ? page.headerTextColor : page.headerColor
  }
  if (v > MINI.paraY - 0.022 && v < MINI.paraY + 0.022) {
    // the paragraph line reads as three "word group" stripes
    const g = (u > 0.16 && u < 0.36) || (u > 0.39 && u < 0.6) || (u > 0.63 && u < 0.84)
    return g ? page.paraColor : page.bg
  }
  if (v >= MINI.btnY && v <= MINI.btnY + MINI.btnH && u > 0.29 && u < 0.71) {
    const mid = MINI.btnY + MINI.btnH / 2
    const inLabel = v > mid - 0.018 && v < mid + 0.018 && u > 0.4 && u < 0.6
    return inLabel ? '#ffffff' : page.buttonColor
  }
  return page.bg
}

// ===========================================================================
// BROWSER WINDOW (the protagonist's home) — viewport content = f(beatIndex)
// ===========================================================================
// v1.3.14 (F62): the loading state (progress bar + spinner + Waiting text),
// shared by beats 1–20 AND by the screen beat's transit window — while the
// spark carries the frame GPU → window the screen keeps waiting, and this
// fades out (alphaMul) as the delivered page lands.
function drawLoadingState(
  ctx: CanvasRenderingContext2D,
  V: Rect,
  url: string | undefined,
  beat: number,
  finalFromBeat: number,
  t: number,
  alphaMul: number,
) {
  if (alphaMul <= 0) return
  ctx.save()
  ctx.globalAlpha = alphaMul
  const p = clamp(beat / (finalFromBeat - 1), 0, 1)
  const barW = (V.w - 80) * easeInOutCubic(p)
  rrPath(ctx, V.x + 40, V.y + 30, V.w - 80, 8, 4)
  ctx.fillStyle = 'rgba(150,170,255,0.14)'
  ctx.fill()
  rrPath(ctx, V.x + 40, V.y + 30, Math.max(10, barW), 8, 4)
  ctx.fillStyle = hexA('#22d3ee', 0.8)
  ctx.fill()
  const a = t * 0.006
  ctx.strokeStyle = hexA('#22d3ee', 0.85)
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(V.x + V.w / 2, V.y + V.h / 2 - 10, 16, a, a + Math.PI * 1.4)
  ctx.stroke()
  // LAYOUT v1.3.3 (F25a): 14 → 18 px — it rendered ≈8 px on the owner's stage
  ctx.fillStyle = 'rgba(170,180,224,0.55)'
  ctx.font = `500 18px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText(`Waiting for ${url ?? 'the server'}…`, V.x + V.w / 2, V.y + V.h / 2 + 28)
  ctx.restore()
}

export const drawBrowserWindow: EntityRenderer = (ctx, s, e, active) => {
  const ex = (e.extra ?? {}) as Partial<BrowserWindowExtra>
  const W = ex.bounds, V = ex.viewport, U = ex.urlBar, L = ex.linkRect
  if (!W || !V || !U || !L || !ex.page) return
  const beat = s.beatIndex
  const urlFromBeat = ex.urlFromBeat ?? 1
  const finalFromBeat = ex.finalFromBeat ?? 21

  ctx.save()
  if (active) glow(ctx, e.pos, e.color, 160, 0.18 + 0.05 * Math.sin(s.t * 0.004))

  // window frame
  rrPath(ctx, W.x, W.y, W.w, W.h, 22)
  ctx.fillStyle = 'rgba(16,22,48,0.92)'
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.75 : 0.35)
  ctx.lineWidth = 2.5
  ctx.stroke()

  // chrome bar: dots + url pill
  const cx = W.x + 26
  const cy = W.y + 30
  const dotCols = ['#fb7185', '#facc15', '#4ade80']
  dotCols.forEach((c, i) => {
    ctx.fillStyle = hexA(c, 0.85)
    ctx.beginPath()
    ctx.arc(cx + i * 20, cy, 6, 0, TAU)
    ctx.fill()
  })
  rrPath(ctx, U.x, U.y, U.w, U.h, U.h / 2)
  ctx.fillStyle = 'rgba(8,12,30,0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(150,170,255,0.18)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  // LAYOUT v1.3.2 (F20): padlock + URL text anchor to the pill's own center
  // (pcy), not the chrome row (cy) — the lock used to hug the pill's top edge.
  const pcy = U.y + U.h / 2
  if (beat >= urlFromBeat) {
    // little padlock for https
    ctx.strokeStyle = hexA('#facc15', 0.95)
    ctx.lineWidth = 2
    const lx = U.x + 22
    rrPath(ctx, lx - 5, pcy - 2, 10, 9, 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(lx, pcy - 6, 4, Math.PI, TAU)
    ctx.stroke()
    ctx.fillStyle = 'rgba(225,235,255,0.92)'
    ctx.font = `600 15px ${FONT}`
    ctx.fillText(ex.url ?? '', lx + 14, pcy)
  } else {
    ctx.fillStyle = 'rgba(170,180,224,0.45)'
    ctx.font = `500 14px ${FONT}`
    ctx.fillText('Search or type a URL', U.x + 18, pcy)
  }

  // viewport
  rrPath(ctx, V.x, V.y, V.w, V.h, 14)
  ctx.fillStyle = 'rgba(10,14,32,0.96)'
  ctx.fill()
  ctx.save()
  ctx.clip()

  if (beat < 2) {
    // ---- the search page (context only) ----
    const qb: Rect = { x: V.x + V.w * 0.14, y: V.y + 34, w: V.w * 0.72, h: 46 }
    rrPath(ctx, qb.x, qb.y, qb.w, qb.h, 23)
    ctx.fillStyle = 'rgba(22,30,58,0.95)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(150,170,255,0.25)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = 'rgba(225,235,255,0.9)'
    ctx.font = `600 18px ${FONT}`
    ctx.textAlign = 'left'
    ctx.fillText(ex.query ?? '', qb.x + 24, qb.y + 24)
    // caret blink
    if (Math.floor(s.t / 530) % 2 === 0) {
      const tw = ctx.measureText(ex.query ?? '').width
      ctx.fillStyle = 'rgba(225,235,255,0.75)'
      ctx.fillRect(qb.x + 26 + tw, qb.y + 13, 2, 24)
    }

    // first result (the hit-zone)
    const rr2: Rect = L
    const hoverPulse = s.phase === 'waiting' ? 0.5 + 0.3 * Math.sin(s.t * 0.004) : 0.35
    rrPath(ctx, rr2.x, rr2.y, rr2.w, rr2.h, 12)
    ctx.fillStyle = hexA('#22d3ee', s.phase === 'waiting' ? 0.05 + 0.05 * hoverPulse : 0.04)
    ctx.fill()
    ctx.strokeStyle = hexA('#22d3ee', 0.3 + 0.35 * hoverPulse)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#7ee7f9'
    ctx.font = `700 20px ${FONT}`
    ctx.fillText(ex.resultTitle ?? '', rr2.x + 20, rr2.y + 24)
    // underline
    const tW = ctx.measureText(ex.resultTitle ?? '').width
    ctx.strokeStyle = hexA('#7ee7f9', 0.65)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(rr2.x + 20, rr2.y + 33)
    ctx.lineTo(rr2.x + 20 + tW, rr2.y + 33)
    ctx.stroke()
    ctx.fillStyle = 'rgba(134,239,172,0.85)'
    ctx.font = `500 13px ${FONT}`
    ctx.fillText(ex.resultUrl ?? '', rr2.x + 20, rr2.y + 45)
    ctx.fillStyle = 'rgba(170,180,224,0.65)'
    ctx.font = `500 14px ${FONT}`
    ctx.fillText(ex.resultSnippet ?? '', rr2.x + 20, rr2.y + 63)

    // a second, greyed result (context depth, never interactive)
    ctx.fillStyle = 'rgba(170,180,224,0.4)'
    ctx.font = `600 17px ${FONT}`
    ctx.fillText('Cats in mythology — an overview', rr2.x + 20, rr2.y + 118)
    ctx.fillStyle = 'rgba(134,239,172,0.35)'
    ctx.font = `500 12px ${FONT}`
    ctx.fillText('https://lore.example/cats', rr2.x + 20, rr2.y + 136)
    // v1.3.11 (F55, owner round 11): more greyed rows below — owner wants a
    // rich SERP ("cho nhiều kết quả hơn đi ... nhưng cho đủ để ko bị tràn
    // ra khỏi viền block browser"). 64 px pitch, alpha decays with depth;
    // 4 rows measured against the viewport bottom (12 px margin).
    ;(ex.extraResults ?? []).forEach((res, k) => {
      ctx.fillStyle = `rgba(170,180,224,${0.34 - k * 0.04})`
      ctx.font = `600 17px ${FONT}`
      ctx.fillText(res.title, rr2.x + 20, rr2.y + 182 + k * 64)
      ctx.fillStyle = `rgba(134,239,172,${0.3 - k * 0.04})`
      ctx.font = `500 12px ${FONT}`
      ctx.fillText(res.url, rr2.x + 20, rr2.y + 202 + k * 64)
    })
  } else if (beat < finalFromBeat && s.phase !== 'done') {
    // ---- loading state: progress bar + spinner; deliberately EMPTY page ----
    drawLoadingState(ctx, V, ex.url, beat, finalFromBeat, s.t, 1)
  } else {
    // ---- finale: the rendered page ----
    // v1.3.14 (F62, owner round 14 "khi đốm sáng từ GPU lên màn hình thì cái
    // pop up all about cats mới hiện ra chứ"): the page may NOT pre-exist its
    // delivery. The spark carries the frame GPU → window (travel 25→26, 462
    // world px) across the whole 3000 ms beat, yet the page used to be FULLY
    // visible at 500 ms — the spark had covered 1.7 % of the trip and was
    // still sitting on the chip at (735,797). Now the screen keeps WAITING
    // through the flight (bar, spinner, Waiting text — fading out), and the
    // hand-off happens as the spark closes in: cross-fade over [0.40 → 0.72]
    // — spark at (662,697) → (494,463), inside the window — with the page
    // growing 0.55 → 0.96 eased over [0.40 → 1.00], full exactly at beat end.
    // F28f's gentle grow is kept; the recap rests at full size as before
    // (the 21→22 seam is identical).
    const lin = clamp(s.beatElapsed / 3000, 0, 1) // beat 21 = 3000 ms
    const finA = s.beatIndex > finalFromBeat ? 1 : clamp((lin - 0.4) / 0.32, 0, 1)
    if (finA < 1) drawLoadingState(ctx, V, ex.url, beat, finalFromBeat, s.t, 1 - finA)
    if (finA > 0) {
      const growIn = s.beatIndex > finalFromBeat ? 1 : easeInOutCubic(clamp((lin - 0.4) / 0.6, 0, 1))
      const scale = lerp(0.55, 0.96, growIn)
      const cw = V.w * scale
      const ch = V.h * scale
      drawMiniPage(ctx, { x: V.x + (V.w - cw) / 2, y: V.y + (V.h - ch) / 2, w: cw, h: ch }, ex.page, finA)
    }
  }
  ctx.restore()

  // window label (below the frame)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = active ? '#ffffff' : hexA('#aab4d0', 0.55)
  ctx.font = `700 16px ${FONT}`
  if (active) { ctx.shadowColor = e.color; ctx.shadowBlur = 10 }
  ctx.fillText(e.name, W.x + W.w / 2, W.y + W.h + 18)
  ctx.restore()
}

// ===========================================================================
// NIC — small network card (hardware continuity with Chapter 01)
// ===========================================================================
export const drawNIC: EntityRenderer = (ctx, s, e, active) => {
  // v1.3.7 (F45): steady brightening while the packet sits on the NIC —
  // owner round 7: no flash ring (F41 removed), just "sáng lên chút" while
  // the spark dwells (see the response beat's holdAt), then it rolls to RAM.
  const dSpark = Math.hypot(s.sparkPos.x - e.pos.x, s.sparkPos.y - e.pos.y)
  const pulse = Math.pow(clamp(1 - dSpark / 110, 0, 1), 2)
  ctx.save()
  ctx.globalAlpha = active ? 1 : Math.max(0.55, 0.55 + 0.45 * pulse)
  if (active) glow(ctx, e.pos, e.color, 90, 0.4 + 0.1 * Math.sin(s.t * 0.005))
  if (pulse > 0.01) glow(ctx, e.pos, e.color, 100, 0.32 * pulse)
  const w = 74
  const h = 30
  rrPath(ctx, e.pos.x - w / 2, e.pos.y - h / 2, w, h, 6)
  ctx.fillStyle = hexA(e.color, active ? 0.22 : 0.12)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.95 : 0.5)
  ctx.lineWidth = 2
  ctx.stroke()
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = hexA(active ? '#ffffff' : e.color, active ? 0.75 : 0.55)
    ctx.fillRect(e.pos.x - 24 + i * 20, e.pos.y - 5, 12, 10)
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active)
}

// ===========================================================================
// SERVICE BOX — DNS (book) and Server (files). `extra.icon`, optional
// `extra.ipLabel` revealed from `extra.ipFromBeat` (DNS's answer persists).
// ===========================================================================
interface ServiceBoxExtra { icon?: string; ipLabel?: string; ipFromBeat?: number }
export const drawServiceBox: EntityRenderer = (ctx, s, e, active) => {
  const ex = (e.extra ?? {}) as ServiceBoxExtra
  ctx.save()
  ctx.globalAlpha = active ? 1 : 0.55
  if (active) glow(ctx, e.pos, e.color, 110, 0.42 + 0.1 * Math.sin(s.t * 0.006))
  // LAYOUT v1.3.3 (F25): w 150 → 156, h 110 → 118 — after the book glyph grew
  // and the IP pill gained honest padding, re-banded so every interior band
  // (icon / churn / pill) keeps ≥ 8 px breathing (R02).
  const w = 156
  const h = 118
  const x = e.pos.x - w / 2
  const y = e.pos.y - h / 2
  rrPath(ctx, x, y, w, h, 14)
  ctx.fillStyle = hexA(e.color, active ? 0.18 : 0.1)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.95 : 0.45)
  ctx.lineWidth = 2
  ctx.stroke()

  const cxp = e.pos.x
  const cy = e.pos.y - 17 // bands: icon (−37..+3) / churn (+14) / pill (+27..+51)
  if (ex.icon === 'book') {
    // address book glyph — LAYOUT v1.3.3 (F25c): was 34×32 with 11 px
    // microtype (≈6 px on the owner's stage, unreadable) → 52×40, honest type
    rrPath(ctx, cxp - 26, cy - 20, 52, 40, 5)
    ctx.fillStyle = hexA(e.color, 0.35)
    ctx.fill()
    ctx.strokeStyle = hexA('#ffffff', 0.85)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cxp, cy - 20)
    ctx.lineTo(cxp, cy + 20)
    ctx.stroke()
    ctx.fillStyle = hexA('#ffffff', 0.92)
    ctx.font = `800 16px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('A→', cxp - 13, cy + 1)
    ctx.fillText('IP', cxp + 13, cy + 1)
  } else {
    // stacked disks glyph (server)
    for (let i = 0; i < 3; i++) {
      rrPath(ctx, cxp - 22, cy - 18 + i * 14, 44, 10, 3)
      ctx.fillStyle = hexA(e.color, 0.35)
      ctx.fill()
      ctx.strokeStyle = hexA('#ffffff', 0.75)
      ctx.lineWidth = 1.2
      ctx.stroke()
    }
  }
  // churn dots while the machine works
  if (active) {
    for (let i = 0; i < 3; i++) {
      const a = s.t * 0.01 + (i * TAU) / 3
      ctx.fillStyle = hexA('#ffffff', 0.5 + 0.4 * Math.sin(a))
      ctx.beginPath()
      ctx.arc(cxp - 10 + i * 10, e.pos.y + 14, 3, 0, TAU)
      ctx.fill()
    }
  }
  // DNS's answer persists once given.
  // LAYOUT v1.3.3 (F25b): the font is set BEFORE measuring — the old code
  // measured with the stale 11 px icon font (≈72 px) while drawing in 14 px
  // mono (≈109 px), so the text overshot the pill by ~5.5 px on each side.
  // HTML padding model: content box + 12 px inline padding, ≥ 8 px inset.
  if (ex.ipLabel && s.beatIndex >= (ex.ipFromBeat ?? 3)) {
    ctx.font = `700 14px ${MONO}`
    const iw = ctx.measureText(ex.ipLabel).width + 24
    const pillY = e.pos.y + h / 2 - 8 - 24 // 8 px above the border
    rrPath(ctx, cxp - iw / 2, pillY, iw, 24, 12)
    ctx.fillStyle = 'rgba(8,12,30,0.95)'
    ctx.fill()
    ctx.strokeStyle = hexA('#facc15', 0.8)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#facc15'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(ex.ipLabel, cxp, pillY + 12)
  }
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, 74)
}

// ===========================================================================
// HTTPS LOCK — materializes on the link once the channel is private.
// `extra.fromBeat`: first beat where the lock exists.
// ===========================================================================
interface LockExtra { fromBeat?: number; label?: LocalizedText }
export const drawHTTPSLock: EntityRenderer = (ctx, s, e, active) => {
  const ex = (e.extra ?? {}) as LockExtra
  const from = ex.fromBeat ?? 4
  if (s.beatIndex < from) return
  const appearing = s.beatIndex === from ? easeInOutCubic(clamp(s.beatElapsed / 2600, 0, 1)) : 1
  const a = s.beatIndex > from ? 1 : appearing
  ctx.save()
  ctx.globalAlpha = (active ? 1 : 0.7) * a
  if (active) glow(ctx, e.pos, e.color, 80, 0.4 + 0.12 * Math.sin(s.t * 0.007))
  const grow = 0.6 + 0.4 * appearing
  ctx.translate(e.pos.x, e.pos.y)
  ctx.scale(grow, grow)
  // shackle
  ctx.strokeStyle = hexA('#ffffff', 0.95)
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(0, -6, 9, Math.PI, TAU)
  ctx.stroke()
  // body
  rrPath(ctx, -13, -6, 26, 22, 5)
  ctx.fillStyle = e.color
  ctx.fill()
  ctx.strokeStyle = hexA('#ffffff', 0.9)
  ctx.lineWidth = 2
  ctx.stroke()
  // keyhole
  ctx.fillStyle = '#0a0f24'
  ctx.beginPath()
  ctx.arc(0, 3, 3.5, 0, TAU)
  ctx.fill()
  ctx.fillRect(-1.6, 4, 3.2, 7)
  ctx.restore()
  drawName(ctx, e.pos, e.name, e.color, active, 26, 13)
}

// v1.3.2 (F24): pictogram glyphs — a station explains itself by its drawing,
// not by an abbreviation. Monochrome ink in the station's own color.
// LAYOUT v1.3.3 (F27): pictographs drawn at 1.85× (GPU-grid fill parity — the
// glyphs only filled ~30 % of the box); word-badge glyphs (html/css/js) follow
// the real-world dev vocabulary (owner: "JavaScript là JS sẽ hợp hơn") and are
// drawn unscaled — R17: text is never scaled.
const GLYPH_SCALE = 1.85
function drawStationGlyph(ctx: CanvasRenderingContext2D, glyph: string, cx: number, cy: number, color: string) {
  const ink = hexA(color, 0.9)
  // ---- word badges (no geometry scaling — R17) ----
  if (glyph === 'html' || glyph === 'css') {
    ctx.save()
    ctx.fillStyle = ink
    ctx.font = `800 20px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(glyph === 'html' ? 'HTML' : 'CSS', cx, cy + 1)
    ctx.restore()
    return
  }
  if (glyph === 'js') {
    // the community badge: yellow square + dark monogram
    ctx.save()
    rrPath(ctx, cx - 19, cy - 19, 38, 38, 7)
    ctx.fillStyle = hexA(color, 0.95)
    ctx.fill()
    ctx.fillStyle = '#151310'
    ctx.font = `800 21px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('JS', cx, cy + 2)
    ctx.restore()
    return
  }
  ctx.save()
  ctx.strokeStyle = ink
  ctx.fillStyle = ink
  ctx.translate(cx, cy)
  ctx.scale(GLYPH_SCALE, GLYPH_SCALE)
  ctx.lineWidth = 2 / GLYPH_SCALE // ≈2 px effective after scaling
  switch (glyph) {
    case 'hex': // decode: cells of raw byte pairs
      for (let i = 0; i < 3; i++) { rrPath(ctx, -19 + i * 14, -6, 11, 12, 2); ctx.stroke() }
      break
    case 'cut': // tokenize: the stream cut into pieces
      rrPath(ctx, -18, -6, 13, 12, 3); ctx.stroke()
      rrPath(ctx, 5, -6, 13, 12, 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-2, -9); ctx.lineTo(2, 9); ctx.stroke()
      break
    case 'tree': { // parser: grows the tree
      const top = { x: 0, y: -9 }, bl = { x: -9, y: 7 }, br = { x: 9, y: 7 }
      ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.lineTo(bl.x, bl.y); ctx.moveTo(top.x, top.y); ctx.lineTo(br.x, br.y); ctx.stroke()
      for (const p of [top, bl, br]) { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, TAU); ctx.fill() }
      break
    }
    case 'bolt': // js engine: runs instantly
      ctx.beginPath()
      ctx.moveTo(5, -12); ctx.lineTo(-6, 2); ctx.lineTo(0, 2)
      ctx.lineTo(-5, 12); ctx.lineTo(6, -2); ctx.lineTo(1, -2); ctx.closePath()
      ctx.fill()
      break
    case 'door': // net port: the little door back to the network
      rrPath(ctx, -9, -12, 18, 24, 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(0, -6)
      ctx.moveTo(-4, -2); ctx.lineTo(0, -6); ctx.lineTo(4, -2)
      ctx.stroke()
      break
    case 'swatch': // style: picks the outfits
      for (const p of [{ x: -10, y: 5 }, { x: 0, y: -7 }, { x: 10, y: 5 }]) {
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, TAU); ctx.fill()
      }
      break
    case 'ruler': // layout: exact geometry
      ctx.strokeRect(-14, -6, 28, 12)
      ctx.beginPath()
      for (const dx of [-7, 0, 7]) { ctx.moveTo(dx, -6); ctx.lineTo(dx, -1) }
      ctx.stroke()
      break
    case 'roller': // paint: turns geometry into draw orders
      rrPath(ctx, -13, -9, 20, 8, 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(7, -1); ctx.lineTo(7, 4)
      ctx.lineTo(11, 4); ctx.lineTo(11, 9); ctx.stroke()
      break
    case 'pixels': // raster: a real pixel grid
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        ctx.globalAlpha = (i + j) % 2 === 0 ? 0.9 : 0.45
        ctx.fillRect(-12 + i * 6, -12 + j * 6, 5, 5)
      }
      break
  }
  ctx.restore()
}

// ===========================================================================
// STATION — an engine work post. `extra.glyph` = pictogram (v1.3.2),
// `extra.short` = 3-letter code fallback,
// `extra.pausedBeats` = beats where the station is visibly frozen.
// ===========================================================================
interface StationExtra { short?: string; glyph?: string; pausedBeats?: number[] }
export const drawStation: EntityRenderer = (ctx, s, e, active) => {
  const ex = (e.extra ?? {}) as StationExtra
  const frozen = (ex.pausedBeats ?? []).includes(s.beatIndex)
  ctx.save()
  ctx.globalAlpha = frozen ? 0.35 : active ? 1 : 0.55
  if (active && !frozen) glow(ctx, e.pos, e.color, 95, 0.4 + 0.1 * Math.sin(s.t * 0.006))
  // LAYOUT v1.3.3 (F27): 132×58 → 148×66 — owner asked for bigger station
  // blocks (GPU-parity presence); gaps re-verified: 22 px top row, 62 px
  // bottom row, 24 px under the east-corridor leg.
  const w = 148
  const h = 66
  const x = e.pos.x - w / 2
  const y = e.pos.y - h / 2
  rrPath(ctx, x, y, w, h, 12)
  ctx.fillStyle = hexA(e.color, active ? 0.2 : 0.1)
  ctx.fill()
  ctx.strokeStyle = hexA(e.color, active ? 0.95 : 0.45)
  ctx.lineWidth = active ? 2.5 : 2
  ctx.stroke()
  if (ex.glyph) {
    drawStationGlyph(ctx, ex.glyph, e.pos.x, e.pos.y, e.color)
  } else if (ex.short) {
    ctx.fillStyle = active && !frozen ? '#ffffff' : hexA('#aab4d0', 0.85)
    ctx.font = `800 17px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(ex.short, e.pos.x, e.pos.y)
  }
  ctx.restore()
  if (frozen) {
    // LAYOUT v1.3.3: pause note parks UNDER the name label — the band above
    // the parser box belongs to the Network Port's own label, and the two
    // collided when the box grew (R01; caught in render v-b14-early).
    ctx.save()
    ctx.fillStyle = hexA('#7dd3fc', 0.95)
    ctx.font = `800 14px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('❚❚ paused', e.pos.x, e.pos.y + 64)
    ctx.restore()
  }
  drawName(ctx, e.pos, e.name, e.color, active, 42, 14)
}

// ===========================================================================
// WORKBENCH — the heart of Chapter 02: watch the page being built.
// Content flows in via extra.story; the stage is chosen by extra.stageAtBeat.
// ===========================================================================
export const drawWorkbench: EntityRenderer = (ctx, s, e, active) => {
  const ex = (e.extra ?? {}) as Partial<WorkbenchExtra>
  if (!ex.rect || !ex.story || !ex.stageAtBeat) return
  const r = ex.rect
  const story = ex.story
  const stage = ex.stageAtBeat[s.beatIndex] ?? 'final'
  // v1.3.6 (F38): normalized by the beat's REAL duration (was hardcoded
  // /3000 — a 2800 ms beat never reached frac 1, its tail fade could never
  // complete). With durAtBeat every stage dies fully inside its own beat.
  const dur = ex.durAtBeat?.[s.beatIndex] ?? 3000
  const frac = easeInOutCubic(clamp(s.beatElapsed / dur, 0, 1))

  ctx.save()
  if (active) glow(ctx, e.pos, e.color, 140, 0.16)
  rrPath(ctx, r.x, r.y, r.w, r.h, 20)
  ctx.fillStyle = 'rgba(13,19,42,0.94)'
  ctx.fill()
  ctx.strokeStyle = hexA('#e2e8f0', active ? 0.5 : 0.22)
  ctx.lineWidth = 2
  ctx.stroke()
  // stage caption
  const cap = ex.captions?.[stage]
  if (cap) {
    ctx.fillStyle = hexA('#aab4d0', 0.7)
    ctx.font = `700 15px ${FONT}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(cap, r.x + 18, r.y + 12)
  }
  ctx.save()
  rrPath(ctx, r.x, r.y, r.w, r.h, 20)
  ctx.clip()

  const inner: Rect = { x: r.x + 20, y: r.y + 40, w: r.w - 40, h: r.h - 88 }
  const st = stage
  // v1.3.8 (F46, owner round 8): the PREVIOUS dot's collision-real residue
  // dissolves ONLY at the new dot's opening — the first 10 % of REAL beat
  // time (~0.3 s) — then nothing of the old dot exists. Inside a beat,
  // nothing fades at all ("chỉ khi thật sự sang bước tiếp theo thì mới có
  // hiệu ứng biến mất hoàn toàn"). Zero-residue at steady state (round 6,
  // "triệt để") still holds: after the opening, only the current dot draws.
  // v1.3.8 (F46, owner round 8): the PREVIOUS dot's collision-real residue
  // dissolves ONLY at the new dot's opening — the first 10 % of REAL beat
  // time (~0.3 s) — then nothing of the old dot exists. Inside a beat,
  // nothing fades at all ("chỉ khi thật sự sang bước tiếp theo thì mới có
  // hiệu ứng biến mất hoàn toàn"). Zero-residue at steady state (round 6,
  // "triệt để") still holds: after the opening, only the current dot draws.
  const lin = clamp(s.beatElapsed / dur, 0, 1)
  const rf = 1 - easeInOutCubic(clamp(lin / 0.1, 0, 1))
  if (rf > 0) drawResidue(ctx, inner, story, s.beatIndex, rf, s.t)
  if (st === 'bytes') stageBytes(ctx, inner, story, frac, s.t)
  else if (st === 'chars') stageChars(ctx, inner, story, frac, s.t)
  else if (st === 'dom') stageDom(ctx, inner, story, frac, false, false)
  else if (st === 'cssfetch') stageCssFetch(ctx, inner, story, frac, s.t)
  else if (st === 'cssom') stageCssom(ctx, inner, story, frac, false)
  else if (st === 'paused') stagePaused(ctx, inner, story, frac)
  else if (st === 'mutated') stageMutated(ctx, inner, story, frac)
  else if (st === 'rendertree') stageRenderTree(ctx, inner, story, frac)
  else if (st === 'layout') stageLayout(ctx, inner, story, frac)
  else if (st === 'paint') stagePaint(ctx, inner, story, frac)
  else if (st === 'raster') stageRaster(ctx, inner, story, frac)
  else if (st === 'composite') stageComposite(ctx, inner, story, frac, s.t)
  else drawMiniPage(ctx, centerRect(inner, 0.72), story.page, 1)

  ctx.restore()
  ctx.restore()
}

function centerRect(r: Rect, k: number): Rect {
  const w = r.w * k
  const h = r.h * k
  return { x: r.x + (r.w - w) / 2, y: r.y + (r.h - h) / 2, w, h }
}

// v1.3.8 (F46, owner round 8): THE rule of the workbench. Inside a beat,
// content births at the calm F43 pace and then HOLDS AT FULL PRESENCE to the
// beat's end — nothing fades or vanishes inside its own beat. The previous
// dot's residue dissolves ONLY at the new dot's opening (drawResidue, first
// 10 % of real time), so the hand-off reads as the old making room for the
// new ("chỉ khi thật sự sang bước tiếp theo thì mới có hiệu ứng biến mất
// hoàn toàn"). Supersedes F38's tailA (fade in the beat's own tail from
// 0.82): with F43's whole-beat births, tailA killed elements before they were
// ever fully shown — the owner's "chưa hiện hết đã mờ dần rồi biến mất hẳn"
// (measured: CSSOM card 3 peaked at ~7 % alpha, the last 102 raster pixels
// lit into an already-dissolving page). Live arcs (the DOM tree, b11→b16)
// and the owner-kept settles (b13 column, b14 dim, b16 shrink) stand.
// v1.3.9 (round 9): case 18 retired — paint now OWNS the blueprint (settles
// it into the left mini, F49); case 20 retired — the raster page persists
// DIMMED as the composite beat's underlay (F51). Remaining cases: 10–15,
// 17, 19.
function drawResidue(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  st: StorySpec,
  beatIndex: number,
  rf: number,
  t: number,
) {
  // The old dot's FINAL frame, dissolving at the new dot's opening (F46).
  // Only collision-real blocks are redrawn — live arcs keep their own rules.
  switch (beatIndex) {
    case 10: // decode → tokenize: hex grid + decoded characters
      drawBytes(ctx, r, st, 1, t, rf)
      break
    case 11: { // tokenize → DOM: source lines + token chips
      ctx.save()
      ctx.globalAlpha = rf
      ctx.font = `600 15px ${MONO}`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = hexA('#e2e8f0', 0.75)
      st.charLines.forEach((ln, i) => ctx.fillText(ln, r.x, r.y + 14 + i * 24))
      ctx.restore()
      drawChips(ctx, r, st, 1, rf)
      break
    }
    case 12: { // DOM → css-fetch: the token hint line
      ctx.save()
      ctx.globalAlpha = rf
      ctx.font = `600 13px ${MONO}`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = hexA('#e2e8f0', 0.35)
      ctx.fillText(st.tokens.slice(0, 8).join('  '), r.x, r.y + 10)
      ctx.restore()
      break
    }
    case 13: { // css-fetch → CSSOM: the parked CSS parcel (v1.3.12/F59: the
      // link pulse ring is GONE from the residue — it already ended at frac
      // 0.24 of its own beat, and re-drawing it here left it visibly detached
      // (~26 world px) from the link node while the tree settled left)
      const px = r.x + r.w * 0.82
      const py = r.y + r.h * 0.66
      ctx.save()
      ctx.globalAlpha = rf
      rrPath(ctx, px - 30, py - 20, 60, 40, 8)
      ctx.fillStyle = hexA('#c084fc', 0.3)
      ctx.fill()
      ctx.strokeStyle = hexA('#c084fc', 0.9)
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = '#e9d5ff'
      ctx.font = `800 14px ${FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('CSS', px, py)
      ctx.restore()
      break
    }
    case 14: { // CSSOM → js-pause: the rule cards + heading (tree is live arc)
      const half = r.w * 0.52
      drawCssomCards(ctx, r, st, half, 1, rf)
      if (r.w - half - 40 >= 56) {
        ctx.save()
        ctx.globalAlpha = rf
        ctx.fillStyle = hexA('#c084fc', 0.8)
        ctx.font = `800 14px ${FONT}`
        ctx.textAlign = 'left'
        ctx.fillText('CSSOM', r.x + half + 30, r.y + 30)
        ctx.restore()
      }
      break
    }
    case 15: { // js-pause → js-run: the script ring (tree handled by the arc)
      const area = { x: r.x, y: r.y + 40, w: r.w, h: r.h - 88 }
      const { pos } = domPositions(st, area, true)
      const sp = pos[st.scriptNode.id]
      if (sp) {
        ctx.save()
        ctx.globalAlpha = rf
        ctx.strokeStyle = hexA('#facc15', 0.9)
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 29, 0, TAU)
        ctx.stroke()
        ctx.restore()
      }
      break
    }
    // case 16 (js-run → render-tree) handled INSIDE stageRenderTree: the
    // F28d old-DOM shrink-and-dissolve at the new dot's opening — the
    // owner-kept "co lại" settle.
    case 17: // render-tree → layout: the render nodes
      drawRenderTree(ctx, r, st, 1, rf)
      break
    // case 18 (layout → paint) removed in v1.3.9 (F49): the paint beat now
    // OWNS the blueprint — it settles into the left mini inside stagePaint.
    case 19: { // paint → raster: receipts (right zone) + the mini blueprint
      drawReceipts(ctx, r, st, 1, rf, paintZone(r))
      drawBlueprintIn(ctx, paintMini(r), 1, 0.55 * rf)
      break
    }
    // case 20 (raster → composite) removed in v1.3.9 (F51): the raster page
    // now DIMS to 30 % and persists as the composite beat's underlay.
  }
}

// ---- stage: bytes → characters --------------------------------------------
// v1.3.8 (F46): the stage HOLDS at full presence to beat end (no inside-beat
// fade); its residue (hex grid + chars) dissolves at tokenize's opening
// (drawResidue case 10).
function drawBytes(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, t: number, alphaMul = 1) {
  const grid = st.hexGrid
  const cols = grid[0]?.length ?? 0
  const rows = grid.length
  if (!cols || !rows) return
  // LAYOUT v1.3.4 (F29): the stage used to cram everything into the top-left
  // (~40×40 % of the bench). Measured two-zone fit now — both zones occupy
  // ≥80 % of the bench height (R09), digits 14→18 px, chars 15→19 px.
  // v1.3.10 (F52, owner round 10): hex zone widened 0.46 → 0.52 (cells
  // 42 → 48 world px, grid +63 px ≈ +33 px on the owner's stage — "kéo rộng
  // 1 chút"); the soft-wrapped decode lines need ≈ 308 / 485 px — no clip.
  const zoneW = r.w * 0.52
  const cw = Math.min(52, (zoneW - 16) / cols)
  const chh = Math.min(64, (r.h - 24) / rows)
  const gw = cols * cw
  const gh = rows * chh
  const gx = r.x
  const gy = r.y + (r.h - gh) / 2
  ctx.save()
  ctx.globalAlpha = alphaMul
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 18px ${MONO}`
  for (let row = 0; row < rows; row++) {
    for (let c = 0; c < cols; c++) {
      const cells = row * cols + c
      const born = cells / (rows * cols)
      const a = clamp((frac * 1.4 - born) / 0.25, 0, 1)
      if (a <= 0) continue
      const drift = Math.sin(t * 0.003 + cells) * 1.5
      ctx.fillStyle = hexA('#38bdf8', 0.16 * a)
      rrPath(ctx, gx + c * cw + 4, gy + row * chh + drift, cw - 8, chh - 10, 5)
      ctx.fill()
      ctx.fillStyle = hexA('#7dd3fc', 0.9 * a)
      ctx.fillText(grid[row][c], gx + c * cw + cw / 2, gy + row * chh + chh / 2 + drift)
    }
  }
  // decoded characters appearing on the right side, driven by the same frac
  {
    const lines = st.decodeLines ?? st.charLines
    const pitch = Math.min(64, (r.h - 32) / lines.length)
    const cy0 = r.y + (r.h - (lines.length - 1) * pitch) / 2
    const charsZone: Rect = { x: gx + gw + 32, y: r.y, w: r.w - gw - 32, h: r.h }
    ctx.beginPath()
    ctx.rect(charsZone.x, charsZone.y, charsZone.w, charsZone.h)
    ctx.clip()
    ctx.fillStyle = hexA('#e2e8f0', 0.95)
    ctx.font = `600 19px ${MONO}`
    ctx.textAlign = 'left'
    lines.forEach((ln, i) => {
      const show = Math.floor(clamp(frac * 1.4 - 0.15, 0, 1) * ln.length)
      ctx.fillText(ln.slice(0, show), charsZone.x, cy0 + i * pitch)
    })
  }
  ctx.restore()
}

function stageBytes(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, t: number) {
  // v1.3.8 (F46): full presence to beat end; the hand-off lives at the next
  // dot's opening now, not in this beat's tail (old F38 tailA deleted).
  drawBytes(ctx, r, st, frac, t)
}

// ---- stage: characters → tokens --------------------------------------------
function drawChips(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, alphaMul = 1) {
  const toks = st.tokens
  const perRow = 4
  const chipW = (r.w - (perRow - 1) * 12) / perRow
  const n = Math.floor(frac * toks.length)
  ctx.textAlign = 'center'
  toks.forEach((tk, i) => {
    if (i > n) return
    const appear = i === n ? frac * toks.length - n : 1
    const row = Math.floor(i / perRow)
    const col = i % perRow
    const x = r.x + col * (chipW + 12)
    const y = r.y + 150 + row * 54
    ctx.globalAlpha = (0.3 + 0.7 * appear) * alphaMul
    rrPath(ctx, x, y, chipW, 44, 8)
    ctx.fillStyle = i === n ? hexA('#818cf8', 0.32) : hexA('#818cf8', 0.16)
    ctx.fill()
    ctx.strokeStyle = hexA('#818cf8', 0.6)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#e2e8f0'
    ctx.font = `600 14px ${MONO}`
    ctx.fillText(tk, x + chipW / 2, y + 22)
    ctx.globalAlpha = 1
  })
}

function stageChars(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, t: number) {
  // v1.3.8 (F46): the decode residue now dissolves AT THIS beat's opening
  // (drawResidue case 10), and this beat's own lines + chips hold at full
  // presence to beat end — the last 4 chips no longer die at ~0 alpha
  // (measured: chips 13–16 were born 0.82→1.0 straight into F38's tailA).
  // Birth windows unchanged from F43: lines (frac−0.17)/0.12, chips
  // (frac−0.19)/0.81.
  const lineA = clamp((frac - 0.17) / 0.12, 0, 1)
  ctx.font = `600 15px ${MONO}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = hexA('#e2e8f0', 0.75 * lineA)
  // v1.3.10 (F52): CHAR_LINES back to 5 rows with the script on ONE line
  // (owner round 10); pitch 24 keeps the block above the chips grid
  // (starts at r.y + 150) with room to spare.
  st.charLines.forEach((ln, i) => ctx.fillText(ln, r.x, r.y + 14 + i * 24))
  drawChips(ctx, r, st, clamp((frac - 0.19) / 0.81, 0, 1))
}

// ---- shared: draw the DOM tree --------------------------------------------
function domPositions(st: StorySpec, area: Rect, includeScript: boolean) {
  const nodes = includeScript
    ? [...st.domNodes, { ...st.scriptNode, order: 7, tint: '#facc15' }]
    : st.domNodes
  const byDepth: Record<number, typeof nodes> = {}
  nodes.forEach((n) => { (byDepth[n.depth] ??= []).push(n) })
  const depthCount = Object.keys(byDepth).length
  const pos: Record<string, { x: number; y: number; tint?: string; label: string; id: string }> = {}
  Object.entries(byDepth).forEach(([d, ns]) => {
    ns.forEach((n, i) => {
      const gap = area.w / (ns.length + 1)
      pos[n.id] = {
        x: area.x + gap * (i + 1),
        y: area.y + (Number(d) / Math.max(1, depthCount - 1)) * (area.h - 40) + 10,
        tint: n.tint,
        label: n.label,
        id: n.id,
      }
    })
  })
  return { pos, nodes }
}

function drawDomTree(
  ctx: CanvasRenderingContext2D,
  area: Rect,
  st: StorySpec,
  includeScript: boolean,
  revealCount: number, // -1 = all
  opts: { dim?: number; scriptRing?: number; pLabelOverride?: string },
) {
  const { pos, nodes } = domPositions(st, area, includeScript)
  const dim = opts.dim ?? 1
  // LAYOUT v1.3 (F3): leaf-row labels alternate two bands so siblings never
  // share the same text band — measured-fit rule R05.
  const maxDepth = Math.max(...nodes.map((n) => n.depth))
  let leafSlot = 0
  const leafBand: Record<string, number> = {}
  nodes.forEach((n) => {
    if (n.depth === maxDepth) { leafBand[n.id] = 26 + (leafSlot % 2) * 20; leafSlot += 1 }
  })
  // edges first (behind nodes)
  nodes.forEach((n) => {
    if (!n.parent) return
    if (revealCount >= 0 && n.order > revealCount) return
    const a = pos[n.id]
    const b = pos[n.parent]
    if (!a || !b) return
    ctx.strokeStyle = hexA('#7ee7f9', 0.4 * dim)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  })
  nodes.forEach((n) => {
    if (revealCount >= 0 && n.order > revealCount) return
    const p = pos[n.id]
    const tint = n.tint ?? '#22d3ee'
    const appear = revealCount >= 0 ? clamp(1 - (revealCount - n.order - 1), 0, 1) : 1
    ctx.save()
    ctx.globalAlpha = dim * appear
    if (opts.scriptRing && n.id === st.scriptNode.id) {
      ctx.strokeStyle = hexA('#facc15', 0.5 + 0.4 * opts.scriptRing)
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(p.x, p.y, 26 + 3 * opts.scriptRing, 0, TAU)
      ctx.stroke()
    }
    ctx.fillStyle = hexA(tint, 0.22)
    ctx.strokeStyle = hexA(tint, 0.9)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(p.x, p.y, 18, 0, TAU)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#e2e8f0'
    ctx.font = `700 13px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(n.id === 'p' ? (opts.pLabelOverride ?? n.label) : n.label, p.x, p.y + (leafBand[n.id] ?? 26))
    ctx.restore()
  })
}

// ---- stage: tokens → DOM ---------------------------------------------------
function stageDom(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, _s: boolean, _b: boolean) {
  // v1.3.8 (F46): the tokenize residue (lines + chips) dissolves at this
  // beat's opening, so the hint line waits until it has cleared (eased frac
  // 0.12 ≈ 31 % real time — the residue is gone by 10 %), then HOLDS to beat
  // end (no tailA). The DOM tree stays a live arc (b11→b16) at full presence.
  ctx.font = `600 13px ${MONO}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  const hintA = clamp((frac - 0.12) / 0.05, 0, 1)
  ctx.fillStyle = hexA('#e2e8f0', 0.35 * hintA)
  ctx.fillText(st.tokens.slice(0, 8).join('  '), r.x, r.y + 10)
  // v1.3.3 (F28a-continuity): this beat grows html/head/link only (orders 1–3).
  // The old floor(frac*6) ended the beat with SIX nodes, then cssfetch
  // reopened at THREE — body/h1/p were visibly retracted and re-grown
  // (the owner's "các node trên graph bị mất"). cssfetch now picks up exactly
  // where this beat leaves off — growth never runs backwards.
  const grow = clamp((frac - 0.24) / 0.76, 0, 1)
  drawDomTree(ctx, { x: r.x, y: r.y + 40, w: r.w, h: r.h - 88 }, st, false, Math.min(3, Math.ceil(grow * 3)), {})
}

// ---- stage: CSS fetch detour ------------------------------------------------
// The parser does NOT wait: while the CSS parcel travels, the tree keeps
// growing — body/h1/p (orders 4–6) pop in across the beat (v1.1 review fix:
// previously the frozen tree contradicted the \"keeps reading\" narration).
function stageCssFetch(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, t: number) {
  drawDomTree(ctx, { x: r.x, y: r.y + 40, w: r.w, h: r.h - 88 }, st, false, 3 + Math.min(3, Math.floor(frac * 4)), {})
  // the link node pulses (it triggered the fetch) — drawn as a ring near its pos.
  // v1.3.12 (F59, owner round 12 "sang node trên nhánh khác rồi mà nhánh vẫn
  // còn nhấp nháy... đừng để như thế"): the pulse lives ONLY while the parser
  // is AT the <link> node ("giữa chừng, Parser gặp một cái link") — full to
  // frac 0.16 (real ≈ 1.09 s), faded out by 0.24, i.e. BEFORE body pops at
  // frac 0.25 (same eased clock, so the ordering is exact — never a blink
  // over another branch's birth). The cssom residue drops the ring too.
  const { pos } = domPositions(st, { x: r.x, y: r.y + 40, w: r.w, h: r.h - 88 }, false)
  const lp = pos['link']
  const pulseGate = clamp((0.24 - frac) / 0.08, 0, 1)
  if (lp && pulseGate > 0) {
    ctx.save()
    ctx.strokeStyle = hexA('#a78bfa', (0.5 + 0.4 * Math.sin(t * 0.008)) * pulseGate)
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(lp.x, lp.y, 26 + 2 * Math.sin(t * 0.008), 0, TAU)
    ctx.stroke()
    ctx.restore()
  }
  // the CSS parcel descends from the top edge and parks beside the tree
  // v1.3.8 (F46): parcel + pulse HOLD parked to beat end (they used to die
  // 64 ms after parking — F38's tailA); they dissolve at the CSSOM beat's
  // opening now (drawResidue case 13). v1.3.12 (F59): only the PARCEL holds
  // to beat end — the pulse ends early by design (see pulseGate above).
  const px = r.x + r.w * 0.82
  const py = lerp(-20, r.y + r.h * 0.66, easeInOutCubic(clamp(frac / 0.8, 0, 1)))
  if (frac > 0.06) {
    ctx.save()
    ctx.globalAlpha = clamp(frac / 0.2, 0, 1)
    rrPath(ctx, px - 30, py - 20, 60, 40, 8)
    ctx.fillStyle = hexA('#c084fc', 0.3)
    ctx.fill()
    ctx.strokeStyle = hexA('#c084fc', 0.9)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#e9d5ff'
    ctx.font = `800 14px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('CSS', px, py)
    ctx.restore()
  }
}

// ---- stage: CSSOM ----------------------------------------------------------
// v1.3.3: rule cards extracted — the paused stage reuses them as a hand-over
// ghost (F28e) instead of cutting the column at the seam.
// v1.3.4 (F30): cards are gated on real estate — while the tree-settle still
// owns the width (frac < 0.35) the column simply isn't drawn. The old appear
// formula started card 0 at frac>0 with a NEGATIVE width (half ≈ r.w) →
// IndexSizeError in the live viewer (owner stack trace, dot 14). Cards now
// stack in for (frac-0.35)/0.65, i.e. exactly when their width is final.
function drawCssomCards(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, half: number, frac: number, alphaMul = 1) {
  const cardW = r.w - half - 40
  if (cardW < 56) return
  const cx = r.x + half + 30
  const prog = clamp((frac - 0.35) / 0.65, 0, 1)
  const n = Math.floor(prog * st.cssomRules.length)
  st.cssomRules.forEach((rule, i) => {
    const appear = i < n ? 1 : i === n ? prog * st.cssomRules.length - n : 0
    if (appear <= 0) return
    const y = r.y + 50 + i * 66
    ctx.save()
    ctx.globalAlpha = appear * alphaMul
    rrPath(ctx, cx, y, cardW, 52, 10)
    ctx.fillStyle = hexA('#c084fc', 0.16)
    ctx.fill()
    ctx.strokeStyle = hexA('#c084fc', 0.7)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#e9d5ff'
    ctx.font = `600 14px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(rule, cx + cardW / 2, y + 26)
    ctx.restore()
  })
}

function stageCssom(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, doneBlink: boolean) {
  // LAYOUT v1.3.3 (F28b): the DOM tree SETTLES from full width into its left
  // column during this beat (the same settle language as the paint blueprint,
  // F23) — it used to teleport ~501 px in a single frame at the 13→14 seam.
  // The card column follows the shrink. Beat duration untouched.
  const settle = easeInOutCubic(clamp(frac / 0.35, 0, 1))
  const half = r.w * lerp(1, 0.52, settle)
  drawDomTree(ctx, { x: r.x, y: r.y + 40, w: half, h: r.h - 88 }, st, false, -1, {})
  // CSSOM rule cards stack on the right (gated on their width — F30)
  // v1.3.8 (F46): cards + heading HOLD at full presence to beat end (card 3
  // used to peak at ~7 % alpha — born 0.783→1.0 straight into F38's tailA);
  // they dissolve at the js-pause beat's opening (drawResidue case 14).
  drawCssomCards(ctx, r, st, half, frac)
  const headA = clamp((frac - 0.3) / 0.08, 0, 1)
  if (headA > 0 && r.w - half - 40 >= 56) {
    ctx.fillStyle = hexA('#c084fc', 0.8 * headA)
    ctx.font = `800 14px ${FONT}`
    ctx.textAlign = 'left'
    ctx.fillText(doneBlink ? 'CSSOM ✓' : 'CSSOM', r.x + half + 30, r.y + 30)
  }
}

// ---- stage: parser paused on <script> ---------------------------------------
function stagePaused(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number) {
  // v1.3.8 (F46): the cssom cards dissolve AT THIS beat's opening (drawResidue
  // case 14). The tree regrow + dim settles are KEPT (owner: "co lại giữ
  // nguyên"); the script ring now holds to beat end and dissolves at the
  // js-run beat's opening (drawResidue case 15) — no inside-beat tail fade.
  const regrow = easeInOutCubic(clamp((frac - 0.26) / 0.3, 0, 1))
  drawDomTree(ctx, { x: r.x, y: r.y + 40, w: r.w * lerp(0.52, 1, regrow), h: r.h - 88 }, st, true, -1, {
    dim: lerp(1, 0.55, regrow),
    scriptRing: easeInOutCubic(clamp((frac - 0.26) / 0.5, 0, 1)),
  })
}

// ---- stage: script mutates the page -----------------------------------------
function stageMutated(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number) {
  const pLabel = frac < 0.3 ? st.mutationBase : st.mutationBase + st.mutationAppend
  drawDomTree(ctx, { x: r.x, y: r.y + 40, w: r.w, h: r.h - 88 }, st, true, -1, {
    // v1.3.8 (F46b — BUG FIX, owner round 8): this was lerp(0.55 → 0), i.e.
    // the WHOLE TREE faded to zero within the first 8 % of the beat and the
    // bench sat empty for the remaining 92 % — of the beat whose entire point
    // is the script mutating that tree (verified: snapshot old-b15-mid). The
    // old comment even said "0.55 → clear": the tree now un-dims from the
    // paused beat's 0.55 back to FULL over the first 8 %.
    dim: lerp(0.55, 1, clamp(frac / 0.08, 0, 1)),
    pLabelOverride: pLabel,
  })
  // highlight flash on the mutating text
  // LAYOUT v1.3 (F4): status text lives in its own top-right band (R11) —
  // never in the leaf-label band.
  const drawStatus = (alpha: number) => {
    ctx.fillStyle = hexA('#4ade80', alpha)
    ctx.font = `800 15px ${FONT}`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText('✓ DOM complete', r.x + r.w - 18, r.y + 12)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
  }
  if (frac >= 0.3 && frac < 0.85) drawStatus(0.5 * (1 - (frac - 0.3) / 0.55))
  if (frac >= 0.85) drawStatus(0.85)
}

// ---- stage: render tree ------------------------------------------------------
// v1.3.3: render-tree drawing extracted (drawRenderTree) so the layout stage
// can hold it as a hand-over ghost (F28e); `frac` = progressive reveal.
function drawRenderTree(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, alphaMul = 1) {
  const area: Rect = { x: r.x + r.w * 0.35, y: r.y + 50, w: r.w * 0.62, h: r.h - 100 }
  const byDepth: Record<number, typeof st.renderNodes> = {}
  st.renderNodes.forEach((n) => { (byDepth[n.depth] ??= []).push(n) })
  const depthCount = Object.keys(byDepth).length
  const pos: Record<string, { x: number; y: number }> = {}
  Object.entries(byDepth).forEach(([d, ns]) => {
    ns.forEach((n, i) => {
      const gap = area.w / (ns.length + 1)
      pos[n.id] = { x: area.x + gap * (i + 1), y: area.y + (Number(d) / Math.max(1, depthCount - 1)) * area.h * 0.8 }
    })
  })
  st.renderNodes.forEach((n, i) => {
    if (!n.parent) return
    const a = pos[n.id]
    const b = pos[n.parent]
    const appear = clamp(frac * st.renderNodes.length - i, 0, 1)
    if (appear <= 0) return
    ctx.globalAlpha = appear * alphaMul
    ctx.strokeStyle = hexA('#c084fc', 0.5)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  })
  st.renderNodes.forEach((n, i) => {
    const appear = clamp(frac * st.renderNodes.length - i, 0, 1)
    if (appear <= 0) return
    const p = pos[n.id]
    ctx.globalAlpha = appear * alphaMul
    ctx.fillStyle = hexA(n.tint, 0.85)
    ctx.strokeStyle = hexA('#ffffff', 0.8)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(p.x, p.y, 16, 0, TAU)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#e2e8f0'
    ctx.font = `700 13px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(n.label, p.x, p.y + 24)
  })
  ctx.globalAlpha = 1
}

function stageRenderTree(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number) {
  // LAYOUT v1.3.3 (F28d) + kept in v1.3.8 (F46, owner round 8 "co lại giữ
  // nguyên"): the old DOM SHRINKS into its left strip AND dissolves by frac
  // 0.38 — this IS the js-run → render-tree hand-off, timed at the new dot's
  // opening exactly like every other F46 residue. While settling it keeps
  // its end-of-b15 state (script node, mutated label).
  const settle = easeInOutCubic(clamp(frac / 0.38, 0, 1))
  ctx.save()
  ctx.globalAlpha = lerp(1, 0, settle)
  drawDomTree(ctx, { x: r.x, y: r.y + 40, w: r.w * lerp(1, 0.45, settle), h: r.h - 88 }, st, settle < 1, -1, {
    pLabelOverride: settle < 1 ? st.mutationBase + st.mutationAppend : undefined,
  })
  ctx.restore()
  // v1.3.5 (F33): the render tree grows in only after the old DOM has settled
  // v1.3.8 (F46): …and HOLDS at full presence to beat end (its last node
  // used to peak at ~7 % alpha in F38's tail); the residue dissolves at the
  // layout beat's opening (drawResidue case 17).
  drawRenderTree(ctx, r, st, clamp((frac - 0.42) / 0.58, 0, 1))
}

// ---- stage: layout (blueprint) ------------------------------------------------
// v1.3.9 (F49): drawBlueprintIn draws into an explicit page rect so the PAINT
// beat can settle the SAME blueprint from its full form into the left mini
// (owner round 9: "layout co lại rồi paint hiện fill text bên phải").
// drawBlueprint(ctx, r, …) keeps the centered-full behavior for the layout
// beat itself.
function drawBlueprintIn(ctx: CanvasRenderingContext2D, pg: Rect, f2: number, alphaMul = 1) {
  const grow = easeInOutCubic(f2)
  ctx.save()
  ctx.globalAlpha = alphaMul
  ctx.strokeStyle = hexA('#4ade80', 0.8)
  ctx.lineWidth = 2
  ctx.setLineDash([6, 5])
  // page outline grows
  ctx.strokeRect(pg.x, pg.y, pg.w * grow, pg.h)
  ctx.setLineDash([])
  // boxes with measurement ticks
  const boxes = [
    { x: 0, y: 0, w: 1, h: 0.2 },
    { x: 0.08, y: 0.3, w: 0.84, h: 0.22 },
    { x: 0.29, y: 0.62, w: 0.42, h: 0.11 },
  ]
  boxes.forEach((b, i) => {
    const appear = clamp(f2 * 3 - i, 0, 1)
    if (appear <= 0) return
    const bx = pg.x + b.x * pg.w
    const by = pg.y + b.y * pg.h
    const bw = b.w * pg.w
    const bh = b.h * pg.h
    ctx.globalAlpha = appear * alphaMul
    ctx.strokeStyle = hexA('#4ade80', 0.9)
    ctx.lineWidth = 2
    ctx.strokeRect(bx, by, bw, bh * appear)
    // measurement ticks (width arrow)
    ctx.strokeStyle = hexA('#4ade80', 0.55)
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(bx, by - 6)
    ctx.lineTo(bx + bw, by - 6)
    ctx.moveTo(bx, by - 9)
    ctx.lineTo(bx, by - 3)
    ctx.moveTo(bx + bw, by - 9)
    ctx.lineTo(bx + bw, by - 3)
    ctx.stroke()
    ctx.fillStyle = hexA('#4ade80', 0.75)
    ctx.font = `600 12px ${MONO}`
    ctx.textAlign = 'center'
    ctx.fillText(`${Math.round(bw)}px`, bx + bw / 2, by - 14)
  })
  ctx.restore()
}

function drawBlueprint(ctx: CanvasRenderingContext2D, r: Rect, f2: number, alphaMul = 1) {
  drawBlueprintIn(ctx, centerRect(r, 0.62), f2, alphaMul)
}

// paint-beat geometry (F49): the blueprint settles into this left mini;
// receipts own the right zone. Shared by stagePaint and drawResidue case 19.
const paintMini = (r: Rect): Rect => {
  const w = r.w * 0.3
  const h = r.h * 0.3
  return { x: r.x, y: r.y + (r.h - h) / 2, w, h }
}
const paintZone = (r: Rect): Rect => ({ x: r.x + r.w * 0.42, y: r.y + 26, w: r.w * 0.56, h: r.h - 26 })

function stageLayout(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number) {
  // v1.3.8 (F46): the render-node residue dissolves AT THIS beat's opening
  // (drawResidue case 17). The blueprint HOLDS at full presence to beat end
  // (its last measurement box used to peak at ~24 % alpha — born 0.767→1.0
  // straight into F38's tail); it dissolves at the paint beat's opening.
  drawBlueprint(ctx, r, clamp((frac - 0.3) / 0.7, 0, 1))
}

// ---- stage: paint (command receipts) ------------------------------------------
// drawReceipts is called by stagePaint (births) and by drawResidue case 19
// (dissolve at the raster beat's opening); the list stays centered (F23's
// blueprint strip stays deleted).
  // v1.3.7 (F43): birth window back to (frac−0.35)/0.65 — the whole beat
  // stacks calmly, finishing at beat end. v1.3.8 (F46): …and it HOLDS there.
function drawReceipts(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, alphaMul = 1, zone?: Rect) {
  // v1.3.9 (F49): receipts can own an explicit zone (paint beat: right side,
  // beside the settled mini blueprint). Default = centered (legacy callers).
  const listW = zone ? zone.w : r.w * 0.56
  const listX = zone ? zone.x : r.x + (r.w - listW) / 2
  const y0 = zone ? zone.y : r.y + 26
  const n = st.paintCommands.length
  st.paintCommands.forEach((cmd, i) => {
    const appear = clamp(((frac - 0.15) / 0.85) * n - i, 0, 1)
    if (appear <= 0) return
    const y = y0 + i * 52
    ctx.globalAlpha = appear * alphaMul
    rrPath(ctx, listX, y, listW, 40, 8)
    ctx.fillStyle = hexA('#fb7185', 0.14)
    ctx.fill()
    ctx.strokeStyle = hexA('#fb7185', 0.6)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#fecdd3'
    ctx.font = `600 14px ${MONO}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(cmd, listX + 16, y + 20)
    ctx.globalAlpha = 1
  })
}

function stagePaint(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number) {
  // v1.3.9 (F49, owner round 9): layout's blueprint does NOT dissolve here —
  // this beat OWNS it now: it SETTLES from its full form into the left mini
  // (30 % bench width, dimmed to 55 % after the settle — the owner-picked
  // "mini-dim") and stays as the geometry reference while the paint commands
  // ("mấy cái fill text") stack in the right zone beside it. Both dissolve
  // together at the raster beat's opening (drawResidue case 19).
  const settle = easeInOutCubic(clamp(frac / 0.3, 0, 1))
  const full = centerRect(r, 0.62)
  const mini = paintMini(r)
  const pg = {
    x: lerp(full.x, mini.x, settle),
    y: lerp(full.y, mini.y, settle),
    w: lerp(full.w, mini.w, settle),
    h: lerp(full.h, mini.h, settle),
  }
  drawBlueprintIn(ctx, pg, 1, lerp(1, 0.55, settle))
  drawReceipts(ctx, r, st, clamp((frac - 0.35) / 0.65, 0, 1), 1, paintZone(r))
}

// ---- stage: raster (pixels!) ----------------------------------------------------
// v1.3.3: raster page extracted (drawRasterPage) so the composite stage can
// hand it over as a fading ghost (F28e); `litFrac` = progressive fill.
function drawRasterPage(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, litFrac: number, alphaMul = 1) {
  const pg = centerRect(r, 0.6)
  const cols = 26
  const rows = 17
  const cw = pg.w / cols
  const chh = pg.h / rows
  const total = cols * rows
  const lit = Math.floor(litFrac * total)
  ctx.save()
  ctx.globalAlpha = alphaMul
  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const u = (col + 0.5) / cols
    const v = (row + 0.5) / rows
    if (i < lit) {
      ctx.fillStyle = pageColorAt(st.page, u, v)
      ctx.fillRect(pg.x + col * cw, pg.y + row * chh, cw + 0.5, chh + 0.5)
    } else {
      ctx.fillStyle = 'rgba(150,170,255,0.05)'
      ctx.fillRect(pg.x + col * cw, pg.y + row * chh, cw - 1, chh - 1)
    }
  }
  ctx.strokeStyle = hexA('#fb923c', 0.5)
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.strokeRect(pg.x, pg.y, pg.w, pg.h)
  ctx.setLineDash([])
  ctx.restore()
}

function stageRaster(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number) {
  // v1.3.8 (F46): the receipts dissolve AT THIS beat's opening (drawResidue
  // case 19). Pixels light at the F43 pace and the finished page HOLDS at
  // full presence to beat end — the last ~102 pixels (23 % of the page) used
  // to light into an already-dissolving page; the residue dissolves at the
  // composite beat's opening (drawResidue case 20).
  drawRasterPage(ctx, r, st, clamp((frac - 0.22) / 0.78, 0, 1))
}

// ---- stage: GPU composite ---------------------------------------------------------
function stageComposite(ctx: CanvasRenderingContext2D, r: Rect, st: StorySpec, frac: number, t: number) {
  // v1.3.10 (F53, owner round 10): the hand-off sequence the owner asked
  // for — the raster pixels DIM OUT from 0.22 and are GONE exactly at 0.68,
  // the moment the 2 layers finish stacking ("khi 2 layout chồng lên nhau
  // thì pixel phải mờ dần biến mất thì pop up mới hiện ra chứ?"); THEN the
  // crisp page pops (0.68 → 1.0). (v1.3.9's keep-it-dimmed underlay F51 was
  // the intermediate step; this is the final choreography.)
  const pg = centerRect(r, 0.58)
  drawRasterPage(ctx, r, st, 1, 1 - easeInOutCubic(clamp((frac - 0.22) / 0.46, 0, 1)))
  const slide = easeInOutCubic(clamp((frac - 0.3) / 0.38, 0, 1))
  // layer 1 (background) slides from left; layer 2 (content) from right
  ctx.save()
  ctx.globalAlpha = 0.7
  const off = (1 - slide) * 46
  ctx.fillStyle = hexA('#38bdf8', 0.25)
  rrPath(ctx, pg.x - off, pg.y - 12, pg.w, pg.h, 12)
  ctx.fill()
  ctx.strokeStyle = hexA('#38bdf8', 0.7)
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = hexA('#c084fc', 0.25)
  rrPath(ctx, pg.x + off, pg.y + 12, pg.w, pg.h, 12)
  ctx.fill()
  ctx.strokeStyle = hexA('#c084fc', 0.7)
  ctx.stroke()
  ctx.restore()
  // final crisp page popping in (F51: alpha + a 0.92 → 1.0 pop-up scale)
  const snap = easeInOutCubic(clamp((frac - 0.68) / 0.32, 0, 1))
  if (snap > 0) {
    const cx = pg.x + pg.w / 2
    const cy = pg.y + pg.h / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(lerp(0.92, 1, snap), lerp(0.92, 1, snap))
    ctx.translate(-cx, -cy)
    drawMiniPage(ctx, pg, st.page, snap)
    ctx.restore()
    ctx.save()
    ctx.globalAlpha = snap * (0.35 + 0.25 * Math.sin(t * 0.008))
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    rrPath(ctx, pg.x - 4, pg.y - 4, pg.w + 8, pg.h + 8, 14)
    ctx.stroke()
    ctx.restore()
  }
}
