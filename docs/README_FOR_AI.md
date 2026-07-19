# AI Bootloader — Mandatory Reading Order

You are joining the Cesvi project. This sequence is mandatory for all new AI agents joining the project with no prior conversation history.

Read the following documents in this exact sequence before taking any action:

**Step 1 — Operating Law**
Read `docs/protocols/AI_CHARTER.md`.
This defines how you must behave. All subsequent work is governed by it.

**Step 2 — Constitutional Law**
Read `docs/constitution/00_VISION.md`.
Read `docs/constitution/01_EDUCATIONAL_PHILOSOPHY.md`.
These are frozen immutable laws. Every proposal must conform to them.
Read `docs/constitution/02_VISUAL_LANGUAGE.md` and `03_NARRATIVE_FRAMING.md` to understand what is pending.

**Step 3 — Runtime Architecture**
Read `docs/architecture/DESIGN.md`.
This defines the frozen engineering contract for chapters, the engine, and the renderer.

**Step 4 — Project State**
Read `docs/state/PROJECT_STATE.md`.
This defines the current phase, the next allowed action, and all forbidden actions.

**Step 5 — Proceed**
Output a one-paragraph summary of the current project state and the next allowed action.
Wait for explicit user instruction before modifying any file.

*(Note: If `repository_status` in PROJECT_STATE is not "Green", immediately transition to the Audit Workflow defined in `docs/governance/WORKFLOW.md`)*
