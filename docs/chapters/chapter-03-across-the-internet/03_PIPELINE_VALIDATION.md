# Chapter 03 — Phase 3: Pipeline Validation Record (FROZEN)

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** `02_PIPELINE.md` (FROZEN)
- **Produced artifact:** this validation record
- **Review status:** Passed — reviewed against `01_EDUCATIONAL_PHILOSOPHY` logic constraints
- **Frozen status:** FROZEN

---

## V1. No missing steps
Walked the chain from "response at the Server's door" to "whole file in RAM" and interrogated every arrow for a hidden state change:
- The learner cannot understand *why* packets exist before seeing the whole-stream failure → P03 present before P04.
- A packet cannot hop before the road is known to be a chain of machines → P02 before P05.
- Out-of-order arrival requires independent per-packet routing to be established → P06 before P08.
- The hole in the tray requires the drop to have been observed → P07 before P08.
- The gap cannot be *reported* before the receiver tracks continuity → P10 before P11.
- The file cannot be stitched before every slot is filled and ordered → P11 before P12; the file cannot be handed over before it is whole → P12 before P13.
- "Who fixes the mess?" requires the mess to be fully visible first → P08 before P09.
**No gaps found.**

## V2. Correct causal ordering (no use-before-define)
| Dependency | Check |
|---|---|
| Road structure before forwarding | P02 < P05 ✓ |
| Slicing motivated by the whole-stream problem | P03 < P04 ✓ |
| Sequence Numbers exist before they are used for parking/acking/stitching | P04 < P09, P10, P12 ✓ |
| Drop before the observed hole | P07 < P08 ✓ |
| Parking before the gap report | P09 < P10 ✓ |
| Gap report before targeted retransmission | P10 < P11 ✓ |
| Full ordered buffer before stitching; stitching before hand-off | P11 < P12 < P13 ✓ |
✓ PASS

## V3. No circular logic
Each step consumes only artifacts produced by earlier steps. No step references a downstream artifact (e.g., the ACK counter never needs stitched bytes; stitching never needs the hand-off). DAG verification: acyclic. ✓ PASS

## V4. No unclassified black boxes
| Opacity in pipeline | Classification (per Phase 1 §5) |
|---|---|
| Cable physics (light in glass, radio last stretch) | Terminal Boundary (declared) |
| How a Router knows its "closest neighbor to destination" (route tables/BGP) | Deferred Internal → future networking journey |
| Header formats, checksum/error-detection math | Deferred Internal → future journey |
| TCP handshake/windowing/congestion control | Deferred Internal (handshake already covered at story level by Ch-02 HTTPS) |
| Link framing between last Router and NIC | Deferred Internal → future journey |
✓ PASS — zero unclassified black boxes.

## V5. No "magic" condensed transitions (`01 §1.2` Brevity Prohibition)
Every state change the beginner must observe gets its own beat (Phase 4): the road reveal, the whole-stream failure, the slice, the hop-by-hop walk, the branch, the drop, the disordered tray, the parking, the counter, the ask, the single resend, the stitch, the hand-off. The drop (P07) is shown *inside* the routing beat as a secondary, dimmed event — not a separate lesson (attention economy, `02 §7`) — but it is visibly its own event, never implied. ✓ PASS

## V6. Technical correctness (established-knowledge audit)
1. No direct end-to-end wire; hop-by-hop store-and-forward — P02/P05. ✓
2. Segmentation into packets carrying header metadata incl. sequence numbers — P04. ✓
3. Per-packet independent routing; different paths for one flow — P06. ✓
4. Congestion drop at a router — P07. ✓
5. Out-of-order buffering without discard — P09 (RFC 9293). ✓
6. Cumulative ACK advancing only in order; duplicate ACK exposing the gap; fast retransmit of exactly the missing segment — P10/P11 (RFC 9293 + RFC 5681). The story shows the *observable essence* (a counter that only moves in order; a request for exactly one piece) with no invented mechanics. ✓
7. In-order concatenation into the original byte stream; placement into memory for the application — P12/P13. ✓
No step presents speculation as fact. ✓ PASS

## V7. Single State Mutation check (`01 §1.1` + `§2` Atomic Chunks)
One mutation per beat in Phase 4: road reveal (b1) · whole-stream failure (b2) · slicing (b3) · forwarding + independent paths + drop (b4) · disordered tray (b5) · slot 1 + keeper named (b6) · parking out-of-order (b7) · counter advance + gap (b8) · ask + single resend (b9) · stitch (b10) · hand-off to RAM (b11) · recap (b12).

Two inherent multi-variable moments are declared **Atomic Chunks** (`01 §2`), with sub-steps individually observable inside the beat:
- **b3 (slicing):** cuts + header stamping are one mechanical operation (a packet cannot exist half-cut); the header band and the number appear together because they are one structure. Sub-steps were isolated here (cut lines, then stamped chips) and are observable within the beat.
- **b4 (the road in motion):** packet 1's hop-by-hop walk is the primary mutation (full visual weight); the branch (packet 2) and the drop (packet 4) are secondary, dimmed agents (`02 §18`) demonstrating the *same* mechanism (live per-packet decisions) — not new concepts. Each is visually separable and is narrated separately (branch named in b4; drop named in b5).
- **b9 (ask + resend):** request and response are one causal pair (the resend exists only because of the ask); both halves are individually observable inside the beat (ask rises out through the port; the piece descends back).
✓ PASS

## V8. Scope guard (`03 §17` — teach only what the question needs)
Interrogated every step against the central question "How does data travel from a Server to the Browser?":
- DNS/HTTPS/HTTP semantics: absent (Ch-02). ✓
- Rendering of any kind: absent (Ch-02 Act 3); the browser window stays in its honest *loading* state throughout. ✓
- Routing tables, header math, windows, handshakes: pruned, classified (V4). ✓
The pipeline stops the instant the file is whole in RAM. Nothing after the answer. ✓ PASS

## Validation verdict: **PIPELINE VALIDATED** — proceed to Phase 4.
