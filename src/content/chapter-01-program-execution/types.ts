// content/chapter-01-program-execution/types.ts
// Chapter-local types. The generic interfaces live in chapter-loader/types;
// these are the chapter-specific extensions the engine/viewer still consume.

import type { LocalizedText, Vec2 } from '../../chapter-loader/types'

/** Legacy alias so existing narration code can keep using `L`. */
export type L = LocalizedText
export type Scene = 'pc' | 'cpu'

export type Op = '+' | '-' | '*' | '/'
export interface Expr {
  a: number
  b: number
  op: Op
}

export type Mnemonic = 'LOAD' | 'MOV' | 'ADD' | 'SUB' | 'MUL' | 'STORE' | 'HALT'
export type Kind = 'load' | 'mov' | 'arith' | 'store' | 'halt'

export interface Instr {
  mn: Mnemonic
  kind: Kind
  usesAlu: boolean
  op?: '+' | '-' | '*'
  dst?: number // register index 0..3
  src?: number // register index 0..3
  imm?: number // immediate value (LOAD)
  text: string // compact display, e.g. "ADD  R1, R2"
  plain: LocalizedText
}

export type PartId = 'monitor' | 'ssd' | 'ram' | 'cpu' | 'gpu' | 'bus'
export type CpuPartId = 'cu' | 'registers' | 'alu'
export type AnyPartId = PartId | CpuPartId

/** A part as the chapter describes it. `kind` lets the rendering layer pick a
 *  draw routine without the chapter calling the canvas. */
export interface PartSpec {
  id: AnyPartId
  kind?: string
  pos: Vec2
  color: string
  name: string
  gloss: LocalizedText
  labelSize?: number
}

export interface CpuState {
  regs: (number | null)[]
  mem: number | null
}

export type Stage = 'fetch' | 'decode' | 'execute' | 'writeback' | 'pcinc'

export type BeatEffect = 'run' | 'loop'
export interface Beat {
  id: string
  line: LocalizedText
  duration: number
  scene?: Scene
  active: AnyPartId | null
  travel?: { from: number; to: number }
  rest?: { at: number }
  emerge?: boolean
  effect?: BeatEffect
}
