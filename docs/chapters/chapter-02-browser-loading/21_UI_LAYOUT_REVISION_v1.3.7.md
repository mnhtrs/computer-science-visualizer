# Chapter 02 — UI/Layout Revision v1.3.7 (Owner Feedback Round 7)

> ⚠️ **ERRATUM (v1.3.8):** F43's calm births are **kept**, but the "R19 refined" hide mechanics are superseded by `23_UI_LAYOUT_REVISION_v1.3.8.md` (F46): F38's in-beat tail fades killed late-born elements before they were fully shown (measured §2 of 23_), so hides moved to the NEW dot's opening. F45's hold window (0.52→0.79, ~0.8 s) is superseded by F47 (0.52→0.65, ~0.4 s). Also in 23_: F46b — the js-run bench sat empty for 92 % of its beat (`dim lerp` typo), fixed.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` stages/spark + shared engine travel mechanics. Frozen docs 01–09 untouched; Chapter 01 untouched (no beat declares `holdAt`; smoke byte-identical).
**Builds on:** v1.3.6 (19_) + v1.4.1 (20_).
**Change classes:** animation timing/pacing + spark choreography — **owner-ordered this round** ("đưa trở về như cũ, cái nào layout animation co lại thì giữ nguyên, cái nào thực sự cần phải ẩn đi ở bước tiếp theo để tránh đè lên nhau sau này thì mới phải ẩn đi", "Bỏ cái nháy ở NIC đi… đến NIC nó sáng lên chút (và dừng 1 chút) thì nó mới sang RAM"). Approved via ask_user (pkg-r7 = yes; hold-len = **~0.8 s**).
**Pairs with:** `22_NARRATION_TYPOGRAPHY_v1.4.2.md` (quote/ellipsis typography).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

---

## 1. Owner complaints (round 7)

- **L-54** The green-timeline animations now feel too fast — "mất bản chất ban đầu vốn có". Restore the original pace. Keep the shrink-settles. Hide things *only* when they'd genuinely stack onto the next green dot.
- **L-55** (typography) Remove every curly quote “ ” in favor of straight `"`; stop using unusual characters in Vietnamese. → **22_**.
- **L-56** Remove the NIC flash. What was actually wanted: arriving at the NIC, the NIC **lights up a bit** and the packet **pauses a moment**, only then moves on to RAM.

## 2. Measured findings

| # | Evidence | Root cause |
|---|---|---|
| L-54 | timing table vs v1.3.5 | F38 restored residues correctly but over-compressed every *birth* window (chips to 0.05–0.83, regrow to 0.04–0.30, ring from 0.05, cards to (0.35)/0.40, receipts to 0.03–0.72, pixels to 0.03–0.81, slide to 0.04–0.44, snap to 0.44–0.84) — roughly double the original speed, and tails killed content from frac 0.82. "Quá nhanh": confirmed by constants, no eyeballing. |
| L-56 | `update.ts` travel | polyline parameter is distance-mapped (`easeInOutCubic(p)` over segment lengths) — zero-length anchor dups can rest a spark only at a beat's *end*, never mid-beat. A NIC dwell needed a generic piecewise `holdAt`. |

## 3. Fixes

### F43 — original pacing restored; hides narrowed to collision-real only
- **Birth windows back to the F33-era (v1.3.5) values everywhere:** lines `(frac−0.17)/0.12` · chips `(frac−0.19)/0.81` · DOM grow `(frac−0.24)/0.76` · CSSOM cards `(frac−0.35)/0.65` (now actually complete at beat end thanks to dur-normalized frac) · regrow `(frac−0.26)/0.3` · script ring `(frac−0.26)/0.5` · render nodes `(frac−0.42)/0.58` · blueprint `(frac−0.3)/0.7` · receipts `(frac−0.35)/0.65` · pixels `(frac−0.22)/0.78` · layers slide `(frac−0.3)/0.38` · snap `(frac−0.68)/0.32`.
- **Settles kept ("cái nào co lại thì giữ nguyên"):** F28a cssom width-settle, F28d DOM shrink-settle (which now also fades to zero by 0.38), the b15 dim settle.
- **Hides kept only where the next dot would truly stack (R19 refined):** hex grid before tokenize · tokens chips before DOM · CSSOM cards before paused · render nodes before layout · blueprint before receipts · receipts before pixels · raster page before composite · CSS parcel/pulse before cssom. All fade in the old beat's own tail (0.82→1.0) — never rendered at the new dot.
- **Not coming back:** F23's dim blueprint strip (that *was* a residue) — receipts stay centered on the paint bench. Recorded again here so the choice is explicit.

### F45 — NIC dwell + steady brightening (supersedes F41)
- Engine: `BeatDescription.travel` gains optional `holdAt: { index, from, to }`. The travel parameter becomes piecewise: eased approach to the anchor's distance-fraction, frozen during `[from, to)`, eased continuation. Generic and Chapter-01-neutral.
- Content: `response` beat → `travel: { from: 17, to: 22, holdAt: { index: 21, from: 0.52, to: 0.79 } }` — the packet parks at the NIC (anchor 21) for **~0.8 s of the 3000 ms beat**, then rolls into RAM. Distance math: NIC sits at 86.9 % of the path length (1127/1297 px), the approach is compressed into the first 52 % of the beat, the last 13 % of travel eases across NIC→RAM after the hold.
- `drawNIC`: flash ring and bloom **removed**; steady brighten instead — card alpha 0.55 → 1.0 and a steady glow (`r 100, α 0.32·pulse`) while the spark is within 110 px. Verified: `w-b07-hold` (mid-hold: spark parked on the NIC, NIC lit), `w-b07-post` (0.95: spark reaching RAM, NIC calm).

## 4. Verification

- `npm run build` (tsc + vite) — **PASS**; `npm run smoke` — **PASS** (ch1 3585 ~59.9 s identical; ch2 4304 ~71.9 s identical, seams OK).
- Canvas re-renders at owner sizes: `w-b07-pre/hold/post` dwell proven; `v-b10-early`, `w-b10-mid`, `v-b19-early` still residue-free; `v-b13-crashwin` (frac 0.02) unchanged.
- Quote/ellipsis census shipped in 22_: zero curly quotes, vi … free.
- **DOM eyeball list after reload:** none this round beyond the already-known items (strip length, round group dot) — everything here is canvas-visible.

## 5. Errata

- **19_ F41** (NIC arrival flash) — replaced by **F45** (steady brightening + the packet itself dwelling; a better expression of the same intent, owner's refinement).
- **19_ §3 F38** — the "every stage dies in its own tail" blanket is refined by F43/R19: only collision-real content hides; births run at the historic calm pace. The zero-residue rule itself stands.
