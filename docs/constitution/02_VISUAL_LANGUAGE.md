# Constitution Document 02: Visual Language

**Title:** Visual Language
**Purpose:** Establishes the timeless, project-wide laws governing how any concept is visually represented so that observation faithfully constructs the correct mental model.
**Status:** Frozen
**Version:** 3.0.0
**Dependencies:**
- 00_VISION.md
- 01_EDUCATIONAL_PHILOSOPHY.md
**Downstream Documents:**
- Runtime Architecture, Rendering Systems, Journey Authoring, Quality Checklists

---

# 1. Purpose
Visual representation exists solely to reveal reality. Its purpose is not decoration, entertainment, or aesthetic appeal. Every visual decision must increase the learner's understanding of how the underlying system actually behaves.

# 2. Structural Isomorphism
Every visual representation shall preserve the structural behavior of the system it represents. A learner must be capable of inferring the underlying mechanism through observation alone. Visual representations shall never introduce structures, behaviors, or relationships that do not exist in the represented system.

*   **2.1. Connection Identity (corollary):** Two connections that are physically or logically distinct in the represented system (e.g. an external network link vs. an internal system bus; a control path vs. a data path) shall be rendered as visually distinct paths. Merging distinct connections into one drawn line is forbidden, because it makes the learner infer a shared conduit that does not exist — a structural lie. Every connection's endpoints must terminate at the boundary of the component it connects (`§14` transition causality applied to structure), never inside it and never short.
*   **2.2. Derivable Geometry (corollary):** Spatial stability (`§6`) is only auditable when positions are *derived*, not eyeballed. Every drawn coordinate shall be expressible as a named layout primitive or a function of a container rectangle and measured text (see the Layout Derivation Law in `AUTHORING_WORKFLOW.md` Phase 5). A coordinate that exists only as an inline literal cannot be proven stable, cannot be proven clear of its neighbours, and cannot survive a future chapter reusing the pattern — so it is treated as a defect, not a style choice.

# 3. Representation Before Symbolism
Concrete mechanisms shall always be represented before symbolic notation. Whenever direct observation of a mechanism is possible, symbolic representations must not replace it. Abstraction may be introduced only after the learner has observed the underlying process.

# 4. Separation of Structure and State
The architecture of a system and the changing state within that architecture shall remain visually distinct. Containers, connections, boundaries, and permanent structures shall never be visually confused with mutable values.

# 5. Temporal Continuity
State transitions shall be continuously observable. A learner must be capable of following the complete causal path between two states without mentally inventing missing intermediate steps. No hidden transition may contain educationally significant information.

# 6. Spatial Stability
Stable structures shall remain spatially stable. Relative positions of components shall not change unless spatial movement itself represents the real mechanism. Layout changes performed solely for aesthetics or convenience are prohibited.

# 7. Attentional Economy
Attention is a limited educational resource. Only information required for the current reasoning step may receive primary visual emphasis. Information not participating in the current reasoning step shall remain visible whenever necessary for context but shall not compete for attention.

# 8. Progressive Disclosure
Complexity shall be introduced only when required by the learner's current understanding. Hidden detail may become visible through progressive exploration. Every abstraction must preserve the learner's ability to reconnect with the underlying mechanism.

# 9. Explicit Encapsulation
Whenever an abstraction boundary is introduced, the learner must observe how the lower-level mechanism becomes encapsulated. An abstraction shall never appear as unexplained replacement.

# 10. Cross-Domain Consistency & Canonical Style
Equivalent structures shall be represented consistently throughout the entire Cesvi ecosystem. All chapters must conform to the canonical visual style, animation physics, and scene transition patterns established as the product standard. Deviation from the canonical standard is constitutionally forbidden.

# 11. Medium Independence
These laws govern representation itself rather than any particular medium. No implementation technology may weaken these constitutional requirements.

# 12. Truth Supremacy
Visual simplification is permitted only when it preserves the underlying mechanism. If simplification changes causal behavior, introduces false intuition, or creates misconceptions, it is constitutionally forbidden.

# 13. Protagonist Continuity
Every Journey must designate exactly one persistent visual protagonist. This protagonist represents the learner's point of observation as it travels through the system. The protagonist must remain continuously traceable across every scene and every scene transition.

# 14. Transition Causality
Every scene transition must be caused by an observable state change or causal event established within the preceding scene. A transition may not occur because narration declares it.

# 15. Visual Purity and Determinism
The visual state, data representation, and protagonist position at any given timeline step must be completely deterministic. Animation sequences must not rely on fire-and-forget logic that breaks when a user skips, pauses, or reverses the timeline.

# 16. UI Attentional Priority
Information not directly participating in the current action (such as HUD dashboards, data tables, or console logs) must yield visual priority to the active mechanism. 

# 17. Orientation Preservation
The visual layout must preserve the learner's sense of position and orientation within the system at all times, preventing cognitive disorientation during scene changes or camera movements.

# 18. Primary Protagonist Priority in Parallelism
When representing concurrent or parallel flows, the visualization must maintain one clearly highlighted "Primary Protagonist" to guide the focus. Auxiliary parallel agents must be rendered with significantly decayed visual weight (e.g. dimmed colors or transparency) to prevent cognitive overload.
