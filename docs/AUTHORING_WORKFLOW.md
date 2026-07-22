# Cesvi — Chapter Authoring Workflow & Best Practices Guide

**Document type:** Standard Operating Procedure (SOP) & Authoring Guide
**Scope:** All Cesvi educational Journeys
**Status:** ACTIVE
**Version:** 2.0.0
**Effective Date:** 2026-07-22
**Authority:** Architecture & Educational QA Authority

> This document defines the mandatory production pipeline and authoring best practices for every Cesvi Chapter.
> It governs *how* a Journey is produced, how technical content is pruned, and how story-first learning is enforced.
> The *timeless laws* the Journey must satisfy are defined exclusively in the frozen Constitution (`docs/constitution/`).

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

After a phase becomes **Frozen**, the author/assistant SHALL automatically continue to the next phase without asking the user. The assistant shall only stop when:
- a review fails,
- a prerequisite is missing,
- the chapter reaches the final **Freeze** state,
- the user explicitly interrupts.

---

## Chapter Lifecycle & Operational Phases

The lifecycle consists of 9 sequential stages. No stage may be skipped.

### Phase 1 — Journey Definition
- **Purpose:** Establish the formal scope, central question, and narrative continuity of the Chapter before any design begins.
- **Required Inputs:** Selected topic, Constitution constraints.
- **Produced Outputs:** Journey Definition artifact (Scope, Non-goals, Prerequisites, Entry/Exit State, Central Question).
- **Quality Requirements:**
  *   **One Central Question:** The chapter must address exactly *one* central educational question. If a concept starts answering another question, it belongs in another chapter.
  *   **Chapter-to-Chapter Continuity Contract:** The entry state of Chapter $N+1$ must align seamlessly with the endpoint of Chapter $N$. Authors must declare:
      1. *Upstream State:* The exact physical/visual state of the system at the end of the previous chapter.
      2. *Contextual Carry-Over:* The exact visual assets, mock URLs, and data payloads that must carry over to preserve continuity.
      3. *Downstream Launchpad:* How this chapter's final scene sets up the next.
- **Review Requirements:** Self-verification against Constitution Scope rules.

### Phase 2 — Pipeline Design
- **Purpose:** Produce the complete technical pipeline as a sequential list of state changes.
- **Required Inputs:** Frozen Phase 1 Journey Definition.
- **Produced Outputs:** Technical Pipeline artifact (Numbered sequence of state changes).
- **Quality Requirements:** List only the essential, numbered states required to transition from the Entry State to the Exit State.
- **Review Requirements:** Technical correctness verification.

### Phase 3 — Pipeline Validation
- **Purpose:** Verify the pipeline is technically correct, complete, and scope-compliant.
- **Required Inputs:** Frozen Phase 2 Technical Pipeline.
- **Produced Outputs:** Pipeline Validation record artifact.
- **Quality Requirements:** No missing steps, correct causal ordering, no circular logic, no unclassified black boxes.
- **Review Requirements:** Review against `01_EDUCATIONAL_PHILOSOPHY` logic constraints.

### Phase 4 — Story Architecture
- **Purpose:** Convert the validated pipeline into one continuous Journey with a single protagonist.
- **Required Inputs:** Frozen Phase 3 Technical Pipeline and Validation.
- **Produced Outputs:** Story Architecture artifact (Ordered scene list mapping to pipeline steps).
- **Quality Requirements:**
  *   **The Canonical Learning Rhythm:** Every chapter must structure its learning flow around a recurring, six-stage rhythm:
      1. *Observe:* The learner first sees the system in action.
      2. *Focus:* Attention is directed to the specific component or mechanism being studied.
      3. *Explore:* The learner examines the mechanism's internal behavior.
      4. *Understand:* The learner can predict the mechanism's behavior.
      5. *Continue:* The journey proceeds to the next mechanism.
      6. *Summarize:* The chapter concludes by reinforcing the central question.
  *   **No Standalone Lessons:** Transitions between scenes must feel inevitable; the learner must always feel they are continuing one continuous journey.
- **Review Requirements:** Review against `02_VISUAL_LANGUAGE` protagonist continuity rules.

### Phase 5 — Scene Design
- **Purpose:** Design the visual and structural specification for every scene before writing narration.
- **Required Inputs:** Frozen Phase 4 Story Architecture.
- **Produced Outputs:** Scene Design artifact (Visual focus, transitions, protagonist paths, concept readiness per scene).
- **Quality Requirements:**
  *   Every transition must have a visible cause.
  *   Stable structures must remain spatially stable.
  *   Orientation preservation must be planned so the camera never disorients the learner.
  *   Scenes must exist because the learner needs them to solve an experienced problem, not because the technology exists. Never create scenes whose only purpose is to explain a mechanism.
- **Review Requirements:** Review against `02_VISUAL_LANGUAGE` causality and `03_NARRATIVE_FRAMING` knowledge reveal rules.

### Phase 6 — Narration
- **Purpose:** Write the natural human language script for the Journey based entirely on observable events.
- **Required Inputs:** Frozen Phase 5 Scene Design.
- **Produced Outputs:** Narration Script artifact.
- **Quality Requirements:**
  *   **The PST Sequence:** Every narration sequence introducing a concept must follow the exact sequence: **Question → Problem → Need → Solution → Terminology**. Never reverse this order, and never introduce terminology simply because it exists.
  *   **Prohibited Text Patterns (Anti-Manual Rules):** To prevent narration from sounding like dry technical documentation, the following prose patterns are strictly forbidden:
      *   Starting an explanation with: *"X is a component that..."*, *"X is responsible for..."*, *"X performs the function of..."*, or *"The role of X is..."*.
      *   Listing a component's attributes, properties, or features as a standalone checklist.
      *   Explaining what a component "is" before showing it active in the story.
  *   **Bilingual Technical Lock:** Explanations must use plain, everyday language, but core technical terms (e.g., CPU, RAM, Router, Packets, DOM Tree) must remain locked to their global English terms. Localized terms must be explicitly displayed alongside their English equivalents.
- **Review Requirements:** Review against `03_NARRATIVE_FRAMING` explanation rules.

### Phase 7 — Self Review
- **Purpose:** Perform a holistic self-evaluation of the entire Chapter against all constraints.
- **Required Inputs:** All Frozen artifacts from Phases 1 through 6.
- **Produced Outputs:** Self Review Record artifact.
- **Review Requirements:** Must use `docs/CHAPTER_REVIEW_CHECKLIST.md`.

### Phase 8 — Independent Audit
- **Purpose:** An external or independent validation of the Chapter to ensure it can be handed off seamlessly.
- **Required Inputs:** Frozen Self Review Record and all Chapter artifacts.
- **Produced Outputs:** Independent Audit Record artifact.
- **Review Requirements:** Must pass all independent verification checks without exception.

### Phase 9 — Freeze
- **Purpose:** Officially seal the Chapter as a production-ready asset.
- **Required Inputs:** Frozen Independent Audit Record.
- **Produced Outputs:** Chapter Freeze Declaration.

---

## Educational Quality Best Practices

### 1. Technical Pruning & The Educational Stopping Point
*   **The Principle:** Technical completeness must never override educational clarity. Authors must prune technical noise (such as minor protocol options, packet fields, or minor architectural buffers) that do not directly contribute to answering the single central question.
*   **The Stopping Point:** Once the learning objective of a chapter or beat is achieved, **stop teaching**. Do not add extra details or adjacent concepts simply because they are technically true or related. The success of a chapter is measured by learner retention and confidence, not by technical density.

### 2. Curiosity-Driven Learning
*   The learner's curiosity must never serve the technology; rather, the technology must serve the learner's curiosity. A component or system layer must only appear on screen at the moment the learner's mental simulation faces a bottleneck and demands a solution.

### 3. Concurrency and Parallelism Visual Weight
*   In multi-agent systems (like networks or parallel execution), the primary protagonist (the golden spark) must carry 100% of the active attention. Secondary parallel agents must be rendered with faded visual weights (grayed out or transparent) so they illustrate the concept of concurrency without causing cognitive overload.

---

## AI Authoring Guidance (For LLM Agents)

If you are an AI assistant developing a chapter for CESVI, you must adhere to these strict rules to prevent educational drift:
1.  **Do Not Default to "Textbook" or "Lecture Slide" Writing:** Avoid paragraphs of dry explanation. Your narration must be natural, conversational, and direct the user's attention *only* to what is currently visible on screen.
2.  **Verify Your Trajectory Before Implementation:** Do not write Canvas rendering code or storyboards until you have established the singular central question (Phase 1) and technical pipeline (Phase 2), and verified them with the user.
3.  **Respect the Story Continuity:** Ensure that the first scene of your new chapter uses the same mock domain or file names as the previous chapter.

---

## Common Educational Failure Patterns

Reviewers and authors should watch out for these common failure modes:

| Failure Pattern | Root Cause | Symptom | Corrective Action |
|---|---|---|---|
| **The "Slide Deck" Effect** | Disconnected scenes, missing protagonist path | The learner feels they are reading independent slides rather than traveling. | Return to Phase 4. Map a continuous protagonist path across all scenes. |
| **The Jargon Dump** | Terminology introduced before its need is established | The learner is forced to memorize a term (e.g. "TCP", "Router") without understanding why it exists. | Return to Phase 6. Apply the PST sequence: establish the problem first. |
| **The Academic Bloat** | Trying to teach the entire technical spec | Narration becomes dense with minor protocol options, confusing absolute beginners. | Return to Phase 1. Add the distracting concepts to the "Non-Goals" list and prune. |
| **The Ghost Handoff** | Chapter boundaries are disjointed | The learner feels they have started a completely different lesson; previous context is lost. | Return to Phase 1. Enforce the Continuity Contract. |
| **The Active HUD Noise** | UI dashboards and data tables animate simultaneously with the spark | The learner's attention is split, leading to cognitive overload. | Return to Phase 5. Dim auxiliary UI until the spark has completed its travel. |
