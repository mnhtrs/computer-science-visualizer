# Cesvi Visual & Design System Tokens Specification

**Layer:** 3 — Visual & Design System  
**Single Responsibility:** Canonical visual tokens (colors, typography, geometry constants, animation physics) across all rendering targets.  
**Status:** Active  
**Version:** 1.0.0  
**Authority:** Visual Architecture Authority  
**Dependencies:** `docs/architecture/VISUAL_LANGUAGE.md`  
**Downstream Documents:** `docs/architecture/DESIGN.md`, `src/content/chapter-NN/scenes/metrics.ts`

---

## 1. Purpose

This document provides the single source of truth for all visual tokens in the Cesvi ecosystem. Downstream implementation agents (Arena.ai) MUST consume visual constants from this document rather than inferring colors, typography, or spacing from existing chapter renderer code.

---

## 2. Color Palette Tokens

### Hardware & System Entity Colors

| Entity Token Name | Hex Code | Visual Role | Usage Scope |
| :--- | :--- | :--- | :--- |
| `COLOR_CPU` | `#f59e0b` | CPU core, execution units, instruction fetch | Hardware / Chips |
| `COLOR_RAM` | `#60a5fa` | Memory blocks, bus rails, storage slots | Hardware / Memory |
| `COLOR_NIC` | `#a855f7` | Network interface cards, network sockets | Hardware / Network |
| `COLOR_GPU` | `#10b981` | Render pipeline, framebuffers, composite stage | Hardware / Graphics |
| `COLOR_SERVER` | `#64748b` | Web servers, database backends, disk storage | Hardware / Server |
| `COLOR_ROUTER` | `#8b5cf6` | Network routers, gateway nodes, IP hops | Infrastructure |
| `COLOR_BROWSER` | `#38bdf8` | Browser window, DOM engine, renderer process | Software / App Shell |

### Spark & Protagonist Tokens

| Token Name | Hex Code | Visual Role |
| :--- | :--- | :--- |
| `COLOR_PROTAGONIST_SPARK` | `#a78bfa` | Primary golden protagonist spark (Golden Spark Path) |
| `COLOR_INTERRUPT_SPARK` | `#ef4444` | Hardware interrupt signal spark |
| `COLOR_DATA_TRAFFIC` | `#38bdf8` | Active packet byte stream on network wire |
| `COLOR_PARALLEL_DECAY` | `rgba(148, 163, 184, 0.35)` | Secondary parallel agent decayed visual weight |

---

## 3. Typography Tokens

### Font Stack Specifications
* **Primary Sans-Serif (`FONT`):** `'Quicksand', system-ui, -apple-system, sans-serif`
* **Monospace (`MONO`):** `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace`

### Canonical Type Scale (`F`)

| Role Token | World Size (px) | Weight | Font Family | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `F.caption` | 19 px | Bold | `FONT` | Scene step captions & narration titles |
| `F.hwName` | 19 px | Bold | `FONT` | Main hardware box labels (CPU, RAM, NIC) |
| `F.portName` | 17 px | Medium | `FONT` | Sub-component port & socket labels |
| `F.ipPill` | 17 px | Medium | `MONO` | IP address badges and network packet headers |
| `F.url` | 19 px | Medium | `MONO` | Address bar URLs and HTTP request paths |
| `F.chipNum` | 21 px | Bold | `MONO` | Memory address numbers and register values |
| `F.ackVal` | 28 px | Bold | `MONO` | Large numerical state counters |

---

## 4. Spacing & Clearance Tokens (Derivable Geometry)

Per `02_VISUAL_LANGUAGE.md §2.2`, all canvas positioning MUST comply with these spatial clearance scale constants:

| Token Name | Value (px) | Layout Constitution Rule | Purpose |
| :--- | :--- | :--- | :--- |
| `BREATH` | `8 px` | R02 | Minimum breathing clearance between text↔edge or text↔text |
| `CLIP_INSET` | `12 px` | R13 | Minimum content inset from container/clip bounding box |
| `LABEL_GAP` | `10 px` | R06 | Standard gap between component box edge and its name label |
| `MIN_CORNER_R` | `8 px` | R08 | Standard border radius for component container boxes |

---

## 5. Renderer Token Consumption Protocol

When Arena.ai generates `scenes/metrics.ts` for Chapter $N$:

1. Import font stacks `FONT` and `MONO` from `docs/architecture/DESIGN_TOKENS.md`.
2. Map entity colors to the token names in Section 2 (`COLOR_CPU`, `COLOR_RAM`, `COLOR_NIC`, etc.).
3. Size all pills and badges using `measureText(text) + BREATH * 2` (HTML Box Model compliance).
4. Strictly forbid inline hex code literals inside `renderers.ts`.
