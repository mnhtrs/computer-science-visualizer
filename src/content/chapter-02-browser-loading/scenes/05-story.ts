// scenes/05-story.ts — the micro-content the workbench renders: the actual
// mini page and every intermediate artifact it passes through (frozen in
// Phase 2/Phase 5). One file = one source of truth for the pipeline data.

// ---- the HTML source (what the bytes decode into) ------------------------------
export const HEX_GRID: string[][] = [
  ['3C', '68', '74', '6D', '6C', '3E', '0A', '3C', '68', '65', '61'],
  ['64', '3E', '3C', '6C', '69', '6E', '6B', '3E', '3C', '2F', '68'],
  ['65', '61', '64', '3E', '3C', '62', '6F', '64', '79', '3E', '3C'],
  ['68', '31', '3E', '41', '6C', '6C', '20', '41', '62', '6F', '75'],
  ['74', '20', '43', '61', '74', '73', '3C', '2F', '68', '31', '3E'],
  ['3C', '70', '3E', '43', '61', '74', '73', '3C', '2F', '70', '3E'],
]

export const CHAR_LINES: string[] = [
  '<html><head><link></head>',
  '<body><h1>All About Cats</h1>',
  '<p>Cats sleep 16 hours.</p>',
  // v1.3.9 (F48, owner round 9): honest DOM API (no invented `p.t`); the
  // leading space keeps the tree label exact ("hours. They own…").
  // v1.3.10 (F52, owner round 10): ONE physical source line — "p.textContent
  // phải ở cùng dòng với += chứ?". 49 chars ≈ 441 px at 15 px mono; the
  // tokenize bench affords 1044 — no clipping.
  '<script>p.textContent += " They own the internet."',
  '</script></body>',
]

// v1.3.10 (F52): the decode stage renders beside the 11-col hex grid at
// 19 px mono (zone ≈ 485 px; the one-liner needs ≈ 559) — so it SOFT-WRAPS
// the script line editor-style. Same file content, display wrap only:
// tokenize (dot 2) shows the line intact, decode (dot 1) wraps it.
export const DECODE_LINES: string[] = [
  '<html><head><link></head>',
  '<body><h1>All About Cats</h1>',
  '<p>Cats sleep 16 hours.</p>',
  '<script>p.textContent +=',
  '" They own the internet."',
  '</script></body>',
]

// ---- tokens -------------------------------------------------------------------
export const TOKENS: string[] = [
  '<html>',
  '<head>',
  '<link>',
  '</head>',
  '<body>',
  '<h1>',
  '"All About Cats"',
  '</h1>',
  '<p>',
  '"Cats sleep…"',
  '</p>',
  '<script>',
  '"change p…"',
  '</script>',
  '</body>',
  '</html>',
]

// ---- the DOM tree (built during b11; the script node arrives at b14) -------------
export const DOM_NODES = [
  { id: 'html', label: '<html>', depth: 0, order: 1, parent: null, tint: '#38bdf8' },
  { id: 'head', label: '<head>', depth: 1, order: 2, parent: 'html', tint: '#818cf8' },
  { id: 'link', label: '<link>', depth: 2, order: 3, parent: 'head', tint: '#a78bfa' },
  { id: 'body', label: '<body>', depth: 1, order: 4, parent: 'html', tint: '#22d3ee' },
  { id: 'h1', label: '<h1> All About Cats', depth: 2, order: 5, parent: 'body', tint: '#fbbf24' },
  { id: 'p', label: '<p> Cats sleep 16 hours.', depth: 2, order: 6, parent: 'body', tint: '#4ade80' },
] as const

export const SCRIPT_NODE = {
  id: 'script',
  label: '<script>',
  depth: 2,
  parent: 'body',
  tint: '#facc15',
} as const

export const MUTATION_BASE = '<p> Cats sleep 16 hours.'
export const MUTATION_APPEND = ' They own the internet.'

// ---- CSSOM ----------------------------------------------------------------------
export const CSSOM_RULES: string[] = [
  'body { navy; white }',
  'h1 { gold; big }',
  'p { soft gray }',
]

// ---- Render Tree (visible nodes only — M-truth: head/link/script dropped) -------
export const RENDER_NODES = [
  { id: 'r-body', label: 'body', depth: 0, parent: null, tint: '#22d3ee' },
  { id: 'r-h1', label: 'h1 · gold', depth: 1, parent: 'r-body', tint: '#fbbf24' },
  { id: 'r-p', label: 'p · white', depth: 1, parent: 'r-body', tint: '#e2e8f0' },
] as const

// ---- Paint commands --------------------------------------------------------------
export const PAINT_COMMANDS: string[] = [
  '1  fillRect   page background',
  '2  fillRect   header band',
  '3  fillText   "All About Cats"',
  '4  fillText   the paragraph',
  '5  fillRect   the button',
  '6  fillText   "Adopt a cat"',
]

// ---- the final page spec (workbench b20/b21 → viewport finale) ----------------------
export const PAGE = {
  bg: '#20294a',
  headerColor: '#fbbf24',
  headerText: 'All About Cats',
  headerTextColor: '#1f2937',
  paraColor: '#e5e7eb',
  paraText: 'Cats sleep 16 hours. They own the internet.',
  buttonColor: '#fb7185',
  buttonText: 'Adopt a cat',
}

// ---- beat → workbench stage (deterministic mapping) --------------------------------
// Beat indices after the v1.2 architectural revision (23 beats; engine = b9–b20).
export const STAGE_AT_BEAT: Record<number, string> = {
  9: 'bytes',
  10: 'chars',
  11: 'dom',
  12: 'cssfetch',
  13: 'cssom',
  14: 'paused',
  15: 'mutated',
  16: 'rendertree',
  17: 'layout',
  18: 'paint',
  19: 'raster',
  20: 'composite',
  21: 'final',
  22: 'final',
}

export const STAGE_CAPTIONS: Record<string, string> = {
  bytes: 'bytes → characters',
  chars: 'characters → tokens',
  dom: 'tokens → DOM Tree',
  cssfetch: 'fetching the CSS file…',
  cssom: 'CSS → CSSOM',
  paused: 'Parser paused: a script!',
  mutated: 'the script edits the page',
  rendertree: 'DOM + CSSOM → Render Tree',
  layout: 'Layout: measuring every box',
  paint: 'Paint: the ordered drawing list',
  raster: 'Raster: real pixels at last',
  composite: 'GPU: stacking the layers',
  final: 'the page!',
}
