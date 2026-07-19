// narration/operations.ts — the dynamic "what is the CPU doing right now" line.
// Real register values; the result is appended only once write-back begins.

import type { Lang } from '../../../chapter-loader/types'
import type { CpuState, Instr } from '../types'
import { REG_NAMES } from '../scenes/06-execute'

export function currentOpText(ins: Instr, st: CpuState, lang: Lang, done = false): string {
  const r = st.regs
  const nm = (i: number) => REG_NAMES[i]
  const en = lang === 'en'
  const opSym = ins.op === '*' ? '\u00D7' : ins.op === '-' ? '\u2212' : '+'
  switch (ins.mn) {
    case 'LOAD':
      return en ? `Put ${ins.imm} into ${nm(ins.dst!)}` : `Đặt ${ins.imm} vào ${nm(ins.dst!)}`
    case 'MOV': {
      const v = r[ins.src!] ?? 0
      return en
        ? `Copy ${v} from ${nm(ins.src!)} to ${nm(ins.dst!)}`
        : `Chép ${v} từ ${nm(ins.src!)} sang ${nm(ins.dst!)}`
    }
    case 'ADD': {
      const a = r[ins.dst!] ?? 0
      const b = r[ins.src!] ?? 0
      const res = a + b
      return en ? `Add: ${a} + ${b}${done ? ' = ' + res : ''}` : `Cộng: ${a} + ${b}${done ? ' = ' + res : ''}`
    }
    case 'SUB': {
      const a = r[ins.dst!] ?? 0
      const b = r[ins.src!] ?? 0
      const res = a - b
      return en
        ? `Subtract: ${a} ${opSym} ${b}${done ? ' = ' + res : ''}`
        : `Trừ: ${a} ${opSym} ${b}${done ? ' = ' + res : ''}`
    }
    case 'MUL': {
      const a = r[ins.dst!] ?? 0
      const b = r[ins.src!] ?? 0
      const res = a * b
      return en
        ? `Multiply: ${a} ${opSym} ${b}${done ? ' = ' + res : ''}`
        : `Nhân: ${a} ${opSym} ${b}${done ? ' = ' + res : ''}`
    }
    case 'STORE': {
      const v = r[ins.src!] ?? 0
      return en ? `Save ${v} to memory` : `Lưu ${v} vào bộ nhớ`
    }
    case 'HALT':
      return en ? 'Stop' : 'Dừng'
  }
}
