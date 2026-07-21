# Chapter 02 — Phase 5: Scene Design (FROZEN)

- **Chapter ID:** `chapter-02-browser-loading`
- **Parent artifacts:** `04_STORY_ARCHITECTURE.md` (FROZEN) and all earlier frozen artifacts
- **Produced artifact:** per-scene visual/structural specification + animation design (before narration)
- **Review status:** Passed — reviewed against `02_VISUAL_LANGUAGE` (causality, attention economy, canon) and `03` (knowledge-reveal readiness)
- **Frozen status:** FROZEN — scene structures sealed; Phase 6 writes narration onto this skeleton

---

## 0. Canonical style inheritance (`02 §10` mandatory)

Inherited verbatim from Chapter 01: starfield gradient background + vignette (composer) · golden spark + trail · `Quicksand` typography · fade-through-black scene changes (450 ms) · `easeInOutCubic` travel · glow-on-active · name labels under boxes · side-panel gloss system · beat dots timeline. Chapter accent: `#22d3ee` (cyan, from the frozen `meta.ts`). No aesthetic deviation.

## 1. Scene A — `web` (world 1500×920; bbox `{40,40,1460,940}`, cameraPad 0.92)

```
(40,40)┌─────────────────────  "Desktop" case  ─────────────────────┐  ┌────────────┐
       │  ┌──────────────── BROWSER WINDOW (90,110,760×600) ───────┐ │  │ DNS        │
       │  │ ○ tab    ┌──────── URL bar ────────┐                   │ │  │ (1240,175) │
       │  │ │ https://best-cats.example        │                   │ │  └─────▲─────┘
       │  │ └──────────────────────────────────┘                   │ │   rail-dns (off-route!)
       │  │ ┌───────────────── VIEWPORT ─────────────────────────┐ │ │        │
       │  │ │ search results → loading bar → final page          │ │ │        │
       │  │ │        [b0 hit-zone: the result link]              │─┼─┼─ rail-srv ──►┌ SERVER ─┐
       │  │ └────────────────────────────────────────────────────┘ │ │   🔒HTTPS    │(1240,520)│
       │  │  hardware row:  NIC → RAM → CPU → GPU   (y=830)        │ │              └─────────┘
       └───────────────────────────────────────────────────────────┘
```

**Entities** (kind → renderer; gloss = Phase 6):
| id | kind | pos | color | role |
|---|---|---|---|---|
| `browser` | `browser-window` (new) | (470,410) center of window | `#22d3ee` | main character; viewport content = f(beatIndex) |
| `nic` | `nic` (new) | (260,830) | `#a5b4fc` | hardware door (Ch-01 recall) |
| `ram` | `ram` (reused) | (430,830) | `#facc15` | fills "HTML" at b7+ |
| `cpu` | `cpu-chip` (reused) | (590,830) | `#fb923c` | presence + Ch-01 gloss |
| `gpu` | `gpu` (reused) | (740,830) | `#4ade80` | glows at b21 |
| `dns` | `service-box` (new, icon `book`) | (1240,175) | `#a78bfa` | off-route lookup |
| `server` | `service-box` (new, icon `files`) | (1240,520) | `#22d3ee` | animated churn when active |
| `httpslock` | `https-lock` (new) | (1010,520) on rail-srv | `#facc15` | invisible until b4; then persists |

**Infrastructure:** `case` rect `{60,80,840,790}` (labels the desktop); `rail-dns` polyline `(850,300)→(1100,300)→(1100,175)→(1170,175)`; `rail-srv` `(850,520)→(1170,520)`; `hw-rail` `(260,830)→(740,830)` (dim). Infra glows when the beat's `active` equals the infra id (runtime generalization R4).

**Browser-window viewport content** — pure function of `s.beatIndex` (`02 §15`): b0–b1 search page (query "cats", top result card = hit-zone + spark origin) · b2–b20 loading state (thin progress bar + spinner; NO fake content) · b21+ the final webpage (same drawing as the workbench finale).

## 2. Scene B — `engine` (world 1400×920; bbox `{30,40,1370,960}`, cameraPad 0.94)

```
        ┌ net-port (670,55)  ← little ceiling door back to the network
        │
  Decode(330,170)  Tokenize(500,170)  HTML Parser(670,170)   JS Engine(920,170)
 ┌─────────────── WORKBENCH (150,270 → 710,770) ───────────────┐
 │ the page transforms here: bytes→chars→tokens→DOM→+CSSOM      │
 │ →mutation→render tree→blueprint→paint list→pixels→final page │
 └───────────────────────────────────────────────────────────────┘
   Style(380,850)   Layout(560,850)   Paint(740,850)   Raster(920,850)   GPU(1100,850)
```

**Entities:** 10 stations (kind `station`, colors: decode `#38bdf8`, tokens `#818cf8`, parser `#22d3ee`, js `#facc15`, net-port `#94a3b8`, style `#c084fc`, layout `#4ade80`, paint `#fb7185`, raster `#fb923c`), `gpu` kind `gpu` `#4ade80`, `workbench` (new kind) at its rect center `#e2e8f0`, name "Workbench".
**Infrastructure:** `bench-top-rail` `(330,170)→(920,170)` dim; `bench-bottom-rail` `(380,850)→(1100,850)` dim; `port-cable` stub `(670,55)→(670,34)` dim (`02 §4`: structure stays visible & stable; rails never glow to avoid competing with the spark — attention `02 §7`).

**Workbench storyboard** (f(beatIndex, beatElapsed) — deterministic sub-progress `frac = clamp(beatElapsed/3000)`):
| beat | workbench state |
|---|---|
| b9 | byte grid (hex pairs) rains in; dissolves L→R into characters |
| b10 | char string; scissor marks cut chips: `<html>` `<head>` `<link>` `</head>` `<body>` `<h1>` `All About Cats` `</h1>` `<p>` `Cats sleep 16 hours.` `</p>` `<script>` `…` `</script>` `</body>` `</html>` accumulate staggered |
| b11 | token chips fly onto tree: nodes pop `html→head→link`,`body→h1,p` with link lines; `link` node retains a soft pulse into b12 |
| b12 | tree static; a small CSS parcel descends from the top edge into beside the tree (mirrors spark's port detour) |
| b13 | parcel unfolds: CSSOM mini-tree (3 rule cards) appears right of the DOM |
| b14 | whole tree dims 40%; `<script>` node rings gold; status tag "Parser paused" |
| b15 | the `p` node's text mutates: `Cats sleep 16 hours.` → append `They own the internet.`; tree re-lights; ✓ DOM complete |
| b16 | DOM + CSSOM slide together; merge into Render Tree: only `body/h1/p` nodes remain, each tinted by its style |
| b17 | tree ghosts; blueprint page wireframe draws itself with measurement ticks |
| b18 | blueprint fades to 25%; right column: 6 numbered draw-command receipts stack in order |
| b19 | receipts consumed top-down → coarse pixel grid floods row-by-row into the page |
| b20 | pixelated page refines; two translucent layers slide into alignment; crisp final mini page + glow pulse |

**Final-page micro-content (single source, used by workbench b20/b21 and viewport):** navy page, gold header bar titled "All About Cats", white paragraph "Cats sleep 16 hours. They own the internet.", coral button "Adopt a cat".

## 3. Animation design (paths; `easeInOutCubic` everywhere; ambient orbit when resting, per canon)

**PATH_A (26 points)** — coordinates fixed in `scenes/`:
`0 link(450,285) · 1 urlbar(490,142) · 2 edge(850,300) · 3 dns-bend(1100,300) · 4 dns-bend2(1100,175) · 5 dns-door(1162,175) · 6 (1100,175) · 7 (1100,300) · 8 (850,300) · 9 (850,520) · 10 lock(1010,520) · 11 srv-door(1162,520) · 12 (1010,520) · 13 (850,520) · 14 (850,520)dup · 15 (1010,520) · 16 srv-door(1162,520) · 17 srv-door dup · 18 (1010,520) · 19 (850,520) · 20 (850,830) · 21 nic(260,830) · 22 ram(430,830) · 23 door(470,410) · 24 gpu(740,830) · 25 window(470,410)`
Beats: b0 rest0(emerge) · b1 travel 0→2 · b2 travel 2→5 · b3 travel 5→8 · b4 travel 8→13 · b5 travel 14→16 · b6 rest17 · b7 travel 17→22 · b8 travel 22→23 · b21 travel 24→25 · b22 loop.
Seam: PATH_A end (25) ≡ b8 rest point (23) = (470,410) → zero jump on any fade.

**PATH_B (13 points):** `0 decode · 1 tokens · 2 parser · 3 net-port(670,55) · 4 parser · 5 js(920,170) · 6 bench-east(810,510) · 7 style · 8 layout · 9 paint · 10 raster · 11 gpu(1100,850) · 12 gpu dup`
Beats: b9 rest0 · b10 0→1 · b11 1→2 · b12 2→4 · b13 rest4 · b14 4→5 · b15 rest5 · b16 5→7 · b17 7→8 · b18 8→9 · b19 9→10 · b20 10→12.
Seam: PATH_B end = GPU hold (12); re-entry to `web` at gpu analog (PATH_A 24). ✓

**Durations (ms):** b0 1400 · b1 2600 · b2 2800 · b3 2400 · b4 3000 · b5 2400 · b6 2600 · b7 3000 · b8 2400 · b9 3000 · b10 3000 · b11 3600 · b12 3200 · b13 2800 · b14 2800 · b15 3400 · b16 3200 · b17 3200 · b18 3000 · b19 3200 · b20 3200 · b21 3000 · b22 6500 ≈ **71.4 s**.

## 4. Concept-readiness matrix (`03 §13` Knowledge Reveal authorization)

| Term unlocked | Only after observing |
|---|---|
| URL (b1) | address appearing in the bar |
| DNS (b2), IP address (b3) | query sent; number returned |
| HTTPS (b4), HTTP request (b5) | lock appears; chip labeled request |
| HTML (b7), Browser Engine (b8) | bytes in RAM; entering the window |
| decode/UTF-8 (b9), token (b10) | chars appear; chips cut |
| HTML Parser, DOM Tree (b11) | tree growing |
| CSS, CSSOM (b12–b13) | style parcel; rule map |
| JavaScript/JS Engine (b14–b15) | parser freeze; mutation |
| Render Tree (b16), Layout (b17), Paint (b18), Raster (b19), composite (b20) | respective artifacts |

## 5. Attentional economy (`02 §7/§16`)
Exactly one active glow per beat (`active` field). Dim rails; the workbench holds 70% visual weight while stations stay quiet until visited; HUD/side-panel narration waits for motion completion (beats are single-mechanism). Misconception guardrails (M1–M8) embedded in geometry itself (DNS above & off-route; lock on link; parser freeze).

## 6. Transition spec (sealed)
web→engine (b9 beat has `scene:'engine'`; fade 450ms; seam A25≡A23) · engine→web (b21 `scene:'web'`; seam B12↔A24 GPU). UI: hash-route level unchanged; `Step x / 23` counter; engine-scene beats show scene tag "Inside the Browser Engine".
