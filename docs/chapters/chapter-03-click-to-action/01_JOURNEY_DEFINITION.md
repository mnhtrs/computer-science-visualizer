# Chapter 03 — Phase 1: Journey Definition (FROZEN)

- **Chapter ID:** `chapter-03-click-to-action`
- **Parent artifacts:** Chapter 02 (`chapter-02-browser-loading`), Frozen Constitution v1.3.0 (`00`–`03`)
- **Produced artifact:** this Journey Definition
- **Review status:** Passed (self-verified against Constitution Scope rules)
- **Frozen status:** FROZEN — no scope changes permitted downstream

---

## 1. Central Question (exactly one)

> **"How does web page data travel safely and reliably across the chaotic Internet from a far-off Server to your local Browser?"**

Every scene, beat, and line of narration must measurably advance the answer. The final scene must visibly answer it by completing the handoff of the reconstructed data.

## 2. Entry State (learner's assumed mental model)

From Chapter 02 (prerequisite, completed):
- Knows the rendering pipeline of the browser.
- Knows that the browser "requests" and "receives" HTML bytes, CSS, and JS from a DNS address using HTTPS.
- Views the network between the Browser and the Server as a simple, black-box "road" that magically returns files.

About the Internet (fresh):
- May believe there is a direct private wire from their ISP/house to the server.
- Believes files travel across the network as single, undivided blocks.
- Believes packet arrival is orderly, linear, and always perfect.
- May carry misconceptions that any packet loss corrupts the whole download irreversibly.

## 3. Exit State (target mental model)

The learner can mentally simulate, forward and backward:

click → physical distance recognized → shared wires problem → slicing files into Packets → Sequence Numbers → dynamic routing via Routers → Tokyo vs Singapore paths (redundancy) → packet arrival out-of-order → TCP handshake → TCP Reassembly Buffer → expected seq number checking → feedback via ACKs → duplicate ACKs demanding missing pieces → retransmission → stitching packets together → complete HTML reconstruction → handoff to the Browser Engine.

For each concept, the learner can state: **what** it is, **why** it exists, and **what breaks without it**.

## 4. Scope (bounded list; everything in the chapter maps here)

| # | In-scope item | Beats |
|---|---|---|
| S1 | Navigation start: click the link, initiate request. | b1 |
| S2 | Distance reality: no direct line; network of shared cables and gateways. | b2 |
| S3 | Handshake: establishing virtual connection, initializing sequence counters. | b3 |
| S4 | Slicing problem: huge files block cables and are vulnerable to transmission noise. | b4 |
| S5 | Solution: Packets (slicing resource into 1KB units with header addresses). | b5 |
| S6 | Dynamic routing: Packets route independently (Tokyo vs Singapore paths). | b6 |
| S7 | Resiliency: Alternative path routing bypasses wire cuts and congestion. | b7 |
| S8 | Inside the TCP Engine: Transition inside the OS/Network card. | b8 |
| S9 | Empty buffer queue: Initializing slots for sequence numbers. | b9 |
| S10 | In-order packet arrival: Slot filled, marked as stitched, sending ACK. | b10 |
| S11 | Out-of-order arrival: Gap detected (Seq 3 arrives before Seq 2). | b11 |
| S12 | Feedback ACK loop: Sending duplicate ACKs to demand the missing Seq 2. | b12 |
| S13 | Retransmission & Stitching: Seq 2 arrives, gap is plugged, files are merged. | b13 |
| S14 | Complete file assembly: All packets arrive and tệp tin is rebuilt. | b14 |
| S15 | Handoff to RAM: Fully assembled HTML in memory, ready for Chapter 2. | b15 |
| S16 | Recap: Summary of the Internet journey. | b16 |

## 5. Non-Goals (constitutionally locked)

ISP business models · IP subnetting and CIDR math · BGP / OSPF routing algorithms · TCP congestion window size calculations · TCP sliding window bytes flow control · checksum math (e.g. CRC32, MD5) · multi-path TCP standard details · DNS database structures.

**Abstraction-boundary classification (Constitution `01 §3`):**
| Boundary | Classification | Revealed in |
|---|---|---|
| Undersea cable repeater electronics & light wavelengths | **Terminal Boundary** | permanently out of scope |
| IP packet checksum calculation | **Deferred Internal** | future cybersecurity/error-checking journey |
| BGP path exploration & route maps | **Deferred Internal** | future network administration journey |
| TCP window congestion control state machine | **Deferred Internal** | future advanced networking journey |

## 6. Protagonist Declaration (Constitution `02 §13`)

- **Persistent Protagonist:** The golden **spark** representing the active data payload (the request packet, the handshake, or the file packets).
- **Secondary sparks:** In Scene 1, small decorative cyan and orange sparks represent other packets flowing through the network, demonstrating dynamic routing and multiplexing on shared cables.
- **The Browser Engine** remains the static platform home; in Act 2, we zoom into the **TCP Assembly Bench**, where the spark enters the queue and triggers state transitions.

## 7. Misconceptions to actively prevent (owner's list)

| # | Forbidden belief | Prevention mechanism |
|---|---|---|
| M1 | Internet is a single direct wire | Scene 1 shows a full web of 4 routers and alternative paths. |
| M2 | Files are sent as single blocks | Beat 4 and 5 illustrate the "giant file block" cable congestion problem and slice it into 5 explicit packet blocks. |
| M3 | All packets take the exact same route | Beat 6 and 7 show Packet 1 taking the Tokyo route and Packet 2 taking the Singapore route. |
| M4 | Out-of-order packets immediately crash | Beat 11 shows Packet 3 being safely buffered (not rendered) while waiting for Packet 2. |
| M5 | Lost packets require restarting the entire download | Beat 12 shows TCP requesting *only* the missing Packet 2 via duplicate ACK 2, and Beat 13 shows Packet 2 being resent. |
