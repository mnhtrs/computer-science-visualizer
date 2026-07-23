# Chapter 03 — Phase 4: Story Architecture (FROZEN)

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** `03_PIPELINE_VALIDATION.md` (FROZEN), `02_PIPELINE.md`, `01_JOURNEY_DEFINITION.md`
- **Produced artifact:** ordered scene list + beat map; every pipeline step covered; protagonist continuously traceable
- **Review status:** Passed — reviewed against `02_VISUAL_LANGUAGE` §13/§14 (continuity, causality)
- **Frozen status:** FROZEN
- **v1.0.1 (implementation reconciliation):** beat `route` now ends with the spark *parked at the NIC* (`travel 2→9` + `holdAt`, 6200 ms) so the last siblings visibly arrive in order 1,3,5,2; `mess` rests at the NIC; inside-scene path redesigned to a slot-to-slot walk (9 anchors) so the keeper's attention and each piece's descent stay causal (see `05` §3 and the renderers). Numbers below are the implemented ones.
- **v1.0.2 (UI/layout, presentation-only):** geometry compressed horizontally and the home cable rerouted to drop outside the Browser window (see `10_UI_LAYOUT_REVISION_v1.0.2.md`); no change to beats, narration, or continuity.
- **Authoritative-source note (closure review):** the *design intent* (scenes, beat order, transitions, continuity, misconception mapping) in this document is the frozen record; the **exact** beat indices, path anchors, and durations live in the code (`narration/beats.ts`, `scenes/01-the-wire.ts` PATH_A) and were finalised by revisions `10_`–`12_`. Where a literal index/timing below differs from the code (e.g. the v1.0.1 `route` value `travel 2→9`), the **code wins** — this mirrors the Ch-02 convention (frozen design docs are snapshots; revisions layer on top; the code is the source of truth). Read this doc for *why*; read the code for *the exact numbers*.

---

## 1. Scenes (2 — same count and same structure as Chapters 01 and 02)

| Scene | ID | Acts | Metaphor | Covers |
|---|---|---|---|---|
| The Road (the Internet between the machines) | `wire` | Act 1, Act 2, Finale | home on the left (Ch-02's exact case + hardware row), the Server on the right, a web of Routers between | P01–P08, P13 |
| Inside the Receiving Machine | `bench` | Act 3 (core) | the keeper's workshop: NIC port in the ceiling, numbered Reassembly Buffer bench, RAM door in the floor | P09–P12 |

The home side of `wire` reuses Ch-02's case and hardware row at identical coordinates (`02 §6`, `02 §17`); the browser window is intentionally *shorter* (height 470 vs Ch-02's 600) so the NIC inbox lives in the floor band below it — the continuity-critical hardware row, where bytes actually land, is unchanged.

## 2. The Canonical Learning Rhythm (AUTHORING_WORKFLOW Phase 4)

| Rhythm stage | Beats | What the learner experiences |
|---|---|---|
| **Observe** | b0 | the Server at its door with the finished response — the exact moment Ch-02's bytes "left" |
| **Focus** | b1 | attention to the road itself: no wire — a web of machines |
| **Explore** | b2–b5 | why packets; how they hop; how they branch; how they drop; how they arrive in disorder |
| **Understand** | b6–b10 | the keeper (TCP): slots, parking, the ACK counter, the single resend, the stitch — the learner can now predict each step |
| **Continue** | b11 | the whole file slides into RAM — the journey walks straight into Ch-02's doorstep |
| **Summarize** | b12 | the spark tours the whole circuit; the chain is recited; the central question closes |

## 3. Act map & time budget (13 beats; durations = Phase 5)

| Act | Purpose | Beats | Σ duration | Share |
|---|---|---|---|---|
| 1 — The door & the road | response ready; the road revealed as a web of machines | b0–b1 | 7.0 s | ≈13% |
| 2 — The road in motion | whole-file failure → packets → hopping/branching/dropping → disordered arrival | b2–b5 | 17.0 s | ≈32% |
| 3 — The keeper & the hand-off | TCP slots → ACK → resend → stitch → RAM → recap | b6–b12 | 29.5 s | ≈55% |

Total ≈ 53.5 s (runtime playthrough 54.4 s incl. the done-frame cap). Every scene advances the central question; zero independent explanatory units.

## 4. Beat map (pipeline coverage + central-question advancement)

| Beat | Act | Scene | Covers | Observable event (the visible cause) | Advances the question by |
|---|---|---|---|---|---|
| b0 ready | 1 | wire | P01 | spark emerges above the Server's door; the file block hovers there; a faint dashed "imagined straight road" to home | establishing the entry state (Ch-02's P08 boundary) |
| b1 road | 1 | wire | P02 | the straight road dissolves; the Router web lights up machine by machine, cables drawing between them | the road is machines, not a wire (M1, M6) |
| b2 whole | 2 | wire | P03 | spark + file slide along the open space above the cable; the block monopolizes it, dim traffic queues behind; one bit flips red | why sending whole fails (M2 problem) |
| b3 slice | 2 | wire | P04 | cut lines flash across the block; five numbered chips appear above the door, each with a header band | Packets + header + Sequence Number (M2 solution) |
| b4 route | 2 | wire | P05–P07 | spark rides Packet 1 R4→R3→R2→R1→NIC, each Router lighting as it forwards; Packet 2 (dim) takes the R2b branch at R3; Packet 4 (dim) fizzles at the congested R2; Packet 1 parks at the NIC as 3, 5, 2 close in | hop-by-hop forwarding; live per-packet decisions; drops; arrival order 1,3,5,2 (M3, M6) |
| b5 mess | 2 | wire | P08 | the NIC inbox (floor band) fills 1, 3, 5, 2; a dashed "?" slot pulses for 4; spark rests at the NIC | the road gives back a disordered pile with a hole (M3 visible) — and the question: who fixes this? |
| b6 slot-1 | 3 | bench | P09 | fade through black; inside: NIC port in the ceiling, bench with five numbered empty slots; the keeper escorts Piece 1 port→slot 1; keeper named: TCP; bench named: Reassembly Buffer | the supervisor + numbered slots (M4 foundation) |
| b7 park | 3 | bench | P09 | the keeper walks slot1→slot3→slot5; Pieces 3 and 5 drop from the port into their own slots as the keeper arrives; dim ✓ checks drift up | out-of-order pieces parked, never discarded (M4 resolved) |
| b8 counter | 3 | bench | P10 | the keeper walks slot5→slot2 and dwells; Piece 2 drops in; the ACK counter jumps 1→3; slot 4 pulses empty | the counter advances only in order — the gap becomes visible |
| b9 ask | 3 | bench | P11 | a "need #4" chip rises out through the port; the keeper dwells at slot 4; Piece 4 drops in; counter →5 | only the missing piece travels again (M5 resolved) |
| b10 merge | 3 | bench | P12 | payload strips leave the slots in order, gather into a column, converge, fuse into one golden block ("whole ✓"), glide to the RAM door | the slices become one stream, in order |
| b11 home | 3 | wire | P13 | fade back; RAM fills and glows "HTML" — the window above still honestly loading; spark rests on RAM | the file is home, whole: the question answered visibly |
| b12 recap | 3 | wire | — | spark tours the whole circuit (server→web→NIC→RAM); narration recites the chain | consolidation; the hand-off sentence lands on the Browser |

## 5. Protagonist continuity proof (`02 §13`)

- **b0→b5 (wire):** spark path is one unbroken polyline (PATH_A, 14 anchors; see `01-the-wire.ts` for the exact coordinates). b0/b1 rest at anchor 0 (the hover above the door); b2 travels 0→1 (hover→clog, above the cable) and b3 1→2 (clog→hover, the slice); b4 travels 2→11 (hover→R4→R3→R2→R1→DROP_TOP→DROP_MID→UNDER→PLUG→NIC) with a dwell at the NIC; b5 rests at the NIC. Every beat resumes at the previous beat's terminal anchor — no index gaps, no jumps. (The v1.0.1 text said `2→9 … edge→corner→NIC`; the v1.0.2 reroute moved the home drop below the case, so the authoritative indices are the code's.)
- **wire → bench (b5→b6):** fade-out holds the spark at the NIC (seam hook `(260,805)`); PATH_B starts at the NIC port — the same door seen from inside. Scene change caused by b5's on-screen question (the disordered inbox).
- **b6→b10 (bench):** single polyline PATH_B (9 anchors): port→slot1→slot3→slot5→slot2→slot4→merge→RAM door. The keeper walks slot-to-slot and dwells (via `holdAt`) exactly where each piece lands; pieces descend from the port on their own window, synced to the dwell.
- **bench → wire (b10→b11):** fade-out holds at the RAM door (PATH_B end); `wire` reopens with the spark resting on RAM (PATH_A anchor 10) — the same RAM, seen from outside.
- **b12:** `effect: 'loop'` — spark orbits the whole circuit (Ch-01/Ch-02 canonical finale behavior).
- Payload metamorphoses (stream → packets → parked pieces → stitched block) happen only while visible (above the door, on the bench) — **on-screen only**. ✓

## 6. Transition causality audit (`02 §14`)

| Transition | Visible cause established in |
|---|---|
| wire → bench (b5→b6) | the NIC inbox shows 1,3,5,2 with a hole; narration asks "who puts this mess back into a file?" — the zoom inside is the answer |
| bench → wire (b10→b11) | the stitched block crosses the RAM door in the bench floor (b10's final motion) |

Both scene changes are consequences, not narration declarations. ✓

## 7. Central-question coverage
Opening question kept open by design: b0–b1 establish *where* the data must go; b2–b5 answer *how it crosses distance* (packets + routing); b6–b10 answer *how it arrives whole* (TCP); b11 answers it visibly (whole file in RAM); b12 recites it. The final frame is literally the answer: bytes, whole, at the Browser's doorstep. PASS — proceed to Phase 5.
