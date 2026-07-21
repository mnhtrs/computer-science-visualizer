# Chapter 02 — UI/Layout Revision v1.3.1 (Amendment)

> ⚠️ **ERRATUM (v1.3.5):** **F19** (scene tag parked in the controls row) is superseded by **F35** in `17_UI_LAYOUT_REVISION_v1.3.5.md` — the scene tag is now an absolutely pinned overlay at the top-left corner of `.stage` (owner round 5, L-44). The Home pill mechanics of F18/F21 are unaffected.

---

**Status:** APPLIED — chapter-level correction (does not reopen the frozen design)

**Chapter:** `chapter-02-browser-loading` — "How does a website reach my screen?"

**Version bump:** 1.3.0 → 1.3.1 (composes with `10_`–`12_`; no design-doc content changes)

**Effective Date:** 2026-07-20

**Trigger:** owner screenshot of the live Viewer — "nhìn kỹ giao diện xem có chướng mắt
không". The v1.3 layout audit rendered the **bare canvas at 1280×860**, which left two
blind spots: (a) viewer chrome (Home pill, scene tag) never entered the evidence frame,
and (b) beat 0 was never sampled, so the search-page stack was audited only through the
card's internal padding, not its neighbors. This revision closes both. Same change-class
fence as v1.3: `x/y/w/h/spacing/alignment/anchor/container-size` — no animation, timing,
beats, scenes, style, or narration.

---

## 1. Findings (all measured on live constants; renders at the owner's stage size)

| ID | Sev | Where | Problem (measured) | Evidence |
|----|-----|-------|--------------------|----------|
| L-16 | 🔴 | web / b0–b1 | Query pill `qb = {208, 226, 524×46}` (bottom 272) **overlapped the result card top (246) by 26 px**; the card's cyan border — drawn after — struck through the `cats` query glyphs (y 237–254) and the caret. Present since v1.0; missed by the v1.3 audit. | arithmetic + `snapshots/b01-user-view.png` (pre-fix frame) |
| L-17 | 🟠 | web / chrome | Home pill (fixed 18,18, bottom ≈ 53 px screen) covered the Desktop case top edge (47.9 px) by ~5 px and sat 0–2 px from the `Desktop` label (56–63.5) at the owner's stage — **under R02's 8 px floor; viewport-dependent, hence unprovable while floating.** | fit() math at 836×570 + owner screenshot |
| L-18 | 🟡 | web / b1 | Spark trail crosses the query pill during the click → URL-bar leg | disclosed, **declined**: changing the trail's shape is animation-class (outside the fence); the trail is transient FX |
| L-19 | 🟠 | engine / chrome | Scene tag (screen y 16–46) vs net-port box top: +8 px at 1280×860 canvas, **−10 px at the owner's 836×570 stage** — L-15's v1.3 fix was viewport-correlated, not viewport-invariant | fit() math at both sizes + `snapshots/b13-user-view.png` |

**Root cause of the misses:** scope (chrome outside the render frame; beat 0 unsampled)
plus one over-optimistic measurement — `12_LAYOUT_REVIEW.md` §7 row 12 recorded the
L-15 clearance as "~52 px"; the true figure was ≈ 8 px at 1280×860. **Erratum issued**
(banner added to `12_`).

## 2. Approved fixes (owner approved `full-controls`)

| Fix | Change | Class |
|-----|--------|-------|
| F17 | `LINK_RECT` {130, 246, 680, 80} → **{130, 288, 680, 80}**; spark origin `PATH_A[0]` → **(470, 328)** = exact card center. Query pill → card gap: **26 px overlap → 16 px clear** (R02). The click hit-zone moves with the same rect (no test drift). | y / anchor |
| F18 | Home pill leaves the fixed top-left overlay; it is now the **first child of the `.controls` grid row** (`margin-right: auto`). The controls row is a separate grid row below the stage, so overlap with world content is **impossible by construction at any viewport and in any chapter** — the only fix class that is provable rather than measured. | position / margin |
| F19 | Scene tag likewise leaves the stage overlay and parks in the controls row (`margin-left: auto`, mirrored with the Home pill so the dot group stays centered). Same provability argument; also removes the L-15/L-19 family entirely instead of widening BBOXes (which would have cost ~6 % glyph zoom). | position / margin |

Files touched: `scenes/01-navigation.ts` (2 constants), `src/app/App.tsx`,
`src/viewer/Viewer.tsx` (optional `controlsLeft` prop; tag moved), `src/index.css`
(`.viewer-back`, `.sceneTag` restyled for in-row parking). **No chapter-01 content
files, no frozen docs, no narration, no timings.** Viewer chrome changes are shared
infrastructure, not chapter content.

## 3. Proof of fix

| Check | Pre | Post | Rule |
|-------|-----|------|------|
| Query pill → card gap | −26 px | **+16 px** (272 < 288) | R02 |
| Card border vs query glyphs | strikes through (246 ∈ 237–254) | **34 px clear** | R01/R15 |
| Spark origin | card center (470, 286) — with the old, overlapped card | **exact center (470, 328)** of the separated card | R08/R10 |
| Home pill × world content | −5 px (case corner), 0–2 px (Desktop label), viewport-dependent | **∞ (different grid row)** | R13 screen-space |
| Scene tag × net-port | +8 px @860 tall, **−10 px @570 tall** | **∞ (different grid row)** | R13 screen-space |
| Second greyed result | — | moves with card (relative), 38 px below it, inside viewport | R07 |

## 4. Verification

| Check | Result |
|---|---|
| `npm run build` (tsc + vite) | **PASS** |
| `npm run smoke` — integrity, continuity, seams, Ch-01 + Ch-02 | **PASS** (Ch-02 4304 frames ≈ 71.9 s — unchanged) |
| Re-render at owner's stage size (R16) | `b00-user-view.png`, `b01-user-view.png`, `b13-user-view.png` — gap, centering, clear canvas confirmed; `Desktop` label legible |
| Vietnamese diacritics scan on touched files | clean |
| Chapter 01 content files modified | **NONE** |
| Frozen artifacts 01–09 modified | **NONE** |

**Layout Debt delta:** +1 🔴 +2 🟠 found post-v1.3 (L-16, L-17, L-19) → **0** after F17–F19.

## 5. Recorded guidance

1. Any future layout audit must include **beat 0** and must reproduce **viewer chrome at the
   owner's stage size**, not only the bare canvas (R16 extended: sample waiting states too).
2. Screen-space rules (R02/R13) **cannot be satisfied while chrome floats over the stage** —
   the fit offset is viewport-dependent. Chrome belongs in dedicated grid rows; park it,
   don't float it. (The one remaining floating element type — FX glows/trails — is
   exempt as transient, non-readable matter.)
3. Measurements in evidence reports must state their viewport context; a clearance given
   for one canvas size is not a clearance. (Erratum precedent: `12_` §7 row 12.)

*Amendment effective immediately. The frozen set 01–09 remains the design of record;
`10_`–`13_` together form the current delta.*
