# Chapter 02 — UI/Layout Revision v1.3.4 (Owner Screenshot Round 4)

> ⚠️ **ERRATA (v1.3.5):** **F31** ("knock at the lock and return home") is semantically amended by **F36** in `17_UI_LAYOUT_REVISION_v1.3.5.md` — the owner clarified the spark must *stay* at the HTTPS lock and the following beat continues through it to the server; the round-trip inside one beat is gone. **F32's** inside-group Replay position is fixed by **F34** (Replay now sits at the end of the row). The grouped-timeline interaction model itself stands.

**Status:** applied & verified · **Date:** 2026-07-20
**Scope:** `chapter-02-browser-loading` + shared viewer/primitive. Frozen docs 01–09 untouched; Chapter 01 behavior preserved (deep-scene branch has priority and is untouched).
**Builds on:** v1.3.3 (15_).
**Change classes touched:** layout (fence), **scene-path choreography** (F31) and **viewer interaction model** (F32) — both outside the layout fence and both **explicitly ordered/proposed by the owner in this round** ("Chấm tròn thứ 5 … phải đi đến khóa HTTP chứ", "Lựa chọn gom lại hết inside làm 1 chấm vàng thì các bước bên trong … mới xanh lá chứ?"). Recorded openly. Beat count, durations, narration strings: **unchanged** (smoke: 4304 frames ≈ 71.9 s).
**Also revoked:** F26b (v1.3.3's `.dots.deep` green tint) — owner's call: "chỉ chuyển sang xanh lá trong trường hợp như ở chapter 1 thôi".

---

## 1. Owner complaints (round 4, verbatim paraphrase)

- L-38 The dark bench frame is full of empty space — inner elements should grow and spread out to fit (bytes stage screenshot).
- L-39 **Live crash at timeline dot 14 (cssom):** `IndexSizeError: The radius provided (-20) is negative` at `drawCssomCards (web-parts.ts:944)` → `stageCssom` → `drawWorkbench` → render loop. "Fix lại hết phần graph này đi."
- L-40 Dot 5 (`https` beat): the spark should go **to the HTTPS lock and turn back** — not overshoot past it to the server. Dot 6 (`request`) is the one that should pass the lock to the server and back.
- L-41 Green timeline revolt: flat gold dots must not turn green; green only when *entered* — owner proposes: collapse all inside beats into one yellow stop; the steps inside it become green (Ch-1's pattern).

## 2. Measured findings

| # | Evidence | Measurement / root cause |
|---|---|---|
| L-38 | `stageBytes` @ inner 1044×412 | hex grid 418×168 (**~40 %×40 %** of the bench), digits 14 px, char lines pitch 30 — content crammed top-left (`u-b09` pre-fix). |
| L-39 | `stageCssom` (v1.3.3 F28b) | New width-settle made `half = lerp(r.w → 0.52·r.w)`. For `frac ∈ (0, 0.063)` the card width `r.w − half − 40` goes **negative (−40 → 0)**, and `rrPath`'s `rad = min(r, w/2, h/2) = −20` → `arcTo` throws. **Why our renders missed it:** every cssom sample sat at frac ≥ 0.12 (outside the window); smoke's playthrough verifies state, not canvas ops. |
| L-40 | `PATH_A` / beat `https` | travel `{from:8,to:13}` walked 850→980→**1102 (server door)**→980→850 — a full server round-trip inside the handshake beat. |
| L-41 | v1.3.3 F26b | `.dots.deep` re-skinned the flat timeline green while merely *in* the engine scene — semantically wrong per owner's model: gold=timeline, green=**entered interior**. |

## 3. Fix package (approved via ask_user: yes)

### F29 — bytes/chars stage measured fit (L-38)
- `drawBytes`: two-zone fit — hex zone = 46 % width, cell pitch `cw ≤ 52` / `chh ≤ 64` (was 38×28), vertically centered, digits **14 → 18 px**; char zone: pitch `≤ 64` centered (was 30), text **15 → 19 px**. Both zones now occupy ≥ 80 % of bench height (R09).
- `drawChips` (b10 + dom ghost): gap 8 → 12, pitch 52 → 54, height 40 → 44, text 13 → 14 px, start y 146 → 150.
- `stageChars` lines: 14 → 15 px, pitch 26 → 30.

### F30 — cssom crash (L-39), the real bug of the round
- `drawCssomCards` gated on real estate: `cardW = r.w − half − 40`, `if (cardW < 56) return` — no column exists before the settle opens one.
- Cards re-timed to appear for `(frac − 0.35)/0.65` — i.e. stacking **starts exactly when the settle is done** (also better pedagogy: tree settles, then rules stack).
- `CSSOM` heading fades in after frac 0.3 and is width-gated too.
- `rrPath` (shared primitive): **defensive clamp** — non-positive w/h → empty path, radius ≥ 0. This crash *class* can never throw again.
- New verification samples at **frac 0.02 / 0.06** (inside the old crash window) — `v-b13-crashwin` renders clean.

### F31 — HTTPS spark routed to the lock (L-40; scene choreo, owner-ordered)
`PATH_A[11]` 1102 → **980**, `PATH_A[12]` 980 → **850** (11 becomes the hold-at-lock dup; 12 the return home). Travel anchors unchanged — everything downstream (request 14→16, server rest 17, response 17→22) is untouched. Dot 5 now: home → rail → **knock at the lock (hold ~640 ms)** → home; dot 6 still crosses the lock to the server. Verified in `u-b04` (spark sits on the 🔒 at mid-beat). Narrative fit: the lock "sits ON the link, owned by both ends (M4)" — the knock *is* at the lock.

### F32 — grouped timeline (L-41; viewer interaction, owner-proposed)
- `.dots.deep` removed (F26b revoked).
- `Viewer.tsx` `DotGroup`: contiguous beats sharing one non-home scene collapse into a **single yellow stop** — Ch-2's main row is now 12 stops (web beats, **1 engine stop**, finale beats). Clicking the stop enters at its first beat.
- While inside a group, the strip swaps to Ch-1's identical component: green `.cycleDots` micro-timeline (one cdot per engine beat, clickable, done/cur states) + green **◁ back** button (jumps to the beat before the group) + **↺ Replay** when paused.
- Chapter 01 untouched in behavior: its deep-scene (`prog`/`cycleDots`) branch keeps priority; grouping is a no-op for solo-scene beats.

## 4. Verification

- `npm run build` (tsc + vite) — **PASS**; `npm run smoke` — **PASS** (ch1 3585 frames ~59.9 s identical; ch2 4304 frames ~71.9 s identical, seams OK).
- 31 owner-size renders re-audited, incl. new `v-b13-crashwin` / `v-b13-settle` (crash window), `u-b04` (spark on lock), `u-b09/u-b10` (stage fill), `u-b13` (cssom intact at frac 0.7).
- Vietnamese diacritics grep — 0 hits.
- **DOM-only items pending owner eyeball after reload:** the grouped timeline (12 yellow stops; green strip + ◁ + ↺ inside the engine), tag centering (F26a). The canvas crash fix is headless-verified at frac 0.02.

## 5. Errata / process notes

- **Sampling lesson (Constitution addendum in spirit of R16):** seam animations must be sampled *inside their first 5 %*, not only at showcase fractions — the L-39 crash hid in `frac ∈ (0, 0.063)`, below every sample we had. `scripts/ui-check.ts` now includes frac 0.02.
- The round-3 doc (15_) listed F26b as owner-approved-parity; the owner has since refined the visual contract: **green = entered interior only**. This doc records the revocation and the grouped pattern as the canonical resolution.
