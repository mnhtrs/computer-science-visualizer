# Chapter 02 — UI/Layout Revision v1.3.15 (Owner Feedback Round 16)

> ⚠️ Standing: layout amendment. Frozen docs 01–09 untouched. This document
> becomes **current for layout**, superseding 29_UI_LAYOUT_REVISION_v1.3.14 as
> the chain head (F62's finale gating stands untouched). Companion narration
> amendment of the same owner round: `30_NARRATION_REVISION_v1.4.3.md`.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** the engine-hall scene ("inside the browser") typography only.
Web-scene illustrations, station glyphs, and Chapter 01 unchanged.

---

## 1. Owner directive (round 16)

> "Trong inside the browser cho chữ trong mấy block to lên tí (ví dụ decoder, tokenizer, style, layout,…) và các chữ trong các phần tử của khung tối đen đen cho kích thước to lên chút"

Two parts: **D2a** = station block names (Decoder, Tokenizer, Style, Layout…),
**D2b** = the text inside the dark workbench's elements.

## 2. F69 — station block names (D2a)

- Baseline: station names render via `drawName` at `labelSize ?? 15` world px
  (`generic-renderer.ts`); at the engine-zoom 0.5205 that is ≈7.8 screen px —
  the small print the owner flagged. Only the Network Port had an override (12).
- Measured before touching anything (worst-case pairs, Quicksand 700):
  "HTML Parser" + adjacent slots — the widest 18 px label is "JavaScript
  Engine" ≈159 world px; the closest station pair needs 131.5 px < 170 px
  minimum pitch → no label-to-label contact at 18.
- Applied, explicit per PartSpec in `scenes/04-engine-hall.ts` (the renderer
  default stays 15 for everyone else — Chapter 01 untouched):

| station | before | after |
|---|---|---|
| Decoder, Tokenizer, HTML Parser, JavaScript Engine, Style, Layout, Paint, Rasterizer, GPU, Workbench | 15 (default) | **18** |
| Network Port | 12 | **14** |

## 3. F70 — workbench element text (D2b)

Owner approved a uniform **×1.2** with an auto-fallback rule (any overflowing
site dials back to its largest fitting size and is disclosed). 15 sites touched
in `src/rendering/parts/web-parts.ts`:

| site | line | before → after |
|---|---|---|
| residue decode char-lines (b11 opening) | 798 | 15 → **18** mono |
| residue token hint row | 810 | 13 → **16** mono |
| bytes hex grid cells | 914 | 18 → **22** mono |
| decoded characters | 939 | 19 → **23** mono |
| token chips | 977 | 14 → **17** mono |
| decode char-lines (stageChars) | 991 | 15 → **18** mono |
| DOM node labels | 1080 | 13 → **16** mono (700) |
| DOM script-link hint | 1094 | 13 → **16** mono |
| css-fetch link tag | 1151 | 14 → **17** (800) |
| CSSOM rule text | 1186 | 14 → **17** mono |
| parser-paused note | 1210 | 14 → **17** (800) |
| js-mutated hint | 1247 | 15 → **18** (800) |
| render-tree labels | 1300 | 13 → **16** mono (700) |
| blueprint size tags | 1373 | 12 → **14** mono |
| paint receipts | 1426 | 14 → **17** mono |

Fit math (spot): token chips are width-driven from the bench (chipW ≈262 →
longest token ≈150 at 17 px ✓); the single decode script line ≈567 px < 1084 px
bench ✓; hex cells 22 px in 48 px cells ✓; CSSOM cards measure-then-draw
(R18/F30 discipline) so they grow with the text, and at 17 px still end clear
of the bench's right edge (verified in render).

**Auto-fallback triggered: NONE.** All 15 sites hold at the approved sizes
(render sweep below).

## 4. Approvals (ask_user, round 16)

| id | chosen |
|---|---|
| `f69-station-labels` | **as-measured** (15→18, netport 12→14) |
| `f70-bench-text` | **scale-120** (×1.2 with disclosed auto-fallback) |

## 5. Verification

| check | result |
|---|---|
| `npm run build` (tsc --noEmit + vite) | PASS |
| `npm run smoke` | PASS — byte-identical structure (no beat/timing/travel edits) |
| ui-check full re-render (60 frames) vs frozen baseline | the **30 engine-hall frames** all changed (the point of the round); the **30 web-scene frames byte-identical** — includes every F62 contract guard (waiting/landing/full), F60's CPU park, F58's route, F57's NIC dwell (zero narration/motion edits this round) |
| visual sweep `snapshots/r16-after.png` (12 cells: decode, residue, dom, css-fetch, cssom, js-pause, js-run, render-tree, blueprint, paint, decode-end, web park) | no clipping, no label collisions, receipts/boxes/cards contain their text |
| baseline re-pinned (`snapshots/uicheck-baseline.md5`) | `md5sum -c` → 60/60 OK |
| vi census (pattern grep + NFC) | clean on all touched files |

## 6. What did NOT change

Station badge glyphs (HTML/CSS/JS at 20–21 px already), the outer browser-window
illustration text (address bar, Waiting state, mini page — rect-scaled, outside
the owner's scope), the CPU → GPU divider tag, engine-hall geometry/zones,
Chapter 01 (its stations keep the 15 px default), and every beat's motion.
