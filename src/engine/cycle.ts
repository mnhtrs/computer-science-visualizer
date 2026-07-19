// engine/cycle.ts
// Fetch → Decode → Execute → Write Back → PC++ cycle math. Pure functions.

import type { Chapter, ProgramInstruction, Vec2 } from '../chapter-loader/types'
import { clamp } from '../rendering/primitives/math'

export interface StageAt {
  stage: string
  sp: number
}

/** Where in the cycle is fraction-of-instruction `ft`? */
export function stageAt(chapter: Chapter, ft: number): StageAt {
  const sm = chapter.program?.stageModel
  if (!sm) return { stage: '', sp: 0 }
  for (let i = 0; i < sm.stages.length; i++) {
    if (ft < sm.bounds[i + 1]) {
      return {
        stage: sm.stages[i],
        sp: (ft - sm.bounds[i]) / (sm.bounds[i + 1] - sm.bounds[i]),
      }
    }
  }
  return { stage: sm.stages[sm.stages.length - 1], sp: 1 }
}

/** Resolve the [from, to] nodes for the spark during a given stage. */
export function stageEndpoints(
  ins: ProgramInstruction,
  stage: string,
): [string, string] {
  const m = ins.stageEndpoints
  if (m && m[stage]) return m[stage]
  return ['list', 'list'] // safe fallback
}

/** Resolve a node id to a world position via the chapter runtime. */
export function nodePos(
  chapter: Chapter,
  id: string,
  instrIdx: number,
): Vec2 | null {
  return chapter.runtime?.nodePos ? chapter.runtime.nodePos(id, instrIdx) : null
}

/** The display (register/memory) state at (instrIdx, ft). */
export function displayState(
  chapter: Chapter,
  instrIdx: number,
  ft: number,
): { regs: (number | null)[]; mem: number | null } {
  if (chapter.runtime?.displayState) {
    return chapter.runtime.displayState(instrIdx, ft)
  }
  const st = chapter.runtime?.stateAfter ? chapter.runtime.stateAfter(instrIdx) : { regs: [], mem: null }
  return st
}
