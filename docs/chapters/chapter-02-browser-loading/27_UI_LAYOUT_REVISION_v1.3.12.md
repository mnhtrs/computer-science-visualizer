# Chapter 02 — UI/Layout Revision v1.3.12 (Owner Feedback Round 12)

> ⚠️ **ERRATUM (v1.3.13):** by `28_UI_LAYOUT_REVISION_v1.3.13.md` — F58's tail amended: the route now ENDS AT THE CPU (the post-CPU climb to the window was deleted; the engine-door anchor is gone), so every anchor ≥ 25 referenced in this document reads −1 in current code (GPU = 25, finale rest = 26), and beat 8 now reads `travel { from: 22, to: 24, holdAt { index: 24, from: 0.5, to: 0.77 } }` (parked on the chip to beat end). The RAM → loading-screen → CPU front half stands exactly as approved here. F59 stands untouched.

> ⚠️ Standing: this document amends v1.3.11 (26_). Frozen docs 01–09 untouched; Chapter 01 untouched.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` — web-scene spark path (to-engine reroute + anchor insert), css-fetch link-pulse lifetime. Frozen docs 01–09 untouched; Chapter 01 untouched.
**Change classes:** spark choreography (loading-screen visit) + effect lifetime (pulse gate) — **owner-ordered this round** ("Sai rồi, nó đi qua RAM xong nhảy lên màn hình loading chứ ko phải đi tiếp sang CPU, nó phải đi từ RAM nhảy lên màn hình loading sau đó đi vào CPU chứ" · "Tại sao tạo node khác trong graph như h1 với p và sang nhánh khác rồi nhưng vẫn còn nhấp nháy ở cái node link ... Nếu lỗi thì fix đi"). Approved via ask_user (cpu-park = **keep 648 ms** · link-pulse = **short-lived**, dead before the branch move).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

## §1 Owner report

- **L-68** (to-engine, 4th gold dot from the bottom): wrong — after RAM the spark must JUMP UP to the loading screen ("màn hình loading"), and only then go into the CPU. Flying straight along the hardware row to the CPU is not the story.
- **L-69** (css-fetch, the DOM graph on the bench): why does the link node keep blinking pink-purple ("tím hồng") while other nodes (h1, p) are already being created on another branch — it even reads as if the node is gone while the blink lives on. "Lỗi à? Nếu lỗi thì fix đi" — the blink must not survive the move to another branch.

## §2 Measurement (before)

**The flight (`snapshots/r12-before.png` row 1; beat 8 = 2400 ms, sampled spark positions from the live sim).** frac 0.10 → (437, 805); frac 0.35 → (584, 805) — six world px from the CPU, still ON the hardware rail (y = 805); parked 0.45→0.72 at (590, 805); only after the park does it climb to the engine door. The loading screen is visible all beat — spinner center at `V.x + V.w/2, V.y + V.h/2 − 10` = (470, 453), "Waiting for best-cats.example…" at (470, 491), from `VIEWPORT = {106, 212, 728, 502}` — but the spark never visits it. Exactly the owner's complaint.

**The pulse (`r12-before.png` row 2; beat 12 = 3200 ms).** The ring (`#a78bfa`, alpha `0.5 + 0.4·sin`, radius `26 + 2·sin` world px) was drawn UNGATED for the whole beat: at frac 0.55 h1 already exists on the body branch and the ring still blinks on link; at frac 0.90 all of body/h1/p stand and it still blinks. Worse, `drawResidue` case 13 re-drew the ring for the first 10 % real time of the cssom beat AT THE OLD FULL-WIDTH POSITION while the live tree settled into its 52 % column — during that window the link node slides ~26 world px left, so the ring visibly detaches from the node it rings. That detachment is the closest real match for the owner's "node này đã biến mất nhưng vẫn còn hiệu ứng nhấp nháy".

**Knowledge check (answering "Lỗi à?").** Not a code bug in the strict sense: the link NODE never disappears during css-fetch — `revealCount ≥ 3` all beat, and `domPositions` is reveal-independent, so ring and node always coincide inside the beat (render frames verified). The pulse is an intentional emphasis shipped back in v1.1 (senior review): it marks the tag that triggered the fetch — the causal tie between the link node and the flying CSS parcel, serving the frozen M-truth "the parser does not wait; the same fetch pattern for any file". But the owner is right about readability: once body/h1/p start popping at frac 0.25/0.50/0.75 the story has left the link node, and a leftover-looking blink — plus a detached residue ring — reads as a bug. Fix ordered and approved (short-lived pulse).

## §3 F58 — rerouted: RAM → loading screen → CPU → engine door

- `PATH_A` gains anchor 23 = **`{ x: 470, y: 453 }`** — the exact spinner center taken from the loading-screen draw code. CPU → 24, engine door → 25, GPU → 26, finale rest → 27 (comment-marked in `01-navigation.ts`). The path is now 28 points.
- Beat `to-engine` (duration kept at 2400 ms — frozen M-truth): `travel: { from: 22, to: 25, holdAt: { index: 24, from: 0.50, to: 0.77 } }`, `active: 'cpu'` kept. Measured hops: RAM→screen √(40² + 352²) = **354** · screen→CPU √(120² + 352²) = **372** · CPU→door √(120² + 375²) = **394** world px (total 1120; CPU anchor distance-fraction fA ≈ 0.648 of the sliced path). Timing: approach 1.20 s — the spark crosses the loading screen at frac ≈ 0.248 (verified frame: (477, 475) at frac 0.25, inside the Waiting block) — **park 0.50→0.77 ≈ 648 ms, the round-11-approved length kept verbatim** — exit 0.55 s up to the door.
- Beat `screen`: travel renumbered `25→26` → **`26→27`**. Smoke's computed seam line now logs `engine → web (seam entry path[27])` — verified; no assertion depends on the string.
- **Disclosed debt, repaired:** F56 forgot to renumber recap's `rest: { at: 25 }` — since v1.3.11 it had pointed at the GPU. Harmless in practice (that beat's `effect: 'loop'` shadows the rest branch entirely — the `looping` branch precedes `rest` in `update.ts`, so no frame ever rendered it), but wrong on paper. Now `rest: { at: 27 }` = the window center, back to the pre-F56 semantics.
- Narration untouched — the beat line ("Browser mang chúng vào xưởng bên trong mình: Browser Engine.") already narrates this hand-off.

## §4 F59 — the link pulse ends before the parser leaves the node

- `stageCssFetch`: new `pulseGate = clamp((0.24 − frac) / 0.08, 0, 1)` multiplies the ring alpha; drawing is skipped when it hits 0. On the eased stage clock (`frac = easeInOutCubic(lin)`) the result is: full ring to frac 0.16 (real ≈ 1.09 s — the narration moment "giữa chừng, Parser gặp một cái link"), a clean ~256 ms fade, then **dead at frac 0.24 — exactly BEFORE body pops at frac 0.25** (`Math.floor(frac·4)` flips at 0.25; same clock, so the ordering is exact and can never invert). The rest of the beat runs as before: parcel flying and parking, body/h1/p popping ring-free.
- `drawResidue` case 13: the ring block deleted; the parked parcel alone dissolves there now. This restores F46's own invariant — "residue = the old dot's FINAL frame": beat 12 ends ring-less, so its residue must be ring-less too — and no detached ring can float while the tree settles.
- Kept deliberately (the emphasis is the causal marker link → fetch): the ring itself at beat start, the sin blink rate, the radius wobble, the `#a78bfa` tint. Parcel descent (`frac/0.8` eased) and tree growth (`3 + min(3, floor(frac·4))`) untouched. The link node is still drawn for the entire beat — that part of the owner's report described a perception, not the actual draw state (see §2).

## §5 Verification

- `npm run build` (tsc + vite) PASS; `npm run smoke` PASS — ch-01 3585 frames ≈ 59.9 s byte-identical; ch-02 4304 frames ≈ 71.9 s, seams `web → engine (seam entry path[0])` / `engine → web (seam entry path[27])` (*the seam index moved 25 → 27 across the F56 + F58 renumbers*), 23 beats × 3 snapshots.
- `scripts/ui-check.ts`: F56's `w-b08-flycpu/cpu/door` replaced by the new window — `w-b08-hop1` (0.12, climbing off RAM) · `w-b08-page` (0.25, spark ON the loading screen — the L-68 regression guard) · `w-b08-appcpu` (0.45) · `w-b08-cpu` (0.63, parked, chip lit) · `w-b08-door` (0.9); plus new `w-b12-nopulse` (0.55 — h1 present, zero pink ring — the L-69 guard) and `w-b13-noring` (0.04 — parcel-only residue). 55 samples render clean.
- Proof montages: `snapshots/r12-before.png` (evidence) vs `snapshots/r12-after.png` — row 1: hop1 (435, 765) climbing off RAM → page (477, 475) inside the Waiting block → parked (590, 805) on the lit CPU → rising (509, 553) to the door; row 2: blink alive at 0.10, GONE at 0.55 with h1 standing, gone at 0.90, cssom opening carries the parcel only.
- Vietnamese census on edited code files and this doc: zero broken glyph clusters, zero double backslashes; straight quotes everywhere; no new em-dashes (doc dashes are pre-existing frozen tokens or plain hyphens).

**Supersedes:** v1.3.11 (26_) for layout — F56's CPU route is extended: the loading-screen visit is inserted at anchor 23, so every anchor ≥ 24 in 26_ reads +1 again in current code. F55 (SERP rows) and F57 (NIC dwell) stand. Everything else in 26_ stands.
