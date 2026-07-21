# Chapter 02 — UI/Layout Revision v1.3.8 (Owner Feedback Round 8)

> ⚠️ **ERRATUM (v1.3.9):** by `24_UI_LAYOUT_REVISION_v1.3.9.md` — F46 residue **case 18 retired** (paint now owns the blueprint: it settles into a left mini, F49) and **case 20 retired** (the raster page persists dimmed as the composite underlay, F51); F47's hold window (0.52→0.65) superseded by F50 (0.52→0.60, ~0.24 s). The F46 full-presence rule + F46b fix stand untouched.

> ⚠️ Standing: this document amends v1.3.7 (21_). Frozen docs 01–09 untouched; Chapter 01 untouched.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` workbench stages (engine act, beats 9–20) + the `response` beat's NIC dwell. Frozen docs 01–09 untouched; Chapter 01 untouched (no beat declares `holdAt`; smoke byte-identical).
**Change classes:** animation timing + hand-off choreography — **owner-ordered this round** ("Bỏ hiệu ứng này đi? Đã bảo là chỉ khi thật sự sang bước tiếp theo (chấm xanh lá tiếp theo) thì mới có hiệu ứng biến mất hoàn toàn (ở chấm xanh trước) để nhường chỗ cho phần tử ở cái chấm xanh lá đấy mà? Phần layout xanh lá vẫn giữ hiệu ứng co lại chứ? Trả lại hết animation timeline xanh lá về nguyên trạng như trước" · "Giảm thởi gian đứng đợi khi đến NIC xuống đi"). Approved via ask_user (residue-style = **dissolve ~0.3 s at the new dot's opening**; nic-dwell = **~0.4 s**).
**Pairs with:** nothing new this round (narration untouched; 22_ stays current for typography).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

## §1 Owner report

- **L-57** Inside the green timeline, elements fade/blur and vanish before they are even fully shown. Remove these effects. A complete-disappearance may happen ONLY when truly at the next green dot, to make room for that dot's elements. The green layout's shrink ("co lại") animations stay. Restore all green-timeline animations to their original state, then apply exactly the above.
- **L-58** Reduce the waiting time at the NIC.

## §2 Measurement — the reported behavior was real, and structural

Root cause: **F43 (v1.3.7) restored whole-beat births on top of F38's (v1.3.6) `tailA` early-death fade** (`1 − clamp((frac−0.82)/0.18)`), and the two are mathematically incompatible. Anything born after frac 0.82 of its beat could never reach full alpha. Measured per beat (durations normalized by `durAtBeat`):

| Beat | Content | Damage under F43+tailA |
|---|---|---|
| 10 tokenize | chips 13–16 of 16 (`"change p…"`, `</script>`, `</body>`, `</html>`) | born 0.82→1.0 into the fade; last chip peaked at alpha **≈ 0** |
| 13 CSSOM | rule card 3 (`p { soft gray }`), card 2 | card 3 peaked at **≈ 7 %**; card 2 held full alpha for **51 ms** |
| 16 render-tree | node `p · white` (3rd of 3) | peaked at **≈ 7 %** |
| 17 layout | measurement box 3 (+ticks) | peaked at **≈ 24 %** |
| 18 paint | receipts 5–6 of 6 | peaked at **≈ 60 %** / **≈ 8 %** |
| 19 raster | last **≈ 102 pixels (23 % of the page)** | lit into an already-dissolving page; the page never appeared whole |
| 9, 11, 12, 14 | fully-born content | still dimmed out during the final 18 % of their own beat (the CSS parcel held park for **64 ms** before its fade) |

Additionally discovered while auditing (render-verified, snapshot `old-b15-mid.png`): **F46b — the js-run bench sat empty for 92 % of its beat.** `stageMutated` carried `dim: lerp(0.55, 0, frac/0.08)` — the whole DOM tree faded to alpha 0 within the first 8 % (272 ms) of beat 15, although that beat's entire point is the script mutating that tree. Mislabeled a kept "settle" in v1.3.7; it was a plain bug (the surviving comment even said "0.55 → clear"). Disclosed and fixed here.

## §3 F46 — holds at full presence; dissolve ONLY at the next dot's opening

**Rule (replaces F38's tail-fade rule):** inside a beat, content births at the calm F43 pace and then **holds at full presence to the beat's end**. The previous dot's collision-real residue dissolves **only at the new dot's opening — the first 10 % of real beat time (~0.28–0.36 s)**, eased — then nothing of the old dot exists. Round-6 "triệt để" still holds: after the opening, the bench shows only the current dot's content, and the earliest births (≥ eased 0.17 ≈ ≥ 25 % real) can never stack on the residue.

Implementation (`src/rendering/parts/web-parts.ts`):
- `tailA` deleted (13 call sites across 10 stages); every stage now runs births only.
- New `drawResidue(ctx, r, st, beatIndex, rf, t)` with `rf = 1 − easeInOutCubic(clamp(lin/0.1, 0, 1))` (`lin` = REAL beat progress; the eased stage clock is untouched) redraws only the collision-real final frame of the old dot:
  - **b10** hex grid + decoded chars · **b11** source lines + token chips · **b12** token hint line · **b13** parked CSS parcel + link pulse ring · **b14** CSSOM cards + "CSSOM" heading · **b15** script ring · **b17** render nodes · **b18** blueprint (extracted as `drawBlueprint`) · **b19** receipts · **b20** raster page.
  - **b16 needs no residue:** the F28d old-DOM **shrink-and-dissolve at the new dot's opening (kept "co lại")** already IS the js-run → render-tree hand-off.
- `stageDom`'s token hint line now births at eased frac 0.12 (≈ 31 % real) instead of 0 — it used to cross-fade with the tokenize residue.
- **Kept exactly (owner: "co lại giữ nguyên"):** b13 DOM column settle · b14 tree regrow + dim-to-0.55 · b16 shrink dissolve. `durAtBeat` kept (duration normalizer, not a fade).
- **F46b fix:** `stageMutated` dim is now `lerp(0.55, 1, frac/0.08)` — the tree un-dims back to full over the first 8 % and STAYS VISIBLE (script-node + mutation label swap at frac 0.3 readable for the whole 3400 ms beat).

## §4 F47 — NIC dwell shortened

`response` beat: `holdAt { index: 21, from: 0.52, to: 0.79 }` → `{ from: 0.52, to: 0.65 }`. Dwell = 0.13 × 3000 ms ≈ **0.39 s** (was ≈ 0.81 s). Approach and NIC brightening (F45) unchanged.

## §5 Verification

- `npm run build` (tsc + vite) PASS; `tailA` source census: 0 code references (7 historical comment mentions).
- `npm run smoke` PASS, byte-identical structure: ch-01 3585 frames ≈ 59.9 s; ch-02 4304 frames ≈ 71.9 s, seams `web → engine @decode` / `engine → web @screen`, 23 beats × 3 snapshots.
- Render proofs at owner stage size 775×536 (composite `snapshots/r8-fix-proof.png`):
  - OLD rows (`old-b10/13/15/18/19`): benches empty at beat end (b15 empty even mid-beat) — the complaint, photographed.
  - NEW rows (`new-b10/13/15/18/19`): all 16 chips, all 3 cards + heading, **the js-run tree back**, all 6 receipts, the complete raster page.
  - `new-b11-head` (lin 0.06): tokenize residue dissolving at ~35 %, nothing else on the bench — hand-off happens exactly at the new dot's opening.
  - `new-b16-settle` (0.35): the kept "co lại" shrink mid-flight.
  - `new-b07-hold` (0.58) spark parked on the brightened NIC; `new-b07-post` (0.80) spark ≈ 97 % of path en route to RAM.
- `scripts/ui-check.ts` gained permanent guards: `w-b10-full`, `w-b13-fullcards`, **`w-b15-tree` (F46b regression)**, `w-b18-full`, `w-b19-fullpage`, `w-b11-residue`; b07 samples retimed to the 0.52→0.65 hold. Full set renders clean.

**Supersedes:** v1.3.7 §3 F43's "R19 refined" hide-list mechanics (the hide LIST is unchanged — the timing moved from the old beat's tail to the new beat's opening) and v1.3.7 §3 F45's hold window (0.52→0.79). F38's tailA is gone; its zero-residue goal survives in the opening-dissolve form.

**Known accepted residues:** none at steady state. During the opening 10 % of beats 10–15 and 17–20 the old dot is visible while dissolving — this IS the approved effect ("có hiệu ứng biến mất hoàn toàn … để nhường chỗ").
