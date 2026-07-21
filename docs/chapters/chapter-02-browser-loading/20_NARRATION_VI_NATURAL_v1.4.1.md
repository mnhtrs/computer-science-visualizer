# Chapter 02 — Vietnamese Naturalization v1.4.1

> ⚠️ **ERRATUM (v1.4.2):** typography tightened further by `22_NARRATION_TYPOGRAPHY_v1.4.2.md` — every curly quote “ ” replaced by straight `"` (both languages), Vietnamese `\u2026` replaced by plain three dots. The `\u201c…\u201d` convention verified in §4 here is superseded; the `"200 — OK"` token still stands.

**Status:** applied & verified · **Date:** 2026-07-20
**Scope:** Vietnamese display strings only — 19 of 23 beat lines in `narration/beats.ts`, 9 hover glosses in `scenes/02-network.ts` / `scenes/04-engine-hall.ts`, plus an errata fix to `05-story.ts` stage captions. English strings untouched. No geometry, timing, beat count, or viewer change. Frozen docs 01–09 untouched.
**Change class:** narration — **explicitly ordered by the owner in round 6 (L-53)**: *"dịch tiếng Việt quá chán, dịch 1 cách tự nhiên đi, đừng máy móc, có những từ dịch rất máy móc đọc xong chả hiểu gì?"* Approved via ask_user (pkg-r6-vi = yes, style samples shown up front).
**Builds on:** v1.4.0 (18_): same style contract, same facts, same terms — this pass attacks **translation naturalness**: v1.4.0 humanized the register, but several lines were still translated word-for-word.
Smoke unaffected: **4304 frames ≈ 71.9 s, identical**.

---

## 1. What was wrong (owner's complaint, decoded)

Word-for-word carry-overs from English that a Vietnamese reader trips on: "cháo chữ cái" (alphabet soup translated literally — nonsense in Vietnamese), "có cha mẹ, có con cái", "học xem mình phải trông ra sao" ("learns how it should look"), "Tính hình học chính xác" ("computes exact geometry" as-is), "được phép xong việc", "bộ quy tắc mã hóa" ("encoding rulebook"). The v1.4.0 pass made sentences shorter and warmer; it did not re-think them **from meaning**.

## 2. Method

Meaning-first rewriting, Northern-everyday register (owner is in Hanoi): "khựng lại", "làm nốt", "chưa biết ở đâu cả", "mớ ký tự lộn xộn", "Luật nhé". Facts, terms, and the `"200 — OK"` token re-verified line by line against the frozen list (06_/10_/11_ — unchanged; see 18_ §2.4 for the same checklist, all still holding).

**19 beat lines rewritten** (kept as sufficiently natural from v1.4.0: dns-a, response, layout, paint).
**9 glosses rewritten** (Decoder, Tokenizer, HTML Parser, JavaScript Engine, Layout, Rasterizer, GPU-engine, Workbench, HTTPS-lock).
**Kept:** netport, Style, Paint, NIC/RAM/CPU/GPU hardware row, browser, DNS, server glosses; all labels; chapterTitle/sceneTag.

Sample diffs (before = v1.4.0 text):

| Where | Before | After |
|---|---|---|
| tokenize (vi) | "Không có token thì tất cả chỉ là cháo chữ cái." | "Không có token thì cả dòng chỉ là một mớ ký tự lộn xộn thôi." |
| js-run (vi) | "Giờ Parser mới được phép xong việc." | "Giờ Parser mới được làm nốt." |
| js-pause (vi) | "Parser đông cứng ngay tại đây." | "Parser khựng lại ngay đó." |
| render-tree (vi) | "mỗi node nhìn thấy được học xem mình phải trông ra sao" | "node nào hiện được cũng biết mình phải trông ra sao" |
| gloss Layout (vi) | "Tính hình học chính xác: vị trí và kích thước của mọi chiếc hộp." | "Tính ra vị trí và kích thước chính xác của từng chiếc hộp." |
| gloss Decoder (vi) | "…theo bộ quy tắc mã hóa của tệp." | "…theo đúng quy ước ghi tệp." |
| dom (vi) | "có cha mẹ, có con cái" | "có cha có con" |

## 3. Errata — the dash census had a blind spot (owed to 18_)

18_ §2.2 claimed displayed strings contained exactly one dash (the `"200 — OK"` token). The census grepped `(en|vi): '` lines only and **missed `STAGE_CAPTIONS`** (canvas strings keyed by stage): five live em-dashes — `paused / layout / paint / raster / composite` ("Raster — real pixels at last" etc.). Spotted on this round's `v-b19-early` render. All five replaced with colons here; the correct census is now: exactly one dash in any displayed string (the HTTP token) — re-verified by grep over every string-bearing table.

## 4. Diacritics process (and a bug it caught)

All 28 Vietnamese strings built from explicit codepoint escapes, NFC-normalized, then read back in full. The read-back caught a real shipping bug before it reached the viewer: my escape builder emitted the curly-quote delimiters as `\\u201c` (two backslashes) in three vi lines — TypeScript would have rendered the literal text "\u201c" on screen. Fixed (6 spots), re-verified: every `\u201c…\u201d` pair in the file is single-escaped, matching convention; the `"200 — OK"` token intact in both languages.
- broken-cluster grep (`lờoi`, `ngườoi`, `lờei`, `rờoi`, `lờii`, `lờîi`, `rồoi`, `rồîi`, `ngườîi`, `lỜI`) across the chapter dir — **0 hits**.
- full vi re-read as plain prose after the swap (the table in §2 reflects the final shipped text).

## 5. Verification

- `npm run build` (tsc + vite) — **PASS**; `npm run smoke` — **PASS**, byte-identical frame counts (ch1 3585 ~59.9 s; ch2 4304 ~71.9 s, seams OK).
- Fact checklist re-verified line by line (DNS asked once / not a stop · keys same-both-sides, never sent, private talk · server stored-or-built · rulebook unnamed · tokens=meaning · parser doesn't wait · CSSOM=map · script freezes parser · visible-only render tree · paint=order/zero pixels · raster=real dots in memory · compositor named + same GPU · finale → Chapter 03).
- **Pending owner ear-check after reload:** whether every line now reads like a person talking; tone remains the owner's call.
