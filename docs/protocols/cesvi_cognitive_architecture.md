# Cesvi — 5-Stage Cognitive Planning Protocol

**Layer:** `protocols/` (AI operating law)  
**Single Responsibility:** Define the machine-readable contracts (artifact schemas, field validation gates, sequencing rules) for the 5-stage cognitive planning pass executed by autonomous implementation agents before `AUTHORING_WORKFLOW.md` begins.  
**Status:** Active  
**Version:** 1.0.0  
**Effective Date:** 2026-07-23  
**Authority:** This document is the single source of truth for the cognitive planning artifact schemas and their validation gates. If this document and any other source disagree on a schema field or gate criterion, this document wins.  
**Dependencies:**
- `docs/constitution/00_VISION.md`
- `docs/constitution/01_EDUCATIONAL_PHILOSOPHY.md`
- `docs/constitution/02_VISUAL_LANGUAGE.md`
- `docs/constitution/03_NARRATIVE_FRAMING.md`

**Downstream Documents:** `docs/AUTHORING_WORKFLOW.md`, `docs/CHAPTER_REVIEW_CHECKLIST.md`

> This document owns: artifact schemas, field-level contracts, cardinality rules, stage gate criteria, stage sequencing rule, and operationalized cognitive constraints.
>
> This document does **NOT** own: the PST educational law (→ `03_NARRATIVE_FRAMING.md §4, §13`), visual protagonist laws (→ `02_VISUAL_LANGUAGE.md`), cognitive load limits (→ `01_EDUCATIONAL_PHILOSOPHY.md §1`), bilingual narration requirement (→ `AUTHORING_WORKFLOW.md Phase 6`), or the Stage→Phase mapping (→ `README_FOR_AI.md §Process Architecture Note`).

---

## 0. Protocol Purpose

The Cognitive Planning Protocol is the mandatory pre-production thinking pass performed by an implementation agent before any chapter authoring begins. Its purpose is to force structured cognitive decisions — about what misconceptions to fix, which entities to show, how the protagonist travels, and how knowledge is revealed — into machine-readable artifacts that can be validated at each stage gate.

This protocol operates at the **design-time** level. None of the artifacts it produces are loaded or parsed by the runtime viewer engine.

---

## 1. Stage Sequencing Rule

The protocol consists of 5 stages executed in strict sequential order. **No stage may begin until the gate of the preceding stage has passed.**

```
Stage 1 (delta.json)   → Gate 1 → Stage 2 (topology.json) → Gate 2
→ Stage 3 (trace.json) → Gate 3 → Stage 4 (storyboard.json) → Gate 4
→ Stage 5 (journey_blueprint.json) → Gate 5
→ AUTHORING_WORKFLOW.md Phase 1
```

If any gate fails, the agent must return to that stage and revise the artifact before proceeding. Skipping a stage or proceeding past a failed gate is a protocol violation.

---

## 2. Stage 1 — Truth Delta

**Purpose:** Identify the single conceptual gap this chapter closes: what the learner currently believes (misconception), what they must believe after (target mental model), and what system invariants must hold throughout the chapter.

### 2.1 `delta.json` Schema

| Field | Type | Cardinality | Description |
| :--- | :--- | :--- | :--- |
| `naive_misconception` | `string` | Required, exactly 1 | A plain-language statement of the false belief the learner holds before this chapter. Must be a complete sentence. |
| `target_mental_model` | `string` | Required, exactly 1 | A plain-language statement of the correct mental model the learner holds after this chapter. Must be a complete sentence. |
| `system_invariants` | `string[]` | Required, 1–5 items | An ordered list of falsifiable invariant statements that remain true throughout every scene of the chapter (e.g. "Packets travel independently through the network."). |

**Example:**

```json
{
  "naive_misconception": "The browser downloads a web page as a single complete file.",
  "target_mental_model": "The browser reassembles many independent packets delivered by multiple routers.",
  "system_invariants": [
    "Data is always divided into fixed-size packets before transmission.",
    "Each packet is addressed and routed independently.",
    "Packets may arrive out of order and must be reassembled at the destination."
  ]
}
```

### 2.2 Gate 1 — Truth Delta Validation

| Gate Criterion | Rule |
| :--- | :--- |
| **G1-A: Jargon-free** | `naive_misconception` and `target_mental_model` must contain zero domain-specific technical terms. Assessed by asking: "Would an absolute beginner understand this sentence with no prior knowledge?" |
| **G1-B: Falsifiable invariants** | Each entry in `system_invariants[]` must be a statement that could, in principle, be proven false by a counter-example. Philosophical assertions or definitions are not invariants. |
| **G1-C: One central question** | `target_mental_model` must answer exactly one question. If it answers two independent questions, the chapter scope is too broad (→ `01_EDUCATIONAL_PHILOSOPHY.md §7.1`). |

---

## 3. Stage 2 — Minimal Topology

**Purpose:** Declare the minimum set of hardware/system entities that must be visible on screen to answer the chapter's central question. No entity may appear unless it is necessary to the `target_mental_model`.

### 3.1 `topology.json` Schema

| Field | Type | Cardinality | Description |
| :--- | :--- | :--- | :--- |
| `active_nodes` | `string[]` | Required, 1–4 items | Ordered list of entity kind keys that will appear on screen. **Each entry must be a lowercase-kebab-case kind key** matching a registered renderer (see `DESIGN.md §17`). |
| `node_count` | `integer` | Required, exactly 1 | Must equal `active_nodes.length`. |
| `occam_justification` | `string` | Required, exactly 1 | A prose justification stating why each included node is necessary and why no additional node was added. |

**Example:**

```json
{
  "active_nodes": ["service-box", "router", "nic", "browser-lite"],
  "node_count": 4,
  "occam_justification": "service-box: origin of packets; router: demonstrates routing decisions; nic: physical arrival point; browser-lite: reassembly destination. No additional nodes appear because DNS resolution and TCP handshake are deferred to future chapters."
}
```

### 3.2 Occam Constraint Rule

`node_count` **must not exceed 4.**

This operationalizes `01_EDUCATIONAL_PHILOSOPHY.md §1 (Law of State Mutation Limits)` into a concrete planning constraint: an agent must be able to justify every node against the `target_mental_model`. If a fifth node is genuinely required by the chapter's central question, the agent must document the justification in `occam_justification` and flag it as a Gate 2 exception requiring explicit human review before proceeding.

### 3.3 Gate 2 — Topology Validation

| Gate Criterion | Rule |
| :--- | :--- |
| **G2-A: Count integrity** | `node_count` equals `len(active_nodes)`. |
| **G2-B: Occam compliance** | `node_count ≤ 4`. If 5 nodes are present, a human review flag must be recorded in `occam_justification`. |
| **G2-C: Kind key format** | Every entry in `active_nodes[]` is lowercase-kebab-case (e.g. `"cpu-chip"`, `"nic"`, `"browser-lite"`). PascalCase, snake_case, or mixed-case entries fail this gate. |
| **G2-D: Justification completeness** | `occam_justification` names every node and explains its necessity. Nodes not mentioned in the justification fail. |

---

## 4. Stage 3 — Protagonist Trace

**Purpose:** Identify the protagonist entity and plan its continuous path through the chapter's topology, establishing the spark's journey as the thread connecting every scene.

### 4.1 `trace.json` Schema

| Field | Type | Cardinality | Description |
| :--- | :--- | :--- | :--- |
| `bottleneck_trigger` | `string` | Required, exactly 1 | A plain-language description of the specific moment in the chapter where the learner's mental simulation faces a bottleneck and demands a resolution. This is the scene the chapter builds toward. |
| `protagonist_entity` | `string` | Required, exactly 1 | The kind key of the entity that serves as the chapter's primary protagonist (the golden spark carrier). Must exist in `topology.active_nodes[]`. Visual protagonist laws are governed by `02_VISUAL_LANGUAGE.md`. |
| `path_continuity` | `string[]` | Required, ≥2 items | Ordered sequence of kind key waypoints the protagonist traverses from chapter entry to chapter exit. Each entry is a lowercase-kebab-case kind key. The final entry must match the chapter's exit state declared in `CURRICULUM_GRAPH.md`. |

**Example:**

```json
{
  "bottleneck_trigger": "The learner expects the page to load instantly but sees the browser waiting. The question becomes: where did the data go?",
  "protagonist_entity": "service-box",
  "path_continuity": ["service-box", "router", "router", "nic", "browser-lite"]
}
```

### 4.2 Gate 3 — Protagonist Trace Validation

| Gate Criterion | Rule |
| :--- | :--- |
| **G3-A: Protagonist in topology** | `protagonist_entity` must be a member of `topology.active_nodes[]`. A protagonist not in the topology has no renderer. |
| **G3-B: Path kind key format** | Every entry in `path_continuity[]` is a lowercase-kebab-case string. |
| **G3-C: Path membership** | Every entry in `path_continuity[]` must appear in `topology.active_nodes[]`. An off-topology waypoint is a scene design error. |
| **G3-D: Continuity contract** | The final waypoint in `path_continuity[]` must match the chapter exit state defined in `CURRICULUM_GRAPH.md §3` for this chapter. |

---

## 5. Stage 4 — PST Storyboard

**Purpose:** Plan the sequence of narrative beats that guide the learner through the chapter, assigning each beat a PST phase tag and a bilingual narration pair. The storyboard is the cognitive contract between the planning pass and the authoring workflow.

> **Note:** This stage tags beats with `pst_phase` values that reference the PST sequencing law (`03_NARRATIVE_FRAMING.md §4, §13`). This document owns the schema field definition and the allowed enum values. It does NOT own the PST law itself.

### 5.1 `storyboard.json` Schema

**Top level:**

| Field | Type | Cardinality | Description |
| :--- | :--- | :--- | :--- |
| `beats` | `Beat[]` | Required, ≥4 items | Ordered array of beat objects. |

**Beat object:**

| Field | Type | Cardinality | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Required | Zero-padded sequential identifier. Format: `"beat-NN"` where NN is two-digit (e.g. `"beat-01"`, `"beat-12"`). |
| `pst_phase` | `enum` | Required | One of: `"Problem"` \| `"Need"` \| `"Solution"` \| `"Terminology"`. Ordering governed by `03_NARRATIVE_FRAMING.md §4`. |
| `narration` | `object` | Required | Bilingual narration pair. Structure: `{ "en": string, "vi": string }`. Both fields non-empty. Bilingual requirement governed by `AUTHORING_WORKFLOW.md Phase 6`. |
| `unlocked_terms` | `string[]` | Required | Technical terms introduced for the first time in this beat. Must be empty `[]` for all beats except `"Terminology"` phase beats. Governed by `03_NARRATIVE_FRAMING.md §13 (Knowledge Reveal Law)`. |

**Example:**

```json
{
  "beats": [
    {
      "id": "beat-01",
      "pst_phase": "Problem",
      "narration": {
        "en": "You click the link. The page starts loading. But something is happening that you cannot see.",
        "vi": "Bạn nhấp vào liên kết. Trang bắt đầu tải. Nhưng có điều gì đó đang xảy ra mà bạn không nhìn thấy."
      },
      "unlocked_terms": []
    },
    {
      "id": "beat-02",
      "pst_phase": "Need",
      "narration": {
        "en": "The data is too large to travel as one piece. It needs to be divided.",
        "vi": "Dữ liệu quá lớn để truyền đi nguyên vẹn. Nó cần được chia nhỏ."
      },
      "unlocked_terms": []
    },
    {
      "id": "beat-03",
      "pst_phase": "Solution",
      "narration": {
        "en": "The server splits the data into small pieces. Each piece travels separately.",
        "vi": "Máy chủ chia dữ liệu thành các phần nhỏ. Mỗi phần truyền đi riêng biệt."
      },
      "unlocked_terms": []
    },
    {
      "id": "beat-04",
      "pst_phase": "Terminology",
      "narration": {
        "en": "Each piece of divided data is called a packet.",
        "vi": "Mỗi phần dữ liệu được chia nhỏ đó được gọi là một gói tin — packet."
      },
      "unlocked_terms": ["packet"]
    }
  ]
}
```

### 5.2 Gate 4 — Storyboard Validation

| Gate Criterion | Rule |
| :--- | :--- |
| **G4-A: ID format** | All beat IDs match the pattern `beat-NN` (two-digit zero-padded). IDs are unique and sequential. |
| **G4-B: PST enum** | `pst_phase` value is one of the four allowed literals. No other value is permitted. |
| **G4-C: PST ordering** | Beats respect PST ordering law (→ `03_NARRATIVE_FRAMING.md §4`): `Problem` precedes `Need`; `Need` precedes `Solution`; `Solution` precedes `Terminology`. |
| **G4-D: Term gating** | `unlocked_terms[]` is non-empty ONLY on beats with `pst_phase: "Terminology"`. A term appearing in narration before its Terminology beat fails this gate (→ `03_NARRATIVE_FRAMING.md §13`). |
| **G4-E: Bilingual completeness** | Both `narration.en` and `narration.vi` are non-empty strings for every beat. |
| **G4-F: Minimum problem coverage** | At least one beat with `pst_phase: "Problem"` exists before any beat with `pst_phase: "Solution"`. A storyboard without an established problem cannot be approved. |

---

## 6. Stage 5 — Blueprint Assembly

**Purpose:** Assemble the four validated stage artifacts into a single, versioned `journey_blueprint.json` payload. This artifact is the handoff between the cognitive planning pass and the authoring workflow review gates.

> `journey_blueprint.json` is a **design-time artifact only**. It is not loaded by the runtime viewer engine. Its role in the production lifecycle is defined in `DESIGN.md §16`.

### 6.1 `journey_blueprint.json` Composition Schema

| Field | Type | Cardinality | Description |
| :--- | :--- | :--- | :--- |
| `chapter_id` | `string` | Required | The chapter folder slug. Format: `"chapter-NN-[slug]"` matching the chapter's folder name under `src/content/`. |
| `version` | `string` | Required | Semver string for this blueprint (e.g. `"1.0.0"`). Increment the minor version on storyboard revisions; the major version on structural changes to delta or topology. |
| `delta` | `object` | Required | Verbatim contents of the Gate 1-validated `delta.json`. |
| `topology` | `object` | Required | Verbatim contents of the Gate 2-validated `topology.json`. |
| `trace` | `object` | Required | Verbatim contents of the Gate 3-validated `trace.json`. |
| `storyboard` | `object` | Required | Verbatim contents of the Gate 4-validated `storyboard.json`. |

**Example (abbreviated):**

```json
{
  "chapter_id": "chapter-03-across-the-internet",
  "version": "1.0.0",
  "delta": { "...": "Gate 1 validated delta.json contents" },
  "topology": { "...": "Gate 2 validated topology.json contents" },
  "trace": { "...": "Gate 3 validated trace.json contents" },
  "storyboard": { "...": "Gate 4 validated storyboard.json contents" }
}
```

### 6.2 Gate 5 — Blueprint Assembly Validation

| Gate Criterion | Rule |
| :--- | :--- |
| **G5-A: All four sub-artifacts present** | `delta`, `topology`, `trace`, `storyboard` fields are all non-null objects. A missing sub-artifact means a stage was skipped — protocol violation. |
| **G5-B: Chapter ID format** | `chapter_id` follows the pattern `chapter-NN-[slug]` where NN is two-digit zero-padded and slug is lowercase-kebab. Must match a chapter entry in `CURRICULUM_GRAPH.md §2`. |
| **G5-C: Version format** | `version` is a valid semver string (e.g. `"1.0.0"`). |
| **G5-D: Internal consistency** | `trace.protagonist_entity` exists in `topology.active_nodes[]`. `trace.path_continuity` entries all exist in `topology.active_nodes[]`. If these constraints are violated at Gate 5, Stage 3 was approved incorrectly — return to Stage 3. |

---

## 7. Canonical Reference Index

This protocol enforces the following laws through schema constraints. It does not own or restate them. For the law itself, consult the cited canonical authority.

| Law | Enforced by this protocol via | Canonical owner |
| :--- | :--- | :--- |
| Cognitive load limit (State Mutation Limits) | `topology.node_count ≤ 4` (Gate 2-B) | `01_EDUCATIONAL_PHILOSOPHY.md §1` |
| One Central Question | Gate 1-C (`target_mental_model` answers exactly one question) | `01_EDUCATIONAL_PHILOSOPHY.md §7.1` |
| PST sequencing (Question Before Answer) | `pst_phase` enum + Gate 4-C ordering | `03_NARRATIVE_FRAMING.md §4` |
| Knowledge Reveal Law | `unlocked_terms[]` gating rule + Gate 4-D | `03_NARRATIVE_FRAMING.md §13` |
| Visual protagonist continuity | `trace.protagonist_entity` + Gate 3-A–D | `02_VISUAL_LANGUAGE.md` |
| Bilingual narration requirement | `narration: {en, vi}` field structure + Gate 4-E | `AUTHORING_WORKFLOW.md Phase 6` |
| EntityDescription.kind naming convention | `active_nodes[]` lowercase-kebab rule (Gate 2-C) | `DESIGN.md §17` |
| Chapter continuity contract | Gate 3-D (`path_continuity` exit state) | `CURRICULUM_GRAPH.md §3` |
| Blueprint design-time vs runtime distinction | Stage 5 purpose note | `DESIGN.md §16` |
| Stage → Phase mapping | Not restated here | `README_FOR_AI.md §Process Architecture Note` |
