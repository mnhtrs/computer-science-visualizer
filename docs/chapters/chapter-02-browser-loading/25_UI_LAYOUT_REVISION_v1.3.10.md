# Chapter 02 — UI/Layout Revision v1.3.10 (Owner Feedback Round 10)

> ⚠️ **ERRATUM (v1.3.11):** by `26_UI_LAYOUT_REVISION_v1.3.11.md` — F50's NIC hold window (0.52→0.60) superseded by F57 (0.52→0.57, ~0.15 s) · web `PATH_A` gained a CPU anchor at index 23 for the to-engine detour (F56) — all anchors ≥ 24 referenced here read +1 in current code. F52/F53 stand untouched.

> ⚠️ Standing: this document amends v1.3.9 (24_). Frozen docs 01–09 untouched; Chapter 01 untouched.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` — story display strings (decode/tokenize), decode two-zone layout, composite stage sequence. Frozen docs 01–09 untouched; Chapter 01 untouched.
**Change classes:** layout geometry (decode zone widths) + content layout (line structure) + animation sequence (composite) — **owner-ordered this round** ("Cái p.textContent phải ở cùng dòng với += … chứ? … phải phóng to cái block xanh dương nhạt ra theo width 1 chút nhưng đừng kéo quá nếu ko phần p.textContent sẽ bị tràn viền" · "Khi 2 layout chồng lên nhau thì cái pixel của rasterizer phải mờ dần biến mất thì khi đó cái pop up all about cats từ GPU mới hiện ra chứ?"). Approved via ask_user (composite-seq = **pixels gone exactly at 68 %**; decode-wrap = **soft-wrap + hex zoneW 0.52**).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

## §1 Owner report

- **L-64** (green dot 2 = tokenize): `p.textContent` must sit on the same line as `+= "…"`. Also: widen the light-blue hex block horizontally "1 chút" — but not so much that the script line overflows the big dark bench.
- **L-63** (composite): when the 2 layers stack, the rasterizer's pixels must fade away completely — the "All About Cats" pop-up from the GPU appears only then.

## §2 F52 — one-line script at dot 2 · soft-wrap at dot 1 · hex widened, never overflowing

Measured constraint set (world space: bench `WORKBENCH.w = 1084`, inner `1044`):
- The one-line statement `<script>p.textContent += " They own the internet."` is **49 chars ≈ 441 px @ 15 px mono** — fits the tokenize bench (1044) with ~60 % spare: no overflow. Honest DOM API from F48 unchanged; leading space kept (tree label parity).
- At **decode** the chars live in a two-zone layout beside the 11×6 hex grid at **19 px mono**: the one-liner needs ≈ 559 px while the zone affords ≈ 485 — physically impossible to have BOTH a wider hex grid AND an unwrapped one-liner (owner's own constraint: "đừng kéo quá nếu ko … tràn viền"). Approved resolution: decode **soft-wraps the script line editor-style** (`DECODE_LINES`, identical file content, display wrap after `+=`); tokenize renders `CHAR_LINES` with the line intact (5 rows; pitch 24 px, last row 110 < chips at 150 — clear).
- **Hex zone widened** `zoneW 0.46 → 0.52`: cells 42 → 48 world px, grid +63 px (≈ +33 px on the owner's stage) — "kéo rộng 1 chút". Remaining chars zone ≈ 485 px ≥ the 308 px the longest wrapped line (27 chars) needs — measured no-clip.
- Plumbing: `StorySpec.decodeLines` + `assemble.ts` maps `DECODE_LINES`; `drawBytes` consumes it (F46 residue case 10 inherits automatically — the residue shows exactly what decode showed).

## §3 F53 — composite sequence: layers stack → pixels vanish → pop-up

- F51's persistent dim underlay (v1.3.9) is retired in favor of the owner's final choreography: the raster page dims out from eased-frac **0.22** and reaches **0 exactly at 0.68** — the frame where the 2 layers finish stacking (slide window `(frac−0.3)/0.38`); **then** the crisp page pops (window `(frac−0.68)/0.32`, scale 0.92 → 1.0 + alpha, unchanged from F51). On the linear clock: pixels fully gone at ≈ 0.568, pop begins at ≈ 0.568 — a clean baton hand-off.
- `drawRasterPage` alpha term: `1 − easeInOutCubic(clamp((frac − 0.22)/0.46, 0, 1))`.
- ui-check sample `w-b20-underlay` (lin 0.40) now documents the mid-hand-off: pixels ≈ 24 % under the sliding layers.

## §4 Verification

- `npm run build` (tsc + vite) PASS; `npm run smoke` PASS, structure byte-identical (ch-01 3585 ≈ 59.9 s; ch-02 4304 ≈ 71.9 s; seams intact; 23 beats × 3 snapshots).
- `scripts/ui-check.ts` renders clean — 47 samples incl. `w-b09-jscode` (wrapped script inside the widened two-zone fit) and `w-b20-underlay`.
- Composite proof `snapshots/r10-proof.png`: decode with wider hex + wrapped script (no clip), tokenize one-liner at 49 chars fully inside the bench (beginning and end-of-beat), composite hand-off triptych: pixels dimming under sliding layers (0.50) → pixels gone / page mid-pop (0.66) → full pop (0.90).

**Supersedes:** v1.3.9 §2 F48's six-line split (by F52: five lines, script on one physical line; `DECODE_LINES` carries the decode wrap) and v1.3.9 §5 F51's persistent underlay (by F53's fade-to-68 %). Everything else in 24_ stands (F49 paint set, F50 dwell ~0.24 s).
