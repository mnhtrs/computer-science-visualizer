# Chapter 03 — Phase 1: Journey Definition (FROZEN)

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** Frozen Constitution v2.0.0 (`00`–`03`), `AUTHORING_WORKFLOW.md` v2.0.0, `CHAPTER_REVIEW_CHECKLIST.md` v1.0.0, Chapter 02 frozen artifact set, owner directive (complete redesign of Chapter 3 from a blank page — the former `chapter-03-click-to-action` storyboard is retired; see that folder's `RETIRED.md`)
- **Produced artifact:** this Journey Definition
- **Review status:** Passed (self-verified against Constitution Scope rules)
- **Frozen status:** FROZEN — no scope changes permitted downstream

---

## 1. Central Question (exactly one)

> **"How does data travel from a Server to the Browser?"**

Every scene, beat, and line of narration must measurably advance the answer. The final scene must visibly answer it: the complete file resting in RAM, at the exact doorstep of Chapter 02's Act 3. (`03_NARRATIVE_FRAMING` — Question Before Answer; `AUTHORING_WORKFLOW` Phase 1.)

The chapter is **not** a networking course. It is the opening of one black box: the road between the NIC and the Server that Chapter 02 drew as a single line and formally deferred to this Journey (`01_EDUCATIONAL_PHILOSOPHY §3.1` Deferred Internal, Ch-02 Phase 1 §5). Nothing exists in this chapter unless it helps the learner watch bytes become a whole file on the other side of that road.

## 2. Entry State (learner's assumed mental model)

From Chapter 01 and Chapter 02 (prerequisites, completed in order):
- Knows at story level: SSD, RAM, CPU (fetch–decode–execute), GPU, NIC, bus; "a program is instructions executed one at a time".
- Has followed the golden spark once from click to pixel (Ch-01) and once from click to rendered page (Ch-02).
- From Ch-02, knows: URL, DNS (address book, asked once, off the road), IP address (`93.184.216.34` for `best-cats.example`), HTTPS (a private agreement — "the rules of the conversation" — keys never sent), HTTP request/response, HTML bytes, Browser ≠ Browser Engine, and the full rendering chain.
- **The planted gap (this chapter's reason to exist):** in Ch-02 the bytes traveled along a single drawn rail between the two machines. The learner accepted a black box: *how the bytes actually cross*. Ch-02 classified that box as a Deferred Internal revealed here.

Fresh misconceptions about the Internet (target learner, `AI_CHARTER`):
- "There is a private wire from my computer straight to the server."
- "A file travels as one whole block."
- "All pieces of a file take the same path and arrive in order."
- "One lost piece means the whole download restarts."
- "The Internet is a cloud — a place, not machines."

## 3. Exit State (target mental model)

The learner can mentally simulate, forward and backward:

server holds the response → no direct wire: a web of Routers between the machines → a whole file would monopolize the cable and any bad bit would force a full resend → the file is sliced into **Packets**, each = payload slice + **header** (from/to addresses + **Sequence Number**) → each Router reads only the destination and forwards to the closest neighbor (**Routing**; per-packet, live decisions; pieces may take different paths) → a busy Router may drop a piece → pieces arrive at the NIC out of order, with a hole → inside the machine, **TCP** keeps a numbered **Reassembly Buffer**: out-of-order pieces are parked, never discarded → the **ACK** counter advances only in order, exposing the gap → TCP asks for exactly the missing piece → the Server resends only that packet → slots read in order, slices stitched → **the whole file, in RAM** — the exact state where Chapter 02's Browser Engine work begins.

For each concept the learner can state: **what** happens, **why** it exists, **what breaks without it** — while firmly rejecting the misconceptions in §7.

## 4. Scope (bounded list; everything in the chapter maps here)

| # | In-scope item | Beats |
|---|---|---|
| S1 | Continuity opening: the Server holds the prepared response (one stream of bytes) at its door | b0 |
| S2 | The road is not a wire: a web of forwarding machines (Routers = the Internet) | b1 |
| S3 | The whole-file problem observed: cable monopolized; one bad bit forces a full resend | b2 |
| S4 | Solution: slicing into Packets (payload + header: from/to + Sequence Number) | b3 |
| S5 | Hop-by-hop forwarding: each Router reads the destination, hands to the closest neighbor | b4 |
| S6 | Per-packet live decisions: another piece takes a different branch; a busy Router drops one piece | b4 |
| S7 | Arrival at the NIC: out of order, with a hole | b5 |
| S8 | Inside the machine: TCP keeps numbered slots; out-of-order pieces parked, not discarded | b6–b7 |
| S9 | The ACK counter advances only in order — the gap becomes visible to the sender | b8 |
| S10 | Recovery: ask for exactly the missing piece; only that piece travels again | b9 |
| S11 | Stitching: slots read in order → the whole file → RAM (hand-off) | b10–b11 |
| S12 | Recap of the whole chain — the central question answered | b12 |

Time budget: Act 1 (observe/focus) ≈ 13% · Act 2 (the road: S2–S7) ≈ 42% · Act 3 (inside + hand-off: S8–S12) ≈ 45%.

## 5. Non-Goals (constitutionally locked)

Routing algorithms and route maps (BGP/OSPF) · ISP topology and business models · IP header format, subnetting, CIDR · checksum/CRC math · TCP handshake mechanics (covered at story level by Ch-02's HTTPS beat; never re-taught here) · TCP windowing, flow control, congestion-control algorithms · Ethernet/Wi-Fi link framing · DNS, HTTP semantics, TLS records (Ch-02 territory) · browser rendering of any kind (Ch-02 Act 3) · encryption internals · websockets/QUIC · caching/CDNs.

**Abstraction-boundary classification (Constitution `01 §3`):**

| Boundary | Classification | Revealed in |
|---|---|---|
| Physics of the cables (light in glass, repeaters, radio for the last stretch) | **Terminal Boundary** (declared permanently out-of-scope) | — |
| How a Router builds its sense of "closest to destination" (route tables, BGP) | **Deferred Internal** | future networking journey; here: "it hands the packet to the neighbor closest to that place" — true at every level, never unlearned |
| IP header layout, checksum/error-detection math | **Deferred Internal** | future networking/security journey; here: noise can damage bytes (observed), detection is implied by the resend, never mechanized |
| TCP windowing / congestion control / handshake state machine | **Deferred Internal** | future advanced networking journey; here: TCP = the keeper of order and completeness — true at every level |
| Link-layer framing between the last Router and the NIC | **Deferred Internal** | future networking journey |
| Everything the Browser does with the bytes afterwards | **Deferred Internal — already revealed** | Chapter 02 (the hand-off points straight back into it) |

No false mechanical analogy anywhere (`01 §3.3`). The "imagine sending it whole" beat (b2) is framed by narration as imagination, not as system behavior (`03 §7` Explicit Assumptions).

## 6. Protagonist Declaration (Constitution `02 §13`, `§18`)

- **Exactly one persistent visual protagonist:** the golden **spark** — continuous with Ch-01/Ch-02's spark (canonical benchmark, `02 §10`). Here it is the learner's point of observation riding the data: it rides **Packet 1** across the road, then follows the keeper's work inside the machine, then rests on RAM.
- **Secondary agents (packets 2–5, other people's traffic)** render with decayed visual weight (dimmed, ~30% alpha) — concurrency shown without splitting attention (`02 §18`, `AUTHORING_WORKFLOW` §3).
- The payload the spark carries *evolves on screen* (stream → packets → parked pieces → stitched file) — every metamorphosis happens in view; the spark core never vanishes, never teleports (`02 §5`, `§13`).

## 7. Misconceptions to actively prevent

| # | Forbidden belief | Prevention mechanism |
|---|---|---|
| M1 | A private wire runs from my machine to the server | b1: the straight "imagined road" dissolves; the Router web lights up between the machines; narration: "there is no wire that runs from the Server all the way to you" |
| M2 | Files travel whole, as one block | b2/b3: the whole-file attempt fails on screen; the file is sliced into 5 explicit Packets |
| M3 | All pieces take the same path / arrive in order | b4/b5: Packet 2 visibly takes the branch; the NIC tray shows 1, 3, 5, 2 |
| M4 | Out-of-order or parked pieces are errors / get thrown away | b7: "Does TCP throw it away? No" — piece 3 waits in its own numbered slot |
| M5 | A lost piece means restarting the whole download | b9: exactly one piece travels again; the file is never resent |
| M6 | The Internet is a cloud / a place | b1/b4: Routers are drawn as computers (same visual family as the machines the learner knows); each decides locally from what it can see |

## 8. Continuity Contract (AUTHORING_WORKFLOW Phase 1)

1. **Upstream State (end of Ch-02, as the learner last saw it):** the Server stamped "200 — OK" and sent the response; bytes crossed a single rail, the NIC caught them, RAM held them; the Browser Engine then rendered the page. The road between NIC and Server remained a black box, formally deferred here.
2. **Contextual Carry-Over (identical, verbatim):**
   - URL `https://best-cats.example`; page "All About Cats" (navy page, gold header, white paragraph "Cats sleep 16 hours. They own the internet.", coral button "Adopt a cat").
   - The Server box (cyan `#22d3ee`, disks glyph, IP pill `93.184.216.34`).
   - The home hardware row at Ch-02's exact coordinates: NIC `(260,805)` `#a5b4fc`, RAM `(430,805)` `#facc15`, CPU `(590,805)` `#fb923c`, GPU `(740,805)` `#4ade80`; the Desktop case `{60,80,840,790}`; the browser window `{90,130,760,600}` frozen in its *loading* state (the page is not rendered yet — that is Ch-02's Act 3, never pre-shown here).
   - The golden spark, starfield backdrop, Quicksand typography, `easeInOutCubic` travel, glow-on-active, 450 ms fade-through-black, beat dots.
3. **Downstream Launchpad:** the final state is *the whole file in RAM* — frame-for-frame the state Ch-02's beat `to-engine` picks up ("the Browser hands them to its inner workshop"). A learner replaying Chapter 02 after this chapter meets zero seam: this chapter ends exactly where that Act begins.

## 9. Verification note (platform constraint)

Constitution `01 §4` mandates State-Predictive Verification machinery; the current runtime (as at Ch-01 and Ch-02 freeze) is playback-based. Mitigation at chapter level: Question-Before-Answer prompts embedded in narration (b1 "how does it leave?", b5 "who puts this mess back into a file?"). Interactive verification gates remain a **platform-level deferred task**, inherited and disclosed (`PROJECT_STATE.md` Runtime Compliance Status). All other gates must PASS.
