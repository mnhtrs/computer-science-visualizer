# Chapter 02 — Narration Typography v1.4.2

**Status:** applied & verified · **Date:** 2026-07-21
**Scope:** displayed string typography in `narration/beats.ts` only. No facts, terms, wording, timing, or viewer changes. Frozen docs 01–09 untouched.
**Change class:** narration typography — **owner-ordered round 7 (L-55)**: *"Bỏ toàn bộ mấy cái ngoặc dạng “ ” và thay bằng " ". Không được dùng những ký tự đặc biệt quá khi dịch sang tiếng Việt."* Approved inside the round-7 package (pkg-r7 = yes).
**Builds on:** v1.4.1 (20_). Smoke unaffected: **4304 frames ≈ 71.9 s, identical**.

---

## 1. What changed

| Item | Before | After |
|---|---|---|
| Curly double quotes in beats.ts (6 pairs across `dns-q`, `request`, `server`, both languages; source form `\u201c…\u201d`) | “ … ” | straight `" … "` everywhere |
| Vietnamese ellipses `\u2026` (3 spots: decode, js-run, screen) | … | plain three dots `...` |
| English ellipses | kept `\u2026` *as approved (scope: vi translation characters only)* | unchanged |

Unaffected on purpose: English apostrophes (`\u2019`) — normal English orthography; the literal `"200 — OK"` HTTP status token — a frozen protocol quote from 10_, kept verbatim in both languages.

## 2. Verification

- Census grep over every displayed string: zero `\u201c`, zero `\u201d` left in the chapter; zero `\u2026` in vi strings.
- `npm run build` — **PASS**; `npm run smoke` — **PASS**, frame counts identical.
- Vietnamese diacritics broken-cluster grep — 0 hits; NFC-stable.
