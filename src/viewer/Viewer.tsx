// viewer/Viewer.tsx
// Chapter-agnostic orchestrator. The outer Viewer resolves WHICH chapter to
// play via the registry (`loadStory`); the inner ViewerCore plays ONLY a
// Chapter object — it never imports a content barrel. This completes the
// Phase-2 → Phase-4 bridge recorded in docs/architecture/DESIGN.md §15.
//
// All scene-specific literals of the old viewer ('pc' / 'cpu') are derived
// from the chapter itself: homeScene = scenes[0].id, deepScene = the scene of
// the 'run' beat (only chapters with an instruction program have one).

import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import type { Chapter, LocalizedText } from '../chapter-loader/types'
import { getChapter } from '../chapter-loader/registry'
import { createPresentationState, update, indexOfEffect, type PresentationState, type Phase } from '../engine'
import { render } from '../rendering/composer/renderer'
import { fit } from '../rendering/primitives/canvas-utils'
import { clamp } from '../rendering/primitives/math'

const EMPTY_TEXT: LocalizedText = { en: '', vi: '' }

// LAYOUT v1.3.1 (F18): `controlsLeft` lets the app park chrome (the Home
// button) inside the controls grid-row instead of floating it over the stage —
// floating overlap is viewport-dependent and unprovable; the grid row is not.
export default function Viewer({ chapterId, controlsLeft }: { chapterId: string; controlsLeft?: ReactNode }) {
  const [chapter, setChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    let alive = true
    const meta = getChapter(chapterId)
    if (!meta?.loadStory) return
    meta
      .loadStory()
      .then((c) => {
        if (alive) setChapter(c)
      })
      .catch((e) => console.error('[viewer] failed to load chapter', chapterId, e))
    return () => {
      alive = false
    }
  }, [chapterId])

  if (!chapter) {
    return (
      <div className="app">
        <div className="stage">
          <div className="viewer-loading">Loading journey…</div>
        </div>
      </div>
    )
  }
  return <ViewerCore chapter={chapter} controlsLeft={controlsLeft} />
}

function ViewerCore({ chapter, controlsLeft }: { chapter: Chapter; controlsLeft?: ReactNode }) {
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
  const phaseRef = useRef<Phase>('waiting')
  const beatRef = useRef(0)
  const sceneRef = useRef(homeScene)
  const langRef = useRef<'en' | 'vi'>('en')
  const execRef = useRef('')

  const beats = chapter.timeline.beats
  const prog = chapter.program
  const ui = chapter.ui ?? {}
  const runI = prog ? indexOfEffect(chapter, 'run') : -1
  // "deep scene": the sub-scene with program-controlled micro-steps (Ch-01's
  // 'cpu'). Chapters without a program never enter a deep scene.
  const deepScene = prog && runI >= 0 ? (beats[runI].scene ?? homeScene) : null

  const sync = (p: Phase, b: number, sc: string) => {
    if (p !== phaseRef.current) { phaseRef.current = p; setPhase(p) }
    if (b !== beatRef.current) { beatRef.current = b; setBeat(b) }
    if (sc !== sceneRef.current) { sceneRef.current = sc; setScene(sc) }
    const ek = `${S.current.execInstrIdx}|${S.current.execStage}|${S.current.execDone ? 1 : 0}`
    if (ek !== execRef.current) { execRef.current = ek; setExecTick((k) => k + 1) }
  }

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
  const replayDeep = () => {
    if (!deepScene) return
    const s = S.current
    s.beatIndex = runI; s.beatElapsed = 0; s.trail = []; s.lastTs = 0
    s.scene = deepScene; s.fade = 0; s.fading = 'none'; s.phase = 'playing'
    sync('playing', runI, deepScene)
  }
  const exitDeep = () => {
    const s = S.current
    const target = Math.max(0, runI - 2)
    s.beatIndex = target; s.beatElapsed = 0; s.trail = []; s.lastTs = 0
    s.scene = homeScene; s.fade = 0; s.fading = 'none'; s.phase = 'paused'
    sync('paused', target, homeScene)
  }

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
    let raf = 0
    const frame = (ts: number) => {
      const s = S.current
      const dt = s.lastTs ? Math.min(50, ts - s.lastTs) : 16
      s.lastTs = ts; s.lang = langRef.current
      update(s, dt, chapter)
      render(ctx, s, chapter)
      sync(s.phase, s.beatIndex, s.scene)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('keydown', onKey) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter])

  const toWorld = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const s = S.current
    const rect = e.currentTarget.getBoundingClientRect()
    const sc = chapter.scenes[0]
    const f = fit(sc.bbox, s.W, s.H, sc.cameraPad ?? 0.9)
    return { x: (e.clientX - rect.left - f.ox) / f.zoom, y: (e.clientY - rect.top - f.oy) / f.zoom }
  }
  const onClick = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const s = S.current
    if (s.phase !== 'waiting') return
    const w = toWorld(e)
    if (chapter.hitZones?.some((z) => z.hits(w))) start()
  }
  const onMouseMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const s = S.current
    if (s.phase !== 'waiting') { e.currentTarget.style.cursor = 'default'; return }
    const w = toWorld(e)
    e.currentTarget.style.cursor = chapter.hitZones?.some((z) => z.hits(w)) ? 'pointer' : 'default'
  }

  // narration
  const beatScene = beats[beat]?.scene ?? homeScene
  const activePart = phase === 'waiting' || phase === 'done' ? null : beats[beat]?.active ?? null
  let line: string
  let instrHint: string | null = null
  if (prog && deepScene && beat === runI && phase !== 'waiting') {
    const s = S.current
    const stage = s.execStage
    if (s.execDone || !stage) { line = (ui.finaleLine ?? EMPTY_TEXT)[lang] }
    else if (prog.instructions[s.execInstrIdx] && chapter.narration?.stageLine) {
      const ins = prog.instructions[s.execInstrIdx]
      line = chapter.narration.stageLine(ins, stage, lang)
      const done = stage === 'writeback'
      instrHint = chapter.narration.currentOp
        ? chapter.narration.currentOp(ins, s.execRegs, lang, done)
        : null
    } else { line = (ui.waitingLine ?? EMPTY_TEXT)[lang] }
  } else if (phase === 'waiting') { line = (ui.waitingLine ?? EMPTY_TEXT)[lang] }
  else { line = beats[beat]?.line[lang] ?? '' }

  const capKey = 'b' + beat + lang + scene + (prog && beat === runI ? S.current.execStageIdx + ':' + execTick : '')

  // gloss: find the active entity across all scenes
  const glossEntity = activePart
    ? chapter.scenes.flatMap((s) => s.entities).find((e) => e.id === activePart)
    : null

  // LAYOUT v1.3.4 (F32): contiguous beats that share one non-home scene
  // collapse into a single yellow stop in the main timeline; while the
  // playhead is inside that stop, the strip swaps to the green micro-timeline
  // — exactly Chapter 01's "inside the CPU" language (one yellow dot, green
  // steps inside). This replaces v1.3.3's `.dots.deep` tint, which the owner
  // revoked: green must mark an entered place, not flatly re-skin flat dots.
  interface DotGroup {
    from: number
    to: number
    scene: string
  }
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
  const replayFrom = (i: number) => {
    jumpTo(i)
    const s = S.current
    s.phase = 'playing'
    s.lastTs = 0
    sync('playing', s.beatIndex, s.scene)
  }
  const nav = phase !== 'waiting'
  const canEdit = phase === 'waiting' || phase === 'done'
  const totalSteps = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0

  return (
    <div className="app">
      <div className="stage" ref={stageRef}>
        <canvas ref={canvasRef} className="canvas" onClick={onClick} onMouseMove={onMouseMove} />
        {beatScene !== homeScene && phase !== 'waiting' && phase !== 'done' && (
          // v1.3.5 (F35): the scene tag sits at the top-LEFT corner of the
          // screen (owner round 5). It supersedes F19's controls-row parking;
          // the corner is dead space in both scenes at any zoom (see doc 17).
          <div className="sceneTag">{(ui.sceneTag ?? ui.insideCpuTag ?? EMPTY_TEXT)[lang]}</div>
        )}
      </div>
      <aside className="panel">
        <div className="panel-head">
          <div className="brand">Cesvi</div>
          <div className="langtoggle">
            {(['en', 'vi'] as const).map((l) => (
              <button key={l} className={`pill ${lang === l ? 'on' : ''}`} onClick={() => { langRef.current = l; setLang(l) }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="chapter">{(ui.chapterTitle ?? EMPTY_TEXT)[lang]}</div>
        {canEdit && (
          <button className="runbtn" onClick={start}>▶ {(ui.startButton ?? EMPTY_TEXT)[lang] || (lang === 'vi' ? 'Mở tệp' : 'Open file')}</button>
        )}
        <div className="step-no">
          {phase === 'waiting'
            ? (lang === 'vi' ? 'Sẵn sàng' : 'Ready')
            : `${lang === 'vi' ? 'Bước' : 'Step'} ${Math.min(beat + 1, beats.length)} / ${beats.length}`}
        </div>
        <div className="narration" key={capKey}>{line}</div>
        {instrHint && <div className="instrHint">{instrHint}</div>}
        {glossEntity && (
          <div className="gloss" style={{ ['--accent' as string]: glossEntity.color }}>
            <span className="gloss-name">{glossEntity.name}</span>
            <div className="gloss-text">{glossEntity.gloss[lang]}</div>
          </div>
        )}
        <div className="spacer" />
        <div className="tip">
          {ui.tipText
            ? ui.tipText[lang]
            : lang === 'vi'
              ? 'Bấm vào tệp trên màn hình để bắt đầu. Dùng ◀ ▶ hoặc các chấm để lùi/tới.'
              : 'Click the file on the screen to begin. Use ◀ ▶ or the dots to step.'}
        </div>
      </aside>
      <div className="controls">
        {/* LAYOUT v1.3.2 (F21): 3-zone grid — left chrome / centered nav / right tag.
            The dot group is centered absolutely; side zones can't push it. */}
        <div className="ctl-left">{controlsLeft}</div>
        <div className="ctl-center">
        {deepScene && scene === deepScene && (
          <button className="btn icon back" onClick={exitDeep} title={lang === 'vi' ? 'Quay lại' : 'Back'}>◁</button>
        )}
        {!deepScene && insideGroup && (
          // v1.3.4 (F32): scene-groups exit exactly like Ch-01's deep scene
          <button className="btn icon back" onClick={() => jumpTo(Math.max(0, insideGroup.from - 1))} title={lang === 'vi' ? 'Quay lại' : 'Back'}>◁</button>
        )}
        <button className="btn icon" onClick={stepPrev} disabled={!nav || beat === 0} title="Previous">◀</button>
        {deepScene && scene === deepScene && prog ? (
          <div className="cycleDots clickable">
            {Array.from({ length: totalSteps }, (_, k) => {
              const curStep = currentStep()
              return <span key={k} className={`cdot ${k < curStep ? 'done' : k === curStep ? 'cur' : ''}`} onClick={() => jumpToStep(k)} />
            })}
          </div>
        ) : insideGroup ? (
          /* v1.3.4 (F32): inside the group — the green micro-timeline.
             v1.3.5 (F34): Replay moved to the END of the button row, after
             Play/Pause — it used to sit between the strip and Next. */
          <div className="cycleDots clickable">
            {Array.from({ length: insideGroup.to - insideGroup.from + 1 }, (_, k) => {
              const bi = insideGroup.from + k
              return <span key={bi} className={`cdot ${bi < beat ? 'done' : bi === beat ? 'cur' : ''}`} onClick={() => jumpTo(bi)} />
            })}
          </div>
        ) : (
          <div className={`dots ${nav ? 'clickable' : ''}`}>
            {groups.map((g) => {
              const cls = phase === 'done' ? 'done' : beat > g.to ? 'done' : beat >= g.from && beat <= g.to ? 'active' : ''
              return (
                <span
                  key={g.from}
                  className={`dot ${cls} ${deepScene && g.scene === deepScene ? 'cpu' : ''} ${g.from !== g.to && g.scene !== homeScene ? 'group' : ''}`}
                  onClick={nav ? () => jumpTo(g.from) : undefined}
                />
              )
            })}
          </div>
        )}
        <button className="btn icon" onClick={stepNext} disabled={!nav} title="Next">▶</button>
        {phase === 'playing' && <button className="btn" onClick={togglePause}>❚❚ {lang === 'vi' ? 'Tạm dừng' : 'Pause'}</button>}
        {phase === 'paused' && <button className="btn" onClick={togglePause}>▶ {lang === 'vi' ? 'Tiếp' : 'Play'}</button>}
        {deepScene && (phase === 'done' || phase === 'paused') && scene === deepScene && (
          <button className="btn" onClick={replayDeep}>↺ {(ui.replayDeep ?? EMPTY_TEXT)[lang] || (lang === 'vi' ? 'Chạy lại CPU' : 'Replay CPU')}</button>
        )}
        {/* v1.3.5 (F34): scene-group Replay lives at the END of the row,
            after Play/Pause (owner round 5: "nút next lại ở sau nút replay?") */}
        {insideGroup && phase === 'paused' && (
          <button className="btn" onClick={() => replayFrom(insideGroup.from)}>↺ {(ui.replayDeep ?? EMPTY_TEXT)[lang] || (lang === 'vi' ? 'Chạy lại' : 'Replay')}</button>
        )}
        {(phase === 'done' || phase === 'paused') && scene === homeScene && (
          <button className="btn" onClick={start}>↺ {lang === 'vi' ? 'Chạy lại' : 'Replay'}</button>
        )}
        </div>
        <div className="ctl-right" />
      </div>
    </div>
  )
}
