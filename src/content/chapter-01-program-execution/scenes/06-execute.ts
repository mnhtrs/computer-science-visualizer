// scenes/06-execute.ts — Act 6: the Execute stage.
// The Registers (fast boxes) and ALU (calculator), plus the miniature PROGRAM
// the CPU runs and its pure state machine.

import { REG_POS, ALU_POS } from './04-fetch'
import type { Instr, PartSpec, Expr, Op, CpuState } from '../types'

// ---- Registers + ALU entities --------------------------------------------
export const registers: PartSpec = {
  id: 'registers',
  kind: 'registers',
  pos: REG_POS,
  color: '#34d399',
  name: 'Registers',
  gloss: {
    en: 'A few tiny, super-fast boxes. They hold the numbers the brain is using right now.',
    vi: 'Vài chiếc hộp nhỏ, siêu nhanh. Chúng giữ những con số mà não đang dùng ngay lúc này.',
  },
}

export const alu: PartSpec = {
  id: 'alu',
  kind: 'alu',
  pos: ALU_POS,
  color: '#fb7185',
  name: 'ALU',
  gloss: {
    en: 'The calculator. It only wakes up for math — adding, subtracting, multiplying.',
    vi: 'Cái máy tính. Nó chỉ thức dậy khi cần tính — cộng, trừ, nhân.',
  },
}

// ---- The miniature program ------------------------------------------------
export const OPS: Op[] = ['+', '-', '*', '/']
export const OP_SYMBOL: Record<Op, string> = {
  '+': '+',
  '-': '\u2212',
  '*': '\u00D7',
  '/': '\u00F7',
}
export const REG_NAMES = ['R1', 'R2', 'R3', 'R4']

export const PROGRAM: Instr[] = [
  {
    mn: 'LOAD', kind: 'load', usesAlu: false, dst: 0, imm: 8,
    text: 'LOAD  R1, 8',
    plain: { en: 'Put the number 8 into box R1.', vi: 'Đặt số 8 vào hộp R1.' },
  },
  {
    mn: 'LOAD', kind: 'load', usesAlu: false, dst: 1, imm: 5,
    text: 'LOAD  R2, 5',
    plain: { en: 'Put the number 5 into box R2.', vi: 'Đặt số 5 vào hộp R2.' },
  },
  {
    mn: 'ADD', kind: 'arith', usesAlu: true, op: '+', dst: 0, src: 1,
    text: 'ADD  R1, R2',
    plain: { en: 'Add R2 into R1.', vi: 'Cộng R2 vào R1.' },
  },
  {
    mn: 'MOV', kind: 'mov', usesAlu: false, dst: 2, src: 0,
    text: 'MOV  R3, R1',
    plain: { en: 'Copy R1 into R3.', vi: 'Chép R1 sang R3.' },
  },
  {
    mn: 'LOAD', kind: 'load', usesAlu: false, dst: 3, imm: 2,
    text: 'LOAD  R4, 2',
    plain: { en: 'Put the number 2 into box R4.', vi: 'Đặt số 2 vào hộp R4.' },
  },
  {
    mn: 'MUL', kind: 'arith', usesAlu: true, op: '*', dst: 2, src: 3,
    text: 'MUL  R3, R4',
    plain: { en: 'Multiply R3 by R4.', vi: 'Nhân R3 với R4.' },
  },
  {
    mn: 'STORE', kind: 'store', usesAlu: false, src: 2,
    text: 'STORE  R3',
    plain: { en: 'Save R3 back into RAM.', vi: 'Lưu R3 trở lại vào RAM.' },
  },
  {
    mn: 'HALT', kind: 'halt', usesAlu: false,
    text: 'HALT',
    plain: { en: 'Stop — the program is finished.', vi: 'Dừng — chương trình đã xong.' },
  },
]

// ---- Pure CPU state machine ----------------------------------------------
export function freshState(): CpuState {
  return { regs: [null, null, null, null], mem: null }
}

export function computeResult(e: Expr): number {
  switch (e.op) {
    case '+':
      return e.a + e.b
    case '-':
      return e.a - e.b
    case '*':
      return e.a * e.b
    case '/':
      return e.b === 0 ? NaN : e.a / e.b
  }
}

export function formatResult(e: Expr): string {
  const r = computeResult(e)
  if (Number.isNaN(r)) return '\u221E'
  const rounded = Math.round(r * 100) / 100
  let s = String(rounded)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  return s
}

export function applyInstr(st: CpuState, ins: Instr): CpuState {
  const regs = st.regs.slice()
  let mem = st.mem
  switch (ins.mn) {
    case 'LOAD':
      regs[ins.dst!] = ins.imm!
      break
    case 'MOV':
      regs[ins.dst!] = regs[ins.src!] ?? 0
      break
    case 'ADD':
      regs[ins.dst!] = (regs[ins.dst!] ?? 0) + (regs[ins.src!] ?? 0)
      break
    case 'SUB':
      regs[ins.dst!] = (regs[ins.dst!] ?? 0) - (regs[ins.src!] ?? 0)
      break
    case 'MUL':
      regs[ins.dst!] = (regs[ins.dst!] ?? 0) * (regs[ins.src!] ?? 0)
      break
    case 'STORE':
      mem = regs[ins.src!] ?? 0
      break
    case 'HALT':
      break
  }
  return { regs, mem }
}

// Precomputed states: REG_STATES[k] = state after k instructions have run.
export const REG_STATES: CpuState[] = (() => {
  const arr: CpuState[] = [freshState()]
  let st = freshState()
  for (const ins of PROGRAM) {
    st = applyInstr(st, ins)
    arr.push(st)
  }
  return arr
})()
