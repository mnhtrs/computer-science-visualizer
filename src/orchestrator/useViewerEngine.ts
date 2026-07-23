// orchestrator/useViewerEngine.ts
// Phase 2: Orchestrator hook extracted from Viewer.tsx.
// Owns: PresentationState, RAF loop, controls, resize, keyboard, inside ceremony.
// Returns: state, controls, refs, derived values for the presentation layer.
// Zero behavior changes — this is a direct extraction of ViewerCore logic.

import { useEffect, useRef, useState } from 'react'
import type { Chapter, LocalizedText, ExecutionState } from '../chapter-loader/types'
import type { EntityRenderer } from '../rendering/types'
import { createPresentationState, update, indexOfEffect, NAV, type PresentationState, type Phase } from '../engine'
import { render } from '../rendering/composer/renderer'
import { sharedEntityRenderers } from '../rendering/parts/registry'
import { clamp } from '../shared/math'

const EMPTY_TEXT: LocalizedText = { en: '', vi: '' }

interface DotGroup {
  from: number
  to: number
  scene: string
}

export interface ViewerEngineState {
  // Refs for DOM mounting
  stageRef: React.RefObject<HTMLDivElement>
  canvasRef: React.RefObject<HTMLCanvasElement>

  // UI state (mirrors of engine state)
  phase: Phase
  beat: number
  scene: string
  lang: 'en' | 'vi'
  lineBeat: number
  introKey: number

  // Derived state
  line: string
  instrHint: string | null
  capKey: string
  glossEntity: { name: string; color: string; gloss: LocalizedText } | null
  groups: DotGroup[]
  insideGroup: DotGroup | null
  insideActive: boolean
  insideStepTotal: number
  insideStepNow: number
  nav: boolean
  canEdit: boolean
  deepScene: string | null
  totalSteps: number
  homeScene: string
  ui: Record<string, LocalizedText>
  runI: number
  prog: Chapter['program']
  beatsLength: number

  // Controls
  start: () => void
  togglePause: () => void
  jumpTo: (i: number) => void
  stepPrev: () => void
  stepNext: () => void
  exitDeep: () => void
  currentStep: () => number
  jumpToStep: (step: number) => void
  resetView: () => void

  // Canvas navigation (Global Canvas Navigation contract; owned by the viewer,
  // not by any chapter). Pointer model + wheel are wired in the RAF effect.
  cameraActive: boolean
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void

  // Language handler
  setLang: (lang: 'en' | 'vi') => void

  // Inside ceremony animation end
  onIntroAnimEnd: () => void
}

export function useViewerEngine(chapter: Chapter, controlsLeft?: React.ReactNode): ViewerEngineState {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const homeScene = chapter.scenes[0].id
  const S = useRef<PresentationState>(
    createPresentationState(chapter.scenes[0].path?.[0] ?? { x: 0, y: 0 }, homeScene),
  )

  const [phase, setPhase] = useState<Phase>('waiting')
  const [beat, setBeat] = useState(0)
  const [scene, setScene] = useState(homeScene)
  const [lang, setLang] = useState<'en' | 'vi'>('en')
  const [execTick, setExecTick] = useState(0)
  const [lineBeat, setLineBeat] = useState(0)
  const [cameraActive, setCameraActive] = useState(false)
  const phaseRef = useRef<Phase>('waiting')
  const beatRef = useRef(0)
  const sceneRef = useRef(homeScene)
  const langRef = useRef<'en' | 'vi'>('en')
  const execRef = useRef('')
  const lineBeatRef = useRef(0)

  const beats = chapter.timeline.beats
  const prog = chapter.program
  const ui = chapter.ui ?? {}
  const runI = prog ? indexOfEffect(chapter, 'run') : -1
  const deepScene = prog && runI >= 0 ? (beats[runI].scene ?? homeScene) : null

  // Merge shared + chapter-specific entity renderers (Phase 5)
  const entityRegistry: Record<string, EntityRenderer> = {
    ...sharedEntityRenderers,
    ...((chapter.entityRenderers as Record<string, EntityRenderer>) ?? {}),
  }

  // ---- sync: mirror engine state to React state ----
  const sync = (p: Phase, b: number, sc: string) => {
    if (p !== phaseRef.current) { phaseRef.current = p; setPhase(p) }
    if (b !== beatRef.current) { beatRef.current = b; setBeat(b) }
    if (sc !== sceneRef.current) { sceneRef.current = sc; setScene(sc) }
    const st = S.current
    const fb = beats[b]
    const nlf = fb?.nextLineFrom
    const lb = nlf !== undefined && b < beats.length - 1 && st.beatElapsed / fb.duration >= nlf ? b + 1 : b
    if (lb !== lineBeatRef.current) { lineBeatRef.current = lb; setLineBeat(lb) }
    const exec = st.executionState as ExecutionState | null
    const ek = exec ? `${exec.instrIdx}|${exec.stage}|${exec.done ? 1 : 0}` : 'null'
    if (ek !== execRef.current) { execRef.current = ek; setExecTick((k) => k + 1) }
  }

  // ---- control functions ----
  const start = () => {
    const s = S.current
    s.phase = 'playing'; s.beatIndex = 0; s.beatElapsed = 0; s.trail = []; s.lastTs = 0
    s.scene = homeScene; s.fade = 0; s.fading = 'none'; s.programDone = false
    sync('playing', 0, homeScene)
  }
  const togglePause = () => {
    const s = S.current
    if (s.phase === 'playing') { s.phase = 'paused'; sync('paused', s.beatIndex, s.scene) }
    else if (s.phase === 'paused') { s.phase = 'playing'; s.lastTs = 0; sync('playing', s.beatIndex, s.scene) }
  }
  const jumpTo = (i: number) => {
    const s = S.current
    const idx = clamp(i, 0, beats.length - 1)
    const targetScene = beats[idx].scene ?? homeScene
    s.beatIndex = idx; s.beatElapsed = 0; s.trail = []; s.lastTs = 0
    if (s.phase === 'waiting' || s.phase === 'done') s.phase = 'playing'
    if (s.scene !== targetScene) { s.scene = targetScene; s.fade = 0; s.fading = 'none' }
    sync(s.phase, idx, s.scene)
  }
  const currentStep = (): number => {
    const s = S.current
    if (!prog) return -1
    const total = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0
    if (s.beatIndex < runI) return -1
    if (s.beatIndex > runI) return total
    const execTime = Math.max(0, s.beatElapsed - prog.stageModel.execOffset)
    const perInstr = prog.stageModel.perInstr
    const execDur = prog.instructions.length * perInstr
    if (execTime >= execDur) return total
    const instrIdx = Math.floor(execTime / perInstr)
    const ft = execTime / perInstr - instrIdx
    const stages = prog.stageModel.stages
    const bounds = prog.stageModel.bounds
    for (let i = 0; i < stages.length; i++) {
      if (ft < bounds[i + 1]) return instrIdx * stages.length + i
    }
    return total
  }
  const jumpToStep = (step: number) => {
    if (!prog || !deepScene) return
    const s = S.current
    const total = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0
    const clamped = clamp(step, 0, total)
    if (clamped >= total) { jumpTo(beats.length - 1); return }
    const stages = prog.stageModel.stages
    const i = Math.floor(clamped / stages.length)
    const st = clamped % stages.length
    const ft = prog.stageModel.bounds[st]
    s.beatIndex = runI
    s.beatElapsed = prog.stageModel.execOffset + (i + ft) * prog.stageModel.perInstr + 0.5
    s.trail = []; s.lastTs = 0; s.scene = deepScene; s.fade = 0; s.fading = 'none'; s.phase = 'paused'
    sync('paused', runI, deepScene)
  }
  const stepPrev = () => {
    const s = S.current
    if (deepScene && prog && s.scene === deepScene) {
      const cur = currentStep()
      if (cur <= 0) { if (s.beatIndex > 0) jumpTo(runI - 1); return }
      jumpToStep(cur - 1); return
    }
    if (s.beatIndex > 0) jumpTo(s.beatIndex - 1)
  }
  const stepNext = () => {
    const s = S.current
    if (deepScene && prog && s.scene === deepScene) {
      const cur = currentStep()
      const total = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0
      if (cur >= total) { jumpTo(beats.length - 1); return }
      jumpToStep(cur < 0 ? 0 : cur + 1); return
    }
    if (s.beatIndex < beats.length - 1) jumpTo(s.beatIndex + 1)
  }
  const exitDeep = () => {
    const s = S.current
    const target = Math.max(0, runI - 2)
    s.beatIndex = target; s.beatElapsed = 0; s.trail = []; s.lastTs = 0
    s.scene = homeScene; s.fade = 0; s.fading = 'none'; s.phase = 'paused'
    sync('paused', target, homeScene)
  }

  // ---- RAF loop ----
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const W = canvas.clientWidth, H = canvas.clientHeight
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      const s = S.current; s.W = W; s.H = H; s.dpr = dpr
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(stageRef.current!)
    window.addEventListener('resize', resize)
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); const s = S.current; if (s.phase === 'waiting' || s.phase === 'done') start(); else togglePause() }
      else if (e.code === 'ArrowRight') stepNext()
      else if (e.code === 'ArrowLeft') stepPrev()
    }
    window.addEventListener('keydown', onKey)
    // §4 cursor-anchored zoom (passive:false so we can preventDefault the scroll)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const s = S.current
      const cam = s.camera
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const wx = (mx - cam.offX) / cam.zoomTotal
      const wy = (my - cam.offY) / cam.zoomTotal
      const newZoom = clamp(cam.zoom * Math.exp(-e.deltaY * NAV.WHEEL_FACTOR), NAV.ZOOM_MIN, NAV.ZOOM_MAX)
      const newTotal = cam.baseZoom * newZoom
      cam.panX = mx - wx * newTotal - cam.baseOx
      cam.panY = my - wy * newTotal - cam.baseOy
      cam.zoom = newZoom
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    // §6 double-click empty canvas resets the view
    const onDbl = (e: MouseEvent) => {
      const s = S.current
      const onZone = !!chapter.hitZones?.some((z) => z.hits(toWorld(e.clientX, e.clientY, canvas)))
      if (!onZone) resetView()
    }
    canvas.addEventListener('dblclick', onDbl)
    let raf = 0
    const frame = (ts: number) => {
      const s = S.current
      if (freezeUntilRef.current > 0 && ts >= freezeUntilRef.current) {
        if (deepScene && prog && s.beatIndex === runI && s.beatElapsed < prog.stageModel.execOffset) {
          s.beatElapsed = prog.stageModel.execOffset
        }
        freezeUntilRef.current = 0
      }
      let dt = s.lastTs ? Math.min(50, ts - s.lastTs) : 16
      if (s.phase === 'playing' && ts < freezeUntilRef.current) dt = 0
      s.lastTs = ts; s.lang = langRef.current
      update(s, dt, chapter)
      render(ctx, s, chapter, entityRegistry)
      sync(s.phase, s.beatIndex, s.scene)
      // drag cursor feedback (§6): grabbing while panning empty canvas
      if (canvas) canvas.style.cursor = drag.current.active && drag.current.moved && !drag.current.onZone ? 'grabbing' : canvas.style.cursor
      setCameraActive(s.camera.zoom !== 1 || s.camera.panX !== 0 || s.camera.panY !== 0)
      if (awaitGreenRef.current && s.phase === 'playing' && s.fading === 'none') {
        const deepFire = !!(deepScene && prog && s.scene === deepScene)
        let groupFire = false
        if (!deepScene) {
          const bi = s.beatIndex
          const sc = beats[bi]?.scene ?? homeScene
          let from = bi, to = bi
          while (from > 0 && (beats[from - 1].scene ?? homeScene) === sc && sc !== homeScene) from--
          while (to < beats.length - 1 && (beats[to + 1].scene ?? homeScene) === sc && sc !== homeScene) to++
          groupFire = sc !== homeScene && to !== from
        }
        if (deepFire || groupFire) {
          awaitGreenRef.current = false
          setIntroKey((k) => k + 1)
          if (deepFire) freezeUntilRef.current = ts + INTRO_BLOCKS_AT
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      window.removeEventListener('resize', resize); window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('dblclick', onDbl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter])

  // ---- canvas navigation (Global Canvas Navigation; viewer-owned, §2–§8) ----
  const drag = useRef({ active: false, onZone: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false })
  // §7: invert the FULL composed transform, so hit-tests are correct at every
  // pan/zoom (this also fixes the pre-migration bug where toWorld used scenes[0]
  // regardless of the active scene).
  const toWorld = (clientX: number, clientY: number, el: HTMLElement) => {
    const s = S.current
    const rect = el.getBoundingClientRect()
    const cam = s.camera
    return {
      x: (clientX - rect.left - cam.offX) / cam.zoomTotal,
      y: (clientY - rect.top - cam.offY) / cam.zoomTotal,
    }
  }
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = S.current
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    const onZone = !!chapter.hitZones?.some((z) => z.hits(toWorld(e.clientX, e.clientY, e.currentTarget)))
    drag.current = {
      active: true, onZone, sx: e.clientX, sy: e.clientY,
      ox: s.camera.panX, oy: s.camera.panY, moved: false,
    }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = S.current
    const d = drag.current
    if (d.active) {
      const dx = e.clientX - d.sx
      const dy = e.clientY - d.sy
      if (!d.moved && Math.hypot(dx, dy) > NAV.CLICK_DRAG_PX) d.moved = true
      if (d.moved && !d.onZone) { s.camera.panX = d.ox + dx; s.camera.panY = d.oy + dy } // §3 pan
      return
    }
    // hover cursor: grab on empty canvas, pointer on an interactive object (§6)
    const onZone = !!chapter.hitZones?.some((z) => z.hits(toWorld(e.clientX, e.clientY, e.currentTarget)))
    e.currentTarget.style.cursor = onZone ? 'pointer' : 'grab'
  }
  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = S.current
    const d = drag.current
    d.active = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
    if (!d.moved && d.onZone && s.phase === 'waiting') start() // §6: click-on-zone
  }
  const resetView = () => { const c = S.current.camera; c.panX = 0; c.panY = 0; c.zoom = 1 } // §5

  // ---- narration ----
  const activePart = phase === 'waiting' || phase === 'done' ? null : beats[beat]?.active ?? null
  let line: string
  let instrHint: string | null = null
  if (prog && deepScene && beat === runI && phase !== 'waiting') {
    const s = S.current
    const exec = s.executionState as ExecutionState | null
    const stage = exec?.stage ?? ''
    if (exec?.done || !stage) { line = (ui.finaleLine ?? EMPTY_TEXT)[lang] }
    else if (exec && prog.instructions[exec.instrIdx] && chapter.narration?.stageLine) {
      const ins = prog.instructions[exec.instrIdx]
      line = chapter.narration.stageLine(ins, stage, lang)
      const done = stage === 'writeback'
      instrHint = chapter.narration.currentOp
        ? chapter.narration.currentOp(ins, exec.regs, lang, done)
        : null
    } else { line = (ui.waitingLine ?? EMPTY_TEXT)[lang] }
  } else if (phase === 'waiting') { line = (ui.waitingLine ?? EMPTY_TEXT)[lang] }
  else { line = beats[lineBeat]?.line[lang] ?? '' }

  const execForCap = S.current.executionState as ExecutionState | null
  const capKey = 'b' + lineBeat + lang + scene + (prog && beat === runI && execForCap ? execForCap.stageIndex + ':' + execTick : '')

  // ---- gloss ----
  const glossEntity = activePart
    ? chapter.scenes.flatMap((s) => s.entities).find((e) => e.id === activePart) ?? null
    : null

  // ---- dot groups ----
  const groups: DotGroup[] = []
  beats.forEach((b, i) => {
    const sc = b.scene ?? homeScene
    const last = groups[groups.length - 1]
    if (last && sc !== homeScene && last.scene === sc) last.to = i
    else groups.push({ from: i, to: i, scene: sc })
  })
  const curGroup = groups.find((g) => beat >= g.from && beat <= g.to) ?? null
  const insideGroup =
    curGroup && curGroup.scene !== homeScene && curGroup.from !== curGroup.to ? curGroup : null

  // ---- inside ceremony ----
  const totalSteps = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0
  const isDeepInside = !!(deepScene && scene === deepScene)
  const insideActive = !!insideGroup || isDeepInside

  const INTRO_BLOCKS_AT = 400
  const [introKey, setIntroKey] = useState(0)
  const wasInsideRef = useRef(false)
  const freezeUntilRef = useRef(0)
  const awaitGreenRef = useRef(false)
  useEffect(() => {
    const nowInside = insideActive && phase !== 'waiting' && phase !== 'done'
    if (nowInside && !wasInsideRef.current) {
      awaitGreenRef.current = true
    } else if (!nowInside && wasInsideRef.current) {
      awaitGreenRef.current = false
      setIntroKey(0)
      freezeUntilRef.current = 0
    }
    wasInsideRef.current = nowInside
  })

  const insideStepTotal = insideActive
    ? isDeepInside && totalSteps > 0
      ? totalSteps
      : insideGroup
        ? insideGroup.to - insideGroup.from + 1
        : 0
    : 0
  const insideStepNow = insideActive
    ? Math.max(
        1,
        Math.min(
          isDeepInside ? (currentStep() < 0 ? 0 : currentStep()) + 1 : beat - (insideGroup?.from ?? beat) + 1,
          insideStepTotal,
        ),
      )
    : 0

  const nav = phase !== 'waiting'
  const canEdit = phase === 'waiting' || phase === 'done'

  const onIntroAnimEnd = () => setIntroKey(0)

  const setLangHandler = (l: 'en' | 'vi') => { langRef.current = l; setLang(l) }

  return {
    stageRef, canvasRef,
    phase, beat, scene, lang, lineBeat, introKey,
    line, instrHint, capKey,
    glossEntity: glossEntity ? { name: glossEntity.name, color: glossEntity.color, gloss: glossEntity.gloss } : null,
    groups, insideGroup, insideActive, insideStepTotal, insideStepNow,
    nav, canEdit, deepScene, totalSteps, homeScene, ui, runI, prog,
    beatsLength: beats.length,
    start, togglePause, jumpTo, stepPrev, stepNext, exitDeep, currentStep, jumpToStep,
    resetView, cameraActive, onPointerDown, onPointerMove, onPointerUp,
    setLang: setLangHandler,
    onIntroAnimEnd,
  }
}
