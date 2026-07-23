# Cesvi — Application Redesign

> Status: **Design proposal — awaiting approval before implementation.**
> Scope: Restructure the app around a Home → Viewer flow, modularize the
> current monolithic `App.tsx`, and make chapters auto-discoverable.
> Principle: the visualization is the product. Everything else gets out of the way.

---

## 0. Design Goals (recap)

| Goal | Decision |
|---|---|
| First screen the user sees | **Home**, not the viewer |
| Chapter discovery | **Auto** via folder convention — no hardcoded cards |
| Page transitions | **No reload** — in-app route switch |
| Viewer lifecycle | **Mount on enter, destroy on leave** (clean raf/listener teardown) |
| Engine / Compiler / Renderer | **Reuse as-is** — only the *shell* around them changes |
| Project shape | **Modular**, single-responsibility files, no god objects |
| Localization | **Native Vietnamese** for prose; CS terms stay in English |
| Visual style | Minimal, Linear/Vercel/Visualgo-grade restraint |

Non-goals (explicitly rejected): LMS, courses, subjects, profiles, quizzes,
progress, auth, search, categories, tags, comments, social.

---

## 1. Complete UX Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

   Open site
      │
      ▼
 ┌─────────────┐
 │   HOME      │   list of journeys, each a card
 │             │   - available  → [Open]
 │             │   - coming soon → greyed, no action
 └─────┬───────┘
       │ click [Open] on an available card
       ▼
 ┌─────────────┐   hash route changes to #/chapter-XX
 │  VIEWER     │   Viewer component mounts
 │             │   → engine boots, canvas inits, raf starts
 │             │   → spark appears, story plays
 │  [◁ Back]   │   user steps / plays / pauses / replays
 └─────┬───────┘
       │ click Back (or browser Back, or Esc)
       ▼
 ┌─────────────┐
 │   HOME      │   Viewer unmounts → raf cancelled, listeners removed
 │             │   state discarded — fresh boot next time
 └─────────────┘
```

**Interaction rules**
- Home never mounts the Viewer. The Viewer's `useEffect` only runs after the route resolves to a chapter.
- Back is offered in three equivalent ways: in-Viewer `◁ Back` button, browser back button (hash change), and `Esc` key. All three trigger the same "leave viewer" path.
- Refreshing the browser on `#/chapter-01` returns the user straight to that Viewer (deep linkable).
- Refreshing on `#/` returns to Home.
- Unknown hash → fall back to Home.

---

## 2. Homepage Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                          [ EN | VI ] │
│                                                                      │
│                                                                      │
│                            Cesvi                                     │
│              Learn Computer Science visually                         │
│                                                                      │
│                                                                      │
│   ─────────────────────────────────────────────────────────────      │
│                                                                      │
│   01     How does a computer run my program?            [ Open → ]   │
│          Follow a single task from click to pixel.                   │
│                                                                      │
│   ─────────────────────────────────────────────────────────────      │
│                                                                      │
│   02     How does a website reach my screen?              soon        │
│          A packet's journey from server to browser.                 │
│                                                                      │
│   ─────────────────────────────────────────────────────────────      │
│                                                                      │
│   03     How does clicking become an action?              soon        │
│          From mouse to event handler.                                │
│                                                                      │
│   ─────────────────────────────────────────────────────────────      │
│                                                                      │
│   04     How does JavaScript really work?                 soon        │
│          Engine, call stack, event loop.                             │
│                                                                      │
│   ─────────────────────────────────────────────────────────────      │
│                                                                      │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Layout principles**
- Single centered column, max-width ~720–820px, generous vertical rhythm.
- No sidebar, no header bar, no footer chrome. Just the brand, the tagline, the list.
- One row per journey: number · title · (one-line subtitle) · status pill / open button.
- Available card: hover lifts subtly, accent underline grows, cursor → pointer. Whole row clickable.
- Coming-soon card: reduced opacity (~45%), subtitle visible, "soon" pill, not clickable.
- Language toggle top-right (small, the same component used inside the Viewer).
- Background: same starfield/gradient as the Viewer — continuity, not a jarring new page.

**Card anatomy**

```
┌──────────────────────────────────────────────────────────────┐
│ 01   How does a computer run my program?                     │
│      Follow a single task from click to pixel.       [Open →]│
└──────────────────────────────────────────────────────────────┘
       ↑                                              ↑
       accent-coloured number (chapter.accent)        status-aware button/pill
```

---

## 3. Navigation Model

### 3.1 Route shapes

| Hash | Screen | Notes |
|---|---|---|
| `#/` (or empty) | **Home** | Lists all chapters from registry |
| `#/chapter-01` | **Viewer(chapter-01)** | Loads that chapter's story |
| `#/chapter-02` | Home with toast "Coming soon" | Coming-soon chapters cannot be entered |
| `#/<unknown>` | Redirect to `#/` | Defensive |

### 3.2 Router contract

A single hook (e.g. `useHashRoute`) is the only navigation primitive.
- It reads `window.location.hash`, listens to `hashchange`.
- It exposes `{ name: 'home' }` or `{ name: 'viewer', chapterId }`.
- It exposes a `navigate(hash)` function.
- The browser back button works for free because we use the hash.

**Why hash and not `react-router`?** A 30-line hook is enough, no dependency,
deep-linkable URLs, and the back button behaves correctly. We are not building
an SPA with nested routes — two screens total.

### 3.3 State diagram

```
        ┌────────┐  click card (available)   ┌────────┐
        │  HOME  │ ─────────────────────────►│ VIEWER │
        │        │ ◄─────────────────────────│        │
        └────────┘   Back / Esc / hash back  └────────┘
            │                                       │
            │ click card (coming soon)              │ refresh
            ▼                                       ▼
        toast "Coming soon"                   re-enter same viewer
```

The Viewer is **conditionally rendered**. When the route is `home`, the Viewer
is not in the React tree at all — its `useEffect` cleanup runs, the raf is
cancelled, the canvas is GC'd. No hidden state survives.

---

## 4. Folder Structure

```
cesvi/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                     # ReactDOM boot — stays tiny
    │
    ├── app/                         # application shell
    │   ├── App.tsx                  # root: route switch + lang provider
    │   ├── useHashRoute.ts          # the only navigation primitive
    │   └── routes.ts                # route type defs
    │
    ├── home/                        # the homepage
    │   ├── Home.tsx                 # page composition
    │   ├── JourneyCard.tsx          # one row
    │   ├── JourneyList.tsx          # maps registry → cards
    │   └── home.css
    │
    ├── viewer/                      # the runtime that plays one chapter
    │   ├── Viewer.tsx               # orchestrator (engine + UI + canvas)
    │   ├── ViewerStage.tsx          # <canvas> + ResizeObserver + raf
    │   ├── useEngineLoop.ts         # raf lifecycle, dt, sync to React
    │   └── viewer.css
    │
    ├── controls/                    # viewer UI overlay (presentational)
    │   ├── PlaybackBar.tsx          # back / prev / timeline / next / play
    │   ├── Timeline.tsx             # yellow beat dots OR green cycle dots
    │   ├── SidePanel.tsx            # narration + instrHint + gloss
    │   ├── LangToggle.tsx           # EN | VI pill (shared with Home)
    │   └── controls.css
    │
    ├── engine/                      # pure logic, no React, no DOM
    │   ├── state.ts                 # S interface, initialState()
    │   ├── update.ts                # advance timeline, derive spark + scene
    │   ├── cycle.ts                 # fetch/decode/execute/wb/pc stage math
    │   └── types.ts                 # Phase, Scene, PState, Vec2, …
    │
    ├── rendering/                   # pure canvas drawing, no state
    │   ├── canvas-utils.ts          # setTransform, fit, hexA, rrPath
    │   ├── math.ts                  # lerp, clamp, easing
    │   ├── background.ts            # gradient + stars
    │   ├── spark.ts                 # protagonist
    │   ├── parts/                   # one file per hardware piece
    │   │   ├── ssd.ts
    │   │   ├── ram.ts
    │   │   ├── cpu-chip.ts
    │   │   ├── gpu.ts
    │   │   ├── monitor.ts
    │   │   ├── bus.ts
    │   │   ├── control-unit.ts
    │   │   ├── registers.ts
    │   │   └── alu.ts
    │   ├── scenes/
    │   │   ├── pcScene.ts           # compose PC parts
    │   │   ├── cpuScene.ts          # compose CPU parts
    │   │   └── stageTracker.ts      # the 5-stage pill bar
    │   └── composer.ts              # background + scene + vignette + fade
    │
    ├── chapter-loader/              # auto-discovery of content
    │   ├── registry.ts              # builds the sorted chapter list
    │   ├── types.ts                 # ChapterMeta, ChapterStatus
    │   └── useChapters.ts           # React hook consumed by Home
    │
    ├── localization/                # UI strings (not chapter narration)
    │   ├── LangContext.tsx          # provider + useLang()
    │   ├── strings.ts               # { en: {...}, vi: {...} }
    │   └── en.ts / vi.ts            # optional split when large
    │
    └── content/                     # the journeys themselves
        ├── chapter-01/
        │   ├── meta.ts              # id, slug, title, status, accent, loader
        │   ├── story.ts             # geometry, parts, program, beats
        │   └── narrations.ts        # stageLine / currentOpText (optional split)
        ├── chapter-02/
        │   └── meta.ts              # coming-soon, no story yet
        ├── chapter-03/
        │   └── meta.ts
        └── chapter-04/
            └── meta.ts
```

**Rules enforced by this layout**
- A renderer never imports React.
- The engine never imports a renderer.
- A chapter's `story.ts` never imports `App.tsx` or any UI.
- `controls/` components are pure/presentational — they take props, call callbacks.
- `home/` and `viewer/` never import each other directly; both live under `app/App.tsx`.

---

## 5. Component Hierarchy

```
<App>                                    ← app/App.tsx
 ├─ <LangProvider>                       ← localization/LangContext.tsx
 │   ├─ (route === 'home')
 │   │   └─ <Home>                       ← home/Home.tsx
 │   │       ├─ <LangToggle/>            ← shared
 │   │       └─ <JourneyList>            ← home/JourneyList.tsx
 │   │           └─ <JourneyCard/> × N   ← from useChapters()
 │   │
 │   └─ (route === 'viewer')
 │       └─ <Viewer chapterId=…>         ← viewer/Viewer.tsx
 │           ├─ <ViewerStage/>           ← canvas + raf (engine output)
 │           ├─ <SidePanel/>             ← narration + gloss
 │           ├─ <PlaybackBar/>           ← back/prev/timeline/next/play
 │           │   └─ <Timeline/>          ← yellow or green dots
 │           ├─ <LangToggle/>
 │           └─ <SceneTag/>              ← "Inside the CPU" pill (when in CPU scene)
```

**Data flow**

```
            ┌──────────────┐
 story ───► │   engine     │ ──► S (mutable ref, updated each frame)
            │  update(dt)  │
            └──────┬───────┘
                   │ sync() snapshots a few scalars into React state
                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ ViewerStage  │    │  controls/   │
            │  draws S     │    │  reads state │
            └──────────────┘    └──────┬───────┘
                                       │ user clicks (jump/step/play)
                                       ▼
                              mutates the same S ref directly
                              (start / jumpTo / jumpToStep / exitCpu …)
```

The engine owns the canonical state in a `useRef`. React state holds only the
*mirror* needed for the UI (phase, beat, scene, lang, execTick). Drawing reads
from the ref every frame — no React re-render needed for animation.

---

## 6. Module Responsibilities

### `app/`
- **`App.tsx`** — decides Home vs Viewer from the route. Hosts `LangProvider`. That's it. <60 lines.
- **`useHashRoute.ts`** — parse `location.hash`, subscribe to `hashchange`, expose `navigate()`. The *only* place that touches the URL.
- **`routes.ts`** — `Route` discriminated union (`{ name:'home' } | { name:'viewer'; chapterId }`).

### `home/`
- **`Home.tsx`** — lays out brand, tagline, list. Reads chapters via `useChapters()`.
- **`JourneyList.tsx`** — maps registry → cards, sorted by `order`.
- **`JourneyCard.tsx`** — one row. Knows nothing about engines or viewers; just calls `onOpen(slug)`.

### `viewer/`
- **`Viewer.tsx`** — owns the engine ref + React state mirror. Wires controls → engine mutations. Mounts/unmounts cleanly.
- **`ViewerStage.tsx`** — `<canvas>` + `ResizeObserver` + the raf loop. Calls `engine.update(dt)` then `rendering.composer.draw(ctx, S)`. Cancels raf on unmount.
- **`useEngineLoop.ts`** — encapsulates the raf lifecycle and `dt` math. Reusable across any chapter.

### `controls/`
- **`PlaybackBar.tsx`** — composes Back / Prev / Timeline / Next / Play-Pause / Replay. Pure presentational.
- **`Timeline.tsx`** — knows two modes (`beat` / `cycle`); emits `onJump(i)` / `onJumpStep(k)`.
- **`SidePanel.tsx`** — renders narration, instrHint, gloss. Reads from props, never from the engine.
- **`LangToggle.tsx`** — shared EN/VI switch used by both Home and Viewer.

### `engine/`
- **`state.ts`** — the `S` interface and `initialState()`. Pure data.
- **`update.ts`** — `update(s, dt)`: timeline advance, fade, spark path derivation, execution state. No React, no DOM, no canvas.
- **`cycle.ts`** — stage model (Fetch/Decode/Execute/Write Back/PC++), `stageAt()`, `stageEndpoints()`, `displayState()`.
- **`types.ts`** — `Phase`, `Scene`, `PState`, `Stage`, `Vec2`, etc.

### `rendering/`
- **`canvas-utils.ts`** / **`math.ts`** — primitives, no domain knowledge.
- **`background.ts`** / **`spark.ts`** — scene-agnostic.
- **`parts/*.ts`** — one file per hardware piece, each a single `draw(ctx, state)`. Composable.
- **`scenes/pcScene.ts`** / **`scenes/cpuScene.ts`** — call the right parts in the right order for that scene.
- **`composer.ts`** — the single entry point: `draw(ctx, S)` = background → scene → vignette → fade overlay.

### `chapter-loader/`
- **`registry.ts`** — uses Vite's `import.meta.glob('./content/*/meta.ts', { eager:true })`, validates each meta, sorts by `order`, exports the array.
- **`types.ts`** — `ChapterMeta` (id, slug, order, status, title, subtitle, accent, `loadStory`).
- **`useChapters.ts`** — React hook returning the sorted list.

### `localization/`
- **`LangContext.tsx`** — `LangProvider` + `useLang()` returning `{ lang, setLang }`.
- **`strings.ts`** — UI-only strings (Home brand, "Open", "Coming soon", "Back", "Pause", "Replay CPU", …). **Chapter narration stays inside each chapter** because it's domain content, not UI.

---

## 7. Chapter Authoring Contract

This is the most important interface in the redesign — it's what lets new
chapters be added with **zero viewer/engine changes**.

### 7.1 Folder convention

```
content/
  chapter-NN/         # NN = zero-padded order
    meta.ts           # required
    story.ts          # required only if status === 'available'
```

### 7.2 `meta.ts` shape

```
ChapterMeta {
  id:        string            // 'chapter-01'  (must match folder name)
  slug:      string            // url-safe, e.g. 'how-a-computer-runs-my-program'
  order:     number            // sort key (folder number is the convention)
  status:    'available' | 'coming-soon'
  title:     { en: string; vi: string }
  subtitle:  { en: string; vi: string }
  accent:    string            // hex color for the card + viewer chrome
  loadStory: () => Promise<ChapterStory>   // lazy import; absent if coming-soon
}
```

### 7.3 What "adding a chapter" looks like

1. Create `content/chapter-NN-[slug]/`.
2. Add `meta.ts` (required for auto-discovery) and the remaining production modules. See `§16` for the full authoritative file manifest derived from the Chapter 03 reference implementation.
3. Done. The registry picks it up via glob; Home renders the new card; the
   Viewer can open it. **No edit to any file outside `content/`.**

### 7.4 Chapter → Viewer contract

The Viewer only needs three things from a chapter:
- its **geometry** (bbox, part positions, spark path),
- its **program / state machine** (for the CPU-style chapters; absent for others),
- its **beats** (the storyboard).

Everything else (renderers, engine, controls) is chapter-agnostic. A future
"how does a website reach my screen" chapter will define its own geometry and
parts but reuse 100% of the rendering/engine/controls modules.

---

## 8. Localization Strategy

### 8.1 Two layers

| Layer | Lives in | Translated? |
|---|---|---|
| **UI chrome** (Home, buttons, labels) | `localization/strings.ts` | Fully, both EN & VI |
| **Chapter narration** (beat lines, glosses, instrHint) | each chapter's `story.ts` | Fully, both EN & VI |

### 8.2 Vietnamese rules (binding)

- **CS terms stay in English**: CPU, RAM, GPU, SSD, Bus, Register, ALU, CU, PC,
  IR, Fetch, Decode, Execute, Write Back, Browser, Server, Client, Pixel, DOM,
  API, HTML, CSS, JavaScript, Fetch, Render Tree, Layout, Paint, ADD, SUB,
  MOV, CALL, Return Stack … — **never** "Bộ xử lý trung tâm", "Bộ nhớ truy cập
  ngẫu nhiên", etc.
- **Surrounding prose** reads like a Vietnamese engineer explaining to a
  beginner — natural word order, everyday verbs, contractions where natural.
  Example: `"CPU đang đọc lệnh tiếp theo từ RAM."` — not a literal translation.
- **Operator symbols**: `+ − × ÷` use Unicode minus and times for clean display.
- **Never** machine-translate. Each VI string is written from scratch.

### 8.3 Lang provider

Single source of truth at app root. Persists to `localStorage` so a returning
user keeps their language. The Home and Viewer share the same toggle.

---

## 9. Integration with the Existing Cesvi Architecture

This is the **least disruptive** part of the redesign: the engine and renderers
are *not* being rewritten, only *moved* and *wrapped*.

### 9.1 What stays identical (logic preserved)

- The `S` engine state shape.
- The `update(s, dt)` function — beat advancement, fade, spark path, execution cycle.
- The `stageAt` / `stageEndpoints` / `displayState` cycle math.
- Every `drawXxx` renderer (background, spark, ssd, ram, cpu-chip, gpu, monitor,
  bus, control-unit, registers, alu, die, stageTracker, programList, etc.).
- The `fit()` camera math.
- The chapter's `story.ts` content (PROGRAM, REG_STATES, beats, geometry).

### 9.2 What changes (mechanical relocation)

| Currently in `App.tsx` | Moves to |
|---|---|
| `lerp`, `clamp`, `easeInOutCubic`, `TAU` | `rendering/math.ts` |
| `hexA`, `rrPath`, `polylinePoint`, `fit` | `rendering/canvas-utils.ts` |
| `STARS`, `drawBackground` | `rendering/background.ts` |
| `drawSpark`, `glow`, `drawName`, `drawVignette` | `rendering/spark.ts` (+ utils) |
| `drawSSD/RAM/CPUChip/GPU/Monitor/Cable/BusRail/Case` | `rendering/parts/*.ts` |
| `drawDie`, `drawCache`/CU/Registers/ALU, `drawProgramList`, `drawStageTracker` | `rendering/scenes/cpuScene.ts` |
| `drawPC`, `drawCPU`, `draw` (composer) | `rendering/scenes/pcScene.ts` + `composer.ts` |
| `S` interface, `initialState` | `engine/state.ts` |
| `update`, `displayState` | `engine/update.ts` + `engine/cycle.ts` |
| `cpuNode`, `stageEndpoints` | `engine/cycle.ts` |
| The React component (panel, controls, timeline) | `viewer/Viewer.tsx` + `controls/*.tsx` |

No algorithm changes — just `import` paths.

### 9.3 What's genuinely new

- `app/App.tsx` (route switch — ~40 lines).
- `app/useHashRoute.ts` (~30 lines).
- `home/*` (~150 lines total).
- `chapter-loader/registry.ts` (~25 lines, Vite glob).
- `localization/LangContext.tsx` (~30 lines).

Total new code: well under 300 lines. The bulk of the codebase is *moved*, not *written*.

---

## 10. Migration Plan

Five small phases. Each phase leaves the app **runnable and green**. No big-bang.

### Phase 1 — Routing shell (no refactor yet)
**Goal:** Home ↔ Viewer, single chapter, current `App.tsx` untouched inside.

1. Create `app/App.tsx` and `app/useHashRoute.ts`.
2. Rename current `App.tsx` → `viewer/Viewer.tsx` (move, don't rewrite).
3. `main.tsx` renders `<App/>`. `App` decides Home vs Viewer by route.
4. Home is **temporarily** a single hardcoded card → opens `#/chapter-01`.
5. Viewer mounts only on `#/chapter-01`. Back returns Home.

**Acceptance:** Site opens on Home; clicking opens the existing viewer; back works; refresh on `#/chapter-01` deep-links.

### Phase 2 — Chapter loader
**Goal:** Home reads from registry; current story becomes `chapter-01`.

1. Move `src/story.ts` → `src/content/chapter-01/story.ts`.
2. Create `content/chapter-01/meta.ts` (status: available, with `loadStory`).
3. Create `chapter-loader/registry.ts` (Vite glob `content/*/meta.ts`).
4. Add `chapter-02..04/meta.ts` as **coming-soon** (no story).
5. Home iterates registry instead of hardcoded card.

**Acceptance:** Adding a new `content/chapter-XX/meta.ts` makes a new card appear with no other edit.

### Phase 3 — Extract rendering layer
**Goal:** Split the 1500-line Viewer into renderer files.

1. Create `rendering/{math,canvas-utils,background,spark}.ts`.
2. Create `rendering/parts/*.ts` — one per `drawXxx`.
3. Create `rendering/scenes/{pcScene,cpuScene,stageTracker}.ts`.
4. Create `rendering/composer.ts` as the single draw entry.
5. Viewer imports from these instead of defining them inline.

**Acceptance:** Same visuals, but Viewer.tsx is now mostly orchestration.

### Phase 4 — Extract engine + controls
**Goal:** Engine and UI are independently testable.

1. Move `S`, `initialState`, `update`, `cycle` → `engine/*.ts`.
2. Move panel/timeline/playback → `controls/*.tsx`.
3. Viewer becomes a thin orchestrator: owns engine ref + React mirror, wires callbacks.

**Acceptance:** Viewer.tsx ≤ 200 lines. engine/* has zero React imports.

### Phase 5 — Localization polish
**Goal:** UI strings extracted; Vietnamese reviewed by a native eye.

1. Move UI strings → `localization/strings.ts`.
2. Wrap app in `LangProvider`; persist to `localStorage`.
3. Review every VI string against the rules in §8.2 (CS terms intact, natural prose).

**Acceptance:** Toggling EN/VI updates Home and Viewer chrome; chapter narration already bilingual.

---

## 11. Decisions Log (why, not just what)

| Decision | Why |
|---|---|
| Hash router, not `react-router` | Two screens; 30 lines beat a dependency |
| `import.meta.glob` for chapter discovery | Native to Vite, zero config, true auto-discovery |
| Engine state in `useRef`, not React state | 60fps animation must not trigger React reconciliation |
| Renderers split per-part | A new chapter reuses parts without copying code |
| Chapter narration inside `content/`, UI strings in `localization/` | Domain content ≠ UI chrome; different change cadence |
| Coming-soon chapters as real `meta.ts` (not hardcoded) | Same code path; promotes honesty about the roadmap |
| `LangProvider` at root, not per-screen | Language survives navigation; one toggle component |
| Viewer conditional mount (not hidden) | Guarantees clean teardown — no leaked rafs across visits |

---

## 12. Out of Scope (explicit)

To prevent scope creep during implementation:

- Search, filter, categories, tags
- Per-chapter deep-link sharing UI (the URL *is* the share; no button needed yet)
- Progress / completion tracking
- Theming / dark-mode toggle (the app is already dark)
- Keyboard shortcut overlay / help screen
- Analytics
- Anything resembling a course, lesson, or module grouping

These can be added later as separate, non-breaking layers.

---

## 13. Approval Checklist

Before implementation begins, confirm:

- [ ] Home ↔ Viewer flow matches the vision
- [ ] Folder structure is acceptable (no objections to module boundaries)
- [ ] Chapter contract (`meta.ts` + `story.ts`) is the right level of abstraction
- [ ] Vietnamese rules in §8.2 are correct and complete
- [ ] Migration phasing (5 steps, each shippable) is acceptable
- [ ] Out-of-scope list is agreed — nothing else sneaks in

Once approved, implementation starts at **Phase 1** (routing shell) and stops
at the end of each phase for review.

---

## 14. Architecture Review & Stabilization (FROZEN)

> This section records the self-review performed before implementation and
> **supersedes** any conflicting detail in §4, §6, §7 above. The architecture is
> now frozen; Phases 1–5 implement exactly this.

### 14.1 Issues found in the original draft

| # | Issue | Severity | Resolution |
|---|---|---|---|
| 1 | `ChapterStory` contract undefined — "add chapter = zero changes" unverifiable | **High** | Defined in §14.4 below |
| 2 | Composer hardcoded to PC/CPU scenes — a browser chapter couldn't reuse it | **High** | Composer calls chapter-provided `render(ctx, S)` |
| 3 | Engine state `S` carries CPU-specific fields (`execInstrIdx`, `execRegs`, …) | Medium | Split into core `S` + chapter extension in Phase 4; leave as-is for now |
| 4 | `viewer/useEngineLoop.ts` is needless indirection (raf ↔ canvas are coupled) | Low | Merged into `ViewerStage.tsx` |
| 5 | `localization/en.ts / vi.ts` "optional split" is premature | Low | Single `strings.ts` only |
| 6 | Glob path is relative — easy to get wrong | Low | Made explicit in registry spec |
| 7 | `rendering/parts/` flat namespace collides across chapters | Low (future) | Namespace by domain when needed (`parts/pc/`, `parts/web/`); not now |

### 14.2 Corrected folder structure (supersedes §4)

```
src/
├── main.tsx
├── app/
│   ├── App.tsx                  # route switch + LangProvider host
│   ├── useHashRoute.ts          # the ONLY navigation primitive
│   └── routes.ts                # Route discriminated union
├── home/
│   ├── Home.tsx
│   ├── JourneyCard.tsx
│   ├── JourneyList.tsx
│   └── home.css
├── viewer/
│   ├── Viewer.tsx               # engine ref + React mirror + control wiring
│   ├── ViewerStage.tsx          # <canvas> + ResizeObserver + raf (lifecycle HERE)
│   └── viewer.css
├── controls/
│   ├── PlaybackBar.tsx
│   ├── Timeline.tsx
│   ├── SidePanel.tsx
│   ├── LangToggle.tsx           # shared by Home + Viewer
│   └── controls.css
├── engine/                      # pure logic — no React, no DOM, no canvas
│   ├── state.ts
│   ├── update.ts
│   ├── cycle.ts
│   └── types.ts
├── rendering/                   # pure drawing — no React, no state ownership
│   ├── composer/
│   │   └── draw.ts              # background → story.render(ctx,S) → vignette → fade
│   ├── scenes/                  # chapter-provided scene files
│   ├── parts/                   # one file per drawable part
│   └── primitives/              # canvas-utils, math, background, spark
├── chapter-loader/
│   ├── registry.ts              # import.meta.glob('../content/*/meta.ts', eager)
│   ├── types.ts                 # ChapterMeta, ChapterStory, ChapterStatus
│   └── useChapters.ts
├── localization/
│   ├── LangContext.tsx
│   └── strings.ts               # UI chrome only (single file)
├── shared/                      # chapter-agnostic cross-cutting code
│   ├── components/              # tiny generic UI atoms used in 2+ places
│   ├── constants/               # app-wide constants (e.g. STORAGE keys)
│   ├── types/                   # shared type aliases (Lang, L)
│   ├── hooks/                   # generic hooks
│   └── utils/                   # pure helpers with no other home
└── content/
    ├── chapter-01-program-execution/
    │   ├── meta.ts
    │   ├── story.ts             # exports ChapterStory (see §14.4)
    │   ├── manifest.ts          # optional asset list
    │   └── assets/
    ├── chapter-02-browser-loading/
    │   └── meta.ts              # coming-soon
    ├── chapter-03-click-to-action/
    │   └── meta.ts
    └── chapter-04-javascript-engine/
        └── meta.ts
```

### 14.3 Frozen rules (binding for all phases)

- **Renderers never import React.** A `drawXxx` takes `(ctx, state)` and returns void.
- **The engine never imports a renderer or React.** `update(s, dt)` is pure.
- **A chapter's `story.ts` never imports UI, the Viewer, or `app/`.**
- **`controls/` are presentational** — props in, callbacks out, no engine import.
- **`home/` and `viewer/` never import each other**; both live under `app/App.tsx`.
- **Scene dispatch is chapter-provided.** The composer calls `story.render(ctx, S)`; it does **not** know about PC or CPU scenes. Chapter 1 ships its own `render` that internally selects pc/cpu; future chapters ship their own.
- **`shared/` is chapter-agnostic and non-orchestration.** Chapter-specific code never lives here.

### 14.4 Chapter contract (frozen — the single most important interface)

```ts
// chapter-loader/types.ts

type ChapterStatus = 'available' | 'coming-soon'

interface LocalizedText { en: string; vi: string }

interface ChapterMeta {
  id:        string            // 'chapter-01-program-execution' (== folder name)
  slug:      string            // url-safe, used in hash route
  order:     number            // sort key on Home
  status:    ChapterStatus
  title:     LocalizedText
  subtitle:  LocalizedText
  accent:    string            // hex color: card + viewer chrome
  loadStory: () => Promise<ChapterStory>   // lazy; undefined for coming-soon
}

interface ChapterStory {
  beats:     ReadonlyArray<Beat>            // the storyboard
  bbox:      { minX; maxX; minY; maxY }     // for camera fit (per scene if needed)
  initialState: () => EngineState           // chapter-specific engine state factory
  update:    (s, dt) => void                // chapter-specific step function
  render:    (ctx, s) => void               // chapter draws itself — THE scene dispatch
  // optional chapter hooks (present only when the chapter uses them):
  narration?: (s, lang) => { line; hint?; gloss? }   // dynamic narration
  jumpToStep?: (s, step) => void                     // micro-step navigation
  totalSteps?: () => number                          // for the cycle timeline
}
```

**Why `render` lives in the story, not the composer:** this is what makes the
Viewer and composer 100% chapter-agnostic. Adding Chapter 20 (a browser flow)
requires writing its `render` inside its own folder — the composer, engine
core, Viewer, and controls are untouched. This is the concrete mechanism behind
"zero code changes outside `content/`."

**Convention for chapter-owned canvas geometry (additive; clarifies §14.4, does
not change the contract):** the contract says *what* a chapter draws
(`render`/entities/infrastructure) but not *how its coordinates are organised*.
Production (Ch-02's `12_LAYOUT_REVIEW.md`, Ch-03's `12_LAYOUT_REVISION_v1.0.4.md`)
proved the required organisation, now binding via the Authoring Workflow Phase 5
Layout Derivation Law and Checklist Gate 5.6: a chapter with canvas geometry ships
a pure **metrics** module (named primitives — one spacing scale, one type scale,
one box spec per element) and a **derived-layout** module (container interiors,
repeated rows, badges/pills computed from primitives + rects + `measureText`); the
bbox and connector routes are derived from content + a declared clip inset; the
draw functions consume only named values / formulas of specs / measured text,
never inline pixel literals. This keeps every chapter's layout auditable and
reusable (Ch-37 inherits Ch-03's method without reading Ch-03), and keeps Ch-01/02
byte-stable when a later chapter changes its own geometry.

### 14.5 Phase 1 scope (frozen — what is implemented now)

Phase 1 builds **only the routing shell**:
- `app/App.tsx`, `app/useHashRoute.ts`, `app/routes.ts`
- `home/Home.tsx` + `home/home.css` (single hardcoded available card)
- existing `App.tsx` → **moved** to `viewer/Viewer.tsx` (export renamed, story
  import path adjusted; internals **untouched** — engine/rendering/simulation
  are not modified)
- `main.tsx` updated to render `<App/>`

Phase 1 explicitly **does NOT**: move `story.ts` into `content/` (Phase 2),
extract renderers (Phase 3), extract the engine (Phase 4), or unify language
via `LangProvider` (Phase 5). The Viewer's existing internal language state is
left as-is; Home has its own toggle. Phase 5 unifies them.

### 14.6 Verification matrix (frozen claims)

| Claim | How it holds |
|---|---|
| Adding Chapter 20 ≈ zero code changes | Drop `content/chapter-20-…/meta.ts` + `story.ts`; registry globs it; Viewer opens it via the `ChapterStory` contract. No edit outside `content/`. |
| Viewer is reusable | Viewer depends only on `ChapterStory`, not on any chapter's internals. |
| Engine is React-independent | `engine/*` has zero React/DOM imports (enforced in Phase 4). |
| Rendering is replaceable | `rendering/composer/draw.ts` delegates to `story.render`; a chapter can ship entirely custom drawing. |
| Localization is independent | UI strings in `localization/`; chapter narration in each chapter; both EN+VI. |
| No God Objects | `App.tsx` <60 lines; `Viewer.tsx` bounded by orchestration; one responsibility per file. |
| No 1000+ line files | Renderers split per-part; engine split per-concern; `parts/` namespaced later if it grows. |

---

## 16. Blueprint-to-Chapter Handoff Note

The 5-Stage Cognitive Architecture (`docs/protocols/cesvi_cognitive_architecture.md`, also summarized in `docs/README_FOR_AI.md §Process Architecture Note`) produces an authoring artifact named `journey_blueprint.json` at Stage 5.

*   **Authoring Handoff**: `journey_blueprint.json` is a design-time artifact used during review gates (Authoring Workflow Phases 7–8).
*   **Runtime Implementation**: The viewer engine does **not** ingest `journey_blueprint.json` directly at runtime. Instead, chapter authors implement TypeScript modules under `src/content/chapter-NN-[slug]/`, registering the chapter via `meta.ts` (`loadStory()`).

### Required File Manifest (derived from Chapter 03 reference implementation)

Every production chapter must contain the following files. `meta.ts` is the minimum required for registry auto-discovery. All others are required for a complete, freezable chapter.

```
src/content/chapter-NN-[slug]/
├── meta.ts          ← ChapterMeta: id, slug, order, title, subtitle, accent, thumbnail, loadStory()
├── index.ts         ← Barrel: imports meta + assembleChapter(meta) and exports the Chapter object
├── assemble.ts      ← assembleChapter(meta): builds SceneDescription[], HitZone[], timeline.beats
├── types.ts         ← Chapter-local PartSpec and any chapter-specific type extensions
├── renderers.ts     ← Chapter-specific draw functions keyed by EntityDescription.kind (lowercase-kebab)
├── scenes/
│   ├── metrics.ts   ← Named layout primitives: spacing scale, type scale (F), box specs. Zero literals.
│   ├── layout.ts    ← Derived geometry: container interiors, routes, clearances from metrics.ts values
│   ├── seam.ts      ← Cross-scene shared positions (protagonist handoff coordinates between scenes)
│   └── NN-[name].ts ← One file per scene: exports PartSpec[], PATH, BBOX, INFRASTRUCTURE
└── narration/
    ├── beats.ts     ← BeatDescription[]: timeline beat array (id, line, duration, travel, scene cues)
    └── labels.ts    ← Localized UI string constants (chapter title, button labels, scene tags)
```

**Naming rules:**
- Folder: `chapter-NN-[slug]` where NN is zero-padded chapter number and slug is kebab-case title summary.
- Scene files: `NN-[name].ts` matching their narrative-act order.
- `EntityDescription.kind`: lowercase-kebab-case only (see §17 for enforcement rule).

---

## 17. Phase 2 — Implemented (auto-discovery + content architecture)

> Phase 2 is complete. The architecture is re-frozen at this point. Phase 3
> (rendering extraction) has NOT been started.

### What changed
- **Auto-discovery**: `chapter-loader/registry.ts` uses
  `import.meta.glob('../content/*/meta.ts', { eager: true })`. Adding a chapter
  = dropping a `content/chapter-NN-…/meta.ts` file. No other edit.
- **Generic Chapter contract**: `chapter-loader/types.ts` defines `Chapter`
  (meta + declarative `scenes: SceneDescription[]`). Chapters describe scenes,
  entities, narration — they never call the canvas. `EntityDescription.kind` is
  the key the future rendering layer will map to a draw routine. **Naming convention: `kind` values must be lowercase-kebab-case strings** (e.g. `'cpu-chip'`, `'nic'`, `'router'`, `'service-box'`). PascalCase or snake_case keys will not match renderer registry entries and will fail silently.
- **Chapter 1 modularised**: split into 7 narrative-act scene files
  (`scenes/01-desktop.ts` … `07-result.ts`), 4 narration files, a `types.ts`,
  `meta.ts`, `manifest.ts`, and an `index.ts` barrel.
- **Chapter 1 relocated**: all content moved from `src/story.ts` into
  `src/content/chapter-01-program-execution/`. The old `src/story.ts` is
  deleted.
- **Home is data-driven**: reads `useChapters()`; no chapter is hardcoded.
- **App validates via registry**: Viewer mounts only for `status === 'available'`.

### What did NOT change (per the brief)
- Engine logic (`update`, cycle math) — untouched, only relocated into chapter modules.
- Rendering behaviour / visuals — Viewer.tsx is byte-identical except ONE import path.
- The 21 `drawXxx` functions stay inside Viewer.tsx (extraction is Phase 3).

### Phase 2 → Phase 3 bridge (deliberate, documented)
The current Viewer still imports chapter 1's runtime symbols statically. This
is the bridge that lets Phase 2 be purely architectural without rewriting
renderers. Phase 3 extracts the renderers into `rendering/parts/*` keyed by
`EntityDescription.kind`, and Phase 4 makes the Viewer chapter-agnostic via
`registry.loadStory()`. The declarative `chapter.scenes` emitted today are the
input the Phase 3 renderer will consume — so the contract is already in place.

---

## 16. Normative viewer-capability specifications (FROZEN layer)

`DESIGN.md` defines the **chapter contract and the app shell**. A separate, frozen
layer defines **mandatory viewer/runtime behaviours that are orthogonal to any chapter's
content** — capabilities the Viewer supplies uniformly so chapters neither implement nor
override them. Each is a self-contained, RFC-style normative spec (MUST/SHALL) living in
this folder, registered here so it is discovered on the normal read path rather than
trapped in a chapter's history:

- **`CANVAS_NAVIGATION.md`** (FROZEN v1.0.0) — the mandatory pan / zoom / reset viewport
  model, independent of the storyboard. *Compliance note:* the spec is frozen and binding;
  the current viewer's fixed auto-fit camera is recorded inside it as inherited platform
  debt (same class as `01 §4` State-Predictive Verification), to be closed by a single
  viewer implementation, never per chapter.

New mandatory viewer capabilities follow this pattern: write the normative spec here,
register it in this list and in `protocols/AI_CHARTER.md`'s boot order if it changes AI
behaviour, and cite it from `CHAPTER_REVIEW_CHECKLIST.md` so compliance is checked for every
chapter. This layer exists because production showed that cross-cutting viewer behaviour,
left implicit, drifts — freezing it as a standard is the fix (see the Documentation
Evolution Report of the chapter that surfaced it).
