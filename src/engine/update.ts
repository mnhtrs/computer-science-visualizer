// engine/update.ts
// The single per-frame step. Advances the timeline, fades between scenes,
// derives the spark path, and computes CPU execution state. Pure: no React,
// no DOM, no canvas. Consumes only the Chapter contract + PresentationState.

import type { Chapter, Vec2 } from '../chapter-loader/types'
import type { PresentationState } from './state'
import { clamp, lerp, easeInOutCubic } from '../shared/math'
import { polylinePoint } from '../shared/geometry'
import { stageAt, stageEndpoints, nodePos } from './cycle'

/** Pick the protagonist's path for the current scene. */
function pathOf(chapter: Chapter, scene: string): Vec2[] {
  return chapter.scenes.find((sc) => sc.id === scene)?.path ?? []
}

/** The spark's "seam" position when a scene is fading out.
 *  Uses chapter-provided seamPosition hook if available,
 *  otherwise falls back to the last point of the scene's path. */
function seamOut(chapter: Chapter, scene: string): Vec2 {
  if (chapter.runtime?.seamPosition) {
    const pos = chapter.runtime.seamPosition(scene)
    if (pos) return pos
  }
  const p = pathOf(chapter, scene)
  return p.length ? p[p.length - 1] : { x: 0, y: 0 }
}

/** Find the index of the beat with a given effect (e.g. 'run'). */
function indexOfEffect(chapter: Chapter, effect: string): number {
  return chapter.timeline.beats.findIndex((b) => b.effect === effect)
}

export function update(s: PresentationState, dt: number, chapter: Chapter) {
  s.t += dt

  // ---- advance timeline ----
  if (s.phase === 'playing' && s.fading !== 'out') {
    s.beatElapsed += dt
    const beats = chapter.timeline.beats
    while (s.beatIndex < beats.length && s.beatElapsed >= beats[s.beatIndex].duration) {
      s.beatElapsed -= beats[s.beatIndex].duration
      s.beatIndex++
    }
    if (s.beatIndex >= beats.length) {
      s.beatIndex = beats.length - 1
      s.beatElapsed = beats[beats.length - 1].duration
      s.phase = 'done'
    }
  }

  // ---- scene fade ----
  const beats = chapter.timeline.beats
  const desired: string = beats[s.beatIndex].scene ?? chapter.scenes[0].id
  if (s.fading === 'none' && desired !== s.scene) s.fading = 'out'
  if (s.fading === 'out') {
    s.fade = clamp(s.fade + dt / chapter.timeline.fadeDuration, 0, 1)
    if (s.fade >= 1) {
      s.scene = desired
      s.fading = 'in'
      s.trail = []
    }
  } else if (s.fading === 'in') {
    s.fade = clamp(s.fade - dt / chapter.timeline.fadeDuration, 0, 1)
    if (s.fade <= 0) {
      s.fade = 0
      s.fading = 'none'
    }
  }

  // ---- derive spark + active ----
  let active: string | null = null
  let sparkPos: Vec2 = { ...s.sparkPos }
  let sparkScale = 0
  let looping = false

  if (s.phase !== 'waiting') {
    const b = beats[s.beatIndex]
    active = b.active ?? null
    const p = clamp(s.beatElapsed / b.duration, 0, 1)
    const scene = b.scene ?? chapter.scenes[0].id
    if (s.phase === 'done' || b.effect === 'loop') looping = true

    const prog = chapter.program
    const runI = prog ? indexOfEffect(chapter, 'run') : -1

    if (s.fading === 'out') {
      sparkPos = seamOut(chapter, s.scene)
      sparkScale = 1
    } else if (b.effect === 'run' && prog) {
      const execTime = Math.max(0, s.beatElapsed - prog.stageModel.execOffset)
      const perInstr = prog.stageModel.perInstr
      const instrs = prog.instructions
      const finished = execTime >= instrs.length * perInstr
      const instrIdx = clamp(Math.floor(execTime / perInstr), 0, instrs.length - 1)
      const ft = clamp(execTime / perInstr - instrIdx, 0, 1)
      const { stage, sp } = stageAt(chapter, ft)
      const ins = instrs[instrIdx]
      const [fromId, toId] = stageEndpoints(ins, stage)
      const from = nodePos(chapter, fromId, instrIdx) ?? sparkPos
      const to = nodePos(chapter, toId, instrIdx) ?? sparkPos
      let pos: Vec2
      let haltFadeScale = 1
      if (finished) {
        const lastIns = instrs[instrs.length - 1]
        if (lastIns && lastIns.kind === 'halt') {
          // HALT: spark fades out at the CU — the task is complete
          const tailDur = 1500
          const tailT = clamp((execTime - instrs.length * perInstr) / tailDur, 0, 1)
          const anchor = nodePos(chapter, 'cu', instrIdx) ?? to
          pos = anchor
          haltFadeScale = Math.max(0, 1 - tailT)
        } else {
          const a = s.t * 0.005
          const anchor = nodePos(chapter, 'alu', instrIdx) ?? to
          pos = { x: anchor.x + Math.cos(a) * 9, y: anchor.y + Math.sin(a) * 6 }
        }
      } else if (execTime <= 0) {
        const a = s.t * 0.004
        // VIEWER SHELL v1.1.10 (F93, owner round 26): park the spark at the
        // FIRST PROGRAM ROW ('list', instr 0) during the pre-exec window,
        // not orbiting the CU — owner: "đốm sáng lại ở vị trí LOAD ở CU
        // thay vì ở LOAD của bảng PROGRAM? Lẽ ra đốm sáng phải ở bước đầu
        // tiên luôn chứ?". Fetch of instr 0 lerps FROM the same 'list'
        // row, so the handoff into execution is continuous by construction.
        const anchor = nodePos(chapter, 'list', instrIdx) ?? nodePos(chapter, 'cu', instrIdx) ?? to
        pos = { x: anchor.x + Math.cos(a) * 9, y: anchor.y + Math.sin(a) * 6 }
      } else if (stage === 'execute' && ins.kind === 'arith') {
        if (sp < 0.35) pos = { x: lerp(from.x, to.x, sp / 0.35), y: lerp(from.y, to.y, sp / 0.35) }
        else {
          const a = s.t * 0.012
          pos = { x: to.x + Math.cos(a) * 26, y: to.y + Math.sin(a) * 16 }
        }
      } else if (fromId === toId) {
        const a = s.t * 0.005
        pos = { x: to.x + Math.cos(a) * 9, y: to.y + Math.sin(a) * 6 }
      } else {
        pos = { x: lerp(from.x, to.x, easeInOutCubic(sp)), y: lerp(from.y, to.y, easeInOutCubic(sp)) }
      }
      sparkPos = pos
      sparkScale = haltFadeScale
    } else if (looping) {
      const base = ((s.t * 0.00016) % 1 + 1) % 1
      const path = pathOf(chapter, chapter.scenes[0].id)
      sparkPos = path.length ? polylinePoint(path, base) : sparkPos
      sparkScale = 1
    } else if (b.travel) {
      const path = pathOf(chapter, scene).slice(b.travel.from, b.travel.to + 1)
      let param = easeInOutCubic(p)
      // v1.3.7 (F45): optional mid-beat dwell — park the spark AT one anchor
      // for a slice of the beat (owner round 7: the packet rests ~0.8 s on the
      // NIC, which brightens meanwhile, then it rolls on to RAM). Ch-01 has
      // no holdAt beats; untouched.
      const h = b.travel.holdAt
      // v1.4.4 (F72, owner round 17): >= so a beat can DWELL AT ITS FIRST
      // anchor (h.index === travel.from, fA = 0, holds p ∈ [h.from, h.to]).
      // h.from = 0 is safe: the p < h.from branch then never runs, so no
      // division by h.from happens. Ch-01 holds no such beat — unchanged.
      if (h && h.index >= b.travel.from && h.index <= b.travel.to) {
        const full = pathOf(chapter, scene)
        let before = 0
        let total = 0
        for (let i = b.travel.from; i < b.travel.to; i++) {
          const dseg = Math.hypot(full[i + 1].x - full[i].x, full[i + 1].y - full[i].y)
          if (i < h.index) before += dseg
          total += dseg
        }
        const fA = total > 0 ? before / total : 0
        if (p < h.from) param = fA * easeInOutCubic(clamp(p / h.from, 0, 1))
        else if (p < h.to) param = fA
        else param = fA + (1 - fA) * easeInOutCubic(clamp((p - h.to) / (1 - h.to), 0, 1))
      }
      sparkPos = path.length >= 2 ? polylinePoint(path, param) : sparkPos
      sparkScale = 1
    } else {
      const at = b.rest?.at ?? 0
      const a = s.t * 0.004
      const path = pathOf(chapter, scene)
      const base = path[at] ?? sparkPos
      sparkPos = { x: base.x + Math.cos(a) * 9, y: base.y + Math.sin(a) * 6 }
      sparkScale = b.emerge ? clamp(p / 0.4, 0, 1) : 1
    }
  }

  // ---- chapter-specific execution state (via runtime hook) ----
  const progEx = chapter.program
  const runIEx = progEx ? indexOfEffect(chapter, 'run') : -1
  if (chapter.runtime?.computeExecution) {
    if (progEx && runIEx >= 0 && s.beatIndex === runIEx && s.fading !== 'out') {
      const execTime = Math.max(0, s.beatElapsed - progEx.stageModel.execOffset)
      const perInstr = progEx.stageModel.perInstr
      const instrs = progEx.instructions
      const finished = execTime >= instrs.length * perInstr
      const instrIdx = clamp(Math.floor(execTime / perInstr), 0, instrs.length - 1)
      const ft = clamp(execTime / perInstr - instrIdx, 0, 1)
      const { stage, sp } = stageAt(chapter, ft)
      s.executionState = chapter.runtime.computeExecution({ instrIdx, ft, stage, sp, finished, execTime })
    } else if (progEx && runIEx >= 0 && s.beatIndex > runIEx) {
      s.executionState = chapter.runtime.computeExecution({
        instrIdx: progEx.instructions.length - 1,
        ft: 1,
        stage: '',
        sp: 0,
        finished: true,
        execTime: Infinity,
      })
    } else {
      s.executionState = null
    }
  } else {
    s.executionState = null
  }

  s.active = active
  s.sparkPos = sparkPos
  s.sparkScale = sparkScale
  s.looping = looping
  s.programDone = s.beatIndex >= beats.length - 1

  if (sparkScale > 0.05 && s.fading !== 'out') {
    s.trail.push({ x: sparkPos.x, y: sparkPos.y })
    if (s.trail.length > 30) s.trail.shift()
  }
}

// expose run-index helper for the Viewer's UI logic
export { indexOfEffect }
