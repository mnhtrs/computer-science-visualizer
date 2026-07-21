# Chapter 02 — Narration Revision v1.4.3 (Owner Feedback Round 16)

> ⚠️ **SUPERSEDED AS CURRENT (v1.4.4):** the narration chain continues in `32_NARRATION_REVISION_v1.4.4.md` — the request beat now dwells 720 ms parked at the HTTPS lock (F72, `holdAt{14, 0, 0.30}`) and this document's F71 flip for the request line amends **0.05 → 0.30** (server line now lands 13120 ms). Everything else stands: authoring rule A-01, the recap change, the .75/.88 flips.

> ⚠️ Standing: narration amendment. Frozen docs 01–09 untouched (their texts
> remain as historical record; supersession notes live in PROJECT_STATE).
> This document becomes **current for narration**, superseding 22_NARRATION_TYPOGRAPHY_
> v1.4.2 as the chain head (its typography rules still stand). Companion layout
> amendment of the same owner round: `31_UI_LAYOUT_REVISION_v1.3.15.md`.

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** `chapter-02-browser-loading` narration + shared caption plumbing in the
Viewer. Chapter 01 uses none of the new mechanism (zero behavior change).

---

## 1. Owner directives (round 16)

> "Bỏ toàn bộ phần 'Next stop, Chapter 03: how data really crosses the Internet.' của cuối chương 2 đi. Cập nhật thêm luật trong docs (nhớ cập nhật phù hợp, ko xóa các luật cũ) là ko bao giờ chương này được đỀ cập đến chương sau vì chương sau có thể là 1 nội dung bất kỳ ko đoán trước được."  (**D1**)

> "Lời giải thích và animation đốm sáng phải đi kèm với nhau. Ví dụ: khi đốm sáng từ NIC sang RAM rồi nhảy lên browser loading nhảy vào CPU rồi thì mới hiện lời giải thích 'But bytes in RAM mean nothing yet. So the Browser hands them to its own workshop inside: the Browser Engine.' Thì chậm quá."  (**D3**)

> "Tương tự ... khi đốm sáng gần chạy đến khóa vàng HTTP thì phải chuyển luôn sang 'Now the real ask, an HTTP request: "please send me the page"'. Khi bắt đầu di chuyển khỏi khóa HTTP thì lời giải thích mới hiện: 'The server hears it and works out the answer. Sometimes that's a file it already has, sometimes one it builds right there. Then it stamps "200 — OK" and sends the response back.'"  (**D4**)

## 2. F68 — forward-reference removed + NEW RULE A-01 (D1)

- Evidence first: the only occurrence in `src/` of a named successor chapter was
  the recap beat's tail sentence (`narration/beats.ts`, b22), en + vi. (The
  frozen doc 01_ records "named at b2/b4/b7/b22" — that line is **stale**: the
  v1.4.x voice passes left b22 as the sole carrier. The Network Port gloss's
  "a story for another journey" is a *generic* deferral, not a named reference.)
- Removed, both languages. The recap now ends:
  - en: "…and the GPU put the page on screen."
  - vi: "…và GPU đưa trang lên màn hình."
- Recap facts unchanged otherwise (the 14-step chain sentence is intact; the
  "200 — OK" token elsewhere untouched).

### Authoring Rule A-01 — Chapter Isolation (approved wording: *named-only*)

> **No chapter may name, number, or describe the content of any future chapter.**
> A chapter's successor is arbitrary and unknowable at authoring time; pointing
> at it is a lie waiting for the roadmap to change. *Generic* deferrals that
> name nothing ("that is a story for another journey") remain legal.
> — supersedes the b22 hand-off teaser recorded in frozen 01_ (S18 + the
> Deferred-Internal rows), 06_ (b22 row), and 07_ (§1.4 self-review). Those
> texts are NOT edited; the supersession is recorded in PROJECT_STATE.md.

## 3. F71 — narration rides WITH the spark (D3 + D4)

**Measured baseline first:** the existing sync is frame-accurate — captions
switch exactly on beat boundaries (probe: b8's workshop line appears at
20800 ms = hop start). Nothing was *broken*; the owner wants each line to
arrive ~one landmark earlier so text and motion overlap.

**New mechanism (shared, opt-in per beat):**
- `BeatDescription.nextLineFrom?: number` (`src/chapter-loader/types.ts`) —
  from that elapsed fraction, the panel displays the NEXT beat's line. Line
  ownership stays with its beat; only the display shifts earlier.
- Viewer: new `lineBeat` state, recomputed inside `sync()` on EVERY frame
  (≤16 ms detection), narration text + step counter + caption animation key all
  follow `lineBeat`; the deep-scene (program) narration branch is untouched.
- Chapters without `nextLineFrom` (all of Chapter 01) are bit-identical.

**Approved mapping (probe-verified timestamps, 16 ms steps):**

| line shown | before | after | motion landmark |
|---|---|---|---|
| "Now the real ask…" (b5) | 12400–14800 | **11600**–12528 (`https` nextLineFrom .75) | spark ≈92% eased along the lock leg; lock arrival at 12400 |
| "The server hears it…" (b6) | 14800–17800 | **12528**–17800 (`request` nextLineFrom .05) | spark departs the lock at 12400 |
| "But bytes in RAM…" (b8) | 20800–23200 | **20448**–23200 (`response` nextLineFrom .88) | spark reaching RAM (22); hop RAM→loading→CPU starts 20800 |

Line-exposure budget (reading time): ask-line ≈928 ms (it is a 10-word line),
HTTPS line keeps 2400 ms, server line grows to ≈5.3 s, workshop line to ≈2.8 s.
No beat content, duration, travel, or fact changed — the smoke playthrough is
structurally identical (4304 frames, 23 beats).

## 4. Approvals (ask_user, round 16)

| id | chosen |
|---|---|
| `f68-finale-rule` | **named-only** (ban named successor references; generic deferrals legal) |
| `f71-caption-mapping` | **as-mapped** — .75 / .05 / .88 exactly as proposed |

## 5. Verification

| check | result |
|---|---|
| `npm run build` (tsc --noEmit + vite) | PASS |
| `npm run smoke` | PASS — ch1 3585 / ch2 4304 frames, 11+23 beats × 3 snapshots, seams unchanged |
| `scripts/probe-captions.ts` (lineBeat timeline) | flips at **11600 / 12528 / 20448 ms**, exactly the approved mapping (log in §3) |
| SSR shell probe (`scripts/check-shell.ts`, both chapters) | 22 "OK" lines — waiting shell unchanged |
| vi census (broken-cluster grep + NFC + quote check) | 0 hits, NFC clean on all touched files |
| forward-ref grep (`Chapter 03`, `Next stop`, `Trạm kế tiếp`) | 0 hits in narration strings (only in comments documenting the removal) |

## 6. What did NOT change

All 23 beats' texts (except the b22 tail), durations, travels, facts and terms;
the "200 — OK" token; the generic "another journey" deferral in the JavaScript
Engine gloss; Chapter 01 in full (code + narration). The done-state loop from
VIEWER SHELL v1.1.0 (F67 proof) is untouched.
