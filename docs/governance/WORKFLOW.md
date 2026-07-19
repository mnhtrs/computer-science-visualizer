# Artifact Lifecycles & Governance Workflows

Every artifact in the Cesvi repository follows a strict, one-way deterministic state machine.

---

## 1. Workflows

**Constitution & Governance Workflow**
`Draft` → `Review` (Multidisciplinary) → `Revision` → `Approved` → `Frozen`

**Journey (Content) Workflow**
`Draft` (Narrative/Structure) → `Technical Review` (CS Truth Verification) → `Educational Review` (Cognitive Load Verification) → `Animation Review` (Visual Reasoning Verification) → `Approved` → `Released`

**Runtime (Code) Workflow**
`Draft` (Implementation) → `Test` (Automated & Manual) → `Review` (Architecture Alignment) → `Approved` → `Merged`

**Repository Audit Workflow**
`Audit` (Identify inconsistencies) → `Fix` (Propose resolutions) → `Verify` (Confirm resolution) → `Green` (Resume normal operation)

---

## 2. Amendment Process (For Frozen Documents)

Frozen documents (Constitution and Governance) are immutable. The only legal method to alter a frozen document is via the formal Amendment Process:
`Proposal` → `Impact Analysis` → `Review` → `Approval` → `New Version` → `Freeze`

1. **Proposal**: A formal document proposing the exact textual changes and the reasoning.
2. **Impact Analysis**: Explicitly list every Curriculum, Journey, and Architecture document that relies on the principles being amended. 
3. **Review & Approval**: Multidisciplinary review must reach unanimous consensus that the amendment increases technical truth without violating the "No Unlearning" principle.
4. **New Version & Freeze**: The document is version-bumped. Modifying an upstream document triggers a mandatory cascade audit of all dependent downstream documents.

---

## 3. Versioning Policy

Cesvi applies strict Semantic Versioning (SemVer) principles to document domains.

*   **Major (X.0.0):** Paradigm shifts, fundamental principle changes, or massive structural refactoring.
*   **Minor (0.X.0):** Addition of new documents, new Journeys, or new non-breaking workflows.
*   **Patch (0.0.X):** Typo fixes, formatting, or clarity improvements that do not alter meaning.

**Domain Policies**
*   **Constitution & Governance:** Any non-patch change to a frozen document requires a Major version bump of the entire domain, as foundational changes cascade through the entire repository.
*   **Journeys & Curriculum:** Versioned independently per module.
*   **Architecture & Runtime:** Standard software SemVer applies.
