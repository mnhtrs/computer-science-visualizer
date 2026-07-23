# Architecture Specification — Global Canvas Navigation

**Status:** FROZEN · **Version:** 1.1.0 (v1.0.0 normative spec; v1.1.0 Architecture Migration Pass — runtime now compliant, §12) · **Effective:** 2026-07-22
**Layer:** `architecture/` (frozen technical platform specification)
**Kind:** normative viewer/runtime contract (RFC-style; the keywords below are binding)
**Dependencies:** `constitution/02_VISUAL_LANGUAGE.md` (§6 Spatial Stability, §17 Orientation Preservation, §7 Attentional Economy), `constitution/00_VISION.md` (learner autonomy)
**Downstream:** the Viewer runtime (`src/viewer/`, `src/orchestrator/`, `src/rendering/`); every chapter in `src/content/`
**Review gates:** Software Architect, Principal Motion/Layout Designer, CS Professor (educational non-interference), AI Systems Engineer
**Companion:** `DESIGN.md` (chapter contract + app shell); this file governs the *viewport*, which is orthogonal to the storyboard.

> Normative keywords: **MUST / MUST NOT / SHALL / SHALL NOT** are absolute requirements;
> **MAY** is optional. This document is frozen: it is the standard, not a roadmap item.

---

## 1. Overview
Canvas navigation is a **mandatory capability** of the CESVI viewer. Every chapter
**MUST** support the same viewport navigation model. Navigation is part of the viewer
experience and is **independent** of the storyboard, scene logic, and educational content.
It is a *viewport* capability, never an *educational* mechanic.

## 2. Navigation model
The viewer renders each scene through a camera transform over a world coordinate space.
The default camera is the scene's auto-fit (the chapter's `bbox` + `cameraPad`, per
`DESIGN.md`). On top of that default, the user **MAY** freely pan and zoom. Navigation
affects **only** the camera. It **MUST NOT** modify, directly or indirectly: scene state,
object state, storyboard state, beat progression, the animation timeline, or any
educational logic. The lesson controls the story; the learner controls only the camera.

## 3. Pan
Every chapter **MUST** support viewport panning. The user **MUST** be able to drag empty
canvas to reposition the viewport (Miro / Figma / FigJam behaviour). Panning moves only
the camera; all objects **MUST** remain fixed in world coordinates. Pan **MAY** be bounded
so the scene content cannot be lost entirely off-screen; if bounded, the bound **MUST** be
derived from the scene `bbox` plus a margin (never a hand-tuned literal, per the Layout
Derivation Law in `AUTHORING_WORKFLOW.md` Phase 5).

## 4. Zoom
Every chapter **MUST** support smooth zooming. The default interaction **MUST** be the
wheel / trackpad pinch. Zoom **MUST** be centred on the current cursor position and
**MUST** preserve world-space positions (the world point under the cursor stays under the
cursor). Zoom **MUST** be clamped to a finite range `[Z_min, Z_max]` expressed relative to
the default-fit zoom (so it tracks each scene's scale); the constants **MUST** be named and
shared across chapters. Zoom **MUST NOT** rescale text to fit (Constitution `02` R17) —
world text keeps its world size; only the camera changes.

## 5. Reset
The viewer **MUST** provide a deterministic return to the default-fit view (e.g. a control
and/or double-click empty canvas). Reset **MUST** restore both pan and zoom to the
auto-fit. Reset **MUST NOT** alter any educational state.

## 6. Interaction boundary
Canvas navigation is **completely separate** from object interaction. Dragging empty canvas
**MUST** pan; it **MUST NOT** move blocks, components, packets, scene objects, or edit
layouts. All educational objects **MUST** remain immutable unless a chapter explicitly
designs them as interactive components (e.g. a documented hit-zone). Where a drag begins on
an interactive object, the chapter's interaction **MUST** take precedence over panning;
where it begins on empty canvas, panning **MUST** take precedence. This resolution
**MUST** be implemented once in the viewer, not per chapter.

## 7. Hit-testing under the camera
Any screen→world hit test (interactive start zones, clickable objects) **MUST** invert the
*full* active transform — device-pixel ratio, user zoom, user pan, **and** the base fit —
so interactions remain correct at every pan/zoom level. A hit test that ignores the user's
camera is **non-compliant**.

## 8. Storyboard compatibility
Navigation **MUST** work during **every** storyboard state — playing, paused, seeking,
finished — and during scene transitions and the inside-scene ceremony. In all of these the
user **MUST** always be able to pan, zoom, and reset without affecting the educational
sequence. A scene change **MUST** recompute the default fit for the new scene; whether the
user's manual offset persists across a scene change **MUST** be a single, viewer-level,
documented choice (the recommended default is *reset to fit on scene change*, for
orientation preservation per `02 §17`), applied uniformly to all chapters.

## 9. Composition with rendering
The user's pan/zoom **MUST** compose with the base fit as `T_user ∘ T_fit` (and the dpr
scale outside both). Screen-space overlays (the inside intro ceremony, vignette, fades)
**MUST** remain screen-space and **MUST NOT** be distorted by user pan/zoom. The deterministic
render contract (`02 §15`) **MUST** hold at every camera state: given `(beat, elapsed, t,
camera)`, the frame is fully determined; navigation **MUST NOT** introduce fire-and-forget
motion.

### 9.1 Single source of the composed transform (binding)
The composed camera transform (`zoomTotal`, `offX`, `offY`) **MUST** be computed **exactly
once per frame, by the engine**, from the *active* scene's auto-fit plus the user pan/zoom.
Both the renderer **and** every screen→world hit-test **MUST** consume that single composed
transform; neither **MUST** recompute the fit independently, and neither **MUST** read a
bbox other than the active scene's. (A chapter's `cameraPad` is a *data input* to the
platform's fit, not navigation logic — supplying it is permitted and required; supplying
pan/zoom/reset/pointer handling is forbidden per §10.)
**Why this is a rule, not an implementation note:** when rendering and hit-testing derive
the transform separately, they can disagree (the pre-migration viewer computed the fit in
the composer *and* inverted `scenes[0].bbox` in hit-testing regardless of the active scene —
a dormant hit-test bug). Computing once and consuming everywhere eliminates that class of
drift by construction. The smoke suite's `navCheck` enforces it: at the default camera the
composed transform **MUST** equal the auto-fit, and the inverse **MUST** round-trip.

## 10. Chapter consistency
This navigation model is **mandatory across the entire CESVI curriculum**. Every chapter
**MUST** expose identical navigation behaviour so learners build one consistent spatial
interaction throughout the platform. Individual chapters **MUST NOT** redefine or override
navigation behaviour, pan/zoom bounds, or the reset action. A chapter **MUST NOT** need any
code change to gain navigation — it is supplied by the viewer.

## 11. Design principle
Navigation exists **solely** to improve spatial understanding — to let the learner inspect
a region of a diagram (a Router cluster, a TCP bench, a CPU interior) at their own pace and
then return to the authored framing. It is a viewport capability, not an educational
mechanic, and it **MUST NOT** compete with the protagonist for attention (`02 §7`): no
navigation affordance **MUST** overlay the active teaching object.

## 12. Compliance status (honesty clause — `00` "no hidden magic")
- **Normative target:** this specification is FROZEN and binding as written.
- **Current runtime:** **COMPLIANT** as of the Architecture Migration Pass (v1.1.0). The viewer
  owns a single camera (`engine/state.ts` `Camera` + `NAV` bounds); `engine/update.ts`
  recomposes `T_user ∘ T_fit` every frame and resets the user view on scene change (§8);
  `rendering/composer` consumes the composed transform (never a chapter-supplied one); the
  orchestrator provides pan (drag empty canvas), cursor-anchored wheel zoom, double-click /
  button reset, and a `toWorld` that inverts the composed transform (§7). Navigation is
  wired **once**, in the platform; no chapter supplies or can override it (§10). The smoke
  suite (`scripts/smoke-chapters.ts`, `navCheck`) machine-checks §2 (pan/zoom never mutate
  educational state), §9 (composed transform == auto-fit at the default camera) and §7
  (hit-test inverse round-trips) for every chapter.
- **Migration history:** prior to the migration the viewer camera was a fixed auto-fit with
  no user pan/zoom; that gap was recorded here as inherited platform debt and is now closed.
  The debt record is retained as history; the *status* is compliant.
- **Per-chapter compliance:** every existing chapter (01/02/03) is **compliant through the
  viewer migration** with **zero chapter code** for navigation (verified: no chapter imports
  or references pan/zoom/camera); see the Architecture Migration Report.

## 13. Amendment
This is a frozen architecture specification. It changes only via the Amendment Process
(`governance/WORKFLOW.md`): Proposal → Impact Analysis (list every chapter + the viewer) →
multidisciplinary review → version bump. A change that would let chapters diverge from §10
is **forbidden**.
