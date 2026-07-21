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
import SocialButtons from '../components/SocialButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPause, faPlay, faRotateLeft } from '@fortawesome/free-solid-svg-icons'

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
  const [lineBeat, setLineBeat] = useState(0)
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
  // "deep scene": the sub-scene with program-controlled micro-steps (Ch-01's
  // 'cpu'). Chapters without a program never enter a deep scene.
  const deepScene = prog && runI >= 0 ? (beats[runI].scene ?? homeScene) : null

  const sync = (p: Phase, b: number, sc: string) => {
    if (p !== phaseRef.current) { phaseRef.current = p; setPhase(p) }
    if (b !== beatRef.current) { beatRef.current = b; setBeat(b) }
    if (sc !== sceneRef.current) { sceneRef.current = sc; setScene(sc) }
    // v1.4.3 (F71, owner round 16): the panel line may run AHEAD of the beat
    // when the beat sets `nextLineFrom` — re-sync every frame so the swap
    // lands within ~16 ms of the threshold.
    const st = S.current
    const fb = beats[b]
    const nlf = fb?.nextLineFrom
    const lb = nlf !== undefined && b < beats.length - 1 && st.beatElapsed / fb.duration >= nlf ? b + 1 : b
    if (lb !== lineBeatRef.current) { lineBeatRef.current = lb; setLineBeat(lb) }
    const ek = `${st.execInstrIdx}|${st.execStage}|${st.execDone ? 1 : 0}`
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
  // v1.1.1 (F73): replayDeep + replayFrom deleted with the mid-scene replay
  // buttons (owner round 17: replay only when the whole chapter is done).
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
      // VIEWER SHELL v1.1.9 (F92, owner round 25): at the thaw frame of a
      // deep-scene ceremony, FAST-FORWARD the pre-exec remainder — the
      // execOffset intro window (ch1: beatElapsed 476→3000 ms of still
      // visuals) otherwise plays out as a ~2.5 s dead stretch right after
      // the tag leaves ("nó bị đơ ra 1 lúc sau khi đã xong hết hiệu ứng").
      // Probe probe-ch1-ff.ts: spark coords byte-equal across the skip
      // (793,254), steps tick at the thaw frame itself. Engine/content
      // untouched — this is a viewer-side scrub of a still segment.
      if (freezeUntilRef.current > 0 && ts >= freezeUntilRef.current) {
        if (deepScene && prog && s.beatIndex === runI && s.beatElapsed < prog.stageModel.execOffset) {
          s.beatElapsed = prog.stageModel.execOffset
        }
        freezeUntilRef.current = 0
      }
      let dt = s.lastTs ? Math.min(50, ts - s.lastTs) : 16
      // VIEWER SHELL v1.1.4 (F86, owner round 20): the engine is FROZEN while
      // the inside intro plays — "lúc đó các phần tử và các block trong
      // canvas mới hoạt động và bắt đầu animation" (only once the tag slides
      // up to leave). dt = 0 advances nothing: blocks, dots, spark, captions
      // all stand; the UI chrome is untouched and the freeze window ends on
      // its own timer. Engine + smoke are unaffected (this is RAF-level).
      if (s.phase === 'playing' && ts < freezeUntilRef.current) dt = 0
      s.lastTs = ts; s.lang = langRef.current
      update(s, dt, chapter)
      render(ctx, s, chapter)
      sync(s.phase, s.beatIndex, s.scene)
      // v1.1.8 (F91, owner round 24): FIRE when the green strip is ON SCREEN
      // and the seam has finished — "vào inside xanh lá phát là phải bắt đầu
      // hiệu ứng của tag inside luôn". v1.1.6's deep cue (beatElapsed >=
      // execOffset = 3000) fired at the FIRST GREEN STEP — three seconds
      // after the strip appeared, so Ch-01 looked frozen the instant it
      // started counting (probe-ch1-intro.ts: strip 13360 ms, fire 16352).
      // New cue, both chapter forms: inside shown && s.fading === 'none'
      // (deep: scene IS the deep scene; group: multi-beat non-home group).
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
          // v1.1.11 (F95, owner round 27): freeze ONLY for deep scenes —
          // their exec hasn't started anyway, so the freeze + F92 fast-
          // forward is invisible-but-useful. Beat GROUPS (Ch-02) run the
          // ceremony OVER the living scene: their first strip beat (decode)
          // already rests the spark for 3 s by content design, and freezing
          // 400 ms on top of it stacked a visible stall right at the strip
          // start (probe-ch2-entry.ts: fire 24112 while decode was still
          // until 27040). Approval f95 = groups-no-freeze.
          if (deepFire) freezeUntilRef.current = ts + INTRO_BLOCKS_AT
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('keydown', onKey)
    }
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
  // v1.4.3 (F71): narration follows `lineBeat` (may be one ahead near a
  // beat's tail) — the step counter shows the LINE's beat, matching what
  // the reader sees.
  else { line = beats[lineBeat]?.line[lang] ?? '' }

  const capKey = 'b' + lineBeat + lang + scene + (prog && beat === runI ? S.current.execStageIdx + ':' + execTick : '')

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

  // VIEWER SHELL v1.1.3 (F84, owner round 19) — RULE V-01 INSIDE PARITY:
  // ANY chapter with an inside section gets the full treatment (intro +
  // resident row). "Inside" = a multi-beat scene group (ch2: 12 beats) OR a
  // deep scene of ANY beat count (ch1: exactly ONE 'cpu' beat with 40
  // micro-steps). v1.1.2's group-only trigger silently skipped Ch-01
  // because its deep scene is a single beat (curGroup.from === to) — the
  // owner noticed: "tại sao chương 1 ko có hiệu ứng inside ... như chương
  // 2?". Root cause recorded openly in docs/viewer/04_.
  const totalSteps = chapter.runtime?.totalSteps ? chapter.runtime.totalSteps() : 0
  const isDeepInside = !!(deepScene && scene === deepScene)
  const insideActive = !!insideGroup || isDeepInside

  // VIEWER SHELL v1.1.10 (F94, owner round 26): the ceremony is FAST and the
  // freeze hugs the tag's impact window exactly — "ko đc phép đóng băng
  // trước khi inside tag chưa có hiệu ứng lướt xuống, cũng ko đc phép đóng
  // băng khi inside tag đã gần như biến mất hẳn". Full rhythm now:
  //   0→200 ms    tag slides down + shake ±3 px + blink (F90, simultaneous)
  //   200→400 ms  tag holds (shake/blink tail ends)
  //   400 ms      THAW — blocks start as the tag begins rising (exit 400→650)
  //   400→650 ms  tag rises + fades away, content animating underneath
  // Freeze window [fire, fire+400 ms] — DEEP scenes only (v1.1.11 F95:
  // beat groups like Ch-02's engine strip get NO freeze; the ceremony
  // plays over the living decode scene). Blocks/FF semantics of F86/F91/
  // F92 unchanged.
  const INTRO_BLOCKS_AT = 400
  const [introKey, setIntroKey] = useState(0)
  const wasInsideRef = useRef(false)
  const freezeUntilRef = useRef(0)
  // arms on the inside-entry edge; the RAF loop fires it at green-start.
  const awaitGreenRef = useRef(false)
  useEffect(() => {
    const nowInside = insideActive && phase !== 'waiting' && phase !== 'done'
    if (nowInside && !wasInsideRef.current) {
      awaitGreenRef.current = true
    } else if (!nowInside && wasInsideRef.current) {
      // leaving before or during the ceremony: disarm + unmount + thaw
      awaitGreenRef.current = false
      setIntroKey(0)
      freezeUntilRef.current = 0
    }
    wasInsideRef.current = nowInside
  })

  // v1.1.2 (D6): the resident inside step counts the GREEN timeline's own
  // steps — ch1's deep scene counts its 40 micro-steps (currentStep), ch2's
  // engine group counts the beats inside the group (the 12 green cdots).
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

  return (
    <div className="app">
      <div className="stage" ref={stageRef}>
        <canvas ref={canvasRef} className={`canvas${introKey > 0 ? ' shake' : ''}`} onClick={onClick} onMouseMove={onMouseMove} />
        {/* VIEWER SHELL v1.1.2 (F80+F81, owner round 18): entering an inside
            group fires a one-shot intro — the canvas SHAKES 500 ms while a big
            orange tag drops in from the top (300 ms), holds (900 ms), then
            exits upward (300 ms). The persistent top-right sceneTag (v1.1.0,
            F63) is DELETED by owner order (f81 = kill-topright); residency
            moved under the title with the inside step's own counter (D6). */}
        {introKey > 0 && insideActive && (
          <div key={introKey} className="insideIntro" onAnimationEnd={() => setIntroKey(0)}>
            {(ui.sceneTag ?? ui.insideCpuTag ?? EMPTY_TEXT)[lang]}
          </div>
        )}
        {/* VIEWER SHELL v1.1.1 (F74, owner round 17): the Home pill moved
            INTO the panel head (before the brand) — v1.1.0's stage-corner
            float (F63) is superseded by the owner's own follow-up order;
            nothing floats over the canvas anymore. */}
      </div>
      <aside className="panel">
        <div className="panel-head">
          <div className="panel-head-left">
            {controlsLeft}
            {/* VIEWER SHELL v1.1.2 (F82/D2, owner round 18): the "Cesvi" brand
                next to the Home pill is REMOVED by owner order ("Bỏ chữ Cesvi
                cạnh nút home đi") — the row is just Home + the EN/VI toggle. */}
          </div>
          <div className="langtoggle">
            {(['en', 'vi'] as const).map((l) => (
              <button key={l} className={`pill ${lang === l ? 'on' : ''}`} onClick={() => { langRef.current = l; setLang(l) }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {/* VIEWER SHELL v1.1.2 (F82/D4, owner round 18): the step counter
            moved UP beside the title — one baseline row, title first, then
            "Step 3 / 40". Waiting keeps "Sẵn sàng/Ready" in the same slot. */}
        <div className="chapterRow">
          <div className="chapter">{(ui.chapterTitle ?? EMPTY_TEXT)[lang]}</div>
          <div className="step-no">
            {phase === 'waiting'
              ? (lang === 'vi' ? 'Sẵn sàng' : 'Ready')
              : `${lang === 'vi' ? 'Bước' : 'Step'} ${Math.min(lineBeat + 1, beats.length)} / ${beats.length}`}
          </div>
        </div>
        {/* VIEWER SHELL v1.1.2 (F81/D6, owner round 18): after the intro, the
            inside identity lives HERE — a small orange tag text followed by
            the green timeline's own step (deep: 12/40 micro-steps; group:
            3/12 beats). Hidden while the one-shot intro is on screen. */}
        {insideActive && nav && introKey === 0 && (
          <div className="insideTagRow">
            <span className="insideTagTxt">{(ui.sceneTag ?? ui.insideCpuTag ?? EMPTY_TEXT)[lang]}</span>
            <span className="insideTagStep">
              {`${lang === 'vi' ? 'Bước' : 'Step'} ${insideStepNow} / ${insideStepTotal}`}
            </span>
          </div>
        )}
        {canEdit && (
          <button className="runbtn" onClick={start}><FontAwesomeIcon icon={faPlay} /> {(ui.startButton ?? EMPTY_TEXT)[lang] || (lang === 'vi' ? 'Mở tệp' : 'Open file')}</button>
        )}
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
              ? 'Bấm vào tệp trên màn hình để bắt đầu. Dùng nút < > hoặc các chấm để lùi/tới.'
              : 'Click the file on the screen to begin. Use the < > buttons or the dots to step.'}
        </div>
      </aside>
      <div className="controls">
        {/* LAYOUT v1.3.2 (F21): 3-zone grid — left chrome / centered nav / right tag.
            The dot group is centered absolutely; side zones can't push it.
            VIEWER SHELL v1.1.0 (F63): left zone is empty — Home floated up
            onto the stage corner; the grid stays so the center keeps centered. */}
        <div className="ctl-left" />
        <div className="ctl-center">
        {/* VIEWER SHELL v1.1.0 (F66, owner round 15): while the chapter has
            not started (phase 'waiting') the center slot shows ONLY the two
            social logos, same artwork as the homepage footer. Once the model
            starts, the logos disappear completely and the timeline + Prev /
            Next buttons appear in their place. */}
        {phase === 'waiting' ? (
          <div className="ctl-social"><SocialButtons /></div>
        ) : (
        <>
        {deepScene && scene === deepScene && (
          // VIEWER SHELL v1.1.0 (F64, owner round 15): a real text label
          // ("Back"), no arrow glyph; the green styling stays.
          <button className="btn back" onClick={exitDeep} title={lang === 'vi' ? 'Quay lại' : 'Back'}>{lang === 'vi' ? 'Quay lại' : 'Back'}</button>
        )}
        {!deepScene && insideGroup && (
          // v1.3.4 (F32): scene-groups exit exactly like Ch-01's deep scene
          <button className="btn back" onClick={() => jumpTo(Math.max(0, insideGroup.from - 1))} title={lang === 'vi' ? 'Quay lại' : 'Back'}>{lang === 'vi' ? 'Quay lại' : 'Back'}</button>
        )}
        <button className="btn icon" onClick={stepPrev} disabled={!nav || beat === 0} title="Previous">
          {/* VIEWER SHELL v1.1.1 (F75): FA chevron = a bold "<" (D4+D6) */}
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {deepScene && scene === deepScene && prog ? (
          // VIEWER SHELL v1.1.0 (F65, owner round 15): the step dots split
          // into BALANCED rows (40 steps -> 20 + 20, columns aligned), never
          // one long row with a short tail. Rows kick in past 26 steps.
          <div className="cycleDots clickable">
            {(() => {
              const curStep = currentStep()
              const rowCount = totalSteps > 26 ? Math.ceil(totalSteps / 26) : 1
              const per = Math.ceil(totalSteps / rowCount)
              return Array.from({ length: rowCount }, (_, r) => (
                <div className="cdotRow" key={r}>
                  {Array.from({ length: Math.min(per, totalSteps - r * per) }, (_, k) => {
                    const step = r * per + k
                    return <span key={step} className={`cdot ${step < curStep ? 'done' : step === curStep ? 'cur' : ''}`} onClick={() => jumpToStep(step)} />
                  })}
                </div>
              ))
            })()}
          </div>
        ) : insideGroup ? (
          /* v1.3.4 (F32): inside the group — the green micro-timeline.
             v1.3.5 (F34): Replay moved to the END of the button row, after
             Play/Pause — it used to sit between the strip and Next. */
          <div className="cycleDots clickable">
            {/* one .cdotRow wrapper: .cycleDots is a column of rows since
                VIEWER SHELL v1.1.0 (F65) — without it these 12 dots would
                stack vertically */}
            <div className="cdotRow">
              {Array.from({ length: insideGroup.to - insideGroup.from + 1 }, (_, k) => {
                const bi = insideGroup.from + k
                return <span key={bi} className={`cdot ${bi < beat ? 'done' : bi === beat ? 'cur' : ''}`} onClick={() => jumpTo(bi)} />
              })}
            </div>
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
        <button className="btn icon" onClick={stepNext} disabled={!nav} title="Next">
          {/* VIEWER SHELL v1.1.1 (F75): FA chevron = a bold ">" (prev mirrored) */}
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        {phase === 'playing' && (
          <button className="btn" onClick={togglePause}>
            <FontAwesomeIcon icon={faPause} /> <span className="btn-label">{lang === 'vi' ? 'Tạm dừng' : 'Pause'}</span>
          </button>
        )}
        {phase === 'paused' && (
          // VIEWER SHELL v1.1.1 (F73, owner round 17): paused = RESUME
          <button className="btn" onClick={togglePause}>
            <FontAwesomeIcon icon={faPlay} /> <span className="btn-label">{lang === 'vi' ? 'Tiếp tục' : 'Resume'}</span>
          </button>
        )}
        {/* VIEWER SHELL v1.1.1 (F73, owner round 17): ONE replay button only,
            visible ONLY when the WHOLE chapter is done. The mid-scene replays
            (inside-CPU / inside-engine, shown at paused) are deleted — owner:
            "Replay chỉ xuất hiện khi kết thúc toàn bộ animation". Supersedes
            F34's end-of-row scene-group replay and v1.1.0's deep replay. */}
        {phase === 'done' && scene === homeScene && (
          <button className="btn" onClick={start}>
            <FontAwesomeIcon icon={faRotateLeft} /> <span className="btn-label">{lang === 'vi' ? 'Chạy lại' : 'Replay'}</span>
          </button>
        )}
        </>
        )}
        </div>
        <div className="ctl-right" />
      </div>
    </div>
  )
}

// Dev-tooling handle (scripts/check-shell.ts probes the waiting-phase DOM
// structure without a browser). No runtime effect.
export { ViewerCore }
