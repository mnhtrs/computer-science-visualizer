# CESVI Documentation Evolution Protocol (canonical, versioned home)

**Status:** FROZEN · **Version:** 1.0.0 · **Effective:** 2026-07-22
**Layer:** `protocols/` (AI operating law) · **Authority:** this document is the single
source of truth for *how CESVI learns from production*. Prompt-injected copies of this
protocol are conveniences; **this file is the durable record.** If a prompt and this file
disagree, this file wins.

> Why this document exists: the protocol that makes CESVI self-improving was, until
> v1.0.0, carried only in session prompts — i.e. *outside* the documentation it exists to
> improve. A fresh agent reading only the repo (via `README_FOR_AI.md` / `AI_CHARTER.md`)
> would never run it. That is the exact "knowledge trapped outside the documentation"
> failure the protocol forbids, applied to itself. This file closes that loop and is wired
> into the boot order (`AI_CHARTER.md`) so every future agent encounters it.

---

## 0. Mission
Never optimize only the product. Optimize the documentation system. Every production
issue is evidence that either (1) the documentation is **incomplete**, or (2) it was
**sufficient but not followed**. Determine which. The goal is that Chapter 97 avoids a
mistake *without reading any production history* — including this session's.

## 1. When it runs (mandatory)
After **every** completed task, review, or production issue — including tasks that
"merely" fix a chapter. The task is **not complete** until §6 (the report) is produced.
The report is mandatory **even when no documentation changes are made** (a justified
rejection is a valid outcome; a silent one is forbidden).

## 2. The pipeline
1. Read all relevant documentation. 2. Do the assigned work. 3. Self-review.
4. Apply implementation fixes. 5. **Run this protocol.**

## 3. Root-cause method (the 5-whys, stopped at documentation)
For each issue: state the issue → state the implementation fix → ask **"why did this
happen?"** repeatedly. **Never stop at implementation. Never stop at architecture.** Stop
only when you reach a *documentation* deficiency — or prove none exists.

## 4. Pre-amendment lookup gate (MANDATORY before proposing any doc change)
Before proposing an amendment, **search the binding docs** (Constitution, Governance,
`AUTHORING_WORKFLOW.md`, `CHAPTER_REVIEW_CHECKLIST.md`, `DESIGN.md`, `protocols/`) for the
principle you intend to add. Cite what you found, or explicitly confirm its absence.
- If the principle **already exists**, the issue is *not-followed*, not *missing* → do
  **not** add a new rule; strengthen the existing rule's *enforcement* (a forward pointer
  / a gate) instead, or reject. This prevents duplicate or conflicting rules.
- If it **does not exist**, proceed to §5/§7.

## 5. Self-debate (argue against your own amendment)
Attempt to **reject** it. Ask: am I documenting a *symptom* instead of a *principle*? Is
this Chapter-specific? Does it duplicate an existing rule (§4)? Would another AI already
avoid this by following existing docs? Am I adding docs *only because* a mistake
happened? Is this a temporary implementation detail / a preference / an opinion? **If any
objection succeeds, reject the amendment** and explain why (silent rejection forbidden).

## 6. Acceptance test — accept ONLY if ALL hold
☐ proven by real production experience · ☐ prevents a *recurring class* of mistakes ·
☐ general enough for every future chapter · ☐ independent of the chapter that surfaced
it · ☐ **not already documented (§4)** · ☐ not merely an implementation detail ·
☐ expressed as a reusable *principle* · ☐ makes future AI behaviour more *deterministic*
(mechanically checkable where possible) · ☐ reduces future review effort · ☐ improves the
*system*, not one chapter · ☐ **ships with a forward pointer (§8)** · ☐ **impact-analysed
(§14): future-chapters / invalidation / immediate-refactor / compliance-debt / deferrable
all determined and recorded.**

## 7. Knowledge distillation — document principles, never fixes
Bad: "don't hardcode router coordinates." Good: "renderers must never own layout
geometry." Bad: "increase the font." Good: "readable dimensions derive from measurable
layout constraints." **Always extract the invariant; never archive the symptom.**

## 8. Forward-pointer requirement (MANDATORY for every accepted amendment)
A rule parked only in a chapter's history doc is invisible during normal design work (that
was this project's #1 layout failure). Therefore every accepted amendment MUST also place a
**binding forward pointer** in the doc(s) an agent reads while *building* — the Workflow
phase and/or the Checklist gate that governs the work — not only in a chapter amendment or
the Constitution. A lesson is only "in the system" when it is encountered on the normal
path, without the agent having to know to look for it.

## 9. Document destination (prefer strengthening existing docs)
Architecture → `DESIGN.md` · Workflow → `AUTHORING_WORKFLOW.md` · Quality gates →
`CHAPTER_REVIEW_CHECKLIST.md` · AI behaviour → `protocols/AI_CHARTER.md` / this file ·
Governance → Constitution · Status → `PROJECT_STATE.md`. **Never create a new document
unless absolutely necessary** (this file was created because the protocol had *no* durable
home — the necessary case).

## 10. Anti-bloat policy
Quality ≠ size. Never add docs that prevent only one isolated bug, or that record
preferences/opinions/temporary implementation details. Docs grow **only** through proven
production experience.

## 11. Second- & third-order validation
*Second-order:* "If this doc had existed before the task, would an AI reading **only the
docs** (no history) most likely never make the mistake?" If no → the amendment is
insufficient; improve it. *Third-order:* mentally delete all production history (reviews,
amendments, conversations, owner comments). Can a brand-new AI build Ch-37 correctly from
the docs alone? If no → some knowledge is still trapped outside; move **only** the
generalized knowledge in. Repeat until nothing essential lives only in history.

## 12. Recursive meta-evolution (this protocol applies to itself)
Continuously evaluate the Workflow, the Review Gates, the AI Operational Rules, **and this
protocol**. If any is insufficient to yield a self-improving, minimal, deterministic,
evidence-driven system, treat *that* as a documentation issue and run this protocol on it.
Improve *how* CESVI learns, not only *what* it learns. (v1.0.0 was itself produced by
this clause: the protocol's lack of a durable home, of §4, and of §8 were found by
applying the protocol to the protocol.)

## 13. The mandatory report
Every completed task ends with a **Documentation Evolution Report** (template below), even
if the decision is *Rejected*. Structure per issue: Production Issue · Implementation Fix
· Root Cause (5-whys) · Documentation Gap · Counter-Arguments Considered · Decision
(Accepted/Rejected + reason) · Documentation Updated (None / file list) · Section Updated
· Generalized Principle · Future Mistakes Prevented · **Amendment Impact Analysis (§14)** ·
PROJECT_STATE Updated (Y/N) · Human Review Required (Y/N). Plus a **third-order
validation** paragraph and, when applicable, a **meta-evolution** note.

## 14. Amendment Impact Analysis (MANDATORY for every ACCEPTED amendment)
An amendment that changes a contract without stating its blast radius is incomplete. For
**every accepted amendment**, determine and justify each of the following, and record the
result in the report and (when debt is found) in `PROJECT_STATE.md`:
- **Affects future chapters?** Does it change what a not-yet-written chapter must do or
  avoid? (If yes, the change must already be on the authoring path — §8.)
- **Invalidates existing chapters?** Does any *frozen* chapter now contradict the new
  contract? Distinguish *content invalidation* (a frozen chapter teaches/depicts something
  the new rule forbids — serious, requires amendment or a documented exception) from
  *process/representation debt* (the chapter is fine but pre-dates a newer convention —
  record as debt, do not rewrite frozen content casually).
- **Requires immediate refactoring?** Is the system broken or misleading *now* if the old
  state persists? If no, say so and defer.
- **Creates compliance debt?** Does any existing chapter (or the runtime) fail the new
  contract? Record it explicitly — **never silently** (see the Compliance clause). A chapter
  whose geometry was *audited* (a proof table exists) but not built with the newer
  *module* convention carries *representation* debt, not *un-audited* debt — record the
  distinction honestly.
- **Can migration be deferred?** Justify deferral or immediacy. Default: defer chapter
  refactors that carry no correctness/teaching risk; do **not** defer recording the debt.

An accepted amendment with an unanalysed impact is **not complete**. This clause exists
because production showed that making a rule "binding for every chapter" without auditing
the chapters that already exist silently creates inherited non-compliance.

## 15. Rejection rule
If rejected, state *why* explicitly (e.g. "the mistake resulted from failing to follow
existing documentation; no documentation weakness was identified; no changes made").

---
*Final criterion: the task is complete only when (A) a genuine weakness was generalized
into the documentation and reported, **or** (B) the lesson was explicitly rejected because
the docs were already sufficient. No production lesson may disappear silently. Every
accepted amendment must reduce future dependence on historical conversations.*
