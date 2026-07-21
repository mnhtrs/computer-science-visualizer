# Chapter 02 — UI/Layout Revision v1.3.5 (Owner Feedback Round 5)

> ⚠️ **ERRATUM (VIEWER SHELL v1.1.0):** **F35**'s top-LEFT corner for the scene tag is superseded by **F63** in `/docs/viewer/01_VIEWER_SHELL_REVISION_v1.1.0.md` — owner round 15 swapped the corners: tag now sits top-RIGHT, the Home pill takes the tag's old spot (re-measured; the F35 zone-selection method was reused). Everything else in F35 stands.

> ⚠️ **ERRATA (v1.3.6):** **F33** (sequential hand-overs scheduled inside the *new* beat's head) is superseded by **F38** in `19_UI_LAYOUT_REVISION_v1.3.6.md` — the fade now belongs to the *old* beat's tail, so a dot never shows the previous block at all. **F37** stays conceptually (orange, loud group stop) but its shape is amended by **F40**: the 18 px pill is back to a 9×9 circle with the same ring and glow.

**Status:** applied & verified · **Date:** 2026-07-20
**Scope:** `chapter-02-browser-loading` + shared viewer/primitive. Frozen docs 01–09 untouched; Chapter 01 behavior preserved (smoke byte-identical).
**Builds on:** v1.3.4 (16_).
**Change classes touched:** layout inside the fence (F34 control order, F35 tag pin) — and, **explicitly ordered by the owner this round**, three outside-fence classes: animation timing (F33, "block cũ phải biến mất hẳn thì mới sinh block mới"), scene-path choreography (F36, "đứng yên ở HTTP để bước sau đâm tiếp vào block server"), and style (F37, "viền đậm hơn hay màu cam hơn nổi bật hơn… tham khảo ở chapter 1"). Recorded openly per governance.
**Pairs with:** `18_NARRATION_VOICE_v1.4.0.md` — the same round's narration complaint (L-47) is a separate change class (strings), shipped as its own amendment.
Beat count, durations, narration strings: **unchanged here** (smoke: 4304 frames ≈ 71.9 s).

---

## 1. Owner complaints (round 5, verbatim paraphrase)

- **L-42** Hand-over mud: at every scene change between content blocks, the old block is still dimly visible while the new block is already being born. The old block must fade out **completely** before the new one appears.
- **L-43** Wrong button order: the engine-group **↺ Replay** sits *before* the ▶ next button ("Sao nút next lại ở sau nút replay vậy?").
- **L-44** The scene tag ("Inside the Browser Engine") should be pinned to the **top-left corner** of the stage, not floating in the controls row.
- **L-45** Audit request: some timeline dots show **no nodes** ("có những chấm mà nó bị mất cái node") — bug or feature? Fix if bug.
- **L-46** The HTTPS spark dives into the lock and then **comes back** ("đâm vào thì đứng yên ở HTTP để bước sau đâm tiếp vào block server rồi mới quay lại chứ?"). It should go to the lock and **stay**; the next beat continues from the lock into the server.
- **L-47** Narration voice: make it everyday-human, not AI-flavored; use fewer dashes. → shipped in **18_** (v1.4.0).
- **L-48** The yellow dots that open a green interior timeline should look **distinct** — bolder border, more orange, like Chapter 1's special chips.

## 2. Measured findings

| # | Evidence | Measurement / root cause |
|---|---|---|
| L-42 | `web-parts.ts` stages | v1.3.3's F28b ghosts faded over the early frac **while** the successor grew from frac ≈ 0 — two content blocks on screen at once (e.g. token chips ghost 0–0.35 with the DOM tree growing in parallel; render-tree ghost overlapping the layout blueprint). Confirmed in `v-b10-early`, `v-b11-early` renders. |
| L-43 | `Viewer.tsx` (v1.3.4 F32) | When inside the engine group, ctl-center rendered `◁ · cycleDots · ↺ Replay · ▶` — Replay sat between the green strip and the main ▶. DOM chrome can't be rendered headless; verified by construction. |
| L-44 | `index.css` `.sceneTag` (v1.3.1 F19 / v1.3.3 F26a) | Tag lived in `ctl-right` of the 3-zone controls grid — never a corner pin. At 836×570 the tag's nearest web content is the 'Desktop' label ≈ 8 px lower; engine content starts at x ≈ 348 — so a top-left **stage overlay** collides with nothing at any zoom. |
| L-45 | all 23 seams | Content mid-beat ≠ content at beat start; scrubbing lands at beat start. See the full audit in §4 — **verdict: feature**, and the one genuine discontinuity class (b11→b12 retraction) was already killed in v1.3.3 (F28a). |
| L-46 | `PATH_A` after v1.3.4 F31 | The `https` beat walked `850,300 → 850,520 → 980,520 (lock) → 980,520 → 850,520 → 850,300` — a knock **and visible return home inside one beat** (path len 700, lock reached at t=0.5). The owner's round-4 wording ("đi đến khóa HTTP") meant *stay*, I built *knock-and-return* — my misreading, corrected here. |
| L-48 | `Viewer.tsx` group stop | The group-entry stop rendered as a plain `.dot` — visually identical to solo stops; the owner's mental model (Ch-1 `.dot.cpu`) wants the "opens an interior" stop to announce itself. |

## 3. Fix package (approved via ask_user: pkg-r5 = yes)

### F33 — sequential hand-overs everywhere (L-42; animation timing, owner-ordered)
Every content hand-over is now strictly **fade-out-then-grow**; windows verified in code:

| Stage (beat) | Old block fades | New block starts | Window in code |
|---|---|---|---|
| `stageChars` (b09 decode) | byte cells | char lines, then chips | ghost `frac/0.15` → lines `(frac−0.17)/0.12`, chips `(frac−0.19)/0.81` |
| `stageDom` (b10 tokenize→DOM) | token chips | DOM tree grows | ghost `frac/0.22` → tree `(frac−0.24)/0.76` |
| `stagePaused` (b14 js-pause) | CSSOM cards | tree regrow + script ring | ghost `frac/0.24` → regrow `(frac−0.26)/0.3`, ring `(frac−0.26)/0.5` |
| `stageRenderTree` (b16) | DOM bg settle (F28d, kept) | render-tree nodes | settle `frac/0.38` → nodes `(frac−0.42)/0.58` |
| `stageLayout` (b17) | render tree ghost | blueprint outline + boxes | ghost `frac/0.26` → `f2=(frac−0.3)/0.7` |
| `stagePaint` (b18) | blueprint settle (F23, kept) | receipts stack | settle `frac/0.35` → receipts `(frac−0.35)/0.65` |
| `stageRaster` (b19) | receipts ghost | pixels light up | ghost `frac/0.2` → pixels `(frac−0.22)/0.78` |
| `stageComposite` (b20) | raster page ghost | layers slide, page snaps | ghost `frac/0.28` → slide `(frac−0.3)/0.38`, snap `(frac−0.68)/0.32` |

Beat durations untouched; ~2–10 % of each beat now shows the clean gap between blocks instead of overlap mud. Verified: `v-b10-early` (frac 0.1) shows fading cells only, no char lines yet.

### F34 — Replay to the end of the row (L-43; layout fence)
Inside a group, ctl-center order is now `◁ back · cycleDots (green strip) · ▶ play/pause · ↺ Replay` — Replay last, nothing between it and the edge; solo-scene chapters unchanged.

### F35 — scene tag pinned top-left of the stage (L-44; layout fence; **supersedes F19 + F26a**)
`.sceneTag` moved out of `ctl-right` into `.stage` as an absolutely positioned overlay: `position:absolute; top:14px; left:14px`. By construction at the owner's sizes: 14+~22 px tall tag in a zone whose nearest content is ≥ 8 px clear (web) and whose engine content starts at x ≈ 348 — zero overlap at every zoom. `ctl-right` is now an empty `<div>` keeping the 3-zone grid balanced.

### F36 — HTTPS spark stays at the lock (L-46; scene choreo, owner-ordered; **amends F31 semantics**)
`PATH_A` re-anchored around the lock, everything else untouched:
- `[12][13]` `(850,520)/(850,300)` → `(980,520)` dups — the https beat's sub-path 8→13 now **ends at the lock** (path len 350: 220 down + 130 right, then zero-length dups).
- `[14]` = `(980,520)` — the request beat **starts AT the lock** (b4 end === b5 start, no seam jump), crosses `[15][16]` = `(1102,520)` server door dups.
- Equal-speed travel + `easeInOutCubic`: the spark decelerates into the lock, dwells there (~0.6 s ease-out tail of `https` + ~0.2 s ease-in head of `request`), then proceeds through to the server. Reading: *knock → agree → stay → continue*. Verified: `u-b04` spark parked on the 🔒 at beat tail.

### F37 — group stops announce themselves (L-48; style class, owner-ordered, Ch-1 cousin)
New `.dot.group`: 18 px pill, `border-radius:5px`, 1.5 px orange border `rgba(251,146,60,0.9)`, orange glow, with `done`/`active` variants — a cousin of Ch-1's `.dot.cpu`. Applied in the group renderer when `g.from !== g.to && g.scene !== homeScene` (i.e. exactly the stops that contain a green interior). Main row keeps its 12 stops; only the engine-group stop changed shape.

## 4. The L-45 audit — "nodes die at some dots": all 23 seams

Verdict: **feature, not a bug.** A timeline dot lands you at the *start* of a beat; every beat *builds* its content during its own duration (Constitution: one mutation per beat). Scrubbed views therefore always show a beat's intro state, and mid-beat states are only reached by playing. The audit: content at every seam must (a) continue, never retract, (b) hand over at exactly one boundary, (c) respect scene-coord identity.

| Seam | Hand-over | Continuity check | ✓ |
|---|---|---|---|
| b00→b01 | link (470,348) → URL bar | `knows` travels 0→2 from rest anchor 0 | ✓ |
| b01→b02 | window edge → DNS | spark at 850,300 = travel start 2 | ✓ |
| b02→b03 | DNS q → DNS a | spark at dns door 5 both sides | ✓ |
| b03→b04 | DNS answer → handshake | spark back at 850,300 (anchor 8) | ✓ |
| b04→b05 | lock → request | **(F36)** b04 ends (980,520) = b05 starts (980,520) | ✓ |
| b05→b06 | request → server works | at server door: rest 17 = (1102,520) dup | ✓ |
| b06→b07 | server → response | starts at rest 17, walks 17→22 home | ✓ |
| b07→b08 | RAM → engine door | travel 22→23 (430,805 → 470,430) | ✓ |
| b08→b09 | **scene: web → engine** | seam entry at PATH_B[0] (decode, 330,170) | ✓ |
| b09→b10 | bytes→chars (F33) | spark rest 0 → travel 0→1 | ✓ |
| b10→b11 | chips→tree (F33) | spark at tokenizer 1 = travel start 1 | ✓ |
| b11→b12 | DOM grows, CSS detour | tree ends 3 nodes = css-fetch opens with 3 (v1.3.3 F28a killed the 6→3 retraction) | ✓ |
| b12→b13 | CSS returned | spark back at parser (anchor 4 = anchor 2 coords); tree 6 nodes carried | ✓ |
| b13→b14 | + CSSOM cards → script pause | cards ghost (F33), tree regrows; script node is *additive* (the `<script>` token parses) | ✓ |
| b14→b15 | pause → run | same tree; mutation swaps only the `p` label at frac 0.3 | ✓ |
| b15→b16 | DOM → Render Tree | bg DOM settles whole (F28d) keeping script node + mutated label, then fades | ✓ |
| b16→b17 | Render Tree → Layout | F33: full fade before blueprint | ✓ |
| b17→b18 | Layout → Paint | F23 settle (left strip), receipts after | ✓ |
| b18→b19 | Paint → Raster | F33: receipts fade, pixels after | ✓ |
| b19→b20 | Raster → Composite | F33: raster ghost, layers after | ✓ |
| b20→b21 | **scene: engine → web** | seam entry at PATH_A[24] (GPU 740,805); drawn frame handed to the screen | ✓ |
| b21→b22 | screen glow → recap | rest 25 both beats; finale growth runs to 0.96 during b21 only and holds | ✓ |
| b22→b00 (↺) | loop | full state reset; browser `emerge:true` rebuilds from rest anchor 0 | ✓ |

**No retraction anywhere; no double-birth anywhere (F33); no teleport anywhere (F36).** The "disappearing nodes" the owner saw are beats at their start of construction.

## 5. Verification

- `npm run build` (tsc + vite) — **PASS**; `npm run smoke` — **PASS** (ch1 3585 frames ~59.9 s identical; ch2 4304 frames ~71.9 s identical, both seams OK).
- Owner-size renders re-audited incl. seam-first-5% samples (R16 addendum): `v-b10-early` clean (cells only), `v-b13-crashwin` (frac 0.02) still clean post-rrPath-clamp, `u-b04` spark parked on the lock, `u-b00`…`u-b20` intact.
- Vietnamese diacritics grep — 0 hits.
- **DOM-only items pending owner eyeball after reload:** grouped timeline (12 stops), the new orange `.dot.group` pill, Replay at row end, tag pinned top-left of the stage.

## 6. Errata (pointers recorded in the superseded docs)

- **13_ F19** (tag parked in controls row) — superseded by **F35** (tag now a top-left stage overlay).
- **16_ F31** (HTTPS "knock at the lock and return") — semantics amended by **F36**: the spark *stays* at the lock; the request continues through.
- **16_ F32** (grouped timeline) — Replay position inside the strip fixed by **F34**.
