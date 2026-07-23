# Chapter 03 — Layout Audit → Revision v1.0.4

> Owner directive (verbatim, condensed): *"review toàn bộ chương 3 … xem có chỉnh
> sửa đúng theo layout system / docs không … không được phép fix cứng tọa độ … nếu
> vẫn còn fix cứng tọa độ cộng trừ 1 con số cụ thể thay vì theo layout/grid đã đề ra
> trong docs thì refactor lại theo docs."* Plus: move the packet blocks down, off the
> Browser, hugging the NIC.

---

**Status:** APPLIED — chapter-level correction (does not reopen the frozen design)
**Chapter:** `chapter-03-across-the-internet`
**Version bump:** 1.0.3 → 1.0.4 (composes with `10_` / `11_`; no design-doc content changes)
**Reviewer role:** Principal Motion/Layout Designer, applying the **Layout Constitution
R01–R19** (`docs/chapters/chapter-02-browser-loading/12_LAYOUT_REVIEW.md` §4) + **R18/R19**,
with the verify-before-approve doctrine: *no measurement, no fix; no taste-only fix.*
**Change-class fence (hard):** x / y / w / h / padding / margin / spacing / alignment /
anchor / container-size only. Verified untouched: beat order, durations, narration,
pipeline, animation easings, colours, scene structure.

---

## 1. Finding — the chapter was NOT on a layout system

Auditing the v1.0.3 renderers against R01–R19 found the chapter's coordinates lived as
**inline, eyeballed arithmetic inside the draw functions** (`pos.x - w/2 + 13`,
`cy - 18 + i*14`, `W.x + 26`, `V.y + 22`, `e.pos.y + 14`, the bbox literals
`{40,1740,40,940}`, the home-drop points, the inbox at hand-placed `(180,648)…`, R1 at a
literal `940` that overlapped the case border, …). None of these were tied to a named
constant, a container rect, or a measured text width — i.e. they violated **R03 / R04 /
R06 / R07 / R10 / R18** in spirit even where no pixel collision was visible. This is
exactly the "fix cứng tọa độ" the owner forbade. **Layout Debt (pre-fix):** systemic
(most draw functions), plus one visible symptom (R1 over the case border; inbox floating
near the Browser instead of at the NIC).

## 2. The fix — a real layout system (two modules)

Following the Ch-02 pattern (named rects in the scene files; interiors derived; pills
sized to measured text), the chapter now has:

- **`scenes/metrics.ts`** — the *primitives*: one spacing scale (`BREATH` R02,
  `CLIP_INSET` R13, `LABEL_GAP`), one type scale (`F.*`, every role named), one box spec
  per element (`CHIP / ROUTER / SERVER / NIC / RAM / PORT / FILE / SLOT`), glyph specs
  scaled to their box (`ROUTER_CHEV`, `SERVER_DISK`, `NIC_PAD`, `RAM_CELL`), the
  browser-window interior insets, the route gaps (`RIGHT_MARGIN_GAP / UNDER_GAP /
  PLUG_DX / R1_CLEAR`), the inbox pitch (`TRAY_PITCH`), and the bench paddings — each
  carrying the rule it satisfies in a comment. **Pure (no imports)** so geometry and the
  derived layer both build on it without cycles.
- **`scenes/layout.ts`** — the *derived* layer: every container interior, the inbox tray,
  the slice fan, the merge columns and the cut lines are **computed here** from metrics +
  the geometry rects (`BROWSER`, `TRAY`, `FORMATION`, `mergeCol(k)`, `cutXs(bx)`,
  `ACK_BOX`, `ASK_BAND`, `BENCH_CAP`, `slotLabelY`).
- **`scenes/01-the-wire.ts` / `02-reassembly.ts`** — the bbox and the home-drop route are
  now **derived**, not literals: `BBOX_WIRE = content ± CLIP_INSET`; `DROP_X = window.right
  + RIGHT_MARGIN_GAP`; `BELOW_Y = case.bottom + UNDER_GAP`; `PLUG_X = NIC.x − PLUG_DX`;
  `R1.x = case.right + R1_CLEAR`; the port-cable stub starts **at** the port's top edge
  (R10).
- **`renderers.ts`** rewritten to consume **only** `M.*` / `L.*` / formulas of specs
  (e.g. `box.h / 2`) / `ctx.measureText` (R18) / loop indices / alpha-clamp bounds /
  colours. **No bare layout literal remains.** (A grep for stray pixel offsets in draw
  bodies now yields only spec references.)

## 3. The inbox move — derived, not hand-placed (owner request #1)

The packet blocks no longer sit at a hand-placed y near the Browser. The tray is now
**derived from the NIC** in `layout.ts`, so "hug the NIC" is a consequence of the rules:

```
trayRow2Y = NIC.y − NIC.h/2 − BREATH − CHIP.h/2      // R02 breathing to the NIC box top
trayRow1Y = trayRow2Y − CHIP.h − BREATH              // R06/R07 one pitch, stacked up
row1 x    = NIC.x + (i−1)·TRAY_PITCH   (i = 0,1,2)  // arrival order 1,3,5
row2 x    = NIC.x ∓ TRAY_PITCH/2                    // chip 2 / ghost
```

Result: row2 sits one `BREATH` above the NIC box (hugging it), row1 one chip above that
(≈100 px below the Browser — no longer "sát browser"). Pieces rise from the NIC face
(`TRAY.hover`) into their slot. The whole inbox moved by derivation; zero magic y.

## 4. Constitution sweep — R01–R19 applied to every scene/beat/object

| Rule | Ch-03 compliance (how) |
|---|---|
| R01 no readable-overlap | inbox rows spaced by `CHIP.h+BREATH`; ACK box right-anchored clear of slots; ask in its own band; cut lines inside the block |
| R02 ≥ 8 px breathing | `BREATH` everywhere; proved §5 |
| R03 grow container first | bench/bbox sized to content; children fit inside |
| R04 measured-fit | IP pill = `measureText + 2·padX` (R18); ACK box named width ≥ measured `have ✓N` |
| R05 ≥ 2 bands | file block tag/label = two centred bands (`FILE_LINE_GAP`) |
| R06 one pitch / family | router web, slot row, inbox, chrome dots, merge columns each one pitch |
| R07 one alignment / row | slot numbers top-aligned; chips number centred in body band; rows centred |
| R08 optical centering | browser window / spinner / waiting text centred on VIEWPORT |
| R09 no dead third | content span ≥ 89 % each axis (proved §5); bbox tightened to match |
| R10 connectors at boundary | port-cable starts at port top; mesh cables terminate at router centres; the home cable terminates at the NIC plug (not inside the bus) |
| R11 status own band | bench caption (top-left) and ACK (top-right) reserved; ask in `ASK_BAND` |
| R12 +25 % text | `ACK.w`, IP pill, inbox pitch sized with margin; labels short |
| R13 ≥ 12 from clip | `BBOX_*` = content ± `CLIP_INSET` (12) |
| R14 badge clearance | IP pill below the disks glyph, `≥ BREATH` above the name |
| R15 no stroke across glyphs | cut lines confined to the empty block interior; no decorative stroke crosses a label |
| R16 re-render ≥ 3 / beat | 14 deterministic frames re-rendered + inspected after the refactor |
| R17 never scale text | no `ctx.scale` on text; chevrons are paths, not scaled glyphs |
| R18 measure in font | IP pill sets `ctx.font` then `measureText` then `+ padX` (the HTML box model) |
| R19 no cross-beat residue | each bench stage's content is gated to its beat; incoming chips clamped-descend (settle, never leak); merge strips fade before the block |

## 5. AABB proof table (post-fix, computed from live constants; world units)

| # | Check | Formula | Clearance | Rule |
|---|---|---|---|---|
| 1 | R1 box vs case border | `R1.x−ROUTER.w/2 − (case.x+case.w)` = 975−52−900 | **+23** | R02 |
| 2 | NIC plug line vs NIC name | `(NIC.x−18) − PLUG_X` = 242−230 | **+12** | R02/R12 |
| 3 | inbox row2 vs NIC box top | `(NIC.y−NIC.h/2) − (trayRow2Y+CHIP.h/2)` = 787−779 | **+8** | R02 |
| 4 | inbox row1 vs Browser bottom | `trayRow1Y−CHIP.h/2 − (WINDOW.y+WINDOW.h)` = 679−600 | **+79** | R02 (owner: off the Browser) |
| 5 | IP pill vs Server name | `nameTop − pillBottom` = 589−571 | **+18** | R02/R14 |
| 6 | IP pill width vs box | `box.w − (measured+2·padX)` = 156−148 | **+8** | R04/R18 |
| 7 | caption vs ACK box | `ACK_BOX.x − (BENCH_CAP.x + captionW≈250)` = 1056−292 | **≫8** | R01/R11 |
| 8 | ACK `have ✓N` vs box right | `(ACK.x+ACK.w−padX) − (ACK.x+measured≈150)` = 1230−1156 | **≫8** | R04 |
| 9 | slot label vs slot box | `slotLabelY − (slot.y+SLOT.h/2)` = `SLOT_LABEL_GAP` | **+10** | R02 |
| 10 | file text vs block edge | `FILE_PAD_X` (left); band gap `FILE_LINE_GAP` | **+13 / 18** | R02/R05 |
| 11 | cut lines inside block | `CUT_HALF = FILE.h/2−BREATH` | **8 inside** | R02/R15 |
| 12 | home cable vs window edge | `DROP_X − (WINDOW.x+WINDOW.w)` = `RIGHT_MARGIN_GAP` | **+30** | R02/R10 |
| 13 | content span / BBOX x | (server.pillRight − case.left) / BBOX.w = 1668/1692 | **98.6 %** | R09 |
| 14 | content span / BBOX y | (BELOW_Y − case.top) / BBOX.h = 825/849 | **97.2 %** | R09 |
| 15 | port-cable termination | stub top edge = `PORT.y−PORT.h/2` (starts *at* boundary) | **0 (exact)** | R10 |

Rows 13–14 use the derived bbox; rows 1–12 use named metrics — **no value in this table
is an un-named literal.**

## 6. Layout Debt Report

| | 🔴 Critical |  High |  Medium | 🟢 Low | Systemic |
|---|---|---|---|---|---|
| **Pre-fix (v1.0.3 audit)** | 0 | 1 (R1/case) | 1 (inbox placement) | 0 | **yes** (inline magic throughout) |
| **Post-fix (v1.0.4, verified)** | **0** | **0** | **0** | **0** | **no** (layout system in place) |

**Gate verdict: PASS** — the chapter is now driven by `metrics.ts` + `layout.ts`; the
renderers hold no fixed coordinate arithmetic; the inbox hugs the NIC by derivation;
every clearance above is proven by arithmetic from named constants.

## 7. Verification (final, post-fix)

| Check | Result |
|---|---|
| `npm run build` (tsc + vite) | **PASS** (ch-03 chunk 33.21 kB / 13.34 kB gzip) |
| `npm run smoke` — integrity, continuity, seams | **PASS** |
| Playthrough Ch-01 / Ch-02 | **59.9 s / 71.9 s — unchanged** (shared renderers untouched) |
| Playthrough Ch-03 | **54.4 s**, 13/13 beats |
| 13 beats × deterministic snapshots, visually audited | **PASS** (R16) |
| Change-class fence | **HELD** — geometry/layout constants only |
| Layout Debt gate | **0/0/0/0 + no systemic debt** |

*Amendment effective immediately. The frozen set 01–09 remains the design of record;
`10_`, `11_` and this document together form the layout delta. `05_SCENE_DESIGN.md` gains
a §8 "Layout system" pointer to this revision.*
