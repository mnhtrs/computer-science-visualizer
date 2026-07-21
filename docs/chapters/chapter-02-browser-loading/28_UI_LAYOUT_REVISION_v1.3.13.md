# Chapter 02 — UI/Layout Revision v1.3.13 (Owner Feedback Round 13)

> ⚠️ **ERRATUM (v1.3.14):** by `29_UI_LAYOUT_REVISION_v1.3.14.md` — the finale reveal is now gated on the delivery (F62: cross-fade [0.40→0.72], grow [0.40→1.00] of the screen beat; sample `v-b21-grow` retired). F60/F61 from this document stand untouched.

> ⚠️ Standing: this document amends v1.3.12 (27_). Frozen docs 01–09 untouched; Chapter 01 untouched.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` — web-scene spark path (to-engine endpoint), engine-hall infrastructure (new `zone-divider` kind). Frozen docs 01–09 untouched; Chapter 01 untouched.
**Change classes:** spark choreography (endpoint change) + scene annotation (boundary hairline) — **owner-ordered this round**, after the technical debate the owner explicitly demanded ("PHẢN BIỆN VÀ TRANH LUẬN VỀ CÁCH HOẠT ĐỘNG XEM NÀO? ... CÁCH TƯ DUY NÀO ĐÚNG?"). Approved via ask_user (endpoint = **cpu-is-door** · boundary = **draw-divider**).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

## §1 Owner report & the demanded debate

- **L-70** (to-engine tail): "ĐCM SAO NÓ ĐI VÀO CPU RỒI BƯỚC SAU CÒN NHẢY LÊN BROWSER LOADING THẾ?" — after parking on the CPU, the spark climbed back up to the browser window; that reads as a second, nonsensical loading-screen visit. And: which model is right — "arrive at the CPU = enter the inside browser engine", or "CPU first, then jump up to the loading browser, then enter"?
- **L-71** (engine-hall topology): "Nếu câu trả lời là CPU thì tại sao trong CPU lại có GPU để render? Ko thì inside browser phải có ranh giới giữa CPU và GPU chứ gộp lại dễ hiểu nhầm lắm?"

## §2 The debate, answered — the model the visuals must encode

1. **The loading screen is not a processing stop.** "Waiting for best-cats.example…" is passive chrome. The bytes sit in RAM and are worked on by the CPU — the browser engine is SOFTWARE, and software only exists as something the CPU executes (Chapter-1 continuity: fetch → decode → execute). Reaching the CPU IS reaching the engine's door; cutting into the inside scene IS the camera zooming into the work the CPU is doing. Hence: **arrive at the CPU = enter the inside browser engine.** The rival model fails twice: (a) the page cannot exist before the pipeline builds it — the entire rest of the chapter IS that build, and the window only changes at the finale — so a post-CPU visit to the page implies the page pre-exists its own construction; (b) double-visiting one landmark inside a single beat is choreographic noise, which is exactly what read as wrong to the owner.
2. **The pre-CPU loading visit (F58) stays — as a narrative ARRIVAL marker, not a processing stop.** The thing the page has been "Waiting for…" through 7 beats is precisely these bytes. Arrival announced at the page → processing handed to the CPU → the cut takes us inside. Order valid: house → workshop.
3. **"GPU inside the CPU" is a misread — the GPU station is the pipeline's OUT-GATE, verified in code:** `gpuEngine` is declared `kind: 'gpu'` (a chip pictogram) while the other ten parts are `kind: 'station'` (work desks); the composite beat's spark travels raster (PATH_B 12) → GPU (13/14) — the data crosses out of CPU-land inside that very beat; and the finale re-enters the physical world AT THE GPU CHIP (740, 805) before the page pops in the window. The boundary existed narratively (the frozen line "the painted layers go to the GPU… Same GPU you met in Chapter 1") but was never DRAWN — L-71 is right that the hall visually lumps them together. (Honesty footnote: modern browsers can raster on the GPU too; the chapter's frozen model places the boundary at the compositor — the right depth for this story.)
4. **Owned up:** F58 kept the legacy "engine door = window center" tail — that was the author's miss. The contradiction the owner caught is removed by F60 below.

## §3 F60 — to-engine ENDS at the CPU; the engine-door anchor deleted

- Beat `to-engine`: `travel: { from: 22, to: 24, holdAt: { index: 24, from: 0.5, to: 0.77 } }` — the CPU is now the LAST anchor of the slice, so the anchor distance-fraction fA = 1: the spark leaves RAM, crosses the loading screen at frac ≈ 0.25 (AR marker kept), arrives at the chip at frac 0.50, and **remains parked on it, fully lit, to the beat's end** — measured (590, 805) at frac 0.52 / 0.75 / 0.90. `h.to` stays 0.77 as a NaN guard: at `h.to = 1.0`, `update.ts` divides by `1 − h.to` = 0. Duration 2400 ms untouched (M-truth).
- `PATH_A`: the engine-door anchor (470, 430) **DELETED** — it duplicated the finale rest point's coordinates and only ever fed the climb. GPU 26 → 25, finale rest 27 → 26. The path is now 27 points.
- Beat `screen` travel `26→27` → **`25→26`**; recap `rest: { at: 26 }` (still shadowed by `effect: 'loop'`, hygiene only). Smoke's computed seam line is back to `engine → web (seam entry path[26])` — verified.
- The scene cut at the 8 → 9 seam is the entry: the engine hall is what the CPU is doing.

## §4 F61 — the CPU/GPU boundary, drawn

- New generic infra kind **`'zone-divider'`** in `infrastructure-renderer.ts` (dashed hairline + optional `label`; unknown-kind ignore keeps every other scene untouched — Chapter 01 ships no such items, verified).
- The engine hall gains `cpu-gpu-boundary`: **x = 1075** (the exact mid-gap between Rasterizer 970 and GPU 1180), **y 800 → 902** — the top stays 7 px below the fly-under spark route (y = 793); the `CPU -> GPU` label (ASCII, 12 px, Quicksand 600 — the same face as the infra `Desktop` tag) sits below the line at y = 918, 30 px off the scene floor (bbox maxY 960). Measured free of collisions: bottom-station names sit above their stations, the fly-under clears the line top, the GPU's own name clears the label.
- The composite spark **CROSSES the hairline along the y = 850 rail** — measured: x = 993 at frac 0.30 (left of the line, CPU-land), x = 1167 at frac 0.75 (approaching the chip, GPU-land). Crossing the line IS the hand-off to the GPU.

## §5 Verification

- `npm run build` (tsc + vite) PASS; `npm run smoke` PASS — ch-01 3585 frames ≈ 59.9 s byte-identical; ch-02 4304 frames ≈ 71.9 s; seams `web → engine (seam entry path[0])` / `engine → web (seam entry path[26])`; 23 beats × 3 snapshots.
- `scripts/ui-check.ts`: `w-b08-door` retired → **`w-b08-endpark`** (frac 0.9 must STILL sit on the chip — the L-70 regression lock); new **`w-b20-divider`** (hairline + tag present inside the composite window). 56 samples render clean.
- Proof: `snapshots/r13-after.png` — row 1: loading-screen visit (477, 475) → arrived (590, 805) → mid-park → end-park, no climb anywhere; row 2: composite crossing the hairline; the finale re-entering from the physical GPU chip beside the CPU. Full-res `snapshots/r13a-b20-slide.png`: hairline + `CPU -> GPU` legible at the owner's 775×536 engine stage.
- Vietnamese census on edited code files, this doc and the state file: zero broken glyph clusters, zero double backslashes; straight quotes; no new em-dashes (doc dashes are plain hyphens); YAML frontmatter parses.

**Supersedes:** v1.3.12 (27_) for layout — F58's route is amended AT ITS TAIL: the post-CPU climb to the window is removed and the engine-door anchor deleted (anchor indices ≥ 25 in 27_ read −1 for the finale rows: GPU = 25, rest = 26); the RAM → loading-screen → CPU front half stands exactly as round 12 approved it. F59 (the link pulse gate) stands untouched.
