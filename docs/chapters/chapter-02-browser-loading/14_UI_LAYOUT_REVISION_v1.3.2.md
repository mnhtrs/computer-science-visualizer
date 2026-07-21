# Chapter 02 — UI/Layout Revision v1.3.2 (Amendment)

> ⚠️ **ERRATUM (v1.3.6):** **F23** (the layout blueprint settles into a dim left strip inside the paint beat) is superseded by **F38** in `19_UI_LAYOUT_REVISION_v1.3.6.md` — the strip was a permanent cross-beat residue; owner round 6 established that *nothing crosses a dot alive*. The blueprint now fades out during the layout beat's own tail.

---

**Status:** APPLIED — chapter-level correction (does not reopen the frozen design)

**Chapter:** `chapter-02-browser-loading` — "How does a website reach my screen?"

**Version bump:** 1.3.1 → 1.3.2 (composes with `10_`–`13_`)

**Effective Date:** 2026-07-20

**Trigger:** second owner screenshot round (web beat 1, engine beats incl. paint). Owner
directives, verbatim intent: padlock misaligned in the URL bar · browser window kissing
the Desktop label · DNS IP pill spilling out of its box · timeline (dots/nav) pushed
off-center · station chips use bare abbreviations instead of illustrating themselves ·
workbench wastes its right half and its content is too small (without overflowing, hugging
edges, or touching the top-left title) · the green layout blueprint snaps small instead of
shrinking naturally for the paint receipts.

Change-class: same fence as v1.3/v1.3.1 (x/y/w/h/spacing/alignment/anchor/container-size,
typographic sizes), **plus two owner-ordered exceptions recorded openly**: intra-beat
settle choreography of the paint blueprint (F23 — beat durations/timeline untouched) and
new pictogram vocabulary for station chips (F24 — monochrome stroke glyphs in the
station's own color; no emoji, no new colors/fonts). All fixes verified by renders at the
owner's own stage sizes (web 836×570, engine 775×536).

---

## 1. Findings (owner-reported, machine-verified)

| ID | Sev | Where | Measured cause | Fix |
|----|-----|-------|----------------|-----|
| L-20 | 🟡 | web / URL bar | Padlock drawn against the chrome row (`cy = W.y+30`): lock spanned 132–148 inside a 132–168 pill — top-crammed; glyph position also font-baseline-sensitive | F20 vector lock anchored to pill center `pcy` |
| L-21 | 🟡 | web / case | "Desktop" label bottom 107 vs browser window top 110 → 3 px kiss | F20 whole browser cluster +20 (window/URL bar/viewport/card/anchors) |
| L-22 | 🟡 | web / DNS | IP pill 208–232 vs box bottom 223 → 9 px protrusion past the border | F20 service box 96→110 h; pill fully inside, interior re-banded (icon/churn/pill ≥ 6 px apart) |
| L-23 | 🟠 | controls | **Regression from v1.3.1 F18/F19:** `margin-right:auto` on the Home pill pushed the nav group right whenever the scene tag was absent | F21 controls → 3-zone grid (left/center/right); dots centered absolutely |
| L-24 | 🟡 | engine / chips | Stations identified by 3-letter abbreviations (DEC/TOK/PAR/…) — not decodable by learners at a glance | F24 pictogram glyphs |
| L-25 | 🟡 | engine / bench | Workbench 820 wide left a dead right band; stage text 11–13 px unreadably small at owner viewport | F22 bench 820→1084 + stage content scale-up |
| L-26 | 🟡 | engine / b18 | Blueprint jumped from full-size (b17) to ⅓-width ghost (b18) at the beat seam | F23 settle-in-place inside the paint beat |

## 2. Fix delta (all approved `yes/yes/yes/yes`)

**F20 (web):** `WINDOW y 110→130` · `URLBAR y 132→152` · `VIEWPORT y 192→212` ·
`LINK_RECT y 288→308` (16 px gap to the query pill preserved) · `PATH_A[0]→(470,348)`,
`[1]→(490,170)`, `[23]/[25]→(470,430)` · padlock + URL text centered on
`pcy = U.y + U.h/2` · service box `h 96→110`, icon `cy −12`, churn `+14`,
IP pill `+h/2−32` (8 px above border), pill text `+h/2−20`.

**F21 (controls):** `.controls` → `grid-template-columns: minmax(0,1fr) auto minmax(0,1fr)`;
new `.ctl-left/.ctl-center/.ctl-right` wrappers; `margin:auto` hacks removed from
`.viewer-back` / `.sceneTag`. Overlap with canvas stays impossible (separate grid
row) *and* the dot group is centered regardless of side content.

**F22 (engine):** `WORKBENCH {96,270,820,500}` → `{96,270,1084,500}` (east edge 1180 =
GPU column; right dead band gone; left/right trims 66/68). Spark route `PATH_B` re-routed
through the **East Corridor**: `[5] js(920,170) → (1230,170) → (1230,793) → (450,793) → …`
— 50 px east of the bench, 23 px below it, 28 px above station tops, 37 px above the GPU
chip; `beats.ts` travel anchors re-set {5,9}/{9,10}/{10,11}/{11,12}/{12,14} (a replace-chain
cascade during editing was caught and corrected line-by-line). Stage scale-up: caption
13→15 · hex cells 30×24→38×28, digits 12→14, decoded text 13→15 pitch 22→30 · char
rows pitch 20→26, chip grid +112→+146, chips 30→40 h, 11→13 · DOM/render nodes r 16→18,
labels 11→13, stagger bands 22/40→26/46, tree areas `h−60→−88` / fg `−90→−100` (leaf
labels now end ≥ 12 px above the inner bottom) · parcel 52×32→60×40 14 px · CSSOM cards
44→52 @ 66 pitch, rules/heading 12→14 · `✓ DOM complete` 13→15 · layout ticks 10→12 ·
receipts 32→40 @ 52 pitch, text 12→14.

**F23 (intra-beat, owner-ordered):** paint blueprint settles: `w: 1→0.34 of stage`,
`alpha 0.85→0.16` over `frac 0→0.35` (eased, left-anchored — seamless hand-off from the
layout beat at frac 0); receipts stagger in after `frac 0.15`. Durations, beat graph,
narration: untouched.

**F24 (vocabulary, owner-ordered):** station chips render a monochrome stroke pictogram
in the station's color instead of the 3-letter code (kept as `ex.short` fallback):
decode `hex cells` · tokenize `cut stream` · parser `tree` · net-port `door+arrow` ·
js `bolt` · style `swatch dots` · layout `ruler` · paint `roller` · raster `pixel grid`.
Station name labels 13→14.

## 3. Verification

| Check | Result |
|---|---|
| `npm run build` (tsc + vite) | **PASS** |
| `npm run smoke` — both chapters, integrity/continuity/seams + snapshots | **PASS** (Ch-02 4304 frames ≈ 71.9 s unchanged, Ch-01 ~59.9 s) |
| Renders at owner's stage sizes (R16+) | 19 frames (`snapshots/u-b00…u-b20`): padlock centered · window↔Desktop 19 px · IP pill inside box · staggered leaves intact · receipts clear of ghost · East-corridor leg visible under bench at b16 · finale inset even · no content touches captions or edges |
| Diacritics scan | clean |
| Chapter 01 content files | **NONE** |
| Frozen docs 01–09 | **NONE** |

Caveat recorded: the controls row is DOM, not canvas — F21 is verified by construction
(grid math) and by the fixed regression mechanism, not by headless screenshot.

**Tooling note:** `@napi-rs/canvas` is now a real devDependency — plain `npm install`
keeps pruning un-saved installs, which broke the toolchain twice this session.

**Layout Debt delta:** +1 🟠 +6 🟡 (owner round) → **0**.

## 4. Recorded guidance

1. Verify at the owner's viewport — the v1.3 audit's 1280×860 canvas hid both the DOM
   chrome problems and the sub-10 px text problem. (Already added to `13_` §5; repeated
   because it caught this round too.)
2. A parked-chrome layout still needs centering math: `auto` margins center only when
   both sides are symmetric. Use an explicit 3-zone grid for mixed chrome rows.
3. Widening a container re-checks every route that skirted the old wall — the F22
   bench move invalidated the spark's south-east leg; corridor routing was re-proven
   (50/23/28/37 px clearances).
4. `npm install --no-save` is unsafe in this repo's toolchain (prunes `node_modules`);
   dev tools belong in `devDependencies`.

*Amendment effective immediately. The frozen set 01–09 remains the design of record;
`10_`–`14_` together form the current delta.*
