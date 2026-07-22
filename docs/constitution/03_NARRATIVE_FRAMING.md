# Constitution Document 03: Narrative Framing

**Title:** Narrative Framing

**Purpose:** Establishes the constitutional laws governing how knowledge is introduced, framed, and communicated so that learners construct correct mental models without distortion.

**Status:** Frozen

**Version:** 2.0.0

**Dependencies:**
- 00_VISION.md
- 01_EDUCATIONAL_PHILOSOPHY.md
- 02_VISUAL_LANGUAGE.md

**Downstream Documents:**
- Journey Authoring
- Learning Flow
- Interaction Design
- Dialogue Systems

**Review Gates:**
- Educational Review
- Scientific Review
- Architecture Review

---

# 1. Purpose

Narrative exists solely to organize learning.

Its purpose is not entertainment, drama, emotional manipulation, or fictional storytelling.

Every narrative decision shall improve understanding of reality rather than increase engagement alone.

---

# 2. Reality Before Story

Reality shall never be modified to create a better story.

Facts, mechanisms, and causal relationships always take precedence over narrative convenience.

A learner must never remember an entertaining falsehood instead of a truthful mechanism.

---

# 3. Observation Before Explanation

A learner shall first observe a phenomenon before receiving an explanation.

Explanation exists to organize observed reality rather than replace observation.

Narration shall never reveal conclusions before sufficient evidence has been presented.

---

# 4. Question Before Answer

Learning begins by establishing a meaningful question.

Every explanation shall answer a previously established uncertainty.

Information shall never be introduced without a clear educational purpose.

---

# 5. Progressive Understanding

Knowledge shall be introduced in the smallest sequence that preserves causal understanding.

Each step must depend only on knowledge already established.

A learner shall never be required to accept unexplained assumptions.

---

# 6. Truthful Analogy

Analogies may be used only when they preserve the underlying structure of the represented system.

Every structural relationship in an analogy must correspond to a real structural relationship in the target concept.

Analogies that introduce nonexistent behavior, misleading intuition, or false causality are constitutionally forbidden.

When an analogy reaches its limit, that limit shall be made explicit.

---

# 7. Explicit Assumptions

Every explanation depends on assumptions.

Assumptions shall be stated explicitly whenever they influence understanding.

Learners must always be able to distinguish between:

- observed fact,
- established theory,
- engineering convention,
- design decision,
- working hypothesis.

No assumption may be presented as unquestionable reality.

---

# 8. Cognitive Continuity

Every learning step shall connect directly to the learner's current mental model.

Transitions between concepts must preserve continuity.

Conceptual jumps that require invisible reasoning are prohibited.

---

# 9. Misconception Resolution

Instruction shall actively identify and resolve common misconceptions.

Misconceptions shall never be ignored.

Whenever a misconception is likely, the learner must be guided toward recognizing why it fails before introducing the correct model.

Correct understanding is strengthened by resolving incorrect intuition rather than merely replacing it.

---

# 10. Neutral Presentation

Narration shall remain intellectually neutral.

Language shall clarify rather than persuade.

Emotional language, exaggeration, sensationalism, authority-based persuasion, and rhetorical manipulation are prohibited.

Understanding shall arise from evidence rather than narration.

---

# 11. Learner Autonomy

The learner is an active participant in constructing knowledge.

Narration shall guide reasoning without replacing it.

Whenever possible, learners shall predict outcomes, evaluate consequences, and verify their own understanding before receiving confirmation.

---

# 12. Universality

These constitutional laws apply regardless of:

- educational domain,
- language,
- culture,
- medium,
- implementation technology,
- interaction style.

Future educational media shall remain subject to these laws.

---

# 13. Knowledge Reveal Law

A technical term or concept may be introduced only after the learner has observed a phenomenon that makes that term necessary.

The need for a concept must be established before the concept is named.

Terminology shall never precede the experience that motivates it.

A learner must never encounter a name before encountering the reality it describes.

---

# 14. Narrative-Driven Explanation

Educational explanation must emerge from the current state of the Journey.

A component shall never be described in isolation, independent of the narrative context in which it is encountered.

Explanation shall be triggered by observable events, not by the presence of a component on screen.

The following narration patterns are constitutionally prohibited:

- Listing a component's attributes, functions, or properties as a standalone description.
- Presenting information as a checklist independent of the evolving system state.
- Explaining what a component "is" or "does" before the learner has observed it acting within the Journey.

Understanding must arise through the unfolding of the Journey, not through documentation inserted into it.

---

# 15. Plain Language Translation

Technical IT terminology must be translated and explained using everyday language accessible to absolute beginners.

While the correct technical jargon must be introduced (per the Knowledge Reveal Law), the underlying explanation must never rely on other unexplained jargon. 

The narration must aim for the dual goal: a person with zero IT background can understand it intuitively, and an IT student can use the exact same explanation to succeed in professional interviews.

---

# 16. Global Terminology Lock

While explanations and analogies may be translated into the learner's native language (e.g., Vietnamese) to maximize comprehension, the core names of components, architectures, and protocols must be locked to their global English origins.

Complete localization of core technical keywords (e.g., translating "DOM Tree" to "Cây Đối tượng Tài liệu" or "Layout Thrashing" to "Tranh giành Bố cục") is constitutionally prohibited, as it destroys the learner's ability to search for the concept globally or use it in professional interviews.

Whenever a localized term is used, the exact English equivalent must be explicitly displayed alongside it (Bilingual Terminology).

---

# 17. Learning Momentum

Every Journey must open with exactly one central question that remains unresolved until the final scene.

Every scene must measurably advance the resolution of that central question.

A scene that does not advance the Journey's central question is constitutionally prohibited, regardless of its technical accuracy.

The learner must always be aware of two things simultaneously:

- where they currently are in the Journey,
- how far they remain from the answer to the central question.

Scenes that function as independent explanatory units, disconnected from the Journey's central question, are constitutionally prohibited.

---

# 18. Constitutional Authority

This document governs every explanation, dialogue, interaction, narration, analogy, instructional sequence, and educational script produced within Cesvi.

Where conflict exists between narrative convenience and truthful learning, truthful learning shall always prevail.

---

# 19. Product Experience Consistency

Every chapter must preserve the canonical educational rhythm. The learning experience follows a consistent pattern:

1. **Observe:** The learner first sees the system in action.
2. **Focus:** Attention is directed to the specific component or mechanism being studied.
3. **Explore:** The learner examines the mechanism's internal behavior.
4. **Understand:** The learner can predict the mechanism's behavior.
5. **Continue:** The journey proceeds to the next mechanism.
6. **Summarize:** The chapter concludes by reinforcing the central question.

This rhythm is not a fixed sequence — it is a recurring pattern that may repeat within a chapter as new mechanisms are explored. The specific timing, visuals, and interactions that express this rhythm are not mandated. Only the rhythm itself is invariant.

Every chapter must feel like it belongs to the same educational product. The learning rhythm is a key component of product identity.

**Rationale:** The educational value of Cesvi depends on learners being able to transfer learning skills across chapters. If each chapter introduced a different learning rhythm, the learner would spend cognitive effort adapting to the rhythm rather than absorbing the content. Consistent rhythm enables the learner to focus entirely on the educational content.

---

# 20. Entry and Exit Clarity

Every chapter must provide:

- an obvious beginning that invites the learner to start,
- a clear educational journey with continuous progress,
- a satisfying conclusion that reinforces the central question,
- the ability to replay the journey.

The learner must always know when learning begins and when the learning objective has been completed.

The entry point establishes the learner's commitment to the journey. The exit point reinforces learning and enables review. No chapter may leave the learner uncertain about whether the journey has begun or concluded.

**Rationale:** Without clear entry and exit points, the learner cannot frame the educational experience. An ambiguous beginning fails to establish commitment. An ambiguous ending fails to reinforce learning. Both entry and exit must be unmistakable, interactive, and educational.