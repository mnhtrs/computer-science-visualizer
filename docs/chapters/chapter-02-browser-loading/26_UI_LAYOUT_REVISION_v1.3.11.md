# Chapter 02 — UI/Layout Revision v1.3.11 (Owner Feedback Round 11)

> ⚠️ **ERRATUM (v1.3.12):** by `27_UI_LAYOUT_REVISION_v1.3.12.md` — F56's route changed shape: an anchor was INSERTED at index 23 (the loading screen, 470,453), so every anchor ≥ 24 referenced in this document reads +1 in current code (CPU = 24, engine door = 25, GPU = 26, finale rest = 27), and beat 8 now reads `travel { from: 22, to: 25, holdAt { index: 24, from: 0.50, to: 0.77 } }`. Also disclosed there: F56 forgot recap's `rest` (stale 25 = GPU — shadowed by `effect: 'loop'`, so never visible; now 27). F55 (SERP rows) and F57 (NIC dwell) stand untouched.

> ⚠️ Standing: this document amends v1.3.10 (25_). Frozen docs 01–09 untouched; Chapter 01 untouched.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` — search-page illustration rows, web-scene spark path (to-engine routing + anchor insert), NIC dwell. Frozen docs 01–09 untouched; Chapter 01 untouched.
**Change classes:** layout content (SERP rows) + spark choreography (CPU detour) + animation timing (dwell) — **owner-ordered this round** ("Cho nhiều kết quả hơn đi … nhưng cho đủ để ko bị tràn ra khỏi viền block browser nhé" · "thởi gian chờ ở NIC phải nhanh hơn xíu nữa" · "phải thêm đoạn bay vào CPU (browser engine) chứ sao tự nhiên đang ở trên trang web mà CPU lại phát sáng rồi vào luôn browser engine là sao?"). Approved via ask_user (serp-rows = **+4** · cpu-visit = **park ~0.65 s** · nic-dwell = **~0.15 s**).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

## §1 Owner report

- **L-65** (browser search page, photo attached): more results below please — enough for a rich SERP illustration, but nothing may overflow the browser border.
- **L-66** NIC dwell: shorter yet again.
- **L-67** (4th gold dot from the bottom = `to-engine`, the last web dot before the engine group): after the spark reaches the "Waiting for…" page it must FLY INTO THE CPU — why should the CPU light up out of nowhere and the scene jump straight into the browser engine?

## §2 F55 — richer SERP, measured against the viewport border

`VIEWPORT = { x: 106, y: 212, w: 728, h: 502 }` → bottom edge y = 714. Existing rows: main result card (bottom 388) + the hardcoded greyed "Cats in mythology" row (title 426 / url 446). Added **4 greyed rows** (`EXTRA_RESULTS` in `01-navigation.ts`) at a **64 px pitch** starting y = 490, so the last url baseline lands at 702 — **12 px margin** above the border (measured, R02). Title alpha decays with depth (0.34 → 0.30 → 0.26 → 0.22; urls 0.30 → 0.26 → 0.22 → 0.18) so the illustration reads deep but never competes with the clickable protagonist result. Rows: `Cat breeds A-Z: find your match` / `purr.example` · `Why do cats sleep 16 hours?` / `nap-science.example` · `Adopt a cat near you` / `adopt.example/cats` · `Cats vs. cucumbers: the investigation` / `science.example/cats`. ASCII-only new strings; the pre-existing second row's typography untouched.

## §3 F56 — the spark now routes through the CPU into the engine

Pre-fix choreography (measured from `PATH_A` + beat 8 `travel 22→23`): the spark slid **RAM (430, 805) → the engine door (470, 430)** — a single diagonal that never visits the CPU at (590, 805); the chip only lit by proximity, which read as "tự nhiên CPU phát sáng rồi vào luôn". The story the visuals must tell is Chapter 1's: **the CPU runs the Browser Engine.**

Fix:
- `PATH_A` gains anchor `{ x: 590, y: 805 }` (CPU) at index **23**; engine door / GPU / finale rest shift to 24 / 25 / 26 (comment-marked in the scene file).
- Beat `to-engine` (2400 ms): `travel: { from: 22, to: 24, holdAt: { index: 23, from: 0.45, to: 0.72 } }`, `active: 'browser' → 'cpu'` — the spark flies RAM → **CPU (parks ~0.65 s with the chip legitimately lit)** → ascends to the engine door. Distance math: RAM→CPU 160 px, CPU→door ≈ 394 px (anchor distance-fraction fA ≈ 0.289 of the sliced path).
- Beat `screen`: travel renumbered `24→25` → **`25→26`**. Smoke's computed seam line now logs `engine → web (seam entry path[26])` (was 25) — the renumber is consistent end-to-end; no assertions depend on the string.
- Narration untouched: the beat's line ("Browser mang chúng vào xưởng bên trong mình: Browser Engine.") already tells exactly this hand-off.

## §4 F57 — NIC dwell 0.24 s → 0.15 s

`response` beat `holdAt`: `0.52→0.60` → **`0.52→0.57`** (~0.15 s of the 3000 ms beat). The 0.8 s → 0.39 s → 0.24 s → 0.15 s ladder now matches the owner's "nhanh hơn xíu nữa".

## §5 Verification

- `npm run build` (tsc + vite) PASS; `npm run smoke` PASS (ch-01 3585 ≈ 59.9 s byte-identical; ch-02 4304 ≈ 71.9 s, seams `@decode` / `@screen`, 23 beats × 3 snapshots — *seam index 25 → 26 is the F56 renumber, logged above*).
- `scripts/ui-check.ts` new guards: `w-b00-serp` (6 results, no border breach), `w-b08-flycpu` / `w-b08-cpu` / `w-b08-door` (the RAM → CPU-park → door arc; b07-hold sample retimed to the 0.52→0.57 window — 0.56 stays parked). 51 samples render clean.
- Composite proof `snapshots/r11-proof.png`: full SERP inside the viewport; beat-8 triptych (approaching the CPU at 0.30 · parked with the chip lit at 0.60 · ascending to the engine door at 0.95); NIC hold/departure frames.

**Supersedes:** v1.3.9 §4 F50's hold window (by F57). Everything else in 25_ stands.
