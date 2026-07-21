# Chapter 02 — UI/Layout Revision v1.3.6 (Owner Feedback Round 6)

> ⚠️ **ERRATA (v1.3.7):** **F41** (NIC arrival flash) is replaced by **F45** in `21_UI_LAYOUT_REVISION_v1.3.7.md` — owner wanted a steady brightening *plus* the packet itself dwelling at the NIC. **F38's** blanket "every stage dies in its own tail" is refined by **F43/R19**: only collision-real content still hides, and all birth windows are back at the historic calm pace. Zero-residue at a new dot remains the law.

**Status:** applied & verified · **Date:** 2026-07-20
**Scope:** `chapter-02-browser-loading` + shared viewer skin. Frozen docs 01–09 untouched; Chapter 01 content files untouched (its *behavior* identical — smoke byte-identical).
**Builds on:** v1.3.5 (17_) + v1.4.0 (18_).
**Change classes touched:** animation timing (F38), animation feedback (F41), style (F40), layout fence (F39) — **every one explicitly ordered by the owner this round** ("Sửa lại toàn bộ hiệu ứng chuyển cảnh… fix triệt để", "timeline xanh lá nên dài dài ra", "Nó phải hình tròn như các chấm khác", "di chuyển đến NIC thì NIC phải nháy blur 1 tí xíu").
**Approved via ask_user:** pkg-r6-code = yes; ping-scope = **nic-only** (owner's literal scope, honored exactly).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

---

## 1. Owner complaints (round 6, verbatim paraphrase)

- **L-49** The old block is STILL dimly visible at the new dot (screenshot: tokenize dot showing the faded hex grid). "Sang chấm xanh lá tiếp theo thì toàn bộ phần tử ở chấm cũ biến mất mới hiện chứ? … Cái lỗi này t đã nói lần trước rồi, sao giờ vẫn phải để nhắc? Fix triệt để."
- **L-50** The green timeline is too small — make it long like the yellow one.
- **L-51** Yellow dot #10 is not a circle — it's stretched wide into an oval. It must be round like the others.
- **L-52** When (the packet) moves to the NIC, the NIC should flash a little.
- **L-53** (narration) Vietnamese translation is machine-stiff, some words unreadable → shipped in **20_** (v1.4.1).

## 2. Measured findings

| # | Evidence | Root cause |
|---|---|---|
| L-49 | `v-b10-early` render, owner's Ảnh 1 | Two stacked causes. (a) v1.3.5's F33 made hand-overs sequential **inside the new beat's head** — old block (bytes ghost `frac/0.15` at ≤ 0.6 α) still RENDERS at the new dot, exactly what the screenshot shows. My round-5 misread of "biến mất hẳn thì mới sinh": I serialized the fade and the birth; the owner wants the fade to be **done before the dot changes**. (b) *latent root cause discovered this round:* `drawWorkbench` hardcoded `frac = eio(beatElapsed/3000)` — a 2800 ms beat (cssom, js-pause) caps at frac 0.867, so **any tail fade could never complete** there; a 3200–3600 ms beat parks at frac 1 early. Fixed by feeding real per-beat durations (`durAtBeat`). |
| L-50 | `index.css` | Gold `.dot` 9 px, gap 7 px → 12 stops = **185 px** strip. Green `.cdot` **6 px**, gap **3 px** → 12 cdots = **105 px** (57 % of gold). Literally "bé tí". |
| L-51 | `index.css` `.dot.group` | v1.3.5's F37 pill: `width 18px · height 9px · radius 5px` — at this scale the eye reads an **oval**. The round-5 "rất khác biệt" brief actually asked for *border/color* difference, not shape difference. |
| L-52 | `03-hardware.ts` + `web-parts.ts` | `response` beat's `active: 'ram'` → NIC renderer ran with `active=false` (alpha 0.55, no glow) while the packet literally passes through its position (260, 805). No arrival feedback existed anywhere. |

## 3. Fix package

### F38 — zero cross-beat residues ("fix triệt để"; supersedes F23, F28b, F28e, F33's ghost architecture)

**New rule R19 (Constitution, recorded here like R18 in 15_):** *No cross-beat residues.* Every stage's content **fades out during the tail of its own beat** (`tailA`: 1 → 0 over frac 0.82 → 1.0, ≈ 380–650 ms real time per beat). The next beat opens on an **empty bench** and its content fades/morphs in from frac ≤ 0.05. Live story arcs are the only allowed cross-beat content — the DOM tree (b11→b16) and its full-alpha morphs (F28a settle, mutation) are *continued*, never handed over as dim leftovers.

Also encoded in `assemble.ts`: `durAtBeat` per-beat durations → normalized `frac` (root cause (b) above).

| Stage (beat) | Before (F33-era) | After (F38) |
|---|---|---|
| bytes (b09) | held to beat end; ghosted ≤0.6 α into b10 head (0–0.15) | dies in own tail 0.82→1.0 |
| chars→tokens (b10) | byte ghost 0–0.15 **visible at the dot** (owner's Ảnh 1); lines 0.17–0.29; chips 0.19–1.0 | empty bench; lines 0.02–0.12; chips 0.05–0.83; everything dies here |
| dom (b11) | chips ghost 0–0.22 (≤0.8 α); tree from 0.24; tokens hint static | hint dies in tail; tree from 0.04; **tree is the live arc — no fade** |
| css-fetch (b12) | CSS parcel + link pulse **hard-cut at seam** | both tail-fade |
| cssom (b13) | settle 0–0.35; cards 0.35–1.0 (truncated ≈0.87 by the /3000 bug); ghosted ≤0.85 α into b14 head | cards stack 0.35→0.75 (fully, dur-normalized); cards + heading die in tail |
| paused (b14) | card ghost 0–0.24; regrow 0.26–0.56 | empty bench; regrow 0.04–0.30; script ring dies in tail |
| mutated (b15) | `dim` 0.55 → 0 **snapped at seam** | dim settles out over the first 8 % |
| render-tree (b16) | old DOM parked at **0.12 α for the whole beat**; render nodes ghosted into b17 (0–0.26, ≤0.9 α) | settle fades DOM 1 → **0** by 0.38; nodes 0.42–0.82 die in tail |
| layout (b17) | render-tree ghost 0–0.26; blueprint from 0.3; **ghosted into b18 at 0.85→0.16 α for the whole paint beat (F23)** | blueprint 0.03–0.78 dies in tail; **F23 leftover strip deleted** |
| paint (b18) | blueprint strip 0.16 α beside receipts; receipts ghosted into b19 (0–0.2, ≤0.85 α) | clean bench; receipts **centered** (were right-anchored for the strip), stack 0.03–0.75, die in tail |
| raster (b19) | receipts ghost 0–0.2; pixels from 0.22; ghosted into b20 (0–0.28, ≤0.85 α) | pixels 0.03–0.81 die in tail |
| composite (b20) | raster ghost 0–0.28; layers slide 0.3–0.68; snap 0.68–1.0 | clean bench; slide 0.04–0.44; snap 0.44–0.84, holds to the scene cut |

**Superseded architecture (recorded, not erased):** v1.3.2/F23 (blueprint settles into a dim side strip), v1.3.3/F28b-F28e ("hand-over as a fading ghost in the next beat's head"), v1.3.5/F33 ("sequential inside the new beat's head"). All three eras kept *something* visible across dots; the owner's two complaints in a row establish the final contract: **nothing crosses alive**. F28a/F28d's width-settles of the *live* DOM stay (they are morphs, not residues).

### F39 — green timeline at gold scale (layout fence)
`.cycleDots .cdot` 6 → **9 px**, `.cycleDots` gap 3 → **7 px**, padding 6px 12px → 7px 14px. The Ch-02 engine strip: 12 cdots → **185 px ≈ the 185 px gold row** (identical 16 px pitch). The component is shared with Ch-01's deep scene, so Ch-01's green strip scales identically — intentional: one visual language (owner's own model).

### F40 — group stop is round again (style)
`.dot.group`: 18×9 px radius 5 px → **9×9 px radius 50 %**, keeping the 1.5 px orange ring `rgba(251,146,60,0.9)` + orange glow + done/active variants. Circular like every stop; still the loud orange cousin F37 wanted.

### F41 — NIC arrival ping (animation feedback; owner scope: NIC only)
`drawNIC` computes `pulse = (1 − dist(spark, nic)/90)²` each frame. While pulse > 0.01: extra `glow` (r 110, α 0.4·pulse) + one expanding ring (r 38→64, α 0.55·pulse). Exactly "nháy blur 1 tí xíu" when the response packet sweeps (260, 805); no other hardware touched, Chapter 01 untouched (NIC kind exists nowhere else).

## 4. Verification

- `npm run build` (tsc + vite) — **PASS**; `npm run smoke` — **PASS** (ch1 3585 ~59.9 s identical; ch2 4304 ~71.9 s identical, seams OK).
- Owner-size canvas renders: `v-b10-early` (the exact Ảnh-1 view — **zero hex cells**, content just being born), `w-b10-mid` (chips stacking on an empty bench), `v-b19-early` (no receipts ghost), `v-b07-nic-ping` (NIC flaring as the spark reaches it), `u-b00…u-b20` re-run across the board.
- Vietnamese diacritics grep — 0 hits.
- **DOM-only items pending owner eyeball after reload:** green strip length vs gold, round orange group dot.

## 5. Errata (banners placed in the superseded docs)

- **14_ F23** (blueprint settles into a dim left strip inside paint) — superseded by **F38**: the strip was a permanent cross-beat residue.
- **15_ F28b/F28e** (hand-over ghosts re-drawn at the next beat's head) — superseded by **F38** (zero residues; the DOM live arc stays).
- **17_ F33** (sequential scheduling inside the new beat's head) — superseded by **F38** (the fade belongs to the old beat's tail). 17_ F37 — amended by **F40** (shape: round again; ring and glow kept).
