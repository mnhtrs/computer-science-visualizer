# Cesvi — Chapter Authoring Workflow

**Document type:** Standard Operating Procedure (SOP)
**Scope:** All Cesvi educational Journeys
**Status:** ACTIVE
**Version:** 1.1.0
**Effective Date:** 2026-07-20
**Authority:** Architecture Authority
**Supersedes:** v1.0.0

> This document defines the mandatory production pipeline for every Cesvi Chapter.
> It governs *how* a Journey is produced.
> The *laws* the Journey must satisfy are defined exclusively in the frozen Constitution (`docs/constitution/`).

---

## Sandbox Development Policy

- **Main Repository:** The Main repository is the absolute Source of Truth.
- **Isolated Snapshots:** Every chapter is developed inside an isolated sandbox snapshot.
- **No Synchronization:** Sandboxes SHALL NOT synchronize with Main during development.
- **No Regeneration:** Sandboxes SHALL NOT regenerate previous chapters.
- **Merge Conditions:** Merge to Main is allowed ONLY after:
  - Every phase is Frozen.
  - Independent Audit passes.

---

## Artifact Traceability

Every artifact produced during this workflow must explicitly record:
- **Parent artifacts:** The artifacts from the preceding phase that this artifact depends on.
- **Produced artifact:** The specific output generated in the current phase.
- **Review status:** Passed, Failed, or Pending.
- **Frozen status:** Whether the artifact has been sealed.

---

## Automatic Continuation Rules

After a phase becomes **Frozen**, the assistant SHALL automatically continue to the next phase without asking the user.

The assistant shall only stop when:
- a review fails,
- a prerequisite is missing,
- the chapter reaches the final **Freeze** state,
- the user explicitly interrupts.

---

## Chapter Lifecycle

The lifecycle consists of 9 sequential stages. No stage may be skipped.

### Phase 1 — Journey Definition
- **Purpose:** Establish the formal scope, central question, and boundaries of the Chapter before design begins.
- **Required Inputs:** Selected topic, Constitution constraints.
- **Produced Outputs:** Journey Definition artifact (Scope, Non-goals, Prerequisites, Entry/Exit State, Central Question).
- **Completion Criteria:** All constraints are documented and bounded.
- **Frozen State:** The definition is sealed. No scope changes are permitted downstream.
- **Review Requirements:** Self-verification against Constitution Scope rules.

### Phase 2 — Pipeline Design
- **Purpose:** Produce the complete technical pipeline as a sequential list of state changes.
- **Required Inputs:** Frozen Phase 1 Journey Definition artifact.
- **Produced Outputs:** Technical Pipeline artifact (Numbered sequence of state changes).
- **Completion Criteria:** Every necessary step to transition from Entry State to Exit State is listed without narrative or animation details.
- **Frozen State:** The pipeline is sealed as the factual skeleton.
- **Review Requirements:** Technical correctness verification.

### Phase 3 — Pipeline Validation
- **Purpose:** Verify the pipeline is technically correct, complete, and scope-compliant.
- **Required Inputs:** Frozen Phase 2 Technical Pipeline artifact.
- **Produced Outputs:** Pipeline Validation record artifact.
- **Completion Criteria:** No missing steps, correct causal ordering, no circular logic, no unclassified black boxes.
- **Frozen State:** Validation record is sealed.
- **Review Requirements:** Review against `01_EDUCATIONAL_PHILOSOPHY` logic constraints.

### Phase 4 — Story Architecture
- **Purpose:** Convert the validated pipeline into one continuous Journey with a single protagonist.
- **Required Inputs:** Frozen Phase 3 Technical Pipeline and Validation artifacts.
- **Produced Outputs:** Story Architecture artifact (Ordered scene list mapping to pipeline steps).
- **Completion Criteria:** Every pipeline step is covered by a scene; protagonist is continuously traceable; every scene advances the central question.
- **Frozen State:** Scene sequence is sealed.
- **Review Requirements:** Review against `02_VISUAL_LANGUAGE` protagonist continuity rules.

### Phase 5 — Scene Design
- **Purpose:** Design the visual and structural specification for every scene before writing narration.
- **Required Inputs:** Frozen Phase 4 Story Architecture artifact.
- **Produced Outputs:** Scene Design artifact (Visual focus, transitions, protagonist paths, concept readiness per scene).
- **Completion Criteria:** Every transition has a visible cause; concepts are introduced only after the phenomenon is observed.
- **Frozen State:** Scene structures are sealed.
- **Review Requirements:** Review against `02_VISUAL_LANGUAGE` causality and `03_NARRATIVE_FRAMING` knowledge reveal rules.

### Phase 6 — Narration
- **Purpose:** Write the natural human language script for the Journey based entirely on observable events.
- **Required Inputs:** Frozen Phase 5 Scene Design artifact.
- **Produced Outputs:** Narration Script artifact.
- **Completion Criteria:** Narration explains only what is visible; no checklist or documentation tone; consistent terminology.
- **Frozen State:** The script is sealed.
- **Review Requirements:** Review against `03_NARRATIVE_FRAMING` explanation rules.

### Self Review
- **Purpose:** Perform a holistic self-evaluation of the entire Chapter against all constraints.
- **Required Inputs:** All Frozen artifacts from Phases 1 through 6.
- **Produced Outputs:** Self Review Record artifact.
- **Completion Criteria:** Every review gate (Constitutional, Technical, Story, Cognitive Load) is verified as PASS.
- **Frozen State:** Self Review is sealed.
- **Review Requirements:** Must use `CHAPTER_REVIEW_CHECKLIST.md`.

### Independent Audit
- **Purpose:** An external or independent validation of the Chapter to ensure it can be handed off seamlessly.
- **Required Inputs:** Frozen Self Review Record and all Chapter artifacts.
- **Produced Outputs:** Independent Audit Record artifact.
- **Completion Criteria:** Zero unresolved comments, zero constitutional violations, zero technical flaws.
- **Frozen State:** Audit Record is sealed.
- **Review Requirements:** Must pass all independent verification checks without exception.

### Freeze
- **Purpose:** Officially seal the Chapter as a production-ready asset.
- **Required Inputs:** Frozen Independent Audit Record.
- **Produced Outputs:** Chapter Freeze Declaration artifact.
- **Completion Criteria:** All previous phases are confirmed Frozen; Chapter is ready for merge.
- **Frozen State:** The Chapter itself is FROZEN.
- **Review Requirements:** Final verification of all traceability links and frozen statuses.

---

## Appendix A — Common Failure Modes

| Failure | Root Cause | Corrective Phase |
|---|---|---|
| Scenes feel like independent slides | Story Architecture did not establish a continuous protagonist path | Phase 4 |
| Narration sounds like documentation | Phase 6 was written before Phase 5 was complete | Phase 5, then Phase 6 |
| Technical term introduced before concept is observed | Knowledge Reveal Law not applied during narration | Phase 6 |
| Scene transition with no visible cause | Phase 5 scene design did not specify Transition Out | Phase 5 |
| Protagonist disappears between scenes | Phase 4 scene list did not document protagonist entry/exit | Phase 4 |
| Pipeline step silently merged or dropped | Phase 3 validation was not completed before Phase 4 | Phase 3 |
| Non-goal content appears in a scene | Scope was not enforced during Phase 5 | Phase 5 |
