# Chapter 02 — Independent Architectural Review → Revision v1.2 (Amendment)

---

**Status:** APPLIED — chapter-level correction (does not reopen the frozen design)

**Chapter:** `chapter-02-browser-loading` — "How does a website reach my screen?"

**Version bump:** 1.1.0 → 1.2.0 (supersedes parts of `10_REVIEW_REVISION_v1.1.md`)

**Effective Date:** 2026-07-20

**Reviewer role:** Lead Curriculum Architect (independent — explicitly NOT the v1.1 author).
Review principle: technical correctness alone is insufficient; every concept must
justify its existence; burden of proof on the new concept; implementation cost ignored —
educational quality only. Doctrine: **teach less, but preserve the correct mental model.**

---

## 1. Verdicts on the four architect challenges

### Challenge 1 — Should TCP appear in Chapter 02? → **B (foreshadowing only)**

- TCP answers no question Chapter 02 itself asks. DNS earned its place by answering the
  chapter's own question ("a name is not a place yet"); TCP arrives as an answer without
  a question.
- A dedicated TCP mention with a label, two chapters before its phenomenon (handshake,
  retransmission — Ch-03's syllabus), is terminology-before-phenomenon: trivia-grade.
- If TCP is removed entirely, the residual model is "the two machines talk privately" —
  incomplete, not false; Chapter 03 completes it as its primary content rather than
  correcting it.
- The v1.1 "causal completeness" argument was networking correctness wearing an
  educational hat; the feared "TLS from nowhere" misconception collapses under scrutiny:
  the HTTPS round-trip visually depicts **order** (meet → whisper), learners infer order,
  not identity — there is nothing to un-learn.
- **Applied form:** one unnamed clause inside the HTTPS beat — *"the two machines open a
  road between them — then the Browser knocks politely…"*. No beat, no label.

### Challenge 2 — Does TCP deserve a persistent visual entity? → **B (motion cue is enough; under foreshadowing, converges to narration alone)**

- A TCP chip is a **state**, and the platform's visual grammar assigns entities to actors
  and acted-upon artifacts only (DNS box, HTTPS lock). Admitting one protocol-state chip
  permanently opens a new entity category → pressure for HTTP/QUIC/retransmission chips
  in later chapters (visual-vocabulary sprawl).
- The connection's *opening* is an event; events are already expressible as motion on
  existing infrastructure. Its *persistence*, if ever needed, is a state-change on the
  existing rail — never a new entity at this altitude.
- **Applied:** `conn` entity, `conn-link` kind, and `drawConnChip` removed entirely.

### Challenge 3 — Does TCP in Ch-02 reduce Chapter 03's impact?

Full introduction (v1.1) **reduces** it: it consumes Ch-03's best cold-open reveal ("how
did that conversation even begin?") while teaching no mechanism, forcing Ch-03 to either
re-teach (redundancy) or assume (fragility). Phenomenon-only foreshadowing **creates**
the useful prerequisite: learners arrive believing "conversations run on an opened road";
Ch-03 then names and dissects TCP after showing the phenomenon. A useful prerequisite is
a *belief*, not a *word*.

### Challenge 4 — Educational Dependency Rule (17 concepts)

| Concept | Verdict | Note |
|---|---|---|
| DNS | Required now | Chapter's own question; phenomenon on screen |
| TCP | Helpful foreshadowing (unnamed road); name/mechanics → Ch-03 | No distinct phenomenon here |
| TLS/HTTPS | Required now | User-visible padlock; existence-level only |
| HTTP | Required now | Request/response is Act 2's causal hinge |
| NIC / RAM | Required now | Chapter-01 continuity; zero new-concept cost |
| **UTF-8 (name)** | **Better deferred** | ASCII demo makes decoding invisible; term without phenomenon. The decode *step* stays Required now ("saved following a rulebook") |
| Tokenizer / Parser / DOM / CSSOM | Required now | Chain text→trees; parser-blocking truth |
| Render Tree / Layout / Paint / Rasterization | Required now | Core pipeline; Paint preserves the Ch-01 instructions-vs-execution motif |
| Compositor | concept Required now; **name = foreshadowing-grade** (kept) | Its phenomenon (layers snap into one frame) IS on screen → naming after phenomenon is constitutional §13 |
| GPU | Required now | Chapter-01 continuity; finale owner |

**The dividing line applied uniformly:** keep every fix attached to a phenomenon on
screen (I2 keys, I3 servers, I4 plurality, I7 host, I8 IP, I9 compositor, I10 growing
tree); remove every term shipped without its phenomenon (TCP-as-taught, UTF-8's name).

## 2. What v1.2 changes relative to v1.1

| Item | v1.1 | v1.2 |
|---|---|---|
| Beats | 24 (dedicated `connect` beat) | **23** (HTTPS beat owns the single round-trip) |
| HTTPS narration | keys-never-sent clause | same clause + unnamed "open a road" foreshadow |
| Recap | "opened the connection, locked it with HTTPS" | v1.0 wording restored (recap mirrors taught steps only) |
| Entities | + `conn` (`conn-link`) | removed — visual language unchanged |
| Renderers | + `drawConnChip` | removed |
| Decode narration | "saved with the UTF-8 rulebook" | "saved following a rulebook" (name deferred to the encodings chapter) |
| Duration | ~74.5 s | **~71.9 s** |
| Everything else from v1.1 | — | **unchanged** (I2–I10 stand) |

## 3. Exact implementation (all applied)

- `scenes/01-navigation.ts` — `PATH_A` 31 → 26 points (connect trip removed; the HTTPS
  beat's travel `8→13` includes the bend down to the rail, as in the frozen geometry).
- `scenes/02-network.ts` — `connection` PartSpec removed.
- `narration/beats.ts` — 23 beats; new HTTPS line (road clause + keys-never-sent);
  decode line de-named; recap restored to frozen wording; travels/rests re-anchored
  (`https 8→13`, `request 14→16`, `server rest 17`, `response 17→22`, `to-engine 22→23`,
  `screen 24→25`, `recap rest 25`).
- `scenes/05-story.ts` — `STAGE_AT_BEAT` shifted −1 (`9 bytes … 20 composite, 21–22 final`).
- `assemble.ts` — `conn` entity out; `httpsLock.fromBeat` 5 → **4**; `pausedBeats`
  `[15]` → **`[14]`**; `finalFromBeat` 22 → **21**.
- `src/rendering/parts/web-parts.ts` — `drawConnChip` removed; **`stageCssFetch` growing
  tree retained** (the I10 fix is unaffected).
- `src/rendering/parts/registry.ts` — `conn-link` entry removed.
- `scripts/smoke-chapters.ts` — expected beats 24 → **23**.

## 4. Verification

| Check | Result |
|---|---|
| `tsc --noEmit` + `vite build` | **PASS** |
| `npm run smoke` — integrity, continuity, seams | **PASS** |
| Playthrough Ch-02 | **4304 frames ≈ 71.9 s**, final beat 22/22 |
| 23 beats × 3 deterministic snapshots | **PASS** |
| Playthrough Ch-01 | **~59.9 s — no regression** |
| Chapter 01 content files modified | **NONE** |
| Frozen artifacts 01–09 modified | **NONE** (`10_` carries a supersession pointer; this document is the v1.2 amendment) |

## 5. Standing guidance for future chapters (recorded)

1. **Phenomenon-before-term:** a name may ship only after its phenomenon has been on
   screen. (UTF-8 → encodings chapter; TCP → Chapter 03.)
2. **Entities are forever:** new visual vocabulary requires an actor-or-artifact
   justification; protocol *states* ride infrastructure/motion.
3. **Foreshadow with beliefs, not words.**
4. **Compression is allowed, assertion is not:** saying less than the truth is fine at
   beginner altitude; saying a narrower truth as the whole truth (static-only servers)
   is not — this standard of `10_` remains in force.

*Amendment effective immediately. The frozen set 01–09 remains the design of record;
`10_` and this document together form the v1.2 delta.*
