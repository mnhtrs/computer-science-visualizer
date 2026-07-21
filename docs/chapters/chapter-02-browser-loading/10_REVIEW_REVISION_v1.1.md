# Chapter 02 — Senior Review Revision v1.1 (Amendment)

---

> **⚠ SUPERSEDED IN PART by `11_ARCHITECTURAL_REVIEW_v1.2.md`:** the dedicated TCP
> beat (I1), the `conn-link` visual entity, and the "UTF-8" token were demoted/removed
> by the independent curriculum-architecture verdict (teach-less doctrine: phenomenon
> before term). All other v1.1 fixes (I2–I10) remain in force.

---

**Status:** APPLIED — chapter-level correction (does not reopen the frozen design)

**Chapter:** `chapter-02-browser-loading` — "How does a website reach my screen?"

**Version bump:** 1.0.0 → 1.1.0

**Effective Date:** 2026-07-20

**Parent artifacts:** `01..09_*.md` (all FROZEN — untouched). Per the Amendment Process, this
revision is recorded in a NEW artifact; no frozen file was edited.

**Review scope:** senior-level review (browser-engine engineer × CS educator × technical
reviewer) against 8 criteria: Technical Accuracy, Mental Model Validation, Beginner
Simplification, Engine Architecture vs Chromium/WebKit/Gecko, Animation Review,
Educational Flow, Future Compatibility, Scope Validation. Constraint honored throughout:
**no redesign** — architecture, scene order, pacing, and animation style are preserved;
only targeted corrections were applied.

---

## 1. Issues Found

Eleven issues were confirmed and accepted; a further set of candidate "gaps" was
deliberately judged **out of scope for a beginner chapter** and is listed in §6 with
rationales.

| # | Severity | Criterion | Issue |
|---|---|---|---|
| I1 | **High** | Technical Accuracy / Mental Model | **Missing TCP connection step.** The journey jumped from the DNS answer straight to the HTTPS agreement. Between "knowing the address" and "talking privately" the two machines must first agree on a channel. Omitting it makes HTTPS look like magic that happens out of nowhere — a browser-engine bug as taught. |
| I2 | Medium | Mental Model Validation | **HTTPS "keys" could be read as "secret sent across the wire".** Old line: *"they agree on secret keys"*. A beginner reasonably infers the key travels — the exact misconception HTTPS exists to defeat. |
| I3 | Medium | Technical Accuracy | **Server implied static files only.** Old line: *"finds the page's file"*. Today's pages are dynamically built far more often than not; the model must include both. |
| I4 | Medium | Mental Model | **HTML appeared to be the only downloaded resource.** Old response line called it "*the* HTML file", full stop; the css-fetch beat later fetched CSS without tying the two mechanisms together. |
| I5 | Low | Technical Accuracy / tone | **NIC tautology.** Old: *"The NIC catches them with the net card"* — a Network Interface Card catching bytes "with the net card" is self-referential noise. |
| I6 | Low | Technical Accuracy | **No HTTP status.** The server's answer carried no status notion; "200 — OK" is one clause of zero-cost vocabulary groundwork for later chapters (Fetch, debugging). |
| I7 | Medium | Mental Model | **URL parsing implicit.** Old `knows` beat said the browser "learns the address — the URL", but never showed *host extraction* — why the browser asks for `best-cats.example` and not something else. |
| I8 | Low | Beginner Simplification | **"A number" unnamed.** The DNS answer was "a number". The term *IP address* is safe, universal vocabulary — withholding it cost nothing but taught nothing. |
| I9 | **High** | Engine Architecture / Mental Model | **Compositor unnamed; "GPU renders everything" risk.** Old `composite` beat: *"the layers go to the GPU, which stacks them"* — GPU as an anonymous worker, and the pipeline's Compositor stage never named. Naming the compositor also protects the correct division of labor: raster ≠ composite, GPU ≠ engine. |
| I10 | **High** | Animation Review | **Visual/narration contradiction in `css-fetch`.** Narration: *"the Parser doesn't wait; it keeps reading"* — while the workbench showed a **frozen** DOM tree. The picture taught the opposite of the sentence (Constitution 02: visuals are the lesson). |
| I11 | Low | Educational Flow | **Recap skipped the connection.** A learner reconstructing the timeline from the recap would form a chain missing a link. |

Per-criterion verdicts (all remaining checks **PASS**):

- **Technical Accuracy** — after I1/I3/I6: DNS→connect→TLS→request→status→response→decode→tokenize→DOM (+parser-blocking CSS fetch)→CSSOM→script-blocked parser→DOM mutation→render tree→layout→paint→raster→composite→screen. Correct ordering, correct blockers, no overclaim.
- **Mental Model Validation** — all six misconception risks from the review brief now countered (HTTPS keys I2 · static server I3 · HTML-only I4 · parser reading bytes — already handled by decode/tokenize beats · GPU-does-everything I9 · "page appears magically after HTML" — already handled by the 12-beat engine act).
- **Beginner Simplification** — simplifications remaining are *uniform abstraction* (one request, one connection, no redirect paths) — the kind that generalizes, not the kind that must be unlearned. Vocabulary introduced (TCP, IP, 200 OK) is permanent.
- **Engine Architecture vs Chromium/WebKit/Gecko** — the chapter stays at the shared spec-level pipeline all three engines implement; no engine-specific claims. Deferred specifics in §6.
- **Animation Review** — I10 resolved; new `connect` beat reuses existing motion grammar (out-and-back trip on an existing rail); no new animation language introduced.
- **Educational Flow** — one-beat-per-mutation preserved (Constitution 01 §1.1); the inserted beat adds exactly one idea ("connection before conversation"); act rhythm intact.
- **Future Compatibility** — hooks added for Fetch/async stories (§5, F5/F8); nothing taught here needs to be retracted in later chapters.
- **Scope Validation** — 11 of ~26 candidate issues accepted; 15 deferred with rationale (§6). Chapter remains a ~75s beginner pass.

## 2. Why Each Issue Matters

- **I1 (TCP)** — The freeze doc defines the chapter's contract as *"the minimum correct timeline"*. DNS→TLS without a transport connection is **not correct**: TLS runs *inside* a connection. Teaching the TLS handshake floating in space creates exactly the "HTTPS = magic shield" misconception the chapter's own Mental-Model audit (03 §M4) was designed to prevent.
- **I2 (keys)** — "The browser sends its secret key to the server" is the single most common HTTPS misconception among beginners. One clause ("the keys themselves are never sent") inoculates against it at the moment of formation.
- **I3 (static)** — "Servers hand out files" becomes wrong the first time the learner meets a login page or feed. "Finds *or builds*" keeps the first model true forever.
- **I4 (plurality)** — If HTML reads as *the* file, then CSS/JS/images arriving later look like exceptions instead of the same mechanism repeated. Naming HTML "the *first* file" converts later fetches from anomalies into confirmation of a rule.
- **I5 (NIC)** — Tautologies erode trust in precision. The NIC's real job is simple and already correct in the gloss ("the computer's door to the network"); the beat line now matches it.
- **I6 (status)** — "200 — OK" is where every future debugging story begins. A two-syllable clause now saves an un-teaching moment later.
- **I7 (URL parsing)** — The browser must extract the host *before* it can ask DNS. Showing the pick (`best-cats.example`) explains *why* DNS receives that exact question; without it, the chapter asks the learner to accept the query by fiat.
- **I8 (IP)** — Learners will meet "IP address" within weeks, in every networking context. Naming it costs one breath; omitting it forfeits free vocabulary transfer to Chapter 03.
- **I9 (compositor)** — The Render Tree → Layout → Paint → Raster story ends in *assembly*, and assembly has an owner. Leaving it as "the GPU stacks them" (a) misattributes a renderer-resident stage to a peripheral, (b) invites "the GPU renders web pages" — wrong in a way that compounds when the learner meets CPU rasterization or software compositing.
- **I10 (frozen tree)** — The eye beats the ear. A static tree under the words "it keeps reading" teaches "the parser waits" regardless of the sentence. This was the only place where the visual actively contradicted the narration — the highest class of animation bug for an education tool.
- **I11 (recap)** — The recap is the chapter's exportable artifact: what learners retell. Every beat worth teaching is worth recapping.

## 3. Recommended Fix (design — what, not yet the exact strings)

1. **Insert exactly one beat** (`connect`) between `dns-a` and `https`: the spark travels out and back along the existing server rail (path indices 8→13), a persistent **TCP chip** (`conn-link`) materializes on the rail and *stays* — a connection is a thing that remains, unlike the DNS's one-shot answer (anti-M2) and it sits *under* the HTTPS lock (anti-M4: the lock lives *inside* the connection). +2.6 s (+3.7 %).
2. **Amend five beat lines** (https, server, response, css-fetch, composite, recap — six including recap) and one beat's wording (`knows`, `dns-a`) per §4; each amendment is a clause, never a restructure.
3. **Amend three glosses** (server, HTTPS, GPU-engine) and add one (TCP).
4. **Make the css-fetch stage show work**: DOM nodes `body/h1/p` (orders 4–6) now pop in across the beat while the CSS parcel travels — the parser visibly "keeps reading".
5. **Shift all downstream beat indices** (+1) and the four index-driven draw parameters (`pausedBeats`, `finalFromBeat`, `ipFromBeat` unchanged, stage map) accordingly.
6. **Do not touch**: scene count/order, camera, station layout, motion grammar, durations elsewhere, Chapter 01.

## 4. Exact Changes

### 4.1 Beat timeline (23 → 24 beats, ~70.6 s → ~74.5 s)

New beat **b4 `connect`** (2600 ms, active `conn`, travel `8→13`, scene `web`):

> **EN:** With the address in hand, the Browser still can't just shout. First, the two machines open a connection — a steady two-way road between them. Engineers call it TCP.
> **VI:** Đã có địa chỉ, nhưng Browser không thể cứ thế hét sang. Trước hết, hai máy mở một kết nối — một con đường hai chiều vững chắc giữa đôi bên. Kỹ sư gọi nó là TCP.

All beats formerly b4…b22 renumber to b5…b23. Engine act is now b10–b21, finale b22 `screen`, b23 `recap`.

### 4.2 Narration line amendments (old → new; `narration/beats.ts`)

- **b1 `knows` (I7):** “…learns the address you want — the URL. But a name is not a place yet.” → **“…reads the URL and picks out the name it must find: best-cats.example. But a name is not a place yet.”** (VI: “…đọc URL và chọn ra cái tên nó phải tìm: best-cats.example…”)
- **b3 `dns-a` (I8):** “…the real address: a number. And notice…” → **“…the real address: a number called the IP address. And notice…”** (VI: “…một con số gọi là địa chỉ IP…”)
- **b5 `https` (I2):** “…they agree on secret keys. From now on…” → **“…they do a little math together and come up with the same secret keys — the keys themselves are never sent. From now on…”** (VI: “…bản thân chìa khóa không bao giờ được gửi đi…”)
- **b7 `server` (I3, I6):** “The server hears it, finds the page's file, and wraps it into a response.” → **“The server hears it and works out the answer — sometimes a stored file, sometimes one it builds on the spot — then marks it "200 — OK" and sends back a response.”** (VI mirrored.)
- **b8 `response` (I4, I5):** “…a stream of bytes — the HTML file. The NIC catches them with the net card, and RAM holds them tight.” → **“…a stream of bytes — the HTML file, the first of the page's files. The NIC catches them, and RAM holds them tight.”** (VI mirrored.)
- **b13 `css-fetch` (I4):** “…The Browser fetches it — and the Parser doesn't wait; it keeps reading.” → **“…The Browser fetches it — the same way it will fetch any other file the page asks for — and the Parser doesn't wait; it keeps reading.”** (VI mirrored.)
- **b21 `composite` (I9):** “Almost home. The layers go to the GPU, which stacks them into one final image…” → **“Almost home. The drawing is done — the painted layers go to the GPU, whose compositor stacks them into one final frame…”** (VI: “…compositor của nó xếp chúng thành một khung hình cuối…”)
- **b23 `recap` (I1, I11):** “…found the address, fetched the files…” → **“…found the address, opened the connection, locked it with HTTPS, fetched the files…”** (VI: “…tìm ra địa chỉ, mở kết nối, khóa nó lại bằng HTTPS, tải các tệp…”)

### 4.3 Scene content

- **`scenes/01-navigation.ts`** — `PATH_A` 26 → 31 points: connection trip `9–13` (bend → midpoint → server door → midpoint → home edge), HTTPS trip re-homed to `14–18`, request `19–21`, response `22–27`, finale `29→30`. Every beat resumes exactly where the previous ended (continuity preserved).
- **`scenes/02-network.ts`** — new entity `connection` (`id 'conn'`, kind **`conn-link`**, pos `(1010, 588)` — directly under the HTTPS lock, tethered to the rail; name `TCP`); server gloss (I3) and HTTPS gloss (I2) amended.
- **`scenes/04-engine-hall.ts`** — gpuEngine gloss (I9): **“The compositor's desk: … The page was already drawn — this is assembly.”**; js gloss gains the async hook (F8): **“Some scripts are allowed to wait politely instead — that is a story for another journey.”**
- **`scenes/05-story.ts`** — `STAGE_AT_BEAT` remapped +1 (`10 bytes · 11 chars · 12 dom · 13 cssfetch · 14 cssom · 15 paused · 16 mutated · 17 rendertree · 18 layout · 19 paint · 20 raster · 21 composite · 22–23 final`).
- **`assemble.ts`** — `connection` entity with `fromBeat: 4`; `httpsLock.fromBeat` 4 → **5**; `parser.pausedBeats` `[14]` → **`[15]`**; `browser.finalFromBeat` 21 → **22** (and `urlFromBeat: 1`, `dns.ipFromBeat: 3` verified unchanged).

### 4.4 Rendering (`src/rendering/parts/`)

- **New `drawConnChip`** (`web-parts.ts`, kind `conn-link`, registered in `registry.ts`): from-Beat gate (`extra.fromBeat ?? 4`) + 2600 ms grow-in (same grammar as `drawHTTPSLock`), chain-link glyph + `TCP` pill, active glow/pulse. Once born it never disappears.
- **`stageCssFetch` (I10):** DOM reveal `-1` (frozen full tree) → `3 + Math.min(3, Math.floor(frac * 4))` — `body` (order 4) ≈ 1.15 s in, `h1` ≈ 1.5 s, `p` ≈ 1.85 s of the 3.2 s beat, while the parcel descends. Link pulse and parcel logic untouched.

### 4.5 Verification tooling

- `scripts/smoke-chapters.ts`: expected beat count 23 → **24**.

## 5. Verification Results

| Check | Result |
|---|---|
| `tsc --noEmit` + `vite build` (`npm run build`) | **PASS** (92 modules; chapters stay code-split) |
| `npm run smoke` — beat/path integrity, continuity, seams | **PASS** (24/24 beats; seam entries `decode` path[0], `screen` path[30]) |
| `npm run smoke` — full playthrough Ch-02 | **PASS**, 4460 frames ≈ **74.5 s** (final beat 23/23) |
| `npm run smoke` — full playthrough Ch-01 | **PASS**, ~59.9 s — **no regression** |
| 24 beats × 3 deterministic snapshots | **PASS** |
| Chapter 01 content files modified | **NONE** |
| Frozen artifacts 01–09 modified | **NONE** (this document is the amendment) |

## 6. Deferred Decisions (reviewed, intentionally NOT changed)

| Candidate | Decision | Rationale |
|---|---|---|
| Redirects (301/302) | Defer → Ch-03/network chapter | A second location round-trip doubles Act 2 for a detour beginners can learn later; the chapter never claims “no redirects”. |
| Caching / conditional requests | Defer | “First visit ever” framing is honest; caching is statefulness — a whole new mental-model axis. |
| Compression (gzip/brotli) | Defer | Invisible at this granularity; no visual grammar buys it. |
| UDP / QUIC / HTTP-3 | Defer | TCP named as what *engineers call it*, not as the only transport; QUIC belongs with the networking chapter. |
| Preload scanner (by name) | Defer | Its effect (early CSS fetch) is already shown and narrated; the name would be trivia without a stage. |
| Image / font fetch detail | Defer (hook kept) | Covered by “any other file the page asks for” (I4) — the mechanism is now visibly identical. |
| Fetch API / `async` / `defer` | Defer (hook kept) | New js-gloss clause “Some scripts are allowed to wait politely instead” plants the seed without a pipeline detour. |
| `<!DOCTYPE>` token | Defer | One token among chips; naming it adds no transferable model. |
| Accessibility tree | Defer | A sibling structure the chapter never denies; deserves its own treatment. |
| Raster tiling | Defer | The raster grid reads as tiles visually already; tiling vocabulary is optimization detail. |
| Blink / V8 / renderer-process names | Defer | Engine-specific branding contradicts the chapter's cross-engine (Chromium/WebKit/Gecko) abstraction; JS Engine is already a named station for the future hook. |
| Event loop | Defer (by design) | Explicitly a future chapter; nothing here contradicts it. |
| Browser vs renderer process split | Defer | “Browser's inner workshop” is the correct first-order model; process architecture is its own journey. |

## 7. Final Review Summary

Chapter 02 v1.1 keeps 100 % of its frozen architecture, scene order, pacing feel, and
animation language, while fixing the three scientifically significant gaps (TCP step,
compositor ownership, parser-keeps-reading contradiction) and eight smaller accuracy /
clarity issues — at a cost of +2.6 s and one new visual entity that reuses existing
motion grammar. The chapter now presents a minimum **correct** timeline a
Chromium/WebKit/Gecko engineer would sign off on at beginner altitude, leaves deliberate
hooks (IP, TCP, 200, compositor, async scripts) that future chapters can pull on without
retraction, and documents every scope decision a reviewer could take issue with.
Chapter 01 untouched; all greens hold.

*Amendment effective immediately; the frozen set 01–09 remains the design of record, and this document is its only v1.1 delta.*
