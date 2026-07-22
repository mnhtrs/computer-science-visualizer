// viewer/Viewer.tsx
// Phase 2: Presentation layer. Receives state + callbacks from orchestrator.
// Renders JSX only. No runtime state ownership. No engine logic.
// Zero behavior changes from pre-Phase-2 Viewer.

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Chapter } from '../chapter-loader/types'
import { getChapter } from '../chapter-loader/registry'
import { useViewerEngine } from '../orchestrator/useViewerEngine'
import SocialButtons from '../components/SocialButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPause, faPlay, faRotateLeft } from '@fortawesome/free-solid-svg-icons'

const EMPTY_TEXT = { en: '', vi: '' } as const

export default function Viewer({ chapterId, controlsLeft }: { chapterId: string; controlsLeft?: ReactNode }) {
  const [chapter, setChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    let alive = true
    const meta = getChapter(chapterId)
    if (!meta?.loadStory) return
    meta
      .loadStory()
      .then((c) => { if (alive) setChapter(c) })
      .catch((e) => console.error('[viewer] failed to load chapter', chapterId, e))
    return () => { alive = false }
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
  const engine = useViewerEngine(chapter, controlsLeft)

  const {
    stageRef, canvasRef,
    phase, beat, scene, lang, lineBeat, introKey,
    line, instrHint, capKey,
    glossEntity,
    groups, insideGroup, insideActive, insideStepTotal, insideStepNow,
    nav, canEdit, deepScene, totalSteps, homeScene, ui, runI, prog, beatsLength,
    start, togglePause, jumpTo, stepPrev, stepNext, exitDeep, currentStep, jumpToStep,
    onClick, onMouseMove, setLang, onIntroAnimEnd,
  } = engine

  return (
    <div className="app">
      <div className="stage" ref={stageRef}>
        <canvas ref={canvasRef} className={`canvas${introKey > 0 ? ' shake' : ''}`} onClick={onClick} onMouseMove={onMouseMove} />
        {introKey > 0 && insideActive && (
          <div key={introKey} className="insideIntro" onAnimationEnd={onIntroAnimEnd}>
            {(ui.sceneTag ?? ui.insideCpuTag ?? EMPTY_TEXT)[lang]}
          </div>
        )}
      </div>
      <aside className="panel">
        <div className="panel-head">
          <div className="panel-head-left">
            {controlsLeft}
          </div>
          <div className="langtoggle">
            {(['en', 'vi'] as const).map((l) => (
              <button key={l} className={`pill ${lang === l ? 'on' : ''}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="chapterRow">
          <div className="chapter">{(ui.chapterTitle ?? EMPTY_TEXT)[lang]}</div>
          <div className="step-no">
            {phase === 'waiting'
              ? (lang === 'vi' ? 'Sẵn sàng' : 'Ready')
              : `${lang === 'vi' ? 'Bước' : 'Step'} ${Math.min(lineBeat + 1, beatsLength)} / ${beatsLength}`}
          </div>
        </div>
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
        <div className="ctl-left" />
        <div className="ctl-center">
        {phase === 'waiting' ? (
          <div className="ctl-social"><SocialButtons /></div>
        ) : (
        <>
        {deepScene && scene === deepScene && (
          <button className="btn back" onClick={exitDeep} title={lang === 'vi' ? 'Quay lại' : 'Back'}>{lang === 'vi' ? 'Quay lại' : 'Back'}</button>
        )}
        {!deepScene && insideGroup && (
          <button className="btn back" onClick={() => jumpTo(Math.max(0, insideGroup.from - 1))} title={lang === 'vi' ? 'Quay lại' : 'Back'}>{lang === 'vi' ? 'Quay lại' : 'Back'}</button>
        )}
        <button className="btn icon" onClick={stepPrev} disabled={!nav || beat === 0} title="Previous">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {deepScene && scene === deepScene && prog ? (
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
          <div className="cycleDots clickable">
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
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        {phase === 'playing' && (
          <button className="btn" onClick={togglePause}>
            <FontAwesomeIcon icon={faPause} /> <span className="btn-label">{lang === 'vi' ? 'Tạm dừng' : 'Pause'}</span>
          </button>
        )}
        {phase === 'paused' && (
          <button className="btn" onClick={togglePause}>
            <FontAwesomeIcon icon={faPlay} /> <span className="btn-label">{lang === 'vi' ? 'Tiếp tục' : 'Resume'}</span>
          </button>
        )}
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

export { ViewerCore }
