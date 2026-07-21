# Chapter 02 — Narration Voice Revision v1.4.0

> ⚠️ **ERRATA (v1.4.1):** The Vietnamese phrasing of this pass is superseded where changed by `20_NARRATION_VI_NATURAL_v1.4.1.md` (19 beat lines + 9 glosses re-thought from meaning; style contract, facts, terms unchanged). Separately, §2.2's dash census had a blind spot: it covered only `en:`/`vi:` lines and missed the five em-dashes in `STAGE_CAPTIONS` — removed in 20_ §3.

**Status:** applied & verified · **Date:** 2026-07-20
**Scope:** display strings only — `narration/beats.ts` (23 beats × EN+VI), hover glosses in `scenes/01-navigation.ts` / `02-network.ts` / `03-hardware.ts` / `04-engine-hall.ts`, and `narration/labels.ts` (waiting line). No geometry, timing, beat count, or viewer change. Frozen docs 01–09 untouched; no fact, term, or M-truth changed.
**Change class:** narration — **explicitly ordered by the owner in round 5 (L-47)**: *"Câu văn giải thích đời thường và đừng AI quá, nghe nó phải con người, bớt sử dụng dấu gạch nối đi?"* Approved via ask_user (narration-voice = yes). Recorded openly: this amends the phrasing of frozen `06_NARRATION.md` as a superseding amendment, the same mechanism used by 10_ (v1.1) and 11_ (v1.2).
**Pairs with:** `17_UI_LAYOUT_REVISION_v1.3.5.md` (same owner round, layout classes).
Smoke unaffected: **4304 frames ≈ 71.9 s, identical**.

---

## 1. Owner complaint

- **L-47** The explanation sentences read AI-flavored: stiff openers ("Hãy …", "Trước tiên"), em-dashes everywhere, no spoken rhythm. Owner wants everyday human Vietnamese (and matching English), fewer dashes.

## 2. Style contract (applied to every rewritten string)

1. **Spoken register.** Spoken particles allowed where natural: "nha", "nhé", "này", "kìa", "Ố…", "nên", "Còn … thì". English mirrors the same register: "Oh, a script!", "Meet the CSSOM", "Gần xong rồi."
2. **Dashes out.** Em/en dashes are replaced by periods, commas, or colons. Census after the pass: displayed strings contain exactly **one** dash — the literal HTTP status token `"200 — OK"`, which quotes a real protocol line and is an M-truth from 10_ (kept verbatim in both languages). Code comments are not user-facing and keep the project's dash style.
3. **Terms untouched.** DOM Tree, CSSOM, Render Tree, Layout, Paint, Rasterization, compositor, GPU, HTTPS, HTTP request, IP address, DNS, HTML, CSS, JavaScript, NIC, RAM, token, node, spark stay exactly as before.
4. **Facts untouched** — the frozen truth list, re-verified line by line:
   - DNS: the web's address book; asked **once**; not a stop along the road.
   - HTTPS: the road opens before data (10_/11_ unnamed-TCP foreshadow, never "TCP"); the knock is polite; both sides do a little math **together**; they end with the **same keys on both ends**; the keys themselves are **never sent**; talk is private.
   - Server: answers by finding a stored file **or building bytes on the spot** (10_ dynamic-server truth); stamps exactly `"200 — OK"`; sends the response back.
   - Decode: the file was saved following **a rulebook**; the name UTF-8 stays deferred (11_).
   - Tokens: pieces that **mean something**; DOM: a **living** family tree, parents and children.
   - css-fetch: the Browser fetches it **the same way it will fetch every other file**; the Parser **does not wait**.
   - CSSOM: a **map of every styling rule**. Script: freezes the Parser because JS **can rewrite the page**.
   - Render Tree: only what you can actually see is allowed in. Layout: exactly where, exactly how big. Paint: order only, **zero pixels**. Raster: real dots **in memory**. Composite: the **compositor** stacks layers, "same GPU you met in Chapter 1".
   - Finale: ends pointing at **Chapter 03: how data really crosses the Internet**.

## 3. What changed

| Asset | Before | After |
|---|---|---|
| 23 beat lines EN + VI | essay register, 14 em-dashes across the set | spoken register; dashes only inside `"200 — OK"` |
| `waitingLine` vi | "Hãy bấm vào kết quả tìm kiếm đầu tiên để bắt đầu." | "Bấm vào kết quả tìm kiếm đầu tiên để bắt đầu nhé." |
| browser / DNS / server / HTTPS glosses | correct but brochure-toned, dashed | re-voiced, human |
| NIC / CPU / GPU + 10 station glosses + workbench | dashed appositions | light de-dash (comma/colon), two tiny human touches ("nên Parser phải chờ", "đây chỉ là bước lắp ráp") |
| chapterTitle, sceneTag, startButton, tipText, doneLabel | — | **unchanged** (already human, no dashes) |

Sample diffs (before from 06_, with 10_/11_ facts already present in the 1.2-era text noted):

| Beat | Before | After (v1.4.0) |
|---|---|---|
| b05 request (vi) | "Giờ là yêu cầu thật — một HTTP request: "làm ơn, gửi cho tôi trang web"." | "Giờ là yêu cầu thật, một HTTP request: "làm ơn gửi cho tôi trang web"." |
| b07 response (vi) | "Câu trả lời quay về: một dòng bytes — tệp HTML. NIC hứng chúng bằng card mạng, và RAM giữ chúng thật chặt." | "Câu trả lời quay về: một dòng bytes. Đó là tệp HTML, tệp đầu tiên của trang. NIC hứng lấy, RAM giữ chặt." (first-file plurality is the 10_ truth, kept) |
| b10 tokenize (vi) | "…Không có tokens, tất cả chỉ là cháo chữ cải." | "…Không có token thì tất cả chỉ là cháo chữ cái." — *also a translation correction: "alphabet soup" is chữ cái, not chữ cải.* |
| b13 cssom (en) | "The CSS arrives, and grows its own little tree — the CSSOM: a map of every styling rule." | "The CSS arrives, and it grows its own little tree. Meet the CSSOM: a map of every styling rule." |

## 4. Diacritics process (R18 for strings)

Vietnamese text in this pass was written via explicit codepoint escapes, then NFC-normalized, then reviewed. Checks:
- broken-cluster grep (`lờoi`, `ngườoi`, `lờei`, `rờoi`, `lờii`, `lờîi`, `rồoi`, `rồîi`, `lỜI`) across the whole chapter dir — **0 hits**.
- every non-ASCII cluster codepoint-dumped and read back (`trả lời` = `0x1EA3 0x1EDD` etc.).
- full file NFC-stable; one round of repair was needed and done ("nên lý do Parser" → "nên Parser phải chờ" during review, and the draft's `lờii/rồoi` slips — killed by the escape method).

## 5. Verification

- `npm run build` (tsc + vite) — **PASS**; `npm run smoke` — **PASS**, byte-identical frame counts (ch1 3585 ~59.9 s; ch2 4304 ~71.9 s, seams OK) — strings carry no timing.
- Em-dash census over `en:`/`vi:` display lines: 1 remaining, the `"200 — OK"` token, by design.
- Full print-out review of all 46 beat lines + 18 glosses + labels: register consistent both languages; no term changed.
- **Pending owner ear-check after reload:** whether the spoken register lands as intended — tone is a taste call, and the next revision belongs to the owner's ear.
