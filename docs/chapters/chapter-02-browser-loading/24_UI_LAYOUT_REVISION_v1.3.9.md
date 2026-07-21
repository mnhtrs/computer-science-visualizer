# Chapter 02 — UI/Layout Revision v1.3.9 (Owner Feedback Round 9)

> ⚠️ **ERRATUM (v1.3.10):** by `25_UI_LAYOUT_REVISION_v1.3.10.md` — F48's six-line script split superseded (F52: the script is ONE physical line at tokenize; decode soft-wraps via `DECODE_LINES`; hex zone widened 0.46 → 0.52) · F51's persistent dim underlay superseded (F53: pixels fade 0.22 → gone exactly at 0.68 as the layers finish, then the pop-up). F49 (paint's mini blueprint) and F50 (NIC dwell ~0.24 s) stand.

> ⚠️ Standing: this document amends v1.3.8 (23_). Frozen docs 01–09 untouched; Chapter 01 untouched.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` — story display strings (decode stage), paint/composite stage choreography, NIC dwell. Frozen docs 01–09 untouched; Chapter 01 untouched (no `holdAt`, no workbench; smoke byte-identical).
**Change classes:** content correctness + animation/scene choreography — **owner-ordered this round** ("Đừng bịa cú pháp nhé? Phản biện và sửa lại nếu sai kiến thức" · "tôi vẫn muốn cái layout xanh lá khi sang chấm xanh tiếp theo co lại rồi paint sẽ cho hiện mấy cái fill text bên phải" · "Phần NIC cho dừng nhanh hơn tí rồi sang RAM" · "Rasterizer … đừng cho biến mất luôn mà vẫn phải hiển thị mờ mờ, tiếp theo sang GPU nó đặt 2 layer bên trên rồi render cửa sổ pop up"). Approved via ask_user (js-syntax = **p.textContent** · paint-layout = **mini-dim to 55 %** · nic-dwell = **~0.24 s** · raster-persist = **dim to 30 % underlay + pop scale**).
Beat count, durations, narration: unchanged (smoke 4304 frames ≈ 71.9 s).

## §1 Owner report + phản biện

- **L-59** (green dot 1, decode): why does the embedded script read `p.t += "They own the internet"`? Is that valid JS? Do not invent syntax.
- **L-60** (green dot 4 from the bottom = layout): the owner still wants the old understandable hand-off — the green layout *shrinks* when moving to the next dot, then paint shows the fillText receipts on the right.
- **L-61** NIC dwell: shorter again.
- **L-62** raster → GPU: after the pixels light, do NOT make them disappear; keep them shown dimmed; at the GPU dot the 2 layers slide on top and the page pops up — smooth UI/UX.

## §2 F48 — knowledge critique (L-59) and the honest fix

Critique, measured against the ECMAScript spec + DOM:
- `p.t += "They own the internet"` **parses** as valid JavaScript grammar (member access + compound assignment + string literal — a JS parser accepts it).
- But as *web knowledge* it is **invented**: no DOM API named `.t` exists on elements, and in a bare inline script `p` isn't even defined. Educational content must not teach made-up APIs.
- **Fix:** `<script>p.textContent` + `+= " They own the internet."` + `</script></body>` — `textContent` is the real DOM property; `p` reads as the p element (the DOM tree above shows that same node). The string keeps its **leading space** so the append reproduces exactly the mutated tree label (`Cats sleep 16 hours. They own the internet.`).
- `CHAR_LINES` was re-split 5 → 6 lines for the longer honest code; longest line = 27 chars (unchanged from before) so nothing clips in the decode zone at 19 px mono. The tokenize beat's source-line pitch was tightened 30 px → 24 px so 6 lines still clear the chips grid (starts `r.y + 150`); the F46 residue case 11 uses the same pitch. Single occurrence in the codebase (`05-story.ts`); tokens/captions/narration untouched (already code-free).

## §3 F49 — layout → paint: the blueprint settles into a left mini (L-60)

- F46 residue case 18 (dissolve blueprint at paint's opening) is **retired**: the paint beat now **owns** the blueprint.
- In `stagePaint`: over the first **30 % of the eased beat clock** the blueprint SETTLES from its full form (`centerRect(0.62)`) into a left mini (`paintMini(r)`: `w = 0.30·bench`, height-proportional, vertically centered, flush left) while dimming 1.0 → **0.55** (owner-picked *mini-dim* — crisp reference, receipts stay the focus). It then **stays for the whole paint beat**.
- Receipts stack in the right zone (`paintZone(r)`: `x = 0.42·w, w = 0.56·w`) on the unchanged F43 birth window `(frac−0.35)/0.65` (births start real ≈ 44 % — after the settle completes ≈ 42 %, so they never overlap).
- Geometry measured: mid-settle the blueprint's right edge crosses the receipt zone only while receipts are still unborn (verified render `w-b18-miniblue` / montage row 1).
- Raster opening: **both** dissolve together — residue case 19 now redraws receipts (right zone) + the 55 %-dim mini blueprint, gone by 10 % real time ("nhường chỗ", F46 rule intact).

## §4 F50 — NIC dwell 0.4 s → 0.24 s (L-61)

`response` beat `holdAt`: `0.52→0.65` → **`0.52→0.60`** (0.08 × 3000 ms ≈ **0.24 s**). Linear-clock hold confirmed by render: b7 @0.56 still parked on the bright NIC, @0.80 ≈ 98 % of path en route to RAM.

## §5 F51 — raster persists dimmed under the GPU layers (L-62)

- F46 residue case 20 (dissolve raster page at composite's opening) is **retired**.
- `stageComposite` now: the lit raster page **dims 1.0 → 0.30 over the first 35 %** and **stays as the underlay all beat**; the two layers slide in **on top of it** (motion unchanged); the crisp page then **pops** over everything — alpha plus a **0.92 → 1.0 scale** around the page center ("cửa sổ pop up … mới mượt") — and holds until the scene cut.
- F46's zero-residue-at-steady-state rule is not violated in spirit: the dim raster is *this beat's own* deliberate backdrop (owner-ordered), exactly like the owner-kept settles — not a leftover.

## §6 Verification

- `npm run build` (tsc + vite) PASS; `npm run smoke` PASS, structure byte-identical (ch-01 3585 frames ≈ 59.9 s; ch-02 4304 frames ≈ 71.9 s; seams `web → engine @decode`, `engine → web @screen`; 23 beats × 3 snapshots).
- `scripts/ui-check.ts` new permanent guards: `w-b09-jscode` (honest `p.textContent`, no clipping), `w-b18-miniblue` (mini + right receipts), `w-b19-residue` (joint dissolve), `w-b20-underlay` (dim raster under layers); b07 hold sample retimed to the 0.52→0.60 window (`0.56`). Full set renders clean.
- Composite proof `snapshots/r9-proof.png`: row 1 — decode's real script; blueprint mid-settle (0.15), mini-dim + right receipts (0.70), steady hold (0.95), joint dissolve at raster's opening (0.06). Row 2 — dim raster underlay with layers on top (0.40), popped crisp page (0.92), NIC hold (0.56) and departure (0.80).

**Supersedes:** v1.3.8 §3 — F46 residue case 18 (by F49) and case 20 (by F51); the F46 rule itself stands everywhere else (cases 10–15, 17, 19). v1.3.8 §4 — F47's hold window (by F50). Everything else in 23_ stands.
