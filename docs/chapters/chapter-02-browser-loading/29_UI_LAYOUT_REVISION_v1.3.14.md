# Chapter 02 — UI/Layout Revision v1.3.14 (Owner Feedback Round 14)

> ⚠️ **SUPERSEDED AS CURRENT (v1.3.15):** the layout chain continues in `31_UI_LAYOUT_REVISION_v1.3.15.md` — engine-hall station names upsized 15 → 18 (netport 12 → 14) and the dark-workbench element text ×1.2 across 15 measured sites (F69/F70, owner round 16). F62's finale gating from this document stands untouched.

> ⚠️ Standing: this document amends v1.3.13 (28_). Frozen docs 01–09 untouched; Chapter 01 untouched.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` — finale viewport choreography (delivery-gated page reveal). Frozen docs 01–09 untouched; Chapter 01 untouched.
**Change classes:** animation choreography — **owner-ordered this round**: "ổn hết rồi, giờ chỉ cần sửa đoạn cuối thôi" · "Khi đốm sáng từ GPU lên màn hình thì cái pop up all about cats mới hiện ra chứ sao cho nó hiện ra sớm thế". Approved via ask_user (**crossfade-40**).
**Sign-off note:** rounds 12–13 accepted in full by the same message ("ổn hết rồi") — F58/F59/F60/F61 are owner-approved as shipped.
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

## §1 Owner report

- **L-72** (finale, beat 21 'screen'): the All-About-Cats pop-up must appear when the spark goes from the GPU up to the browser screen — currently it shows far too early, before the spark has even moved.

## §2 Measurement (before)

In `drawBrowserWindow`'s finale branch: `alpha = clamp(beatElapsed / 500)` — the page reached **100 % alpha at 500 ms** of the 3000 ms beat; the F28f scale growth completed at 2400 ms. Meanwhile the spark's `travel { from: 25, to: 26 }` is GPU (740,805) → window center (470,430) = **462 world px**, eased across the whole beat. At 500 ms the eased parameter is 0.020 — the spark sits at **(735,797), 1.7 % of the trip, still on the chip** — with the pop-up already fully rendered. Delivery and reveal were decoupled, and the reveal won by 2.5 s. Exactly the owner's complaint, in numbers.

## §3 F62 — the reveal is gated on the delivery

- The old loading block is factored into a shared **`drawLoadingState(ctx, V, url, beat, finalFromBeat, t, alphaMul)`** (progress bar + spinner + "Waiting for…"), reused by beats 1–20 and by beat 21's transit window. Call-site behavior for beats 1–20 is byte-identical.
- Beat 21's finale branch now runs the delivery arc:
  - **[0.00 → 0.40]:** the screen keeps WAITING at full alpha (bar finished, spinner, text) while the spark flies GPU → window — story-true: the frame is in transit, there is nothing to show.
  - **[0.40 → 0.72]:** cross-fade — the waiting state fades out as the page fades in (`finA`); the spark is at **(662,697) → (494,463)**, inside the window, closing on the center.
  - **[0.40 → 1.00]:** scale **0.55 → 0.96 eased**, full exactly at beat end — F28f's gentle grow language is kept, and the 21→22 seam value (0.96, alpha 1) is identical to before; recap untouched.
- Measured (scripts/proof-round14.ts): frac 0.15 spark (736,799), no page; frac 0.45 spark (639,665), page alpha ≈ 0.17 mid-fade; frac 0.7 spark (498,469), alpha ≈ 0.94; frac 0.9 spark (471,431) docked, alpha 1, scale 0.89 → 0.96.
- Decision record: option **crossfade-40** approved. The alternative (pop only after the spark fully docks, ~300 ms) was put on the table and rejected in the same question — it re-introduces the abrupt-pop language the owner vetoed in round 3 (F28f).

## §4 Verification

- `npm run build` (tsc + vite) PASS; `npm run smoke` PASS — ch-01 3585 frames ≈ 59.9 s byte-identical; ch-02 4304 frames ≈ 71.9 s; seams `web → engine (seam entry path[0])` / `engine → web (seam entry path[26])`; 23 beats × 3 snapshots.
- `scripts/ui-check.ts`: `v-b21-grow` (whose mid-grow semantics F62 intentionally retires) replaced by **`w-b21-waiting`** (frac 0.25 — the screen still waits, no page: the L-72 regression lock) and **`w-b21-landing`** (frac 0.6 — cross-fade in progress, spark inside the window); `v-b21-full` unchanged (full size at 1.0 — the seam). 57 samples render clean.
- Proof `snapshots/r14-after.png`: the 5-frame delivery sequence (waiting ×2 → cross-fade → landed → full), the recap's full-size rest, and a beat-8 regression cell (F60 endpark still intact).
- Vietnamese census on edited code, this doc and the state file: zero broken glyph clusters, zero double backslashes; straight quotes; YAML frontmatter parses.

**Supersedes:** F28f's *timing* (15_, v1.3.3) — the growth curve and end-state are kept; the start is now gated at frac 0.40 of the delivery beat. F60/F61 (28_) stand untouched.
