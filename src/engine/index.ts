// engine/index.ts
// Barrel for the framework-independent engine. No React, no DOM, no canvas
// drawing — only the contract types and the pure step function.

export * from './state'
export * from './cycle'
export * from './update'
