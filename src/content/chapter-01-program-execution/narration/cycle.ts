// narration/cycle.ts — the Fetch → Decode → Execute → Write Back → PC++ cycle:
// the stage model, its timing, and the per-stage narration line.

import type { Lang, LocalizedText } from '../../../chapter-loader/types'
import type { Instr, Stage } from '../types'
import { PROGRAM } from '../scenes/06-execute'

export const STAGES = ['fetch', 'decode', 'execute', 'writeback', 'pcinc'] as const
export type { Stage } from '../types'

export const STAGE_LABEL: Record<Stage, LocalizedText> = {
  fetch: { en: 'Fetch', vi: 'Lấy' },
  decode: { en: 'Decode', vi: 'Giải mã' },
  execute: { en: 'Execute', vi: 'Thực thi' },
  writeback: { en: 'Write Back', vi: 'Ghi lại' },
  pcinc: { en: 'PC \u2192 next', vi: 'PC \u2192 lệnh kế' },
}

// Each stage occupies a fraction of PER_INSTR.
export const STAGE_BOUNDS = [0, 0.16, 0.32, 0.7, 0.86, 1]
export const PER_INSTR = 3800
export const EXEC_OFFSET = 3000 // intro inside the cpu-run beat before execution starts
export const EXEC_DURATION = PROGRAM.length * PER_INSTR
export const TOTAL_STEPS = PROGRAM.length * STAGES.length
export const FADE_DUR = 450 // scene fade-through-black

export function stageAt(ft: number): { stage: Stage; sp: number } {
  for (let i = 0; i < STAGES.length; i++) {
    if (ft < STAGE_BOUNDS[i + 1]) {
      return {
        stage: STAGES[i],
        sp: (ft - STAGE_BOUNDS[i]) / (STAGE_BOUNDS[i + 1] - STAGE_BOUNDS[i]),
      }
    }
  }
  return { stage: 'pcinc', sp: 1 }
}

export function stageLine(ins: Instr, stage: Stage, lang: Lang): string {
  // HALT gets special lines so Decode/Write Back/PC++ aren't misleading.
  if (ins.kind === 'halt') {
    const haltLines: Record<Stage, LocalizedText> = {
      fetch: {
        en: 'Fetch \u2014 the brain gets the final instruction from RAM.',
        vi: 'L\u1EA5y \u2014 n\xE3o \u0111\u1ECDc l\u1EC7nh cu\u1ED1i c\xF9ng t\u1EEB RAM.',
      },
      decode: {
        en: 'Decode \u2014 it reads: stop.',
        vi: 'Gi\u1EA3i m\xE3 \u2014 n\xF3 \u0111\u1ECDc: d\u1EEBng.',
      },
      execute: {
        en: 'Execute \u2014 the program finishes.',
        vi: 'Th\u1EF1c thi \u2014 ch\u01B0\xA1ng tr\xECnh k\u1EBFt th\xFAc.',
      },
      writeback: {
        en: 'Nothing to write back \u2014 the program is stopping.',
        vi: 'Kh\xF4ng c\u1EA7n ghi l\u1EA1i \u2014 ch\u01B0\xA1ng tr\xECnh \u0111ang d\u1EEBng.',
      },
      pcinc: {
        en: 'No next instruction \u2014 the program has ended.',
        vi: 'H\u1EBFt l\u1EC7nh r\u1ED3i \u2014 ch\u01B0\xA1ng tr\xECnh \u0111\xE3 k\u1EBFt th\xFAc.',
      },
    }
    return haltLines[stage][lang]
  }

  const lines: Record<Stage, LocalizedText> = {
    fetch: {
      en: 'Fetch \u2014 the brain gets the next instruction from RAM.',
      vi: 'Lấy \u2014 não đọc lệnh tiếp theo từ RAM.',
    },
    decode: {
      en: 'Decode \u2014 the control unit works out what to do.',
      vi: 'Giải mã \u2014 đơn vị điều khiển xem phải làm gì.',
    },
    execute: {
      arith: { en: 'Execute \u2014 the calculator does the math.', vi: 'Thực thi \u2014 máy tính làm phép tính.' },
      load: { en: 'Execute \u2014 a number goes into a box.', vi: 'Thực thi \u2014 một số đi vào hộp.' },
      mov: { en: 'Execute \u2014 a number is copied between boxes.', vi: 'Thực thi \u2014 một số được chép sang hộp khác.' },
      store: { en: 'Execute \u2014 a number is saved to RAM.', vi: 'Thực thi \u2014 một số được lưu vào RAM.' },
      halt: { en: 'Execute \u2014 the program finishes.', vi: 'Thực thi \u2014 chương trình kết thúc.' },
    }[ins.kind],
    writeback: {
      en: 'Write back \u2014 the result is saved in a box, or in RAM when needed.',
      vi: 'Ghi lại \u2014 kết quả được lưu vào hộp, hoặc vào RAM khi cần.',
    },
    pcinc: {
      en: 'PC \u2192 next \u2014 the counter moves on to the next instruction.',
      vi: 'PC \u2192 lệnh kế \u2014 bộ đếm chuyển sang lệnh tiếp theo.',
    },
  }
  return lines[stage][lang]
}
