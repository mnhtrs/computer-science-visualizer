# Chapter 02 — UI/Layout Revision v1.3.3 (Owner Screenshot Round 3)

> ⚠️ **ERRATUM (v1.3.6):** **F28b / F28e** (hand-over ghosts re-drawn dimmed at the next beat's head) are superseded by **F38** in `19_UI_LAYOUT_REVISION_v1.3.6.md` — owner round 6: zero cross-beat residues; the old block must die in its own beat's tail. F28a's width-settle of the *live* DOM tree and the F28 finale growth remain in force (they are morphs/continuations, not residues).

> **ERRATA (added with v1.3.4 / 16_):** **F26b was revoked by the owner** — flat gold dots must not re-skin green merely while inside the engine scene. The canonical resolution is F32 (16_UI_LAYOUT_REVISION_v1.3.4.md): engine beats collapse into one yellow stop; the green micro-timeline appears only *inside* it, exactly Ch-01's pattern. Visual contract refined: **green = entered interior only.**

**Status:** applied & verified · **Date:** 2026-07-20
**Scope:** `chapter-02-browser-loading` only. Frozen docs 01–09 untouched; Chapter 01 untouched (git count = 0).
**Supersedes:** nothing content-wise; builds on v1.3.2 (14_), keeps the Layout Constitution R01–R17 (12_) and adds rule **R18**.
**Change classes touched:** layout (fence), **style** (F26b) and **animation/beat choreo** (F28) — the last two sit OUTSIDE the layout change-class fence and were **explicitly ordered by the owner in this round** ("sửa lại cho mượt như layout responsive", "phải có hiệu ứng to dần", "tại sao không xanh lá như chapter 1 … sửa nếu có sai sót"). Recorded openly, like F23/F24 in v1.3.2. Beat count, beat durations, narration, scenes: **unchanged** (smoke: 4304 frames ≈ 71.9 s, same as v1.3.2).

---

## 1. Owner complaints (round 3, verbatim paraphrase)

Two screenshots were attached; only **one file arrived** (the engine one, beat 13). The Ảnh-1 items were reproduced and confirmed with our own renders at the owner's stage sizes instead (836×570 / 775×536).

**Ảnh 1 (web scene):**
- L-27 "waiting for…" text too small.
- L-28 Yellow IP text misaligned with the black block — "make the block wrap the text; do you know how to bring the padding idea from HTML into canvas?"
- L-29 DNS "logo" (the book glyph) unreadable — redesign clearer.

**Ảnh 2 (engine scene):**
- L-30 Icon vocabulary: JavaScript should be **JS**; HTML parser as **HTML**; Style — **CSS** or keep? (owner: "tự phản biện" — assistant to reason it out).
- L-31 Timeline 13→14: needs a graph-shrink effect like the responsive green layout shrink; review ALL dots for smooth shrink behavior.
- L-32 Jumping between dots makes graph nodes vanish — bug, missing, or feature? Reason it out, fix if needed.
- L-33 "INSIDE THE BROWSER ENGINE" tag should be center-aligned.
- L-34 Station blocks (Style/Layout/Paint/…) should be bigger, like the GPU block.
- L-35 Why isn't the timeline green inside the Browser Engine like Ch-1's? What is the condition for green? Analyze, fix if wrong.
- L-36 Rasterizer pixels look random — they should resemble the frame the GPU will show.
- L-37 Composite→screen: the "All About Cats" window grows abruptly, needs a gradual grow; and its button + paragraph sit too high leaving an empty band at the page bottom.

## 2. Measured findings (before the fix)

| # | Evidence | Measurement |
|---|---|---|
| L-27 | `drawBrowserWindow` loading branch | `Waiting for…` at **14 px** world ⇒ ≈ **8.1 px** on the owner's stage (zoom 0.5783). |
| L-28 | `web-parts.ts` service box | **Real bug:** `ctx.measureText(ipLabel)` ran *before* setting the 14 px mono font — it measured with the stale 11 px icon font (≈72 px) while drawing ≈109 px ⇒ text overshot the pill **≈5.5 px on each side**, striking its border (see `u-b03` pre-fix). Pill inset in the box also only ~8 px by luck, not by design. |
| L-29 | same | Book glyph 34×32 with 11 px microtype ⇒ ≈6 px on stage ⇒ illegible. |
| L-31 | stages | Width transitions teleported in one frame: b12→b13 tree `1.00w → 0.52w` (**Δ≈501 px** world ≈260 px screen); b13→b14 back; b15→b16 `1.00w → 0.45w` **plus** alpha 1→0.18 instantly **plus** the `<script>` node silently dropped. |
| L-32 | stages | Two parts: (a) *feature* — every beat builds its own content (`frac`), so scrubbing/jumping restarts that beat's build; deterministic by Constitution 02 §15. (b) *real bug* — b11 ended with **6** nodes, b12 reopened at **3**: body/h1/p were retracted then re-grown (history ran backwards). |
| L-33 | CSS | `.sceneTag` inherited `text-align: left`; the 1-line string wraps to 2 lines when the right zone < ~240 px ⇒ second line hugged the left edge; the tag also hugged the row's right edge. |
| L-34 | `drawStation` vs `drawGPU` | Station boxes 132×58 with glyphs filling only ~25–35 % of the area; the GPU's grid fills 78/104 ≈ **75 %** of its chip. |
| L-35 | `Viewer.tsx` | Green appears **only** for `chapter.program` micro-steps: `.cycleDots` renders iff `prog && scene === deepScene` (Ch-1's CPU cycle). Ch-2 has no program ⇒ never green. Not a logic bug — but the "you are inside" signal is missing from Ch-2's timeline (only the orange tag says it). |
| L-36 | `pageColorAt` vs `drawMiniPage` | Button band v 0.70–0.82 while the drawn button lived at v 0.55–0.66 (**mismatch**); paragraph zone was `%11` speckle noise, not text lines ⇒ looked random (`u-b19` pre-fix). |
| L-37 | `drawMiniPage` + finale | Content ended at 0.66h ⇒ **34 % dead band** at page bottom (`u-b22` pre-fix). Finale pop: scale 0.90→0.96 over 900 ms — effectively full-size immediately after the 450 ms scene fade. |

## 3. Verdict on L-32 ("nodes die when I jump dots")

**Feature + one real bug.** Progressive reveal is constitutional: a paused/scrubbed beat legitimately shows its start state, because building that content *is* the beat. Retraction is not: ending b11 at 6 nodes then opening b12 at 3 rewrote history and read as "nodes disappearing". Fixed structurally (F28c-continuity) — growth now never runs backwards, and the narration "the Parser doesn't wait; it keeps reading" is *literally* visible: node orders 4–6 grow during the fetch beat exactly where b11 stopped.

## 4. Fix package (approved via ask_user: yes / both / yes / yes)

### F25 — web scene (layout class)
- **F25a** (L-27): `Waiting for…` 14 → **18 px**.
- **F25b** (L-28): font is now set **before** `measureText`; HTML padding model — content box + **12 px inline padding**; pill sits ≥8 px inside the box on every side. Enabler: box **w 150 → 156, h 110 → 118**, interior re-banded (icon −37..+3 / churn +14 / pill +27..+51). Rail tips realigned to the wider wall (1110 → **1102**, = the path's door points; R10).
- **F25c** (L-29): book glyph 34×32 → **52×40**, honest 16 px lettering (`A→` | `IP`), strokes 1.5 → 2 px; server disks 40 → 44 wide for symmetry.

### F26 — chrome (layout + owner-ordered style)
- **F26a** (L-33): `.sceneTag { text-align: center }`; `.ctl-right { justify-content: center }` — the tag centers itself in its zone.
- **F26b** (L-35, *style class — owner-ordered*): while the playhead is inside a sub-scene, the flat timeline adopts the green "you are inside" skin (`.dots.deep`) — same signal Ch-1's `.cycleDots` gives inside the CPU. Semantic difference preserved: Ch-1's green marks *micro-steps of a program*; Ch-2's marks *scene membership* (no program exists there).

### F27 — stations (layout class)
- **F27a** (L-34): station box 132×58 → **148×66** (gaps re-verified: 22 px top row, 62 px bottom row, 24 px under the east-corridor leg); pictograph glyphs at **×1.85** (fill now matches the GPU grid); name dy 40 → 42; `❚❚ paused` moved **under** the name label (the band above the parser box belongs to Network Port's own label — collision caught in render, R01).
- **F27b** (L-30): word badges per real-world dev vocabulary — HTML Parser → **HTML**, JS Engine → the yellow **JS** badge, Style → **CSS** (assistant's call: completes the web-pillars trio; swatch retired; `short` codes stay dormant). Badges drawn unscaled (R17).

### F28 — seams & finale (*choreo class — owner-ordered*)
- **F28a** (L-31, width settles — F23 language): cssom beat settles the tree `1.00w → 0.52w` over frac 0–0.35 with the card column following; paused beat regrows `0.52w → 1.00w` while the dim eases 1 → 0.55; render-tree beat settles the background DOM `1.00w → 0.45w` + alpha `1 → 0.12`, keeping its end-of-b15 state (script node, mutated label) while settling.
- **F28b** (L-31 review sweep, hand-over ghosts): chips → dom, render tree → layout, receipts → raster, raster page → composite — each hands over as a fading ghost in the next beat's early frac instead of cutting. bytes → chars uses a **short crossfade only** (cells 0.5 alpha, lines ramp in — full-overlay ghosts read as glyph-on-glyph mud; measured and tuned, see §5).
- **F28c** (L-32 bug part): b11 now grows **only orders 1–3** (html/head/link); b12 continues 4–6. No retraction, contiguous growth across the seam.
- **F28d** (L-37a): web finale grows the page **0.55 → 0.96 over 2400 ms** of b21 (alpha ramps in 500 ms). Growth keyed to the *first* finale beat only — later beats rest at full size (a re-shrink regression at b21→b22 was caught in verification and fixed before delivery).
- **F28e** (L-36 + L-37b): mini-page rebalanced on one shared `MINI` metrics table — header 0.20h, paragraph center 0.38h, button 0.68–0.80h (**bottom margin 0.20h = header height**; dead band gone). `pageColorAt` derives from the **same** table: gold header + dark title stripe, three-“word-group” paragraph line, pink button + white label stripe. The raster picture now *is* the frame the GPU will show.

## 5. Regressions caught in verification renders (fixed before delivery)

| Render | Caught | Fix |
|---|---|---|
| `v-b21-full` | finale growth re-ran at b22 start (beatElapsed reset) → page re-shrank/blinked | growth keyed to first finale beat only (F28d note) |
| `v-b14-early` | `❚❚ paused` (raised with the taller box) collided with Network Port's label | tag moved under the station's name label (F27a) |
| `v-b10-early` | full-overlay byte ghost + incoming char lines = glyph-on-glyph mud | short crossfade: cells only, lines ramp (F28b) |
| `v-b19-early` | receipts ghost window 0.30 read as present-tense content | window → 0.22 with comment |

## 6. Constitution addendum

- **R18 — measure in the font you draw in.** Always set `ctx.font` *before* `ctx.measureText`, and size pill/badge boxes as `text + padding`, never by luck (this is literally the HTML box model; L-28 was a stale-font measurement, not a geometry error).

## 7. Verification

- `npm run build` (tsc + vite) — **PASS**.
- `npm run smoke` — **PASS**: ch1 3585 frames (~59.9 s) untouched; ch2 4304 frames (~71.9 s, identical to v1.3.2 — no timing changed), seams OK, 3 snapshots × 23 beats.
- 29 renders at the owner's own stage sizes re-audited (`snapshots/u-b00…u-b20` re-rendered + `v-b13/14/16/17/19/20-early`, `v-b10/11-early`, `v-b21-grow/full`): IP pill inside box with real padding ✓, book glyph legible ✓, waiting text larger ✓, station badges HTML/CSS/JS ✓, all width transitions settle ✓, ghosts hand over ✓, raster previews the final frame ✓, finale grows ✓, b21→b22 continuity ✓, beat 0 intact ✓.
- Vietnamese diacritics grep — 0 hits.
- DOM-only items (F26a tag centering, F26b green dots) verified by construction; owner eyeballs after reload (same caveat as F21 in v1.3.2).

## 8. Out of scope / disclosed

- Spark trail crossing content (transient FX, animation class beyond this round) — parked since v1.3.1.
- b14→b15 brightness step (dim 0.55 → 1) is the intended "the script rewrote the page" focus flash — reviewed, kept.
- Chapter 01 has never been through a Layout-Constitution sweep; awaiting owner directive (offered).
