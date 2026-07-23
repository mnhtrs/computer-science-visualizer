# Macro Curriculum Graph & Inter-Chapter Continuity Specification

**Layer:** 1 — Curriculum & Domain Knowledge  
**Single Responsibility:** Authoritative curriculum sequence, prerequisite dependency tree, and inter-chapter state continuity contracts.  
**Status:** Active  
**Version:** 1.0.0  
**Authority:** Curriculum Architecture Authority  
**Dependencies:** `docs/constitution/VISION.md`  
**Downstream Documents:** `docs/protocols/cesvi_cognitive_architecture.md`, `docs/AUTHORING_WORKFLOW.md`, `docs/governance/CHAPTER_REVIEW_CHECKLIST.md`

---

## 1. Purpose

This document provides the canonical curriculum graph for the Cesvi ecosystem. It eliminates the need for downstream implementation agents (Arena.ai) to inspect prior chapter source code (`src/content/chapter-NN/`) to infer state carry-over, entry conditions, or mock assets.

---

## 2. Global Chapter Sequence & Prerequisite Graph

```
[Ch-01: Program Execution] --? [Ch-02: Browser Rendering] --? [Ch-03: Across the Internet] --? [Ch-04: OS Scheduler] --? [Ch-05: Memory Management]
```

### Topological Chapter Dependency Tree

| Chapter ID | Chapter Title | Core Mechanical Truth Taught | Prerequisite Chapters | Required Entry Mental Models |
| :--- | :--- | :--- | :--- | :--- |
| `chapter-01` | How Computers Execute Programs | CPU-RAM fetch-decode-execute loop & bus transfer | None (Root) | Basic intuition of input/output |
| `chapter-02` | How Browsers Render Websites | HTML/CSS parsing, DOM tree, layout, paint, GPU composite | `chapter-01` | CPU executes code; RAM holds bytes |
| `chapter-03` | How Data Travels Across the Internet | Packets, IP routing, NIC buffer, TCP reassembly | `chapter-01`, `chapter-02` | Browser engine requests resource; bytes arrive at NIC |
| `chapter-04` | How Operating Systems Schedule Tasks | Preemptive context switching, process control blocks, CPU queues | `chapter-01`, `chapter-02` | Single CPU core executes instructions sequentially |
| `chapter-05` | How Virtual Memory Protects Systems | Page tables, MMU translation, page faults, swap storage | `chapter-01`, `chapter-04` | Virtual addresses map to physical RAM slots |

---

## 3. The Continuity Contract Protocol

Per `docs/AUTHORING_WORKFLOW.md Phase 1`, the entry state of Chapter $N$ MUST align seamlessly with the exit state of Chapter $N-1$. Agents MUST derive continuity state from the contracts below rather than inspecting prior source code.

### Inter-Chapter Continuity Matrix

#### Contract 1: `chapter-01` --? `chapter-02`
* **Upstream Exit State:** The CPU finishes executing the program loader instruction sequence.
* **Contextual Carry-Over Payload:**
  * `mock_domain`: `"example.com"`
  * `protagonist_entity`: Golden spark (EventSpark)
  * `hardware_row`: `[CPU, RAM, GPU]`
* **Downstream Launchpad:** The golden spark travels into the CPU to trigger the browser rendering pipeline.

#### Contract 2: `chapter-02` --? `chapter-03`
* **Upstream Exit State:** The browser engine encounters a network resource fetch request (`GET https://cats.org/page`).
* stocking Contextual Carry-Over Payload:**
  * `mock_url`: `"https://cats.org/page"`
  * `mock_domain`: `"cats.org"`
  * `mock_ip`: `"93.184.216.34"`
  * `data_payload`: Byte stream (`0x48 0x54 0x54 0x50...`)
  * `protagonist_entity`: Golden spark (EventSpark)
  * `hardware_row`: `[Browser, NIC, RAM, CPU, GPU]`
* **Downstream Launchpad:** The spark exits the browser window and drops down to the NIC to enter the network wire.

#### Contract 3: `chapter-03` --? `chapter-04`
* **Upstream Exit State:** Packet bytes arrive at the NIC, trigger an interrupt, and pass into the OS socket buffer.
* **Contextual Carry-Over Payload:**
  * `mock_url`: `"https://cats.org/page"`
  * `active_process`: `"browser-engine"` (PID 4096)
  * `interrupt_vector`: `0x20` (NIC Receive Interrupt)
  * `protagonist_entity`: Golden spark (InterruptSpark)
  * `hardware_row`: `[NIC, CPU, RAM]`
* **Downstream Launchpad:** The OS kernel receives the interrupt, pausing the active process and switching execution context.

#### Contract 4: `chapter-04` --? `chapter-05`
* **Upstream Exit State:** The OS scheduler switches execution to PID 4096, which requests a new memory allocation.
* **Contextual Carry-Over Payload:**
  * `active_process`: `"browser-engine"` (PID 4096)
  * `virtual_address`: `"0x7FFF5FBFF000"`
  * `protagonist_entity`: Golden spark (AddressSpark)
  * `hardware_row`: `[CPU, MMU, RAM, Disk]`
* **Downstream Launchpad:** The CPU presents a virtual address to the MMU, triggering a page table lookup.

---

## 4. Autonomous Agent Decision Protocol for Chapter Continuity

When Arena.ai initiates Chapter $N$:

1. **Read Prerequisite Graph:** Look up `chapter-N` in Section 2 of this document. Retrieve required prerequisite chapters.
2. **Retrieve Carry-Over Payload:** Read Contract $N-1 \rightarrow N$ in Section 3 of this document. Extract `mock_url`, `mock_domain`, `data_payload`, and `hardware_row`.
3. **Inject into Stage 1 (Truth Delta):** Inject the carry-over payload directly into Stage 1 (`delta.json`) as the Entry State baseline.
4. **Enforce Zero Code Inspection:** Arena.ai MUST NOT read `src/content/chapter-(N-1)/` code to infer continuity. The contract specified above is the single source of truth.

