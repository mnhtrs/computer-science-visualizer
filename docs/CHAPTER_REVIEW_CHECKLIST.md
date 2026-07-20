# Cesvi — Chapter Review Checklist

**Document type:** Quality Assurance Checklist
**Scope:** All Cesvi educational Journeys
**Status:** ACTIVE
**Version:** 1.0.0
**Effective Date:** 2026-07-20
**Authority:** Chief Quality Assurance Architect
**Constitutional Baseline:** Constitution v1.1.0
**Workflow Baseline:** AUTHORING_WORKFLOW.md v1.0.0

> This checklist is the mandatory QA gate that every Chapter must pass before it may be frozen.
> It does not teach. It only verifies.
> A Chapter that fails any gate must return to the Authoring Workflow phase identified in the corrective action column.

---

## How to Use This Checklist

1. Work through every gate in order.
2. For each item, mark: `PASS` / `FAIL` / `N/A`.
3. A single `FAIL` blocks Chapter approval.
4. Record every `FAIL` with a specific note describing what was found.
5. After corrective action, re-run only the gates affected by the change.
6. A Chapter may be frozen only when all applicable items are `PASS`.

---

## Gate 1 — Scope

**Purpose:** Verify that the Chapter is bounded, coherent, and respects future Journey content.

---

### 1.1 — One Central Educational Question

| | |
|---|---|
| **Verify** | The Chapter has exactly one central educational question, declared before any design work began. |
| **Why it matters** | A Journey without a single question becomes a survey. The learner has no frame for what they are trying to understand. See: `03_NARRATIVE_FRAMING §15`. |
| **Pass criteria** | The question is written down. It is singular. A complete beginner can understand it before watching the Journey. The final scene visibly answers it. |
| **Common failures** | Two questions merged into one ("How does the CPU run a program and why is RAM needed?"). A question so broad it cannot be answered in one Journey. |
| **Corrective action** | Return to Authoring Workflow Phase 1. |

---

### 1.2 — Scope Clearly Defined

| | |
|---|---|
| **Verify** | A bounded scope list exists. Every topic covered in the Chapter appears in this list. |
| **Why it matters** | Without a declared scope, reviewers cannot determine whether a scene belongs in the Journey or belongs to a future Chapter. |
| **Pass criteria** | Every scene in the Chapter can be mapped to at least one item in the scope list. No scene covers a topic absent from the scope list. |
| **Common failures** | A DNS resolution scene appearing in a Journey scoped to HTTP request handling. A RAM internals explanation in a Chapter scoped to program loading. |
| **Corrective action** | Return to Authoring Workflow Phase 1 to tighten scope, or Phase 5 to remove the out-of-scope scene. |

---

### 1.3 — Non-Goals Respected

| | |
|---|---|
| **Verify** | The Chapter's non-goal list is honored in every scene and narration line. |
| **Why it matters** | Non-goals exist to prevent scope creep and to protect the clarity of future Journeys. Violating a non-goal introduces content without the preparation required by the Constitution. |
| **Pass criteria** | Each declared non-goal can be searched for in narration and scene descriptions without appearing. |
| **Common failures** | Mentioning CPU pipelining in a Journey that declared it as a non-goal. Briefly explaining the OS scheduler in a Journey scoped to program execution. |
| **Corrective action** | Return to Authoring Workflow Phase 6 to remove the offending narration, or Phase 5 if the scene itself is the violation. |

---

### 1.4 — No Future Journey Content Leaked

| | |
|---|---|
| **Verify** | No concept, term, or mechanism belonging to a planned future Chapter appears in this Journey without being formally classified as a Deferred Internal. See: `01_EDUCATIONAL_PHILOSOPHY §3.1`. |
| **Why it matters** | Leaking future content without classification creates unexplained black boxes or, worse, partial explanations that require unlearning later. See: `00_VISION §4 — No Unlearning`. |
| **Pass criteria** | Every reference to an unexplained system layer is explicitly flagged as a Deferred Internal or Terminal Boundary within the Journey documentation. |
| **Common failures** | "The operating system then schedules the next process" — used casually without classifying OS scheduling as a Deferred Internal. |
| **Corrective action** | Return to Authoring Workflow Phase 1 to formally classify, or Phase 6 to remove the reference. |

---

## Gate 2 — Technical Pipeline

**Purpose:** Verify that the technical foundation of the Journey is accurate, complete, and correctly ordered.

---

### 2.1 — Complete Pipeline Exists

| | |
|---|---|
| **Verify** | A sequential, numbered technical pipeline was produced and frozen before story work began. |
| **Why it matters** | The pipeline is the factual skeleton of the Journey. Story, animation, and narration are built on top of it. A missing pipeline means the Chapter has no verified technical foundation. |
| **Pass criteria** | A pipeline document or section exists. Every scene in the Chapter corresponds to at least one pipeline step. |
| **Common failures** | Chapter was authored directly as scenes without a prior pipeline document. |
| **Corrective action** | Return to Authoring Workflow Phase 2. The pipeline must be produced and validated before reviewing further. |

---

### 2.2 — No Missing Steps

| | |
|---|---|
| **Verify** | No educationally significant state change is absent between two adjacent pipeline steps. |
| **Why it matters** | A missing step forces the learner to mentally invent a transition. This violates `02_VISUAL_LANGUAGE §5` and creates a gap that produces incorrect mental models. |
| **Pass criteria** | A subject-matter expert can trace every causal step from the Entry State to the Exit State through the pipeline without encountering an unexplained jump. |
| **Common failures** | A pipeline jumps from "program loaded into RAM" directly to "CPU executes first instruction" without showing how the CPU knows which instruction to start with. |
| **Corrective action** | Return to Authoring Workflow Phase 3. |

---

### 2.3 — Correct Ordering

| | |
|---|---|
| **Verify** | Pipeline steps occur in the order in which they occur in the real system. |
| **Why it matters** | Reordering steps for narrative convenience creates a technically false mental model. See: `03_NARRATIVE_FRAMING §2 — Reality Before Story`. |
| **Pass criteria** | Each step can only be reached after every step it causally depends on has occurred. |
| **Common failures** | Showing the CPU fetching an instruction before showing the program being loaded into RAM. |
| **Corrective action** | Return to Authoring Workflow Phase 3. |

---

### 2.4 — No Circular Logic

| | |
|---|---|
| **Verify** | No pipeline step depends on a step that has not yet occurred. |
| **Why it matters** | Circular dependencies in a pipeline produce scenes that cannot be causally connected. The learner is left with an unresolvable logical gap. |
| **Pass criteria** | The pipeline can be traced forward linearly from step 1 to step N without any backward dependency. |
| **Common failures** | "The CPU reads the instruction from RAM" placed before "The instruction was loaded into RAM". |
| **Corrective action** | Return to Authoring Workflow Phase 3. |

---

### 2.5 — No Hidden Magic

| | |
|---|---|
| **Verify** | No pipeline step produces an output whose cause is not established within the Journey or formally classified as a Deferred Internal / Terminal Boundary. |
| **Why it matters** | Unexplained outputs are black boxes. Black boxes without classification violate `01_EDUCATIONAL_PHILOSOPHY §3` and produce magical thinking. |
| **Pass criteria** | Every output of every pipeline step has a visible cause in the Journey, or is formally classified and acknowledged as deferred. |
| **Common failures** | "The DNS server returns the IP address" presented without any explanation of how the DNS server knows the IP address. |
| **Corrective action** | Return to Authoring Workflow Phase 1 to classify, or Phase 3 to add the missing step. |

---

### 2.6 — Technical Correctness

| | |
|---|---|
| **Verify** | Every mechanism described in the pipeline is technically accurate. |
| **Why it matters** | A technically incorrect pipeline produces a Journey that teaches a false mental model. Once learned, incorrect mental models are difficult to correct. See: `00_VISION §4 — No Unlearning`. |
| **Pass criteria** | A subject-matter expert can confirm every step without qualification. |
| **Common failures** | Stating that the CPU fetches instructions directly from the SSD. Describing RAM as permanent storage. |
| **Corrective action** | Return to Authoring Workflow Phase 2. |

---

## Gate 3 — Story Architecture

**Purpose:** Verify that the Journey is a single, continuous narrative rather than a sequence of independent scenes.

---

### 3.1 — Exactly One Protagonist

| | |
|---|---|
| **Verify** | The Journey designates exactly one persistent visual protagonist. |
| **Why it matters** | Multiple protagonists fracture the learner's attention and destroy the single-thread narrative that makes the system comprehensible. See: `02_VISUAL_LANGUAGE §13`. |
| **Pass criteria** | The protagonist is named in the Journey documentation. Every scene references the same entity. No scene introduces a second protagonist without explicitly retiring the first. |
| **Common failures** | "The request packet" is the protagonist in one scene; "the server" becomes the visual focus in the next, with the packet nowhere to be seen. |
| **Corrective action** | Return to Authoring Workflow Phase 4. |

---

### 3.2 — Continuous Protagonist

| | |
|---|---|
| **Verify** | The protagonist's location is always known to the learner. |
| **Why it matters** | A protagonist that disappears between scenes forces the learner to mentally reconstruct its position. This violates `02_VISUAL_LANGUAGE §13` and breaks narrative continuity. |
| **Pass criteria** | At every scene boundary, both the exit position of the protagonist (end of preceding scene) and the entry position (start of next scene) are defined and consistent. |
| **Common failures** | The protagonist is inside the CPU at the end of Scene 3 but appears on the network at the start of Scene 4 with no transitional movement. |
| **Corrective action** | Return to Authoring Workflow Phase 4 or Phase 5. |

---

### 3.3 — No Teleportation

| | |
|---|---|
| **Verify** | The protagonist never moves from one location to another without a visible, continuous path. |
| **Why it matters** | Teleportation is the visual equivalent of a missing pipeline step. It produces the same logical gap at the animation level. See: `02_VISUAL_LANGUAGE §5`. |
| **Pass criteria** | The protagonist's path between any two points is either continuously animated or explicitly described in the scene transition specification. No gap exists in which the protagonist's movement is unaccounted for. |
| **Common failures** | The protagonist appears in the browser in one beat and simultaneously in the server in the next beat, with no travel depicted. |
| **Corrective action** | Return to Authoring Workflow Phase 5. |

---

### 3.4 — Every Transition Has an Observable Cause

| | |
|---|---|
| **Verify** | Every scene-to-scene transition is triggered by an observable event established in the preceding scene. |
| **Why it matters** | A transition that occurs because narration declares it teaches the learner that systems change arbitrarily. See: `02_VISUAL_LANGUAGE §14`. |
| **Pass criteria** | The Phase 5 scene design document specifies a "Transition Out" event for every scene. That event is visible in the animation before the transition occurs. |
| **Common failures** | "Now let's go inside the CPU" narrated without any observable trigger causing the transition. |
| **Corrective action** | Return to Authoring Workflow Phase 5. |

---

### 3.5 — One Continuous Journey

| | |
|---|---|
| **Verify** | The Journey reads as a single, unbroken narrative from first scene to last. |
| **Why it matters** | Independent scenes produce the "slide deck" effect, where the learner reads but does not travel. This violates `03_NARRATIVE_FRAMING §15`. |
| **Pass criteria** | Remove all narration. The animation alone should tell a coherent story. A learner watching without sound should be able to follow the protagonist's journey. |
| **Common failures** | Scenes that could be reordered without breaking the narrative. Scenes that begin with a title card rather than with the protagonist arriving from the previous scene. |
| **Corrective action** | Return to Authoring Workflow Phase 4. |

---

### 3.6 — Every Scene Advances the Central Question

| | |
|---|---|
| **Verify** | Each scene moves the learner measurably closer to answering the Journey's central question. |
| **Why it matters** | A scene that does not advance the central question is either out of scope or an independent explanation inserted into the Journey. Both are prohibited. See: `03_NARRATIVE_FRAMING §15`. |
| **Pass criteria** | For every scene, the reviewer can complete the sentence: "After this scene, the learner now knows [X], which brings them closer to understanding [central question] because [reason]." |
| **Common failures** | A scene explaining RAM internals in a Journey whose central question is "How does a program start?" — where RAM internals are not necessary to answer the question. |
| **Corrective action** | Return to Authoring Workflow Phase 4. Remove or merge the scene, or redefine the scope. |

---

### 3.7 — Ending Answers the Opening Question

| | |
|---|---|
| **Verify** | The final scene provides a complete, visible answer to the central question declared in Phase 1. |
| **Why it matters** | A Journey that does not close its central question leaves the learner in an unresolved state. The educational objective has not been achieved. See: `03_NARRATIVE_FRAMING §15`. |
| **Pass criteria** | The reviewer can point to a specific moment in the final scene at which the central question is answered visibly — not just narrated. |
| **Common failures** | The Journey ends with the system returning to its starting state without making the answer explicit. The answer is stated in narration but never shown in the animation. |
| **Corrective action** | Return to Authoring Workflow Phase 5 or Phase 6. |

---

## Gate 4 — Educational Design

**Purpose:** Verify that the Chapter builds correct mental models in the correct sequence.

---

### 4.1 — Observation Before Explanation

| | |
|---|---|
| **Verify** | The learner observes every phenomenon before receiving an explanation of it. |
| **Why it matters** | Explanation without prior observation replaces learning with memorization. See: `03_NARRATIVE_FRAMING §3`. |
| **Pass criteria** | For every narration line that explains a mechanism, the mechanism has been visibly animated in the current or immediately preceding beat. |
| **Common failures** | Narrating "The Control Unit decodes the instruction" before the Control Unit has been shown receiving and acting on the instruction. |
| **Corrective action** | Return to Authoring Workflow Phase 6. Restructure the beat so the animation precedes the explanation. |

---

### 4.2 — Question Before Answer

| | |
|---|---|
| **Verify** | Every explanation answers a question that has been established prior to the explanation. |
| **Why it matters** | Information without a preceding question is noise. The learner has no frame for receiving it. See: `03_NARRATIVE_FRAMING §4`. |
| **Pass criteria** | For every explanation in the narration, the reviewer can identify the moment — earlier in the Journey — at which the learner would have naturally asked the question being answered. |
| **Common failures** | Explaining what RAM is before the learner has observed the system needing somewhere to store a program. |
| **Corrective action** | Return to Authoring Workflow Phase 5 to add the establishing beat, then Phase 6 to reposition the explanation. |

---

### 4.3 — Knowledge Revealed Progressively

| | |
|---|---|
| **Verify** | Each new concept depends only on concepts already established in the Journey or declared as prerequisites. |
| **Why it matters** | A concept that requires unexplained prior knowledge forces the learner to either accept a mystery or construct a false model. See: `03_NARRATIVE_FRAMING §5`. |
| **Pass criteria** | Every concept introduced in the Journey can be traced back to either a declared prerequisite or an earlier scene in the same Journey. |
| **Common failures** | Explaining the Program Counter before establishing that the CPU needs to track which instruction to run next. |
| **Corrective action** | Return to Authoring Workflow Phase 4 to reorder, or Phase 5 to add an establishing scene. |

---

### 4.4 — Terminology Introduced Only After Experience

| | |
|---|---|
| **Verify** | Every technical term is introduced only after the learner has experienced the phenomenon that makes the term necessary. |
| **Why it matters** | A term without a prior experience is a label without a referent. It is memorized, not understood. See: `03_NARRATIVE_FRAMING §13`. |
| **Pass criteria** | For every technical term introduced in the Journey, the reviewer can point to a specific moment — earlier in the same scene or in a prior scene — where the learner observed the phenomenon the term describes. |
| **Common failures** | Introducing "Program Counter" as a label on a diagram before showing the CPU needing to track instruction order. Calling it "RAM" before showing the system needing a fast, temporary place to hold a program. |
| **Corrective action** | Return to Authoring Workflow Phase 6. Reposition the term introduction, or return to Phase 5 to add the establishing observation. |

---

### 4.5 — One Concept Introduced at a Time

| | |
|---|---|
| **Verify** | No single scene or beat introduces more than one new independent concept simultaneously. |
| **Why it matters** | Simultaneous introduction of multiple concepts exceeds the learner's working memory capacity and prevents correct mental model formation. See: `01_EDUCATIONAL_PHILOSOPHY §1.1`. |
| **Pass criteria** | Each scene can be assigned exactly one new concept. If a scene appears to introduce two concepts, it must be split into two scenes. |
| **Common failures** | A single scene introducing both "what RAM is" and "how the CPU fetches from RAM" simultaneously. |
| **Corrective action** | Return to Authoring Workflow Phase 5. Split the scene. |

---

### 4.6 — Cognitive Load Remains Manageable

| | |
|---|---|
| **Verify** | No scene compresses a sequence of meaningful state changes into a single unverified transition. |
| **Why it matters** | Compressed transitions hide causality. The learner cannot trace what happened, so they fill the gap with assumption. See: `01_EDUCATIONAL_PHILOSOPHY §1.2`. |
| **Pass criteria** | Every state change that a beginner would need to observe to build a correct mental model is animated as a distinct, visible step. |
| **Common failures** | "The packet travels across the internet" shown as a single animated line with no representation of routers, hops, or physical distance. |
| **Corrective action** | Return to Authoring Workflow Phase 5 to expand the compressed scene, or Phase 3 to add the missing pipeline step. |

---

### 4.7 — Misconceptions Actively Prevented

| | |
|---|---|
| **Verify** | The three most likely beginner misconceptions about the Journey's topic are identified and actively resolved within the Journey. |
| **Why it matters** | Omitting a misconception is not the same as resolving it. A learner who leaves with an unchallenged false intuition will construct an incorrect mental model. See: `03_NARRATIVE_FRAMING §9`. |
| **Pass criteria** | The Journey documentation lists at least three expected misconceptions. For each, the reviewer can identify the specific scene and moment at which the Journey guides the learner toward recognizing why the false intuition fails. |
| **Common failures** | The Journey shows the CPU executing instructions without addressing the common misconception that the CPU reads directly from the hard drive. |
| **Corrective action** | Return to Authoring Workflow Phase 5 to add a misconception-resolution beat, then Phase 6 to write the narration. |

---

## Gate 5 — Visual Design

**Purpose:** Verify that the visual representation faithfully constructs the correct mental model.

---

### 5.1 — Spatial Continuity

| | |
|---|---|
| **Verify** | Components do not change position unless the movement itself represents a real mechanism. |
| **Why it matters** | Spatial memory is part of the learner's mental model. Repositioning components disrupts the mental map the learner has built. See: `02_VISUAL_LANGUAGE §6`. |
| **Pass criteria** | Every component occupies the same relative position throughout the Journey, unless the Journey explicitly teaches that components change physical location. |
| **Common failures** | The CPU appears on the left side in one scene and on the right in another for layout convenience. |
| **Corrective action** | Return to Authoring Workflow Phase 5. |

---

### 5.2 — Temporal Continuity

| | |
|---|---|
| **Verify** | All state transitions are continuously observable. No educationally significant change occurs in a hidden transition. |
| **Why it matters** | A hidden transition forces the learner to mentally invent missing steps. This produces the same cognitive harm as a missing pipeline step. See: `02_VISUAL_LANGUAGE §5`. |
| **Pass criteria** | The reviewer can watch the animation frame-by-frame and explain every state change without inferring anything that was not shown. |
| **Common failures** | A value appearing in a register without the instruction that produced it being visibly executed. |
| **Corrective action** | Return to Authoring Workflow Phase 5. |

---

### 5.3 — Stable Visual Language

| | |
|---|---|
| **Verify** | Visual conventions (colors, shapes, motion styles, component representations) are consistent throughout the Journey and consistent with prior Chapters. |
| **Why it matters** | Inconsistent visual language forces the learner to re-learn what symbols mean mid-Journey. See: `02_VISUAL_LANGUAGE §10`. |
| **Pass criteria** | The same component type is always represented with the same visual treatment. A color used to represent one concept is not reused to represent a different concept. |
| **Common failures** | RAM represented as a blue rectangle in Chapter 1 but as a green cylinder in Chapter 3. |
| **Corrective action** | Return to Authoring Workflow Phase 5. |

---

### 5.4 — No Misleading Symbolism

| | |
|---|---|
| **Verify** | No visual element introduces a structure, behavior, or property that does not exist in the real system. |
| **Why it matters** | Decorative symbolism is indistinguishable from representational symbolism to a beginner. False visual relationships produce false mental models. See: `02_VISUAL_LANGUAGE §2`. |
| **Pass criteria** | Every visual element in the animation corresponds to a real component, relationship, or state in the system. Any element that is purely decorative is verifiably incapable of being misread as meaningful. |
| **Common failures** | Connecting two components with an arrow that implies a direct physical link when the real connection passes through an intermediary. |
| **Corrective action** | Return to Authoring Workflow Phase 5. |

---

### 5.5 — Physical and Logical Structures Remain Distinguishable

| | |
|---|---|
| **Verify** | The visual design clearly separates what exists (hardware, permanent structures) from what changes (data, state, values). |
| **Why it matters** | Confusing a structure with its state is one of the most common beginner misconceptions in computer science. See: `02_VISUAL_LANGUAGE §4`. |
| **Pass criteria** | The learner can always identify: what is a container, what is content, and what is currently changing. |
| **Common failures** | Animating a RAM module flashing to represent data being written, making it look as though RAM itself is changing rather than its contents. |
| **Corrective action** | Return to Authoring Workflow Phase 5. |

---

## Gate 6 — Narration

**Purpose:** Verify that all narration is natural, mechanistic, and story-driven rather than documentary.

---

### 6.1 — Natural Human Language

| | |
|---|---|
| **Verify** | Narration reads as natural language, not as technical documentation or specification prose. |
| **Why it matters** | Documentation-style narration triggers a passive reading mode in the learner. It prevents the immersive, story-driven engagement required for mental model construction. |
| **Pass criteria** | A non-technical person can read any narration line aloud without it sounding like a manual. |
| **Common failures** | "The Control Unit decodes the instruction opcode and issues control signals to the appropriate execution units." |
| **Corrective action** | Return to Authoring Workflow Phase 6. |

---

### 6.2 — No Documentation Tone

| | |
|---|---|
| **Verify** | No narration section reads as a definition, specification, or formal description of a component. |
| **Why it matters** | Documentation tone is the primary symptom of narration that was written independently of the observable story. See: `03_NARRATIVE_FRAMING §14`. |
| **Pass criteria** | No narration line begins with or contains patterns such as: "X is a component that...", "X is responsible for...", "X performs the function of...", "The role of X is...". |
| **Common failures** | "The Program Counter is a register that holds the address of the next instruction to be executed." |
| **Corrective action** | Return to Authoring Workflow Phase 6. Rewrite to emerge from an observable event. |

---

### 6.3 — No Checklist Narration

| | |
|---|---|
| **Verify** | No narration section presents information as a structured list of attributes, facts, or properties. |
| **Why it matters** | Checklist narration is documentation narration in disguise. It signals that the explanation was organized by component rather than by observable event. See: `03_NARRATIVE_FRAMING §14`. |
| **Pass criteria** | No narration section — whether formatted as prose or as bullet points — can be reduced to a list of "X does: [a], [b], [c]". |
| **Common failures** | "The ALU can: add numbers, subtract numbers, multiply numbers, and compare values." |
| **Corrective action** | Return to Authoring Workflow Phase 6. |

---

### 6.4 — No Isolated Component Descriptions

| | |
|---|---|
| **Verify** | No narration introduces a component by describing what it is in isolation, independent of what is currently happening in the animation. |
| **Why it matters** | Component descriptions inserted into the narrative pause the Journey and convert it into a reference manual. See: `03_NARRATIVE_FRAMING §14`. |
| **Pass criteria** | Every component is introduced through what it does at the moment the protagonist encounters it — not through what it is in general. |
| **Common failures** | "Now we meet the RAM. RAM stands for Random Access Memory. It is fast, temporary storage used by the CPU." — narrated before the protagonist has any reason to interact with RAM. |
| **Corrective action** | Return to Authoring Workflow Phase 6. Remove the description; let the component introduce itself through action. |

---

### 6.5 — Narration Follows Observable Events

| | |
|---|---|
| **Verify** | Every narration line describes, explains, or names something that the learner has just observed or is currently observing. |
| **Why it matters** | Narration that precedes the observable event replaces observation with instruction. This inverts the constitutional law: observation must come before explanation. See: `03_NARRATIVE_FRAMING §3`. |
| **Pass criteria** | For every narration line, the reviewer can identify the specific animation frame or beat that preceded it and provided the observable basis for the narration. |
| **Common failures** | "The CPU will now fetch the instruction from RAM" narrated before the fetch animation begins. |
| **Corrective action** | Return to Authoring Workflow Phase 6. Reorder so the animation precedes the narration. |

---

### 6.6 — Consistent Terminology

| | |
|---|---|
| **Verify** | Every technical term is used with exactly the same meaning throughout the Journey and consistently with prior Chapters. |
| **Why it matters** | Inconsistent terminology forces the learner to determine whether two terms refer to the same concept or different concepts — cognitive work that belongs to the system, not the learner. |
| **Pass criteria** | Each technical concept has exactly one term. That term is introduced once and used consistently thereafter. No synonym is introduced without explicitly mapping it to the established term. |
| **Common failures** | Using "instruction," "command," and "operation" interchangeably within the same Journey. |
| **Corrective action** | Return to Authoring Workflow Phase 6. Standardize all occurrences. |

---

## Gate 7 — Final Validation

**Purpose:** Confirm that the Chapter is complete, consistent, and ready to be frozen.

---

### 7.1 — Constitution Fully Satisfied

| | |
|---|---|
| **Verify** | Every constitutional law has been applied without exception, approximation, or bypass. |
| **Pass criteria** | The reviewer has checked every item in Appendix B of the Authoring Workflow against the Chapter and confirmed compliance. No constitutional rule was weakened for implementation convenience. |
| **Common failures** | A scene transition occurring without a visible cause, justified by "the animation makes it clear." The Constitution does not permit such exceptions. |
| **Corrective action** | Return to the Authoring Workflow phase identified for the failing constitutional rule. |

---

### 7.2 — Workflow Fully Satisfied

| | |
|---|---|
| **Verify** | All eight Authoring Workflow phases were completed in order, and their required outputs exist. |
| **Pass criteria** | Phase outputs are documented: the central question (Phase 1), the pipeline (Phase 2), the pipeline validation record (Phase 3), the scene list (Phase 4), the scene design specifications (Phase 5), the narration (Phase 6), the self-review record (Phase 7). |
| **Common failures** | No pipeline document exists; the Chapter was authored directly as scenes. |
| **Corrective action** | Return to the earliest missing Workflow phase. |

---

### 7.3 — No Unresolved Reviewer Comments

| | |
|---|---|
| **Verify** | Every comment, concern, or issue raised during review has been resolved and confirmed. |
| **Pass criteria** | The review record shows no open items. Every previously flagged `FAIL` has been re-evaluated and confirmed `PASS`. |
| **Common failures** | A narration issue was "noted for future improvement" rather than corrected before approval. |
| **Corrective action** | Resolve all open items before proceeding. No Chapter may be frozen with outstanding review comments. |

---

### 7.4 — Ready to Freeze

| | |
|---|---|
| **Verify** | All Gates 1–7 are fully `PASS`. The Chapter can be handed to any independent author and produce the same educational experience. |
| **Pass criteria** | The reviewer signs off on the Freeze Record in the Authoring Workflow Phase 8 format. |
| **Common failures** | Freezing a Chapter with known issues on the assumption they will be "fixed in the next version." |
| **Corrective action** | Do not freeze. Return to the relevant phase. A Chapter is frozen only when all issues are resolved. |

---

## Freeze Approval

When all gates pass, record the following:

```
Chapter Review Result

Chapter: [Title]
Central Question: [The question]
Reviewer: [Name or role]
Review Date: [date]

Gate 1 — Scope:                  PASS
Gate 2 — Technical Pipeline:     PASS
Gate 3 — Story Architecture:     PASS
Gate 4 — Educational Design:     PASS
Gate 5 — Visual Design:          PASS
Gate 6 — Narration:              PASS
Gate 7 — Final Validation:       PASS

Outstanding Issues: NONE

Recommendation: APPROVE FOR FREEZE
```

---

## Quick Reference — Corrective Action by Phase

| Authoring Workflow Phase | Issues Resolved Here |
|---|---|
| Phase 1 — Journey Definition | Central question missing or multiple; scope undefined; non-goals missing; Deferred Internals not classified |
| Phase 2 — Pipeline Design | Pipeline not produced; pipeline technically incorrect |
| Phase 3 — Pipeline Validation | Missing steps; misordered steps; circular logic; hidden magic |
| Phase 4 — Story Architecture | No protagonist defined; Journey is a collection of disconnected scenes; scenes do not advance the central question |
| Phase 5 — Scene Design | Protagonist teleportation; transitions without observable causes; spatial discontinuity; out-of-scope scenes; missing establishing beats |
| Phase 6 — Narration | Documentation tone; checklist narration; terminology introduced before experience; narration precedes animation; inconsistent terms |
| Phase 7 — Self-Review | Constitutional compliance check; misconception identification |
| Phase 8 — Final Approval | Do not freeze if any gate fails. No exceptions. |
