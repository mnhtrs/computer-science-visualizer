# Chapter 03 — Phase 5: Scene Design (FROZEN)

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** `04_STORY_ARCHITECTURE.md` (FROZEN) and all earlier frozen artifacts
- **Produced artifact:** per-scene visual/structural specification + animation design (before narration)
- **Review status:** Passed — reviewed against `02_VISUAL_LANGUAGE` (causality, attention economy, canon) and `03` (knowledge-reveal readiness), then reconciled with the implemented renderers via headless visual QA (14 deterministic frames)
- **Frozen status:** FROZEN
- **v1.0.1 (implementation reconciliation):** file block + the spark's door anchors float *above* the cable (y 430, clear of the Server box top at 461) so the packet "drops onto the road" as it begins travelling; the browser window is shortened to 470 so the NIC inbox sits in the floor band, never inside the viewport; `PATH_B` is a 9-anchor slot-to-slot walk; beat timings below are the implemented ones.
- **v1.0.2 (UI/layout, presentation-only):** router web compressed (world width 1900→1740), home drop at x 880 outside the window, `cameraPad` raised, and all chapter-local world-space sizes enlarged for readability (see `10_UI_LAYOUT_REVISION_v1.0.2.md`).

---

## 0. Canonical style inheritance (`02 §10` mandatory)

Inherited verbatim from Chapters 01/02: starfield gradient background + vignette (composer) · golden spark + trail · `Quicksand` typography (mono accents `JetBrains Mono`) · fade-through-black scene changes (450 ms) · `easeInOutCubic` travel · glow-on-active · name labels under boxes · side-panel gloss system · beat dots timeline. Chapter accent: `#a78bfa` (violet). No aesthetic deviation. All new parts built from the shared primitives (`glow`, `rrPath`, `drawName`, `hexA`) with the same physics.

## 1. Scene A — `wire` (world 1920×920; bbox `{40,40,1940,940}`, cameraPad 0.9)

```
 ┌ Desktop case {60,80,840,790} — Ch-02's EXACT case ────────────────┐
 │  ┌── browser window {90,130,760×470} — loading state only ──────┐ │      c1      ┌R4┐  c2  ┌R3
 │  │  URL bar: 🔒 https://best-cats.example                       │ │  edge──●─────●──
 │  │  viewport (372h): spinner — "Waiting for best-cats.example"  │ │ (850,520) (1560) (1360,610)
 │  └──────────────────────────────────────────────────────────────┘ │      c5        c4 ╲   ╱ c3b
 │  "Browser"  ··· FLOOR BAND: the NIC inbox lives here ···          │  ●R1●───●R2●    ●R2b●   c1' ┌ SERVER ┐
 │  hardware row (y=805):  NIC      RAM      CPU      GPU            │ (990)  (1170,430)(1170,710) door─┤1840,520├
 │                         260      430      590      740            │                                   └────────┘
 └───────────────────────────────────────────────────────────────────┘
```

The home block (case + hardware row) matches Ch-02 byte-for-byte; the window is shorter (470 vs 600) so the floor band between the window bottom (600) and the hardware row (790) hosts the NIC inbox — packets-at-the-NIC are hardware, never drawn inside the Browser (`02 §2`, `§4`). The world extends east of Ch-02's rail into the Router web; the Server stands at the far end.

**Entities** (kind → renderer; gloss = Phase 6):

| id | kind | pos | color | role |
|---|---|---|---|---|
| `browser` | `browser-lite` | (470,410) | `#22d3ee` | Ch-02's window, honestly frozen in loading state the whole chapter |
| `nic` | `nic` | (260,805) | `#a5b4fc` | the home door; the inbox forms above it |
| `ram` | `ram-filled` | (430,805) | `#facc15` | the destination; the golden "HTML" fill grows from b11 |
| `cpu` | `cpu-chip` (shared) | (590,805) | `#fb923c` | presence + Ch-01 gloss; dim bystander |
| `gpu` | `gpu` (shared) | (740,805) | `#4ade80` | resting; its work is Ch-02's Act 3 |
| `server` | `service-box` | (1840,520) | `#22d3ee` | the origin; IP pill `93.184.216.34` from b0 (continuity callback) |
| `router4/3/2/2b/1` | `router` | (1560,520)/(1360,610)/(1170,430)/(1170,710)/(990,520) | `#a78bfa` | forwarding machines; hidden at b0, pop in staggered during b1, proximity-glow as a packet passes; R2 carries the congestion mark from b4 |
| `traffic` | `wire-traffic` (labelless) | (1300,520) | `#a78bfa` | beat-driven payload painter: imagined road, mesh cables (revealed in b1), file block, packet chips, other people's dim traffic, NIC inbox |

**Infrastructure:** `case` rect `{60,80,840,790}` · `hw-rail` `(260,805)→(740,805)` dim. The mesh cables are **not** infrastructure — they are painted by `wire-traffic` so the b1 reveal can animate them in (`02 §5`). Rails never glow (the spark owns attention, `02 §7`).

**Router glyph:** 96×62 rounded box, three forward chevrons `≪` pointing WEST (the bytes' direction — no false symbolism: a Router's observable job *is* receive-decide-forward), name "Router" under each (one term, `03 §6`); the name's alpha scales with the reveal factor so a not-yet-popped Router never leaks its label.

**`wire-traffic` storyboard** (pure f(beatIndex, beatElapsed, t) — `02 §15`):

| beat | painted state |
|---|---|
| waiting, b0 | the file block (golden 120×36, `<html>` + "All About Cats") hovers at the door `(1697,430)` above the cable, bobbing; the imagined road = faint dashed hairline `(850,520)→(1762,520)` |
| b1 | imagined road dissolves (alpha ∝ 1−lin); cables draw machine-to-machine in reveal order R4→R3→(R2,R2b)→R1→edge, staggered with the router pops |
| b2 | block rides the spark along the open space above the cable (hover→clog, y 430); 2 dim other-traffic sparks queue behind; at lin≈0.55 one cell flashes red (corrupted bit), `!` ticks above |
| b3 | block holds above the door; three cut lines flash (0.30/0.40/0.50); at 0.55 the block separates into five chips that pop to a fan above the door: (1697,430),(1759,430),(1821,430),(1728,382),(1790,382) |
| b4 | chip 1 = spark position (rides it exactly, `02 §13`); chips 2,3,5 (dim 0.32α) stream west on their windows (#2 [0.50→0.94] branch, #3 [0.30→0.80], #5 [0.42→0.87]); chip 4 [0.24→0.60] fizzles at R2 (red ring + shrink + `×`); chip 1 parks at the NIC from 0.70 while 3,5,2 close in (arrival order 1,3,5,2) |
| b5 | surviving chips rise from the NIC door into the floor-band inbox in arrival order 1 [0.05→0.20], 3 [0.22→0.37], 5 [0.39→0.54], 2 [0.56→0.71]; a dashed ghost slot with a pulsing `?` marks the absent 4 |
| b6–b10 | (scene `bench`) |
| b11 | inbox gone (its content is inside now); the `ram-filled` renderer grows the golden "HTML" fill; block rests inside the RAM cell |
| b12 | static end state (web dim and quiet); 5 ambient dim traffic sparks drift along the cables (t-driven, 0.16α — "the road stays alive"); RAM glows; spark loops PATH_A |

**Browser-window viewport** — pure function of `beatIndex`: loading state only (progress bar + spinner + "Waiting for best-cats.example…") for every beat. The rendered page never appears (Ch-02's Act 3; pre-showing it would be a temporal lie, `02 §5`, `03 §2`).

## 2. Scene B — `bench` (world 1400×960; bbox `{80,10,1320,950}`, cameraPad 0.94)

```
        ┌ NIC port (700,80) — the same NIC seen from inside (cable stub 700,40→700,20)
        │
 ┌──────────── REASSEMBLY BUFFER bench {140,260,1120,420} ────────────┐
 │ caption (top-left) ····························· ACK counter (top-right) │
 │   ┌slot1┐   ┌slot2┐   ┌slot3┐   ┌slot4┐   ┌slot5   (84×84, y=430)  │
 │   │ 340 │   │ 520 │   │ 700 │   │ 880 │   │ 1060│                   │
 │   └─────┘   └─────┘   └─────┘   └─────   └─────┘                   │
 │              merge zone (700,600): strips → column → fuse → block    │
 └──────────────────────────────────────────────────────────────────────┘
        └ RAM door (700,860) — the floor exit, same RAM seen from outside
```

**Entities:** `nicport` (kind `port`, (700,80), `#a5b4fc`) · `bench` (kind `reassembly-bench`, center (700,470), `#e2e8f0`, name "Reassembly Buffer") · `ramDoor` (kind `ram` shared, (700,860), `#facc15`).
**Infrastructure:** `port-cable` stub `(700,40)→(700,20)` dim.

**Bench storyboard** (`stageAtBeat`, `frac = easeInOutCubic(clamp(beatElapsed/dur))`; the keeper = the spark walks slots, pieces drop from the port on their own window timed to land as the keeper dwells):

| beat | stage | bench state |
|---|---|---|
| b6 | `slot1` | five empty slots (dashed, numbers below); Piece 1 drops port→slot 1 [0→1] with the keeper; on landing the slot solidifies; ACK `✓0`→`✓1` at 0.97 |
| b7 | `park` | keeper walks slot1→slot3→slot5; Piece 3 drops [0.10→0.50], Piece 5 [0.55→0.98], each into its own slot as the keeper arrives; a dim ✓ drifts to the port after each; ACK holds `✓1` |
| b8 | `counter` | keeper walks slot5→slot2 and dwells (holdAt); Piece 2 drops [0.05→0.60]; ACK jumps `✓1`→`✓3` at 0.62; slot 4 begins its red gap-pulse |
| b9 | `ask` | a coral `need #4` chip rises out through the port [0→0.30]; keeper dwells at slot 4 (holdAt); Piece 4 drops [0.45→0.85]; ACK `✓3`→`✓5` at 0.88 |
| b10 | `merge` | the five payload strips leave their slots in order (0.06+k·0.05), gather into a visible column, converge to center, fuse into the golden file block (0.62→0.80, "whole ✓" pops), then glide to the RAM door (0.80→1.0) with the keeper |

A slot's frame asserts "occupied" only once its piece is nearly in (or a settled chip rests there) — structure vs state, `02 §4`. Continuity details: the chips inside are the *same* chips as on the road (same body, `#k`, header band); the bench file block is the *same* block shape as at the Server's door (`02 §4`).

## 3. Animation design (paths; `easeInOutCubic` everywhere; ambient orbit when resting)

**PATH_A (12 points):**
`0 hover(1697,430) · 1 clog(1672,430) · 2 hover(1697,430) · 3 R4(1560,520) · 4 R3(1360,610) · 5 R2(1170,430) · 6 R1(990,520) · 7 edge(850,520) · 8 corner(850,805) · 9 NIC(260,805) · 10 RAM(430,805) · 11 RAM-dup`
Anchors 0–2 float above the cable (y 430), clear of the Server box; at b4 the spark drops onto the road (→R4 at y 520). Beats: b0 rest0 (emerge) · b1 rest0 · b2 travel 0→1 · b3 travel 1→2 · b4 travel 2→9 holdAt{9, 0.70, 0.99} · b5 rest9 · b11 rest10 · b12 rest11 + loop. Seam hook (`wire`): NIC `(260,805)`.

**PATH_B (9 points):**
`0 port(700,80) · 1 slot1(340,430) · 2 slot3(700,430) · 3 slot5(1060,430) · 4 slot2(520,430) · 5 slot4(880,430) · 6 merge(700,600) · 7 ramdoor(700,860) · 8 ramdoor-dup`
Beats: b6 travel 0→1 · b7 travel 1→3 · b8 travel 3→4 holdAt{4, 0.60, 0.99} · b9 travel 4→5 holdAt{5, 0.85, 0.99} · b10 travel 5→8. (`holdAt.to` stays < 1 — `update.ts` divides by 1−h.to.) Seam hook (`bench`): RAM door `(700,860)`.

**Durations (ms):** b0 2800 · b1 4200 · b2 3400 · b3 3800 · b4 6200 · b5 3600 · b6 3200 · b7 3800 · b8 4000 · b9 4200 · b10 3600 · b11 3200 · b12 7500 ≈ **53.5 s**.

## 4. Concept-readiness matrix (`03 §13` Knowledge Reveal authorization)

| Term unlocked | Only after observing |
|---|---|
| Router, Internet (b1) | the web of machines lighting up; the straight road dissolving |
| Packet, header, Sequence Number (b3) | the whole-file failure; the slice; the stamped chips |
| Routing (b4) | the hop-by-hop walk; R3 sending Packet 2 around |
| (drop, out-of-order — phenomena, b4/b5) | Packet 4 fizzling; the inbox 1,3,5,2 with the `?` |
| TCP, Reassembly Buffer (b6) | the keeper placing Piece 1 into its numbered slot |
| ACK (b8) | the counter advancing only in order; the ✓ checks at the port |
| retransmission (b9) | the ask leaving; exactly one piece returning |
| (stitching — the answer, b10/b11) | strips fusing into the whole block; RAM filling |

## 5. Attentional economy (`02 §7/§16/§18`)
Exactly one active glow per beat. Secondary packets at 0.32α; other people's traffic at ≤0.25α; the spark carries 100% of active weight. Cables dim; routers quiet until a packet passes. The bench holds the visual weight during Act 3; port/counter animations are small and peripheral. Misconception guardrails M1–M6 embedded in geometry (imagined road dissolves; five explicit chips; branch + inbox order; parked pieces; single-piece resend).

## 6. Transition spec (sealed)
wire→bench (b6 has `scene:'bench'`; fade 450 ms; seam = NIC) · bench→wire (b11 has `scene:'wire'`; seam = RAM door ↔ PATH_A 10). UI: hash-route level unchanged; `Step x / 13` counter; bench beats show the scene tag "Inside the receiving machine" and the green inside-step dots (viewer shell V-01 Inside Parity — automatic for a multi-beat non-home group).

## 7. Waiting phase
Scene `wire` at rest (b0 pre-state): the imagined road faint, the file block bobbing above the Server's door, the Server gently lit. **Hit-zone: the Server box** — the learner starts the journey by sending the response (the first cause of the whole chapter is *their* click, mirroring Ch-01's file click and Ch-02's result click).

## 8. Layout system (v1.0.4 — the coordinates are NOT hand-placed)
Every coordinate in this chapter is a named primitive in `scenes/metrics.ts` or a value
derived in `scenes/layout.ts` from a container rect + measured text; the bbox and the
home-drop route are derived in `01-the-wire.ts` / `02-reassembly.ts`. The renderers
contain no fixed pixel arithmetic. The inbox tray is derived from the NIC (so it hugs the
NIC by rule), and every clearance is proven by arithmetic. Full audit, the R01–R19 sweep
and the AABB proof table live in **`12_LAYOUT_REVISION_v1.0.4.md`** (the layout
constitution is recorded in `docs/chapters/chapter-02-browser-loading/12_LAYOUT_REVIEW.md`
§4, R01–R19, plus R18/R19). The values in §1–§3 above are the *design intent*; the
authoritative, derived numbers are in `metrics.ts` / `layout.ts`.
