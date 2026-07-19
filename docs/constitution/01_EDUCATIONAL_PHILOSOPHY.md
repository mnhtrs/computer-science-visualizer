# Constitution Document 01: Educational Philosophy

**Title:** Educational Philosophy
**Purpose:** Defines the deterministic cognitive laws and verification boundaries governing mental model construction.
**Status:** Frozen
**Version:** 1.0.0
**Dependencies:** `00_VISION.md`
**Downstream Documents:** `02_VISUAL_LANGUAGE.md`, `03_NARRATIVE_FRAMING.md`, Curriculum, Journeys, Runtime Architecture
**Review Gates:** Educational Psychologist, CS Professor, Curriculum Designer, Software Architect, AI Systems Engineer

---

## 1. The Law of State Mutation Limits
A Journey must strictly bound cognitive progression by limiting the number of independent system variables that mutate simultaneously.
*   **1.1. Single State Mutation:** A standard interaction step shall introduce or require the mutation of exactly one independent state variable before State-Predictive Verification is executed.
*   **1.2. Brevity Prohibition:** A sequence of mechanical steps shall never be condensed into a single unverified transition, regardless of spatial or temporal constraints.

## 2. Atomic Cognitive Chunking
When a mechanical operation inherently requires the simultaneous mutation of multiple variables, the operation must be treated as an Atomic Chunk.
*   **2.1. Sequential Grouping:** The independent sub-steps composing the atomic operation must first be isolated and verified individually.
*   **2.2. Consolidation:** Only after individual verification may the sub-steps be executed simultaneously as a single atomic operation in subsequent modules.

## 3. The Black Box Rule (Operationalizing "No Unlearning")
An abstraction boundary that hides mechanical causality is strictly prohibited unless formally classified as a Deferred Internal or a Terminal Boundary.
*   **3.1. Deferred Internal Classification:** A system layer may be treated as an opaque boundary if the curriculum explicitly designates it as a dependency whose internal mechanics are scheduled to be deterministically revealed in a specific downstream module.
*   **3.2. Terminal Boundary Classification:** A system layer may be treated as permanently opaque only if it constitutes the absolute fundamental floor of the Cesvi ecosystem (e.g., sub-atomic physics in a computational curriculum). Terminal Boundaries must be explicitly declared as permanently out-of-scope.
*   **3.3. Prohibited Analogies:** Neither a Deferred Internal nor a Terminal Boundary shall ever be explained using a false mechanical analogy that necessitates future unlearning.

## 4. State-Predictive Verification
Verification of a learner's mental model must rely exclusively on deterministic system state manipulation.
*   **4.1. Action Requirement:** To proceed past a verification gate, a learner must accurately predict the exact future state of the system or manually mutate the system into the correct target state.
*   **4.2. Prohibition of Passive Verification:** Passive reading, multiple-choice questioning, and unstructured text inputs are prohibited as mechanisms for primary verification.

## 5. Granular Reversion (Handling Cognitive Failure)
The learning environment must enforce strict causality when a learner fails a verification step.
*   **5.1. Deterministic Reversion:** Upon verification failure, the state machine must immediately revert to the exact preceding known-good state.
*   **5.2. Prohibition of Dynamic Difficulty:** The system shall not autonomously simplify, bypass, or alter the mechanical constraints of a failed step. The learner must trace causality from the reverted state to satisfy the original verification requirement.

## 6. Knowledge Retrieval Engine
Curriculum architecture must enforce the retrieval of previously established mental models across longitudinal timescales.
*   **6.1. Mandatory Retrieval:** A conceptual model established in a prior module must be actively subjected to State-Predictive Verification in downstream modules to prevent cognitive decay.
