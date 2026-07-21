# Chapter 02 — Phase 1: Journey Definition (FROZEN)

- **Chapter ID:** `chapter-02-browser-loading`
- **Parent artifacts:** Frozen Constitution v1.3.0 (`00`–`03`), `AUTHORING_WORKFLOW.md` v1.1.0, owner directive (roadmap: Chapter 02 = current task)
- **Produced artifact:** this Journey Definition
- **Review status:** Passed (self-verified against Constitution Scope rules)
- **Frozen status:** FROZEN — no scope changes permitted downstream

---

## 1. Central Question (exactly one)

> **"When I type a URL or click a link, how does my browser transform that action into a fully rendered webpage?"**

Every scene, beat, line of narration must measurably advance the answer. The final scene must visibly answer it. (Constitution `03 §17` Learning Momentum.)

## 2. Entry State (learner's assumed mental model)

From Chapter 01 (prerequisite, completed):
- Knows at story level: SSD, RAM, CPU (fetch–decode–execute), GPU, bus; "a program is instructions executed one at a time".
- Has followed a light-spark protagonist once from click to pixel.

About the web (fresh):
- "A browser is a window that somehow shows websites." The Internet is a vague cloud.
- Has never heard the words DOM, CSSOM, Layout, Paint, Raster.
- May believe websites "live inside Google".
- Weak math/programming ability, limited working memory (`AI_CHARTER`, Target Learner).

## 3. Exit State (target mental model)

The learner can mentally simulate, forward and backward:

click → URL known → DNS lookup → IP → HTTPS private channel → HTTP request → server response → NIC → RAM → Browser Engine → decode → tokenize → DOM Tree → fetch CSS → CSSOM → script pause & run → style match → Render Tree → Layout → Paint list → Raster pixels → GPU composite → screen,

and for each Act-3 stage can state: **what** happens, **why** it exists, **what breaks without it**, while firmly rejecting the misconceptions in §7.

## 4. Scope (bounded list; everything in the chapter maps here)

| # | In-scope item | Beats |
|---|---|---|
| S1 | Navigation start: click a search result (Google as *context only*). Takeaway: "the Browser now knows where to go". | b0–b1 |
| S2 | URL = name; browser needs a numeric address | b1–b2 |
| S3 | DNS = address lookup service, consulted once, **off the path** | b2–b3 |
| S4 | HTTPS = privacy agreement before page data (no TLS internals) | b4 |
| S5 | HTTP request → server processes → response (HTML bytes) | b5–b7 |
| S6 | NIC receives, RAM stores (Ch-01 hardware reinforcement, no re-teach) | b7 |
| S7 | Hand-off RAM → Browser Engine (Browser ≠ Browser Engine) | b8 |
| S8 | Decode bytes → characters | b9 |
| S9 | Tokenize characters → tokens | b10 |
| S10 | HTML Parser builds the DOM Tree | b11 |
| S11 | Discover CSS → fetch it → CSSOM (fetch happens while parsing continues) | b12–b13 |
| S12 | Script encountered → Parser pauses → JS executes (page mutated) → Parser finishes | b14–b15 |
| S13 | Style calculation → Render Tree (visible nodes only) | b16 |
| S14 | Layout (geometry) | b17 |
| S15 | Paint (ordered draw-command list, still no pixels) | b18 |
| S16 | Rasterization (pixels into a bitmap) | b19 |
| S17 | GPU composition → final image → monitor | b20–b21 |
| S18 | Recap of the whole chain + hand-off teaser to Chapter 03 | b22 |

Time budget: Act 1 ≈ 5–10% · Act 2 ≈ 20–25% · Act 3 ≈ 60–70% (measured in beats × duration — see Phase 5).

## 5. Non-Goals (constitutionally locked)

SEO, ranking, crawlers, Google index/architecture · Internet routing, ISP, BGP, TCP internals/algorithms, CDN · TLS internals (handshake math) · Browser multi-process architecture · JIT / garbage collection · packet switching · URL standard minutiae · image/font decoding detail.

**Abstraction-boundary classification (Constitution `01 §3`):**
| Boundary | Classification | Revealed in |
|---|---|---|
| The network between NIC and server ("how bytes actually travel") | **Deferred Internal** | Chapter 03 (explicitly named at b2/b4/b7/b22) |
| TLS/HTTPS key agreement mechanics | **Deferred Internal** | future security journey; here: "they agree on secret keys" — true at this level, never unlearned |
| TCP (named only as "the rules of the conversation" inside the HTTPS gloss) | **Deferred Internal** | Chapter 03 |
| DNS database internals | **Deferred Internal** | future infrastructure journey; here: "a directory that answers" |
| Parser error-recovery algorithms, encoding edge-cases | **Deferred Internal** | advanced future journey |
| Light/pixel physics on a monitor panel | **Terminal Boundary** (declared permanently out-of-scope) | — |

No false mechanical analogy anywhere (`01 §3.3`).

## 6. Protagonist Declaration (Constitution `02 §13`)

- **Exactly one persistent visual protagonist:** the golden **spark** — the *unit of work* the Browser cares for — continuous with Chapter 01's spark (canonical visual benchmark, `02 §10`).
- **The Browser** is the persistent main *character*: the stage owner whose perspective the learner inhabits. The narrator always speaks about what *the Browser* does. The spark never leaves the Browser's world physically — the Browser never travels (`MENTAL MODELS` guard).
- The payload the spark carries *evolves on screen* (letter → request chip → bytes → page) — every metamorphosis happens on the workbench, visible; the golden spark core never vanishes, never teleports (`02 §5`, `§13`).

## 7. Misconceptions to actively prevent (owner's list → mechanism)

| # | Forbidden belief | Prevention mechanism |
|---|---|---|
| M1 | Browser physically travels the Internet | Browser is static stage; only the payload moves along rails |
| M2 | DNS lies on the communication path | DNS box placed off-route (above); narration: "only asked once"; request later bypasses it visibly |
| M3 | "TCP is a machine" | TCP rendered only as words inside the HTTPS gloss ("rules of the conversation"), never as a node |
| M4 | HTTPS is a server | Padlock sits *on the link*, owned by both ends |
| M5 | HTML directly becomes pixels | 12 intermediate structures each get a beat and an on-screen artifact |
| M6 | JavaScript always runs in parallel | Parser visibly FREEZES while script runs; resumes after |
| M7 | Paint immediately displays the page | b18 explicitly: "still zero pixels — a list of instructions" |
| M8 | Browser ≡ Browser Engine | Engine is entered through a door (scene transition); tagged "Inside the Browser Engine" |

## 8. Learning objectives (owner's 12, all covered by scope)

Objects: what Browser does after navigation (S1), why DNS (S2–S3), why HTTPS (S4), why HTML is only the beginning (S5–S8), why CSS (S11), why JS runs during load (S12), why intermediate structures (S8–S16), why Layout (S14), why Paint ≠ image (S15), why Raster (S16), why GPU (S17), how pixels reach the monitor (S17+S6).

## 9. Verification note (platform constraint)

Constitution `01 §4` mandates State-Predictive Verification machinery; the current runtime (like Ch-01 at freeze time) is playback-based. Mitigation at chapter level: Question-Before-Answer prompts embedded in narration (b2 "First question: where is it?"). Interactive verification gates are a **platform-level deferred task**, recorded here honestly and inherited from the existing runtime status (`projects/state` compliance note). All other gates must PASS.
