// shared/math.ts
// Pure math utilities shared across all layers. No dependencies.
// Moved from rendering/primitives/math.ts to eliminate Engine → Rendering dependency.

export const TAU = Math.PI * 2

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
