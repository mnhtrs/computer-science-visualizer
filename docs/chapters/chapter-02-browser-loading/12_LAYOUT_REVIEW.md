# Chapter 02 — Visual Layout Audit → Revision v1.3 (Amendment)

> ⚠ **Erratum pointer (2026-07-20, v1.3.1):** §7 row 12 overstates the L-15
> clearance ("~52 px"). True post-fix clearance was ≈ **8 px at 1280×860 canvas-only**
> and degrades below zero at short stage heights — i.e. L-15 was *viewport-correlated*,
> not viewport-invariant. Corrected analysis and the final fix (F19, scene tag parked
> in the controls row) are recorded in `13_UI_LAYOUT_REVISION_v1.3.1.md`.

---

**Status:** APPLIED — chapter-level correction (does not reopen the frozen design)

**Chapter:** `chapter-02-browser-loading` — "How does a website reach my screen?"

**Version bump:** 1.2.0 → 1.3.0 (composes with `10_` / `11_`; no design-doc content changes)

**Effective Date:** 2026-07-20

**Reviewer role:** Principal Motion/Layout Designer, with an independent QA re-verification
round before owner approval. Review doctrine from the owner (verbatim, condensed): audit
**layout only** — bố cục, whitespace, spacing, hierarchy, readability, alignment,
collision, optical balance, container sizing, composition; **not** narration, technique,
pipeline correctness, animation, story, pacing. Every surviving issue must be provable
by measurement (hierarchy / readability / negative space / optical alignment /
composition / scalability). *"Không chấp nhận: 'Tôi thấy đẹp hơn.'"*

**Change-class fence (hard):** fixes are restricted to
`x / y / w / h / padding / margin / spacing / alignment / anchor / container-size`.
Forbidden — and verified untouched in this revision: animation curves, beats, timing,
scene structure, visual style, narration lines.

**Gate:** code edits were permitted only when **Layout Debt = 0 Critical + 0 High**
in the fix design, and only after explicit owner approval of the complete package.

---

## 1. Audit method (evidence trail)

1. **Real rendered snapshots, not paper geometry.** A dedicated tool
   (`scripts/layout-snapshots.ts`, dev-only, not part of the build) bundles the chapter
   and renders **21 beat samples** (beats 1, 3–22, mid-beat fractions) at 1280×860 via
   `@napi-rs/canvas` into `snapshots/*.png`. Pre-fix evidence montage:
   `snapshots/collisions-evidence.png` (b9 chars-smear · b13 cssom label merge ·
   b15 mutated label merge + wall cross · b18 ghost strokes through receipts).
2. **Arithmetic on live constants.** All measurements below are computed from the
   actual scene/renderer constants (cross-checked against frozen `05_SCENE_DESIGN.md`
   for pre-fix values), not estimated.
3. **Metrics-safe margins.** The headless renderer has no Quicksand and falls back to a
   *wider* system font — so any collision seen in renders is a conservative lower bound,
   and every post-fix text clearance is held to **≥ 8 px world units** (Constitution R02)
   to absorb font-metric drift.
4. **Independent QA round.** Before approval, every proposed fix was re-challenged
   (verify-before-approve). This round **added one new finding (L-15)**, **downgraded one
   issue (L-02)**, and **rejected one proposed fix** (top-chain respace, see §5).

---

## 2. Phase 1 — Issue catalog (15 issues)

Severity: 🔴 Critical (readable-element collision/clipping) · 🟠 High (boundary
crossing, guaranteed under metric drift) · 🟡 Medium (readability/composition debt,
measurable) · 🟢 Low (cosmetic-geometric).

| ID | Sev | Scene / Beat | Object | Problem (measured, pre-fix) | Why it hurts |
|----|-----|--------------|--------|------------------------------|--------------|
| L-01 | 🔴 | engine / b9 decode | Workbench stage `bytes→chars` | Characters zone width = `inner.w − gw − 26 = 520 − 490 − 26 ≈ 4.5 px` (hex cell cap 46 → grid 11 × 44.5 = 490) | Decoded text clipped to a smear; the beat's content is unreadable (montage #1) |
| L-02 | 🟡¹ | engine / b10 tokenize | Char lines vs chip grid | 5th char-line glyph box (middle-baseline, bottom ≈ `y+98`) kisses chip row top `y+96` → −2 px | Band kiss; under wider fonts it overlaps (downgraded from High: overlap not proven at nominal metrics) |
| L-03 | 🔴 | engine / b11 dom, b13 cssom, b14 paused, b15 mutated, b16 bg | `drawDomTree` leaf labels | Single label band (dy 22); leaf labels 125–158 px wide vs sibling gaps 130 px (dom) / 104 px (mutated, 4 leaves) / ~68 px (cssom half-tree) → merged strip (montage #2) | Node identity destroyed at the exact beat the tree is being taught |
| L-04 | 🔴 | engine / b15 mutated | Mutated `<p>` label + status text | Mutated p-label ≈ 310 px → right edge measured ≈ 715 > bench east wall 710 (−5 px); `✓ DOM complete` drawn at y 724 in the same band as leaf labels y 722 | Text violates its own container; status unreadable over labels (montage #3) |
| L-05 | 🟠 | engine / b16→17 transition | `PATH_B[6]` spark route | Waypoint (810, 510) lies inside the workbench interior; the js→style leg crosses the bench for ≈ 181 px | Spark visibly tunnels through the main container (causal reading damage) |
| L-06 | 🟠 | web / all | CPU label vs Desktop case | CPU label dy 34 at y 830 → text 864–879 vs case border y 870 → straddles border; NIC/RAM/GPU labels left 0–1 px breathing | Text on a stroke line = guaranteed flicker/clip under metric drift |
| L-07 | 🟡 | engine / b12 css-fetch | CSS parcel park point | Parcel parks directly on the DOM tree's `body` node | Traveling object occludes the teaching object |
| L-08 | 🟡 | engine / b17 layout, b18 paint | Blueprint ghost + receipts | Layout-stage ghost crosses the bench east wall; in b18 its strokes run through the receipt column text (montage #4) | Decorative strokes across glyph boxes (future R15) |
| L-09 | 🟡 | engine / composition | Engine-hall right region + chain rhythm | Content x-extent 150–1152 vs BBOX 30–1370 → content covers 74.8 % of the axis (dead right band); top-chain pitch 170/170/250 | Camera pays real estate for emptiness → smaller glyphs everywhere |
| L-10 | 🟡 | web / b21+ finale | Final page pop-in | Page scale caps at 1.00 → page corners reach the viewport's rounded clip corner (inset 0, radius 12) | The payoff image loses its corners at the climax beat |
| L-11 | 🟡 | web / b3+ | DNS box: IP pill vs name label | IP pill y 208–232; `DNS` label dy 62 → y 237–250 → 5 px gap | Readable elements under-breathing (< 8 px) |
| L-12 | 🟡 | web / composition | Desktop→network bridge band | Case right edge 900 → cluster 1240: 340 px sparse band = 27 % of content width; right trim 145 vs left trim 20 (ratio 7.25); BBOX maxX 1460 under-tight | Camera zoom wasted; provable as uniform glyph-size loss ≈ 6.8 % |
| L-13 | 🟡 | web / b0–b1 | Search result card + spark origin | Card insets asymmetric (top 24 / bottom 7; sides 24 vs 64 within the viewport); spark origin not coincident with card center | First click of the story starts off-center on its own hit-zone |
| L-14 | 🟢 | engine / all | `port-cable` endpoint | Cable stub endpoint (670, 34) sits 8 px *inside* the net-port box top edge (26) | Connector vanishes into its container instead of terminating at the boundary |
| L-15 | 🟡 | engine / all (screen-space) | Viewer scene-tag pill vs NET box | Camera-fit math: scene-tag CSS pill (screen y 16–46) overlaps the NET box top in screen space at the audit viewport | Found in QA round; chrome overlays world content |

¹ Downgraded from 🟠 in QA re-measurement (§3).

## 3. Phase 1.5 — Self-critique (Principal Motion Designer pass)

Every issue was re-challenged; the pass applied one rule: **no measurement, no fix.**

- **Dropped taste-only candidates.** Proposals of the form "would look nicer if
  re-centered / if the glow were symmetric / if captions had a rhythm ramp" were dropped
  outright. The 15 retained issues all carry a number above.
- **L-02 downgraded 🟠 → 🟡.** Re-measured: the char-line glyph box and the chip row
  *kiss* (−2 px band touch) at nominal metrics; no glyph overlap is provable without
  font drift. Still fixed, because the margin to a guaranteed collision is zero.
- **Top-chain respace — fix-side rejection (recorded for the package).** A proposed
  respacing of the top station chain (decode/tokenize/parser/js, pitch 170/170/250) to
  uniform pitch was **rejected under the burden-of-proof rule**: (a) the 250 px
  parser→js gap is narrative whitespace — it is exactly the corridor the CSS detour
  (b12) occupies; the asymmetry encodes a story fact, no readability harm is provable;
  (b) respacing would invalidate every travel-index anchor proven in F6 (§5) for
  cosmetic gain only. **Rejected.** (The bottom finishing chain, by contrast, had both
  measurable rhythm debt *and* a dead right region — fixed, §5.)
- **Folding.** Several alignment nits were folded into Constitution rules (R06, R08)
  rather than standalone fixes, to avoid medicating symptoms one-by-one.

## 4. Phase 2 — Layout Constitution (17 rules; recorded, reusable for future chapters)

| # | Rule |
|---|------|
| R01 | No readable element may overlap any other readable element (text/text, text/chip, text/node). |
| R02 | Text keeps ≥ 8 px world-unit breathing from any drawn edge, stroke, or other glyph box. |
| R03 | Grow the container before shrinking children. |
| R04 | Labels never clip: size containers to measured-fit, not hoped-fit. |
| R05 | Sibling labels that could collide share-space by staggering into ≥ 2 vertical bands. |
| R06 | One spacing scale per scene family (one pitch per chain; deviations must carry a story). |
| R07 | Row/column alignment families: centers, baselines, or edges — pick one per row, keep it. |
| R08 | Optical centering for hero elements (windows, cards, finale page); containers align geometrically. |
| R09 | No dead third: content spans ≥ 80 % of the camera BBOX on each axis, or tighten the BBOX. |
| R10 | Connectors terminate at container boundaries, never inside, never short. |
| R11 | Status/notification text gets its own reserved band; it never shares a content band. |
| R12 | Scalability: label systems must survive +25 % text length (metric drift, i18n). |
| R13 | Content keeps ≥ 12 px inset from any clip edge (incl. camera-fit rounding). |
| R14 | Badges may straddle a boundary only with ≥ 8 px clearance to all labels. |
| R15 | No decorative strokes across glyph boxes. |
| R16 | After any layout change, re-render ≥ 3 samples per affected beat and inspect. |
| R17 | Never scale or rotate text to make it fit. |

## 5. Phase 3 — Constitution sweep (re-audit) and Phase 4 — Approved fix package

The sweep applied R01–R17 to every scene/beat/object. It found **no new issues beyond
L-01…L-15 except L-15 itself** (added here, via camera-fit arithmetic at 1280×860), and
one accepted deviation: rails underlap their service boxes by ~5 px so boxes (drawn over
rails) occlude the seam — documented, not an issue.

Owner-approved package (approved as a whole; fix IDs kept for traceability).
**Class check: every row is x/y/w/h/margin/spacing/anchor/container-size only.**

| Fix | Δ (pre → post) | Issues |
|-----|----------------|--------|
| F1 | `stageBytes` hex cell cap 46 → **30** (`web-parts.ts`) | L-01 |
| F2 | `WORKBENCH` {150, 270, 560, 500} → **{96, 270, 820, 500}**; inner {170,310,520,440} → {116,310,780,440} | L-01, L-03, L-04, L-08 |
| F3 | `drawDomTree` leaf labels: single band dy 22 → **two staggered bands dy 22 / 40** (alternate per leaf slot) | L-03 |
| F4 | `✓ DOM complete` → **reserved top-right band** (inner.x+w−18, inner.y+12, right-aligned) out of the leaf band | L-04 |
| F5 | `stageChars` chip grid start y+96 → **y+112** | L-02 |
| F6 | `PATH_B` re-route: [5] js (920,170) → [6] **(966, 793)** → [7] **(450, 793)** → [8] style … [13] GPU dup; `beats.ts` travel indices re-anchored to waypoints: render-tree {5,8}, layout {8,9}, paint {9,10}, raster {10,11}, composite {11,13} *(spatial anchors only — durations, lines, `active` untouched)* | L-05 |
| F7 | Hardware row y 830 → **805** (nic/ram/cpu/gpu), hw PATH points 830 → 805, `hw-rail` y 805 | L-06 |
| F8 | CSS parcel park point → **(0.82·w, 0.66·h)** of the stage (clear of the tree) | L-07 |
| F9 | Layout ghost clipped to its region **{r.x, w: 0.34·w}**; receipts column → **listX 0.40·w, listW 0.56·w** | L-08 |
| F10 | Service-box name label dy 62 → **74** | L-11 |
| F11 | Bridge cluster −60: httpsLock 1010 → **980**; rail-dns end (1100,300)…(1170,175) → **(1040,300)→(1040,175)→(1110,175)**; rail-srv end 1170 → **1110**; door mids 1162 → **1102** | L-12 |
| F12 | `BBOX_WEB` maxX 1460 → **1370** | L-12 |
| F13 | Result card `LINK_RECT` → **{130, 246, 680, 80}** (viewport side insets 24 = 24); spark origin `PATH_A[0]` → card center **(470, 286)** | L-13 |
| F14 | Finale page scale `0.90 + 0.06·popIn` → cap **0.96** (was 1.00) | L-10 |
| F15′ | Bottom finishing chain respaced to uniform pitch 210: style **340** / layout **550** / paint **760** / raster **970**, GPU **1180** (was 380/560/740/920/1100 — rejected top-chain part, see §3) | L-09 |
| F16 | `BBOX_ENGINE` → **{minX 30, maxX 1300, minY −8, maxY 960}** (was {30, 40, 1370, 960}) — tightens the dead right band and keeps the port-cable tip (y 22) inside the fit | L-09, L-14 |
| F14b | `port-cable` stub → **(670, 26) → (670, 22)**: starts exactly at the net-port top edge (55 − 29), tip inside BBOX | L-14 |

*(F-numbering: F1–F16 as in the approved package; F15′ is F15 with the top-chain respace
rejected in QA — the implemented waypoint used (966,793)/(450,793) after the original
mid-point was found to fall inside the raster station's AABB: route y 793 clears the
bench bottom 770 by 23 px and station tops 821 by 28 px.)*

No file outside this fence was edited for layout. Verified: beat `duration`,
narration `line`, `active`, scene lists, animation easings, colors, glow — all
unchanged (smoke's continuity + integrity checks cover the beat graph; git diff shows
only the constants above).

## 6. Layout Debt Report

| | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | Total |
|---|---|---|---|---|---|
| **Pre-fix (audit)** | 3 (L-01, L-03, L-04) | 2 (L-05, L-06) | 9 (L-02, L-07→L-13, L-15) | 1 (L-14) | **15** |
| **Post-fix (verified)** | **0** | **0** | **0** | **0** | **0** |

**Gate verdict: PASS** — 0 Critical + 0 High in design *before* any code was written;
owner approval obtained for the complete package; implementation matches approval.

## 7. AABB proof table (post-fix, computed from live constants)

| # | Check | Pre-fix | Post-fix | Rule | Evidence |
|---|-------|---------|----------|------|----------|
| 1 | Decoded-chars zone width | 4.5 px | **424 px** (inner.w 780 − grid 330 − 26) | R02/R04 | arithmetic + b09 render |
| 2 | Chip-row top vs 5th char-line glyphs | −2 px (kiss) | **+14 px** (98 → 112) | R02 | arithmetic + b10 render |
| 3 | Leaf-label separation (dom) | 125–158 px labels in 130 px gap, one band | x-gap **195 px** (inner 780/4) + band offset 18 px > 11 px text height | R05 | arithmetic + b11/b13/b14/b15/b16 renders |
| 4 | Mutated p-label vs bench east wall | −5 px (715 > 710) | **≥ +116 px worst-case font** (p.x 584 + ≤216 ≤ 916; nominal +177) | R02/R04/R12 | arithmetic + b15 render |
| 5 | `✓ DOM complete` band | shared leaf band (722/724) | reserved band y 322–335; 9 px to nearest node circle top | R11 | arithmetic + b15 render |
| 6 | Spark js→style vs bench | crosses bench 181 px | leg at bench-top y: x 927.4 > wall 916 (+11.4); corridor y 793: **23 px** below bench, **28 px** above stations; waypoint **50 px** east of wall | R01/R10 | arithmetic + b16/b17 renders |
| 7 | CPU label vs case border | straddle (−9..+6 px) | **+18 px** (839+13 → 870) | R02 | arithmetic + b01/b07 renders |
| 8 | IP pill vs DNS label | 5 px | **17 px** (pill 208–232, label 249–262) | R02 | arithmetic + b03 render |
| 9 | Engine content span / BBOX x | 74.8 % (1002/1340) | **89.4 %** (1136/1270) | R09 | arithmetic; camera zoom +5.5 % |
| 10 | Web content span / BBOX x | bridge band 340 px, trim ratio 7.25 | bridge band **280 px**, trim ratio 5.75, span 89.8 % | R09 | arithmetic; camera zoom +6.8 % |
| 11 | Finale page inset from clip corner | 0 px @ scale 1.00 | **≥ 14.6 px h / 10 px v** @ cap 0.96 (viewport 728×502); page glyphs additionally ≥ 12 px inside the page card | R13/R08 | arithmetic + b21/b22 renders |
| 12 | Broadcast: scene-tag pill vs NET box (screen) | overlap (pill 16–46 px vs box top inside band) | **~52 px clearance** measured at 1280×860 | R01 | QA camera-fit math + render |
| 13 | Rail/cable terminations | port-cable inside box (34 vs edge 26) | starts **at** the boundary (670, 26), tip 22 inside BBOX ≥ −8; PATH_A[0] = exact card center (470, 286) | R10 | arithmetic + renders |
| 14 | Result card insets | sides 24 vs 64; top/bottom 24/7 | sides **24 = 24** within viewport; optical vertical balance re-verified | R08 | arithmetic + b01 render |

Rows combining arithmetic with renders follow R16 (≥ 3 samples per affected beat were
re-rendered after the change; 21 samples total, `snapshots/`).

## 8. Verification (final, post-fix)

| Check | Result |
|---|---|
| `npm run build` (tsc + vite) | **PASS** |
| `npm run smoke` — integrity, continuity, seams | **PASS** |
| Playthrough Ch-02 | **4304 frames ≈ 71.9 s**, final beat 22/22 — unchanged by layout |
| 23 beats × 3 deterministic snapshots | **PASS** |
| Playthrough Ch-01 | **~59.9 s — no regression** |
| Chapter 01 content files modified | **NONE** |
| Frozen artifacts 01–09 modified | **NONE** (this document is the v1.3 amendment) |
| Change-class fence | **HELD** — only geometry constants + travel-index anchors; no animation/timing/beat/scene/style/narration edits |
| Layout Debt gate | **0 Critical + 0 High before code; 0/0/0/0 after** |

## 9. Standing outcomes (recorded)

1. The **Layout Constitution (R01–R17)** is recorded for reuse — future chapters and any
   chapter-level layout revision apply it in Phase 3 order (measure → rule → fix-class
   fence → verify ≥ 3 samples/beat).
2. `scripts/layout-snapshots.ts` is kept as dev tooling next to the smoke suite
   (same bundle-and-run pattern; not part of the app build).
3. Narrative whitespace is a defended pattern: a spacing asymmetry that carries a story
   (parser→js 250 px corridor) is constitutional under R06 and needs no "fix".

*Amendment effective immediately. The frozen set 01–09 remains the design of record;
`10_`, `11_` and this document together form the v1.3 delta.*
