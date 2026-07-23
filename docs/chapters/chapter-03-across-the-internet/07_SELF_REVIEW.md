# Chapter 03 — Self Review Record (FROZEN)

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** all Frozen artifacts Phases 1–6 + implemented runtime (`src/content/chapter-03-across-the-internet/`)
- **Produced artifact:** this Self Review Record (per `CHAPTER_REVIEW_CHECKLIST.md` v1.0.0)
- **Review status:** Passed (1 item N/A by platform status, disclosed)
- **Frozen status:** FROZEN

Verification executed after implementation: `tsc --noEmit` ✓ · `vite build` ✓ (chapter code-split, 29.47 kB / 11.76 kB gzip) · `npm run smoke` — all three chapters: beat/path/holdAt integrity, full playthroughs (Ch-01 59.9 s, Ch-02 71.9 s — byte-stable against their freeze records — Ch-03 54.4 s), spark finite on every frame, 14 deterministic Chapter-03 snapshots rendered and visually audited ✓. The smoke tooling (`scripts/smoke-chapters.ts`) and its `esbuild` dependency were restored (they were referenced by `package.json` but absent from the public repo); this is additive tooling, not a behavioral change to Chapters 01/02.

---

## Gate 1 — Scope: **PASS**
- 1.1 One central question: declared in Phase 1 §1; singular; visible answer at b11, recited at b12. ✓
- 1.2 Scope list exists (Phase 1 §4, S1–S12); every one of the 13 beats maps to it (Phase 4 §4). ✓
- 1.3 Non-goals respected: grep-level audit of narration + geometry finds no routing algorithms (BGP/OSPF), no IP-header/subnet math, no checksum math, no TCP windowing/handshake mechanics, no TLS records, no DNS/HTTP re-teaching, no rendering of any kind (the browser window stays in its honest loading state). TCP appears only as the keeper of order/completeness — true at every level. ✓
- 1.4 No future-chapter leakage: rule A-01 honored — the chapter never names or describes a successor; the only cross-chapter references point *backward* (Chapter 1 hardware, "the last journey" = Chapter 2). Deferred internals (route tables, header/checksum math, windowing, link framing) classified in Phase 1 §5, never mechanized. ✓
- 1.5 Continuity contract: upstream = Ch-02's P08 boundary (response ready); carry-over identical (URL, page, Server box + IP pill, hardware-row coordinates, spark, fonts, physics); downstream launchpad = the exact state Ch-02's `to-engine` beat opens on (whole file in RAM). ✓

## Gate 2 — Technical Pipeline: **PASS**
- 2.1/2.2 complete pipeline, no missing steps (V1). 2.3 ordering (V2). 2.4 acyclic (V3). 2.5 no hidden magic — every artifact has a beat (V5). 2.6 technical truths verified (V6): store-and-forward hop-by-hop; per-packet independent routing; congestion drop; out-of-order buffering without discard; cumulative ACK advancing only in order; fast-retransmit of exactly the missing segment; in-order concatenation into the original byte stream. ✓

## Gate 3 — Story Architecture: **PASS**
- 3.1 exactly one protagonist (golden spark; the Server/Routers/TCP are stage machines — Phase 1 §6; spark rendered identically to Ch-01/Ch-02). ✓
- 3.2 continuous: verified mechanically by smoke (spark finite every frame; seams designed). ✓
- 3.3 no teleportation: path indices contiguous per scene; scene seams designed (NIC; RAM door ↔ PATH_A 10); metamorphoses on-screen only. ✓
- 3.4 every transition has an observable cause (Phase 4 §6 audit). ✓
- 3.5 one continuous journey (single storyboard, 2 scenes; opens at Ch-02's boundary, closes at Ch-02's next move). ✓
- 3.6 every scene advances the central question (Phase 4 §4 rightmost column). ✓
- 3.7 ending answers the opening question (b11 shows it — whole file in RAM; b12 recites it). ✓

## Gate 4 — Educational Design: **PASS, one disclosed N/A**
- 4.1 observation before explanation (mechanics precede terms — Phase 5 §4 matrix; the imagined whole-file beat at b2 is framed by narration as imagination, `03 §7`, then the real mechanism follows). ✓
- 4.2 question before answer (b1 "there is no wire…", b5 "who puts this mess back into a file?"). ✓
- 4.3 progressive reveal. ✓ 4.4 terminology after experience — PST honored per milestone: Router/Internet only after the web lights up (b1); Packet/header/Sequence Number only after the whole-file failure (b2→b3); Routing only after the hop walk (b4); TCP/Reassembly Buffer only after the first slot (b6); ACK only after the counter is seen moving (b8). ✓
- 4.5 one concept per beat (single-mutation audit Phase 3 V7; the three atomic chunks — b3 slicing, b4 road-in-motion, b9 ask+resend — disclosed with individually-observable sub-steps). ✓
- 4.6 cognitive load: max 1 active glow/beat; secondary packets dimmed; the bench holds ~55% of the time in one calm workshop; the window is shortened to keep the inbox out of the Browser (no conceptual collision). ✓
- 4.7 **State-Predictive Verification (`01 §4`): N/A — platform constraint.** The runtime (as at Ch-01/Ch-02 freeze) implements playback + timeline navigation, not learner-driven state prediction. Inherited, not introduced (mitigation: predictive prompts in narration; recorded in Phase 1 §9). Flagged for the platform roadmap. Honesty mandate (`AI_CHARTER: No Fabrication`): recorded, not claimed. ✓ (disclosed)
- Misconceptions M1–M6 each get an explicit geometric or narrated counter (Phase 1 §7; visible in frames 02/04/06/09). ✓

## Gate 5 — Visual Design: **PASS**
- 5.1/5.2 spatial + temporal continuity (mechanically verified; home block identical to Ch-02; every transition continuously observable). ✓ 5.3 canonical style: composer/stars/spark/glow/Quicksand/fade reused untouched; new parts (routers, service box, NIC, RAM-fill, browser-lite, port, wire-traffic, reassembly-bench) built from shared primitives with the same physics. ✓
- 5.4 no misleading symbolism (chevrons point the bytes' way; the imagined road dissolves; the inbox is at the NIC, not in the Browser; slot frames assert occupancy only when a piece is in). ✓
- 5.5 structure vs state separation (cables/slots/box dim-static; payload + spark the only movers; ACK counter is informational chrome). ✓

## Gate 6 — Narration: **PASS**
- 6.1 natural human language (spoken cadence, both languages; VI written from scratch, straight quotes, no machine translation). ✓
- 6.2 no documentation tone; 6.3 no checklist narration (recap b12 retells the journey in causal order, not an attribute list); 6.4 no isolated component descriptions (every gloss attaches to the active entity mid-action; Router/TCP/ACK introduced only through what they *do* on screen); 6.5 narration follows observable events (each line describes the current frame); 6.6 consistent terminology (one term per concept, English-locked). ✓
- Anti-manual patterns absent: grep for "is a component that / is responsible for / performs the function of / the role of" → none. ✓

## Gate 7 — Final Validation: **PASS**
- 7.1 Constitution satisfied (this record + traceability). 7.2 workflow satisfied (Phases 1–6 frozen before implementation; implementation reconciled back into 04/05 v1.0.1 after visual QA). 7.3 zero unresolved comments. 7.4 ready to freeze.

### Corrective actions taken during the visual-QA loop (mapped to phase)
| Found (headless frame) | Root cause | Fix | Phase |
|---|---|---|---|
| A Router not yet popped leaked its name label | `drawName` ignored the reveal alpha | name alpha scaled by `appear` | 5 |
| File block overlapped the Server box (block at cable height = inside the box's vertical span) | door anchors on the cable | float block + PATH_A[0–2] + chip formation to y 430 (above the box); packet "drops onto the road" | 5 |
| NIC inbox drawn *inside* the browser viewport | tray y fell in the window's span | shorten window to 470; inbox moved to the floor band (hardware-row zone) | 5 / 1.5 |
| Inside-scene: a landed chip vanished (descending-done but excluded from settled draw); keeper/piece desync from dead return-legs | hand-rolled descent fractions ≠ spark travel; `PATH_B` wasted half each beat returning to the port | redesign `PATH_B` to a 9-anchor slot-to-slot walk; pieces descend from the port on their own window synced to the keeper's `holdAt` dwell; incoming chips drawn at full alpha (clamped descent = settled after landing) | 5 / 3.2 |
| Merge stacked all strips at the exact center | fade-branch drew strips at `MERGE`, skipping the visible column | strips leave → visible column → converge → fuse → glide | 5 |
| A slot frame asserted "occupied" the instant a descent began | present() keyed on membership, not proximity | frame solidifies only when the piece is nearly in (`02 §4`) | 5 |
