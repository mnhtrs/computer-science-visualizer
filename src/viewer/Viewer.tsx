import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import type { Chapter } from '../chapter-loader/types'
import { chapter, RUN_I, EXEC_DURATION } from '../content/chapter-01-program-execution'
import { createPresentationState, update, indexOfEffect, type PresentationState, type Phase } from '../engine'
import { render } from '../rendering/composer/renderer'
import { fit } from '../rendering/primitives/canvas-utils'
import { clamp } from '../rendering/primitives/math'

export default function Viewer() {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const S = useRef<PresentationState>(createPresentationState(chapter.scenes[0].path?.[0] ?? { x: 0, y: 0 }))

  const [phase, setPhase] = useState<Phase>('waiting')
  const [beat, setBeat] = useState(0)
  const [scene, setScene] = useState('pc')
  const [lang, setLang] = useState<'en' | 'vi'>('en')
  const [execTick, setExecTick] = useState(0)
  const phaseRef = useRef<Phase>('waiting')
  const beatRef = useRef(0)
  const sceneRef = useRef('pc')
  const langRef = useRef<'en' | 'vi'>('en')
  const execRef = useRef('')

  const beats = chapter.timeline.beats
  const prog = chapter.program
  const ui = chapter.ui ?? {}
  const runI = prog ? indexOfEffect(chapter, 'run') : -1

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
    s.scene = 'pc'; s.fade = 0; s.fading = 'none'; s.programDone = false
    sync('playing', 0, 'pc')
  }
  const togglePause = () => {
    const s = S.current
    if (s.phase === 'playing') { s.phase = 'paused'; sync('paused', s.beatIndex, s.scene) }
    else if (s.phase === 'paused') { s.phase = 'playing'; s.lastTs = 0; sync('playing', s.beatIndex, s.scene) }
  }
  const jumpTo = (i: number) => {
    const s = S.current
    const idx = clamp(i, 0, beats.length - 1)
    const targetScene = beats[idx].scene ?? 'pc'
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
    // Compute directly from beatElapsed so rapid clicks work even before
    // update() runs on the next frame. This fixes the "stuck next" bug:
    // previously we read s.execInstrIdx/s.execStageIdx which are only refreshed
    // by update(), so fast clicks saw stale values and stalled.
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
    if (!prog) return
    const s = S.current
    const total = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0
    const clamped = clamp(step, 0, total)
    if (clamped >= total) { jumpTo(beats.length - 1); return }
    const stages = prog.stageModel.stages
    const i = Math.floor(clamped / stages.length)
    const st = clamped % stages.length
    const ft = prog.stageModel.bounds[st]
    s.beatIndex = runI
    // +0.5ms epsilon prevents floating-point boundary bugs where
    // currentStep() could return the wrong stage (5/40 steps affected).
    // 0.5ms is invisible to the user but ensures ft > bounds[st].
    s.beatElapsed = prog.stageModel.execOffset + (i + ft) * prog.stageModel.perInstr + 0.5
    s.trail = []; s.lastTs = 0; s.scene = 'cpu'; s.fade = 0; s.fading = 'none'; s.phase = 'paused'
    sync('paused', runI, 'cpu')
  }
  const stepPrev = () => {
    const s = S.current
    if (s.scene === 'cpu' && prog) {
      const cur = currentStep()
      if (cur <= 0) { if (s.beatIndex > 0) jumpTo(runI - 1); return }
      jumpToStep(cur - 1); return
    }
    if (s.beatIndex > 0) jumpTo(s.beatIndex - 1)
  }
  const stepNext = () => {
    const s = S.current
    if (s.scene === 'cpu' && prog) {
      const cur = currentStep()
      const total = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0
      if (cur >= total) { jumpTo(beats.length - 1); return }
      jumpToStep(cur < 0 ? 0 : cur + 1); return
    }
    if (s.beatIndex < beats.length - 1) jumpTo(s.beatIndex + 1)
  }
  const replayCpu = () => {
    const s = S.current
    s.beatIndex = runI; s.beatElapsed = 0; s.trail = []; s.lastTs = 0
    s.scene = 'cpu'; s.fade = 0; s.fading = 'none'; s.phase = 'playing'
    sync('playing', runI, 'cpu')
  }
  const exitCpu = () => {
    const s = S.current
    const target = Math.max(0, runI - 2)
    s.beatIndex = target; s.beatElapsed = 0; s.trail = []; s.lastTs = 0
    s.scene = 'pc'; s.fade = 0; s.fading = 'none'; s.phase = 'paused'
    sync('paused', target, 'pc')
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
  }, [])

  const onClick = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const s = S.current
    if (s.phase !== 'waiting') return
    const rect = e.currentTarget.getBoundingClientRect()
    const sc = chapter.scenes[0]
    const f = fit(sc.bbox, s.W, s.H, sc.cameraPad ?? 0.9)
    const w = { x: (e.clientX - rect.left - f.ox) / f.zoom, y: (e.clientY - rect.top - f.oy) / f.zoom }
    if (chapter.hitZones?.some((z) => z.hits(w))) start()
  }
  const onMouseMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const s = S.current
    if (s.phase !== 'waiting') { e.currentTarget.style.cursor = 'default'; return }
    const rect = e.currentTarget.getBoundingClientRect()
    const sc = chapter.scenes[0]
    const f = fit(sc.bbox, s.W, s.H, sc.cameraPad ?? 0.9)
    const w = { x: (e.clientX - rect.left - f.ox) / f.zoom, y: (e.clientY - rect.top - f.oy) / f.zoom }
    e.currentTarget.style.cursor = chapter.hitZones?.some((z) => z.hits(w)) ? 'pointer' : 'default'
  }

  // narration
  const beatScene = beats[beat]?.scene ?? 'pc'
  const activePart = phase === 'waiting' || phase === 'done' ? null : beats[beat]?.active ?? null
  let line: string
  let instrHint: string | null = null
  if (beat === runI && phase !== 'waiting' && prog) {
    const s = S.current
    const stage = s.execStage
    if (s.execDone || !stage) { line = (ui.finaleLine ?? { en: '', vi: '' })[lang] }
    else if (prog.instructions[s.execInstrIdx] && chapter.narration?.stageLine) {
      const ins = prog.instructions[s.execInstrIdx]
      line = chapter.narration.stageLine(ins, stage, lang)
      const done = stage === 'writeback'
      instrHint = chapter.narration.currentOp
        ? chapter.narration.currentOp(ins, s.execRegs, lang, done)
        : null
    } else { line = (ui.waitingLine ?? { en: '', vi: '' })[lang] }
  } else if (phase === 'waiting') { line = (ui.waitingLine ?? { en: '', vi: '' })[lang] }
  else { line = beats[beat]?.line[lang] ?? '' }

  const capKey = 'b' + beat + lang + scene + (beat === runI ? S.current.execStageIdx + ':' + execTick : '')

  // gloss: find the active entity across all scenes
  const glossEntity = activePart
    ? chapter.scenes.flatMap((s) => s.entities).find((e) => e.id === activePart)
    : null

  const dotClass = (i: number) => {
    if (phase === 'done') return 'done'
    if (i < beat) return 'done'
    if (i === beat) return 'active'
    return ''
  }
  const nav = phase !== 'waiting'
  const canEdit = phase === 'waiting' || phase === 'done'
  const totalSteps = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0

  return (
    <div className="app">
      <div className="stage" ref={stageRef}>
        <canvas ref={canvasRef} className="canvas" onClick={onClick} onMouseMove={onMouseMove} />
        {beatScene === 'cpu' && phase !== 'waiting' && phase !== 'done' && (
          <div className="sceneTag">{(ui.insideCpuTag ?? { en: '', vi: '' })[lang]}</div>
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
        <div className="chapter">{(ui.chapterTitle ?? { en: '', vi: '' })[lang]}</div>
        {canEdit && (
          <button className="runbtn" onClick={start}>▶ {lang === 'vi' ? 'Mở tệp' : 'Open file'}</button>
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
          {lang === 'vi'
            ? 'Bấm vào tệp trên màn hình để bắt đầu. Dùng ◀ ▶ hoặc các chấm để lùi/tới.'
            : 'Click the file on the screen to begin. Use \u25C0 \u25B6 or the dots to step.'}
        </div>
      </aside>
      <div className="controls">
        {scene === 'cpu' && (
          <button className="btn icon back" onClick={exitCpu} title={lang === 'vi' ? 'Quay lại' : 'Back'}>◁</button>
        )}
        <button className="btn icon" onClick={stepPrev} disabled={!nav || beat === 0} title="Previous">◀</button>
        {scene === 'cpu' && prog ? (
          <div className="cycleDots clickable">
            {Array.from({ length: totalSteps }, (_, k) => {
              const curStep = currentStep()
              return <span key={k} className={`cdot ${k < curStep ? 'done' : k === curStep ? 'cur' : ''}`} onClick={() => jumpToStep(k)} />
            })}
          </div>
        ) : (
          <div className={`dots ${nav ? 'clickable' : ''}`}>
            {beats.map((b, i) => (
              <span key={b.id} className={`dot ${dotClass(i)} ${b.scene === 'cpu' ? 'cpu' : ''}`} onClick={nav ? () => jumpTo(i) : undefined} />
            ))}
          </div>
        )}
        <button className="btn icon" onClick={stepNext} disabled={!nav} title="Next">▶</button>
        {phase === 'playing' && <button className="btn" onClick={togglePause}>❚❚ {lang === 'vi' ? 'Tạm dừng' : 'Pause'}</button>}
        {phase === 'paused' && <button className="btn" onClick={togglePause}>▶ {lang === 'vi' ? 'Tiếp' : 'Play'}</button>}
        {(phase === 'done' || phase === 'paused') && scene === 'cpu' && <button className="btn" onClick={replayCpu}>↺ {lang === 'vi' ? 'Chạy lại CPU' : 'Replay CPU'}</button>}
        {(phase === 'done' || phase === 'paused') && scene === 'pc' && <button className="btn" onClick={start}>↺ {lang === 'vi' ? 'Chạy lại' : 'Replay'}</button>}
      </div>
    </div>
  )
}
