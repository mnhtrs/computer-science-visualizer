# Chapter 03 — Freeze Declaration

---

**Status:** FROZEN

**Chapter:** `chapter-03-across-the-internet` — "How does data travel from Server to Browser?"

**Version:** 1.0.0

**Effective Date:** 2026-07-22

**Authority:** Architecture Authority (sandbox → ready for merge to Main per `AUTHORING_WORKFLOW.md` §Sandbox Development Policy)

---

## Frozen artifacts (traceability closed)

| Artifact | Version | Status |
|---|---|---|
| 01 Journey Definition | 1.0 | FROZEN |
| 02 Technical Pipeline | 1.0 | FROZEN |
| 03 Pipeline Validation | 1.0 | FROZEN |
| 04 Story Architecture | 1.0.1 | FROZEN (reconciled with implemented paths/timings) |
| 05 Scene Design | 1.0.1 | FROZEN (reconciled with implemented geometry/renderers) |
| 06 Narration Script (EN/VI) | 1.0 | FROZEN |
| 07 Self Review | 1.0 | FROZEN |
| 08 Independent Audit | 1.0 | FROZEN |
| 10 UI / Layout Revision | 1.0.2 | FROZEN (presentation-only; see `10_`) |
| 11 UI / Layout Revision | 1.0.3 | FROZEN (presentation-only; see `11_`) |
| 12 Layout Audit → Revision | 1.0.4 | FROZEN (layout-system refactor; see `12_`) |
| Chapter code (`src/content/chapter-03-across-the-internet/`) | 1.0.4 | FROZEN |
| Shared tooling restored (`scripts/smoke-chapters.ts`, esbuild devDep) | — | MERGED |

The former `chapter-03-click-to-action` storyboard is **retired** (see `docs/chapters/chapter-03-click-to-action/RETIRED.md`); none of its storyboard, scene structure, pacing, or teaching sequence was reused — this chapter was designed from a blank page.

## Production verification record

| Check | Result |
|---|---|
| `tsc --noEmit` (strict) | PASS |
| `vite build` | PASS (chapter code-split: 29.47 kB / 11.76 kB gzip) |
| `npm run smoke` — beat/path/holdAt integrity, all chapters | PASS |
| `npm run smoke` — full playthrough Ch-01 59.9 s | PASS (no regression vs freeze record) |
| `npm run smoke` — full playthrough Ch-02 71.9 s | PASS (no regression vs freeze record) |
| `npm run smoke` — full playthrough Ch-03 54.4 s | PASS |
| 13 beats × deterministic snapshots rendered + visually audited | PASS |
| Chapter 01 / 02 content files modified | NONE |

## Disposition

Per the Sandbox Development Policy, this chapter is **ready for merge to Main**:
all workflow phases are Frozen, the Independent Audit passed with zero
unresolved comments, and the continuity contract with Chapter 02 is satisfied
in both directions (the chapter opens at Chapter 02's response boundary and
closes at the exact state Chapter 02's Browser-Engine work begins). Future
improvements to Chapter 03 operate at the Chapter level (corrections of
narration, pacing, geometry) and do not constitute constitutional changes.

*This declaration is permanent and takes effect immediately upon issuance.*

---

## Release Freeze (Release Freeze Protocol — 2026-07-23)

This section establishes Chapter 03 as an **immutable CESVI Production Baseline**. It is
not a review (the Production Closure Review already returned READY FOR RELEASE); it is the
freeze act.

**Release record**
- Version: **1.0.0** · Date: **2026-07-23** · Status: **FROZEN** · Production Baseline: **YES**
- Documentation version: **1.0.4** (01–09 frozen; 10/11/12 revisions; 04 & 05 carry
  authoritative-source notes so design-intent prose never reads as a stale literal)
- Architecture version: **1.0.0** (`DESIGN.md`; `CANVAS_NAVIGATION.md` v1.1.0 — runtime compliant)
- Viewer version: **1.1.0** (Global Canvas Navigation owned by the platform; chapter-agnostic)
- Prerequisites verified at freeze: build PASS · smoke PASS · snapshot/contract PASS (3/3
  chapters, byte-identical frames) · Production Closure PASS.

**Immutability rule.** Future modifications to this chapter are permitted **only** for:
factual errors · implementation bugs · architecture violations · mandatory platform
migrations. The following **MUST NOT** reopen it: feature requests · polish · style
changes · speculative improvements · convention-only refactors. (This mirrors the
governance Amendment Process; a chapter-level correction is logged as a numbered revision,
never a silent edit.)

**Baseline registration (task 6).** Chapter 03 is the **reference implementation** of: the
`metrics` + derived-`layout` system (Layout Derivation Law / Gate 5.6), the Connection
Identity rule (Gate 5.7 / `02 §2.1`), the narrative + Chapter-to-Chapter Continuity
conventions, and a chapter that inherits the platform's Global Canvas Navigation with zero
navigation code. Future chapters **follow this architecture, not copy this implementation** —
the contracts live in the Constitution / Workflow / Checklist / `DESIGN.md §16`, independent
of this chapter, so Ch-37 reproduces them without reading Ch-03 (verified: no global
contract cites Ch-03 as a normative source — only as provenance/baseline).

**Lessons-absorbed validation (task 4):** PASS — every production lesson from this chapter's
production (layout system, connection identity, navigation-as-platform-infrastructure, the
documentation-evolution protocol, the authoritative-source convention) is generalized into
the global documentation; none remains trapped in this chapter's history or in
conversations. The one stale-value trap found at closure (04's path indices) was fixed and
generalized into the authoritative-source convention.

**Final Documentation Evolution decision (task 8):** the documentation system is
**sufficient**. This freeze pass discovered **no** documentation weakness requiring a
change; all candidate "improvements" were rejected under the Anti-Bloat Policy (the
release record and immutability rule are *status records*, not new rules). No
documentation changes occurred in this protocol beyond recording the freeze itself.

*Chapter 03 is now frozen as a CESVI Production Baseline. All future development proceeds
from this baseline. Further modifications require a production-level justification.*
