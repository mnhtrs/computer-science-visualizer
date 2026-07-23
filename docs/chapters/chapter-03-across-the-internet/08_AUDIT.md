# Chapter 03 — Independent Audit Record (FROZEN)

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** `07_SELF_REVIEW.md` (FROZEN) + all chapter artifacts
- **Produced artifact:** this Independent Audit Record (role-separated cold read: the auditor re-derives every claim from primary sources — the Constitution, the pipeline, the frozen script, the running code, the rendered frames — never from the author's conclusions)
- **Review status:** PASSED — zero unresolved comments, zero constitutional violations, zero technical flaws
- **Frozen status:** FROZEN

---

## A. Hand-off integrity (could a stranger take over?)
1. Traceability chain: Definition → Pipeline → Validation → Story → Scene → Narration → Code, each artifact naming its parents; 04/05 carry a v1.0.1 reconciliation note tying them to the implemented geometry. ✓
2. Single sources of truth: geometry in `scenes/`, pipeline micro-data (cables, routes, chip windows, inbox, bench stages, ACK timings) in `scenes/03-story.ts`, script in `narration/`, assembled in `assemble.ts`. No duplicated authority found. ✓
3. A stranger can extend or amend Chapter 03 using only Phases 4–6 + `narration/beats.ts` + `scenes/` geometry + the renderers' stage tables. ✓

## B. Constitutional spot-audit (cold re-read, law by law)
| Law | Cold verification | Verdict |
|---|---|---|
| `00 §4` Absolute Accuracy | Hop-by-hop store-and-forward, per-packet routing, congestion drop, out-of-order buffering, cumulative ACK, single-segment retransmit, in-order concatenation — re-derived from established Internet/TCP behavior; narration says exactly this and no more. | ✓ |
| `00 §4` No Unlearning | Nothing taught is later contradicted at interview depth: TCP = ordered/reliable delivery (scales to RFC 9293); routers = destination-based forwarders (scales to routing courses); packets = segmented units with addressing metadata (scales to packet-capture analysis). The imagined whole-file beat is flagged as imagination, not system behavior. | ✓ |
| `01 §1` Single mutation | 13 beats ↦ one artifact/transformation each (Phase 3 V7); the 3 atomic chunks have individually-observable sub-steps. | ✓ |
| `01 §3` Black Box Rule | every opacity classified (Phase 1 §5); route-table/header/checksum/windowing/link-framing Deferred; cable physics Terminal; nothing mechanized behind a false analogy. | ✓ |
| `02 §2` Structural Isomorphism | Router web = real topology of forwarding nodes; inbox at the NIC (not the Browser); slot frames track real occupancy; the cumulative-ACK counter stalls exactly as a real receiver's would. Re-checked frame by frame. | ✓ |
| `02 §10` Canon vs Ch-01/02 | same composer, spark, trail, physics, fade, fonts; home block reuses Ch-02 coordinates; new parts use shared primitives only. No aesthetic deviation detected. | ✓ |
| `02 §13 / §14` Protagonist + transition causality | continuity mechanically proven (smoke); both scene changes preceded by visible causes (the disordered inbox; the block crossing the RAM door); the spark is continuously traceable (slot-to-slot walk, no teleport). | ✓ |
| `02 §15` Time-travel determinism | every renderer is f(beatIndex, beatElapsed, t); smoke snapshots at 0.55·duration per beat — no nondeterminism; scrubbing/pausing safe (no fire-and-forget). | ✓ |
| `02 §18` Parallelism weight | Packet 1 = full weight; packets 2–5 and other traffic dimmed (≤0.34α / ≤0.25α). | ✓ |
| `03 §3 / §4` Observation / Question | mechanics animate before their line; questions ("there is no wire", "who fixes this?") precede their answers. | ✓ |
| `03 §13` Knowledge Reveal | term-unlock matrix (Phase 5 §4) sampled: 'Router/Internet' first spoken at b1 — after the web lights up; 'Packet' at b3 — after the slice; 'TCP' at b6 — after slot 1; 'ACK' at b8 — after the counter moves. ✓ | ✓ |
| `03 §16` Terminology Lock | VI lines keep Router, Internet, Packet, header, Sequence Number, NIC, TCP, Reassembly Buffer, ACK, Server, Browser, RAM, bytes, DNS, Browser Engine in English inside natural Vietnamese prose; straight quotes; no machine translation. | ✓ |
| `03 §17` Learning Momentum | single question opens (b0/b1), answered only at b11; every beat advances it (Phase 4 §4). | ✓ |

## C. Runtime & engineering audit
1. **No Chapter 01/02 content file modified.** The only repo changes outside `src/content/chapter-03-across-the-internet/` and `docs/` are: removal of the *retired* `src/content/chapter-03/` (the deprecated `click-to-action` stub whose missing thumbnail was already breaking the build); restoration of the documented smoke tooling (`scripts/smoke-chapters.ts`) plus its `esbuild` devDependency and the `--packages=external` flag its bundling needs. Ch-01/Ch-02 verified behaviorally identical by smoke (playthroughs 59.9 s / 71.9 s, matching their freeze records). ✓
2. **Chapter contract conformance:** the Chapter object validates against `chapter-loader/types.ts` (tsc strict); `runtime.seamPosition` provides both seams; `entityRenderers` registers all eight chapter-local kinds. ✓
3. **Registry auto-discovery:** only the new folder + `meta.ts` — Home lists Chapter 03 as available with zero Home/registry edits (DESIGN.md §14.6, verified again). ✓
4. **Code-splitting:** chapter lazy-loaded as its own chunk (29.47 kB / 11.76 kB gzip). ✓
5. **Determinism/purity:** no `Date`/`Math.random` in chapter code paths (ambient motion uses `s.t`, the deterministic clock). ✓
6. **Memory/lifecycle:** Viewer remounts per chapter id (key); raf/listeners cleaned (unchanged lifecycle). ✓

## D. Residual risks disclosed (none blocking)
- The platform-wide State-Predictive Verification gap (inherited; see 07 §Gate 4.7).
- The b2 "imagine the whole file" beat is a deliberate Problem-first device; narration frames it explicitly as imagination (`03 §7`), so it cannot be misread as system behavior.
- During the b4 chip-departure join, a secondary chip briefly crosses the Server box's top-left corner (≈5% of the beat) before settling onto the cable — a minor cosmetic overlap of a dimmed secondary agent, not the protagonist; judged acceptable against the alternative (an off-cable first hop).

**Audit verdict: PASS — approved for Freeze.**
