# Chapter 03 — Phase 2: Technical Pipeline (FROZEN)

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** `01_JOURNEY_DEFINITION.md` (FROZEN)
- **Produced artifact:** this numbered, state-change-only pipeline (no narrative, no animation detail)
- **Review status:** Passed (technical correctness verified against established Internet/TCP behavior)
- **Frozen status:** FROZEN — this is the factual skeleton; Phase 3 validates it

---

## Pipeline (every row = one observable state change; nothing condensed)

| # | From state | Action (mechanism) | To state |
|---|---|---|---|
| P01 | Server has composed the response (Ch-02 P08 boundary) | The HTML byte stream sits at the Server's network door, ready to leave | Response ready at the Server's door |
| P02 | Two machines, an imagined straight line between them | Observation of the real road: no direct wire exists; a web of intermediate computers (Routers) connects the two, each linked to a few neighbors | The road is known to be a chain of machines, not a wire |
| P03 | One long byte stream to send over shared cables | The whole-stream attempt observed: it occupies the cable end-to-end while other traffic waits; one corrupted bit spoils the whole stream, forcing a complete resend | Whole-stream transfer shown to be wasteful and fragile |
| P04 | Whole stream at the door | The stream is sliced into small units — **Packets**; each packet = one payload slice + one **header** (source address, destination address, **Sequence Number** marking its place in the file) | 5 packets ready, numbered 1–5 |
| P05 | Packet at a Router | The Router reads one header field (destination) and forwards the packet to the neighbor closest to that destination; the next Router repeats | Packet 1 advances hop by hop toward home |
| P06 | Multiple packets in the web; one downstream cable busy | Routing decisions are per-packet and live: packet 2 is forwarded along an alternate branch around the busy cable | Packets of one file travel independently, on different paths |
| P07 | Packet 4 at a congested Router | The Router's buffer is full; packet 4 is dropped | Packet 4 no longer exists on the road |
| P08 | Packets finishing different paths | Packets reach the home NIC in path-dependent order: 1, 3, 5, 2 — packet 4 absent | NIC holds an out-of-order pile with a hole |
| P09 | Out-of-order pile at the NIC | Inside the receiving machine, the transport supervisor (**TCP**) places each arriving piece into the slot matching its Sequence Number — a numbered **Reassembly Buffer**; out-of-order pieces are parked, never discarded | Slots 1, 3, 5, 2 filled; slot 4 empty |
| P10 | Pieces parked | TCP acknowledges cumulatively: it reports "I have everything in order up to N" — the counter advances 1 → (holds at 1 while 3, 5 wait) → 3 once piece 2 lands; the held counter is the signal that exposes the gap | Receiver state: continuous up to 3; piece 4 missing |
| P11 | Gap at 4 detected | TCP requests exactly piece 4 (the repeated "have up to 3" tells the Server which piece is wanted); the Server retransmits **only** packet 4; slot 4 fills; counter → 5 | All slots filled, continuous 1–5 |
| P12 | Full, ordered buffer | TCP reads the slots in Sequence Number order and concatenates the payload slices into one byte stream | **The complete HTML file** |
| P13 | Complete file | The file is placed into RAM, where the Browser reads its downloads | **HTML bytes, whole and ordered, in RAM** — the exact entry state of Ch-02 Act 3 (P10 of Ch-02's pipeline) |

## Entry/Exit verification
- **Entry:** matches Phase 1 §2 — the chapter opens precisely at Ch-02's P08 boundary (response composed, about to travel). The request direction, DNS, and HTTPS are Ch-02 territory; none re-taught.
- **Exit:** matches Phase 1 §3 — P13 is exactly Ch-02's "bytes reside in RAM (Browser-readable)" state; the learner can step straight into Ch-02's `to-engine` beat with zero seam.

## Hardware continuity map (Ch-01/Ch-02 reinforcement, no re-teach)
Server's NIC (its door, P01/P04) → Routers (P02/P05/P06/P07 — same machine family, new role) → home NIC (P08, met in Ch-01/Ch-02) → RAM (P13, met in Ch-01/Ch-02). CPU present but inactive (it runs all of this software — one-line gloss recall). GPU resting (its work is Ch-02's Act 3).

## Truth notes (established-knowledge record for Phase 3)
1. **P02:** The Internet is a network of networks of packet-forwarding computers; there is no dedicated end-to-end circuit for a web request. *(Established.)*
2. **P04:** Transport-layer segmentation: the byte stream is broken into segments carried in packets; each carries header information including source/destination addresses and a sequence number. Exact header formats are Deferred Internals. *(Established — TCP segmentation over IP.)*
3. **P05/P06:** Store-and-forward, hop-by-hop, destination-based forwarding; per-packet independent routing means packets of one flow may take different paths. *(Established — IP/Ethernet store-and-forward; ECMP/alternate routes.)*
4. **P07:** Routers drop packets under congestion (finite buffers). *(Established — tail drop / AQM behavior at the story level.)*
5. **P09:** TCP delivers an ordered byte stream to the application; out-of-order segments are buffered, not discarded. *(Established — RFC 9293 reassembly.)*
6. **P10/P11:** Cumulative acknowledgment (ACK carries the next expected in-order byte); duplicate ACKs signal a gap; fast retransmit recovers the single missing segment without a full resend. Shown at story level: a counter that "only moves forward, in order," and a request for exactly the missing piece. *(Established — RFC 9293 cumulative ACK + RFC 5681 fast retransmit.)*
7. **P12/P13:** The reassembled byte stream is placed in memory for the receiving application; here, RAM — identical to Ch-02's P09 state. *(Established.)*

No step presents speculation as fact. Uncertainty register: **empty**.
