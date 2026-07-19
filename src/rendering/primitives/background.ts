// rendering/primitives/background.ts
// Deterministic starfield + gradient backdrop. Scene-agnostic.

import { TAU } from './math'

let _seed = 2463534242
const rnd = () => {
  _seed = (_seed * 1664525 + 1013904223) % 4294967296
  return _seed / 4294967296
}
const STARS = Array.from({ length: 130 }, () => ({
  nx: rnd(),
  ny: rnd(),
  r: 0.4 + rnd() * 1.4,
  a: 0.2 + rnd() * 0.6,
  ph: rnd() * TAU,
}))

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#2b2640')
  g.addColorStop(0.5, '#252038')
  g.addColorStop(1, '#211c32')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  const blob = (x: number, y: number, r: number, c: string) => {
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r)
    gr.addColorStop(0, c)
    gr.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gr
    ctx.beginPath()
    ctx.arc(x, y, r, 0, TAU)
    ctx.fill()
  }
  blob(W * 0.2, H * 0.3, Math.max(W, H) * 0.3, 'rgba(150,120,220,0.1)')
  blob(W * 0.8, H * 0.7, Math.max(W, H) * 0.32, 'rgba(210,110,150,0.06)')
  for (const st of STARS) {
    const tw = 0.5 + 0.5 * Math.sin(t * 0.002 + st.ph)
    ctx.globalAlpha = st.a * tw
    ctx.fillStyle = '#cfe0ff'
    ctx.beginPath()
    ctx.arc(st.nx * W, st.ny * H, st.r, 0, TAU)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export function drawVignette(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createRadialGradient(
    W / 2,
    H / 2,
    Math.min(W, H) * 0.32,
    W / 2,
    H / 2,
    Math.max(W, H) * 0.75,
  )
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.5)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}
