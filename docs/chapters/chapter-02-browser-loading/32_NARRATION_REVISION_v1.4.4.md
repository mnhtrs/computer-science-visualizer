# Chapter 02 — Narration Revision v1.4.4 (Owner Feedback Round 17)

> ⚠️ Standing: narration/timing amendment. Frozen docs 01–09 untouched. This
> document becomes **current for narration**, superseding 30_NARRATION_REVISION_
> v1.4.3 as the chain head (its rules + mapping stand except as amended here).
> Companion shell amendment of the same owner round:
> `/docs/viewer/02_VIEWER_SHELL_REVISION_v1.1.1.md` (controls, icons, Home).
> Layout chain unchanged: v1.3.15 (31_) remains current for layout.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** the request beat's lock dwell + caption timing. Zero beat-count,
duration, fact, or term changes.

---

## 1. Owner directive (round 17, part 1 — the flicker complaint)

> "Sao phần đốm vàng vào HTTP thì lời giải thích 'Now the real ask, an HTTP request: "please send me the page".' Nó biến mất nhanh thế? Đốm sáng phải ở HTTP 1 xíu nữa để người đọc nhìn thấy rõ lời giải thích mà ko bị chớp nhoáng chứ?"

Diagnosis (measured on the v1.4.3 state): the ask-line lived 928 ms
(11600 → 12528 ms) because the spark *left the lock immediately* — the caption
rule (F71) correctly tracked motion, so the line vanished with it. The real
wish: the spark itself must PAUSE at the lock while the ask-line is up.

## 2. F72 — the lock dwell

**Mechanics discovered:** `holdAt` could not park a spark at its beat's FIRST
anchor — `update.ts` required `h.index > travel.from`, and `h.from = 0` would
divide by zero in the approach branch. Enabling it needed a one-character
guard change:

- `src/engine/update.ts`: guard `h.index > b.travel.from` → **`>=`** (with a
  safety note: `h.from = 0` is safe — the `p < h.from` branch can then never
  run, so no division by `h.from` occurs; fA = 0 parks the parameter at the
  first anchor). **Chapter 01 beats hold no such hold — verified unchanged
  (its NIC/route evaluate identically under `>=`).**

**Content edit (`narration/beats.ts`, request beat only):**

| field | v1.4.3 | v1.4.4 |
|---|---|---|
| travel | `{ from: 14, to: 16 }` | `{ from: 14, to: 16, holdAt: { index: 14, from: 0, to: 0.30 } }` |
| nextLineFrom | 0.05 | **0.30** |

- Spark: parked at the lock 0 → **720 ms** of the 2400 ms beat, then flies the
  eased remainder to the server zone (2400 − 720 = 1680 ms).
- Ask-line exposure: 800 ms (https tail, F71's .75) + 720 ms (dwell) +
  boundary frames ≈ **1520 ms** — was 928 ms (+64%).
- Server-line now appears at **13120 ms**, exactly when motion resumes —
  preserving the owner's round-16 rule "khi bắt đầu di chuyển khỏi khóa thì
  lời giải thích mới hiện" (parked = not moving = ask-line stays).
- Duration (23 beats, same seconds), path anchors, and the F45/F47/F50/F57
  NIC dwell lineage are untouched — this is a fourth dwell of the same kind,
  first-ever at a travel START.

**Approval:** `f72-http-dwell` = **dwell-030** (720 ms; options .25/.35 declined).

## 3. Verification

| check | result |
|---|---|
| `npm run build` | PASS |
| `npm run smoke` | PASS — 4304 frames / 23 beats, byte-identical structure |
| caption probe (`scripts/probe-captions.ts`) | flips: ask-line 11600 → server-line **13120** (dwell end) → workshop 20448; ask-line total 1520 ms |
| NEW render guards `w-b05-dwell` (frac .15) / `w-b05-flight` (.60) in ui-check | dwell frame: spark parked ON the lock; flight frame: en route to server (montage `snapshots/r17-dwell.png`) |
| ui-check vs frozen baseline | all 60 pre-existing frames byte-identical (guard change had zero visual effect outside the new dwell, as reasoned); baseline re-pinned at 62 frames |
| vi census + NFC | clean |

## 4. Also recorded in this round (shell-side, details in viewer/02)

- The two "step" tip strings were re-glyphed to match the new chevron buttons
  ("Use the < > buttons or the dots to step.") in `narration/labels.ts` (ch2)
  and the Viewer's fallback tip — the stock ◀ ▶ characters are retired from
  chrome copy. Chapter 01's labels.ts carries no tipText: untouched.
- Controls/icons overhaul: F73 (replay only at done; paused = Resume),
  F74 (Home pill into the panel head), F75 (FA chevrons), F76 (icon-only
  collapse ≤620/700 px), F77 (Font Awesome everywhere incl. brand glyphs).
