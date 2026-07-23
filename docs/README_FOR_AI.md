# AI Bootloader — Mandatory Reading Order

You are joining the Cesvi project. This sequence is mandatory for all new AI agents joining the project with no prior conversation history.

Read the following documents in this exact sequence before taking any action:

**Step 1 — Operating Law**
Read `docs/protocols/AI_CHARTER.md`.
This defines how you must behave. All subsequent work is governed by it.
Read `docs/protocols/DOCUMENTATION_EVOLUTION_PROTOCOL.md`.
This defines how CESVI learns from production; you MUST run it after every task and emit its mandatory report (it is a quality gate, not optional reading).

**Step 2 — Constitutional Law**
Read `docs/constitution/00_VISION.md`.
Read `docs/constitution/01_EDUCATIONAL_PHILOSOPHY.md`.
These are frozen immutable laws. Every proposal must conform to them.
Read `docs/constitution/02_VISUAL_LANGUAGE.md` and `03_NARRATIVE_FRAMING.md`. These are frozen constitutional laws. Every proposal must conform to them.

**Step 3 — Runtime Architecture**
Read `docs/architecture/DESIGN.md`.
This defines the frozen engineering contract for chapters, the engine, and the renderer.

**Step 3.5 — Chapter Production & Review Process**
Read `docs/protocols/cesvi_cognitive_architecture.md`.
This defines the mandatory 5-stage cognitive planning pass that must complete before any chapter authoring begins.
Read `docs/AUTHORING_WORKFLOW.md`.
This defines the mandatory 9-phase production pipeline for every chapter.
Read `docs/CHAPTER_REVIEW_CHECKLIST.md`.
This defines the 7 QA gates every chapter must pass before freezing.

**Step 4 — Project State**
Read `docs/state/PROJECT_STATE.md`.
This defines the current phase, the next allowed action, and all forbidden actions.

**Step 5 — Proceed**
Output a one-paragraph summary of the current project state and the next allowed action.
Wait for explicit user instruction before modifying any file.

*(Note: If `repository_status` in PROJECT_STATE is not "Green", immediately transition to the Audit Workflow defined in `docs/governance/WORKFLOW.md`)*

---

## Process Architecture Note

Cesvi uses two complementary frameworks for chapter production that operate at different levels of abstraction. They are used sequentially in production:

1. **Cognitive Architecture (5-Stage Checkpoint)** (`docs/protocols/cesvi_cognitive_architecture.md`): Defines how Arena.ai *thinks* to produce five JSON planning artifacts (`delta.json` → `topology.json` → `trace.json` → `storyboard.json` → `journey_blueprint.json`).
2. **Authoring Workflow (9-Phase Production Pipeline)** (`docs/AUTHORING_WORKFLOW.md`): Defines how a chapter is *produced* after cognitive planning is complete, taking the cognitive artifacts and turning them into scene designs, narration scripts, and code.

**Stage → Phase Mapping:**
| Cognitive Stage | Authoring Workflow Phase |
|---|---|
| Stage 1: Truth Delta (`delta.json`) | Precedes Phase 1: Journey Definition |
| Stage 2: Minimal Topology (`topology.json`) | Informs Phase 2–3: Pipeline Design & Validation |
| Stage 3: Protagonist Trace (`trace.json`) | Drives Phase 4: Story Architecture |
| Stage 4: PST Storyboard (`storyboard.json`) | Drives Phase 5–6: Scene Design & Narration |
| Stage 5: Blueprint Assembly (`journey_blueprint.json`) | Input to Phase 7–8: Self Review & Audit |

