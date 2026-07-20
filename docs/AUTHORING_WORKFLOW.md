# Cesvi — Chapter Authoring Workflow

**Document type:** Standard Operating Procedure (SOP)
**Scope:** All Cesvi educational Journeys
**Status:** ACTIVE
**Version:** 1.0.0
**Effective Date:** 2026-07-20
**Authority:** Chief Production Architect
**Supersedes:** None

> This document defines the mandatory production pipeline for every Cesvi Chapter.
> It governs *how* a Journey is produced.
> The *laws* the Journey must satisfy are defined exclusively in the frozen Constitution (`docs/constitution/`).
> When a constitutional rule is required, this document references it rather than repeating it.

---

## Authority Hierarchy

```
Constitution (frozen, v1.1.0)
    └── This Workflow (SOP)
            └── Individual Chapter Productions
```

This document may not override or weaken any rule in the Constitution.

---

## Pipeline Overview

```
Phase 1 — Journey Definition
    │
    ▼
Phase 2 — Pipeline Design
    │
    ▼
Phase 3 — Pipeline Validation
    │
    ▼
Phase 4 — Story Architecture
    │
    ▼
Phase 5 — Scene Design
    │
    ▼
Phase 6 — Narration
    │
    ▼
Phase 7 — Educational Review
    │
    ▼
Phase 8 — Final Approval → FROZEN
```

No phase may be skipped.
No phase may be started before the previous phase is complete and confirmed.

---

## Phase 1 — Journey Definition

**Objective:** Establish the formal scope of the Chapter before any design work begins.

### Required Outputs

| Field | Requirement |
|---|---|
| **Central Question** | Exactly one question. Declarative. Answerable by a beginner. See: `03_NARRATIVE_FRAMING §15`. |
| **Scope** | A bounded list of the system components and mechanisms this Journey will reveal. |
| **Non-Goals** | An explicit list of topics this Journey will NOT cover. |
| **Learner Prerequisites** | The prior knowledge assumed. Must reference an existing Chapter or declare "none". |
| **Entry State** | The observable system state at the moment the Journey begins. |
| **Exit State** | The observable system state when the central question is answered. |

### Gates

- [ ] The central question can be answered by a complete beginner with no prerequisites other than those declared.
- [ ] The scope does not require introducing more than one new system layer per scene.
- [ ] Non-goals are explicit and unambiguous.

---

## Phase 2 — Pipeline Design

**Objective:** Produce the complete technical pipeline as a sequential list before any story or animation work begins.

### Rules

- This phase produces **only** a numbered sequential list of technical steps.
- No narration. No animation. No scene structure. No storytelling.
- Each step must describe one real, observable state change in the system.
- Steps must be ordered in the sequence in which they actually occur in the real system.

### Required Format

```
Pipeline: [Journey Title]

1. [State change: what changes, in which component, caused by what]
2. [State change: ...]
3. [State change: ...]
...
N. [Final state: the state that answers the central question]
```

### Constraint

Each step in the pipeline will become the causal basis for one or more scenes.
A step may not be omitted because it is considered "too simple" or "already understood".
See: `01_EDUCATIONAL_PHILOSOPHY §1.2` (Brevity Prohibition).

---

## Phase 3 — Pipeline Validation

**Objective:** Verify the pipeline is technically correct and educationally complete before story work begins.

### Validation Checklist

**Technical correctness**
- [ ] Every step is technically accurate.
- [ ] No step describes a mechanism that does not exist in the real system.
- [ ] No step anthropomorphizes a hardware or software component.
- [ ] Steps are in the correct causal order. No step depends on a step that follows it.

**Completeness**
- [ ] No educationally significant step is missing between any two adjacent steps.
- [ ] The pipeline begins at the declared Entry State.
- [ ] The pipeline ends at the declared Exit State.
- [ ] The final step visibly answers the central question.

**Scope**
- [ ] The pipeline contains only steps within the declared scope.
- [ ] No step introduces content declared as a non-goal.
- [ ] No step requires knowledge not established by the declared prerequisites.

**Black Box compliance**
- [ ] Any pipeline step that treats an internal mechanism as opaque is formally classified as either a Deferred Internal or a Terminal Boundary. See: `01_EDUCATIONAL_PHILOSOPHY §3`.

### Gate

The pipeline is frozen as a technical artifact before Phase 4 begins.
Changes to the pipeline after Phase 4 starts require restarting from Phase 4.

---

## Phase 4 — Story Architecture

**Objective:** Convert the validated, frozen pipeline into one continuous Journey with a single protagonist.

### Rules

- Assign exactly one protagonist to the Journey. See: `02_VISUAL_LANGUAGE §13`.
- Map each pipeline step to a narrative beat or scene.
- The central question established in Phase 1 must remain visibly unresolved until the final scene. See: `03_NARRATIVE_FRAMING §15`.
- Every scene must advance the resolution of the central question. A scene with no advancement is not permitted.
- Scene boundaries must align with natural causal breaks in the pipeline, not with topic convenience.

### Required Output

A flat, ordered scene list in the following format:

```
Scene N — [Short Title]
  Pipeline steps covered: [e.g., steps 3–5]
  Advancement toward answer: [one sentence]
  Transition cause into this scene: [the observable event from the previous scene that triggers this one]
  Transition cause out of this scene: [the observable event that triggers the next scene]
```

### Gate

- [ ] Every pipeline step is covered by at least one scene.
- [ ] No scene exists that does not cover at least one pipeline step.
- [ ] The protagonist is present and accounted for in every scene entry and exit.
- [ ] Every scene-to-scene transition has a documented observable cause. See: `02_VISUAL_LANGUAGE §14`.

---

## Phase 5 — Scene Design

**Objective:** Design the visual and structural specification for every scene before writing any narration.

### Required Fields per Scene

| Field | Requirement |
|---|---|
| **Scene ID** | Unique identifier. |
| **Purpose** | One sentence: what the learner understands *after* this scene that they did not before. |
| **Visual Focus** | The primary component receiving visual emphasis. See: `02_VISUAL_LANGUAGE §7`. |
| **Protagonist Position** | Where the protagonist starts and ends within this scene. |
| **Protagonist Path** | The continuous movement path. No teleportation permitted. See: `02_VISUAL_LANGUAGE §13`. |
| **Transition In** | The observable event that caused the protagonist to arrive here. |
| **Transition Out** | The observable event that causes the protagonist to depart. |
| **Concepts Introduced** | List of new concepts or terms introduced in this scene. |
| **Concept Readiness** | For each new concept: the observable experience that makes this concept necessary *before* it is named. See: `03_NARRATIVE_FRAMING §13`. |

### Gates

- [ ] Every scene has a clearly defined single educational purpose.
- [ ] No scene introduces a concept before the learner has observed the phenomenon that requires it.
- [ ] No scene introduces a concept declared as a non-goal.
- [ ] The protagonist's path is continuous and unbroken within every scene.
- [ ] Every transition is caused by an observable event, not by narration. See: `02_VISUAL_LANGUAGE §14`.

---

## Phase 6 — Narration

**Objective:** Write narration only after scene design is complete and approved.

### Rules

- Narration is written scene-by-scene in scene order.
- Narration may only be written for a scene whose Phase 5 design is complete.
- Narration must follow all laws in `03_NARRATIVE_FRAMING`.
- In particular:
  - Narration must emerge from observable events, not introduce concepts in isolation. See: `03_NARRATIVE_FRAMING §14`.
  - Narration may explain a transition only after its visible cause is established. See: `02_VISUAL_LANGUAGE §14`.
  - Technical terms are introduced only after the learner has experienced the phenomenon that requires them. See: `03_NARRATIVE_FRAMING §13`.
  - Checklist, enumeration, and documentation-style narration are prohibited. See: `03_NARRATIVE_FRAMING §14`.

### Narration Self-Check (per scene)

- [ ] Does any sentence describe a component's attributes or properties in isolation?
  If yes: rewrite to emerge from an observable event.
- [ ] Does any sentence introduce a term before the learner has experienced its necessity?
  If yes: move the term introduction later or restructure the scene.
- [ ] Can any paragraph be reduced to a bullet list of facts?
  If yes: the paragraph violates `03_NARRATIVE_FRAMING §14`. Rewrite.
- [ ] Does any sentence anthropomorphize a hardware or software component?
  If yes: rewrite using mechanistic language.

---

## Phase 7 — Educational Review

**Objective:** Perform a complete self-review against all review dimensions before requesting final approval.

### Review Dimensions

#### 7.1 Constitutional Compliance

- [ ] Every scene satisfies `02_VISUAL_LANGUAGE §13` (Protagonist Continuity).
- [ ] Every scene transition satisfies `02_VISUAL_LANGUAGE §14` (Transition Causality).
- [ ] All narration satisfies `03_NARRATIVE_FRAMING §13` (Knowledge Reveal Law).
- [ ] All narration satisfies `03_NARRATIVE_FRAMING §14` (Narrative-Driven Explanation).
- [ ] The Journey satisfies `03_NARRATIVE_FRAMING §15` (Learning Momentum).
- [ ] No Black Box abstraction is unclassified. See: `01_EDUCATIONAL_PHILOSOPHY §3`.

#### 7.2 Technical Correctness

- [ ] Every mechanism described is technically accurate.
- [ ] No step in the pipeline has been silently dropped, merged, or reordered.
- [ ] No component is anthropomorphized in any narration or scene description.

#### 7.3 Story Continuity

- [ ] The protagonist is continuously traceable from the first scene to the last.
- [ ] No scene begins without the learner knowing how the protagonist arrived.
- [ ] No scene ends without the learner knowing where the protagonist proceeds.
- [ ] The central question is answered visibly in the final scene.

#### 7.4 Cognitive Load

- [ ] No scene introduces more than one new independent concept simultaneously. See: `01_EDUCATIONAL_PHILOSOPHY §1.1`.
- [ ] No educationally significant step has been compressed into a single unverified transition. See: `01_EDUCATIONAL_PHILOSOPHY §1.2`.

#### 7.5 Misconception Check

- [ ] Identify the three most likely misconceptions a beginner could form from this Journey.
- [ ] Verify that each identified misconception is actively resolved, not merely avoided. See: `03_NARRATIVE_FRAMING §9`.

### Review Failure

If any gate in Phase 7 fails:

- Return to the earliest phase affected by the failure.
- Do not patch individual scenes to paper over structural problems.
- A narration failure caused by a scene design flaw must be fixed at Phase 5.
- A scene design failure caused by a story architecture flaw must be fixed at Phase 4.

---

## Phase 8 — Final Approval

**Objective:** Officially freeze the Chapter as a production artifact.

### Approval Conditions

All of the following must be confirmed before a Chapter is frozen:

- [ ] All Phase 7 review gates passed with no outstanding failures.
- [ ] No non-goal topic was introduced in any scene or narration.
- [ ] No constitutional rule was weakened, bypassed, or approximated.
- [ ] The Chapter can be handed to any independent author and produce the same educational experience.

### Freeze Record

Upon approval, the following record is created for the Chapter:

```
Chapter: [Title]
Central Question: [The question defined in Phase 1]
Status: FROZEN
Version: 1.0.0
Effective Date: [date]
Review Authority: [reviewer]
Constitutional Compliance: CONFIRMED — Constitution v1.1.0
Pending Issues: NONE
```

### Post-Freeze Policy

Once frozen, a Chapter may only be modified if:

1. A technical inaccuracy is discovered that creates an incorrect mental model.
2. A constitutional amendment makes the Chapter non-compliant.
3. A downstream Chapter reveals a foundational misconception introduced by this Chapter.

Cosmetic, wording, or stylistic changes do not constitute grounds for modification.

---

## Appendix A — Common Failure Modes

| Failure | Root Cause | Corrective Phase |
|---|---|---|
| Scenes feel like independent slides | Story Architecture did not establish a continuous protagonist path | Phase 4 |
| Narration sounds like documentation | Phase 6 was written before Phase 5 was complete | Phase 5, then Phase 6 |
| Technical term introduced before concept is observed | Knowledge Reveal Law (`03_NF §13`) not applied during narration | Phase 6 |
| Scene transition with no visible cause | Phase 5 scene design did not specify Transition Out | Phase 5 |
| Protagonist disappears between scenes | Phase 4 scene list did not document protagonist entry/exit | Phase 4 |
| Pipeline step silently merged or dropped | Phase 3 validation was not completed before Phase 4 | Phase 3 |
| Non-goal content appears in a scene | Scope was not enforced during Phase 5 | Phase 5 |

---

## Appendix B — Constitutional References

| Topic | Constitution Reference |
|---|---|
| Single protagonist | `02_VISUAL_LANGUAGE §13` |
| Transition causality | `02_VISUAL_LANGUAGE §14` |
| Knowledge reveal order | `03_NARRATIVE_FRAMING §13` |
| Narrative-driven explanation | `03_NARRATIVE_FRAMING §14` |
| Learning momentum | `03_NARRATIVE_FRAMING §15` |
| Cognitive load limits | `01_EDUCATIONAL_PHILOSOPHY §1` |
| Black box classification | `01_EDUCATIONAL_PHILOSOPHY §3` |
| Misconception resolution | `03_NARRATIVE_FRAMING §9` |
| Observation before explanation | `03_NARRATIVE_FRAMING §3` |
| No unlearning | `00_VISION §4` |
