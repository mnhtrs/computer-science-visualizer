# Chapter 02 — Phase 4: Story Architecture (FROZEN)

- **Chapter ID:** `chapter-02-browser-loading`
- **Parent artifacts:** `03_PIPELINE_VALIDATION.md` (FROZEN), `02_PIPELINE.md`, `01_JOURNEY_DEFINITION.md`
- **Produced artifact:** ordered scene list + beat map; every pipeline step covered; protagonist continuously traceable
- **Review status:** Passed — reviewed against `02_VISUAL_LANGUAGE` §13/§14 (continuity, causality)
- **Frozen status:** FROZEN

---

## 1. Scenes (2; same count and same structure as Chapter 01)

| Scene | ID | Acts | Workbench metaphor | Covers |
|---|---|---|---|---|
| The Browser's World | `web` | Act 1, Act 2, Finale | the desk-world: browser window, hardware row, DNS & server outside | P01–P09, P24 |
| Inside the Browser Engine | `engine` | Act 3 (core) | the workshop: station chain + central workbench | P10–P23 |

## 2. Act map & time budget (23 beats; durations = Phase 5)

| Act | Purpose | Beats | Σ duration | Share |
|---|---|---|---|---|
| 1 — Navigation | Browser receives the mission ("knows where to go") | b0–b1 | 4.0 s | ≈5.6% ✓ (req: 5–10%) |
| 2 — Retrieving resources | DNS → HTTPS → HTTP → NIC → RAM | b2–b7 | 15.8 s | ≈22% |
| 3 — Rendering pipeline | RAM → … → GPU → screen (+ recap) | b8–b22 | 51.3 s | ≈72% ✓ (req: 60–70%, b22 recap included in lesson tailwind; core engine b9–b20 = 39.2 s ≈ 55.4% of total, 77% of Act 3) |

Total ≈ 71 s. Every scene advances the central question (`03 §17`); zero independent explanatory units.

## 3. Beat map (pipeline coverage + central-question advancement)

| Beat | Act | Scene | Covers | Observable event (the visible cause) | Advances the question by |
|---|---|---|---|---|---|
| b0 click | 1 | web | P01 | spark emerges on the clicked link in the results page | establishing the entry action |
| b1 knows | 1 | web | P01–P02 | spark travels link → URL bar → window edge; URL shown | "Browser now knows where to go" |
| b2 dns-q | 2 | web | P03 | spark = query letter out to the DNS box | why DNS exists |
| b3 dns-a | 2 | web | P04–P05 | letter returns carrying a number | destination now known; DNS exits |
| b4 https | 2 | web | P06 | spark shuttles home↔server over the link; padlock materializes on the link | why HTTPS exists |
| b5 request | 2 | web | P07 | request chip travels to the server | the actual ask |
| b6 server | 2 | web | P08 | server churns (animated internals) | response has a cause |
| b7 response | 2 | web | P09 | bytes return along the link; sweep down to NIC → RAM fills "HTML" | why downloading ≠ done |
| b8 to-engine | 3 | web → | P10 | spark carries bytes from RAM into the browser window; window pulses (scene change CAUSED) | Browser ≠ Engine |
| b9 decode | 3 | engine | P11 | workbench: byte field dissolves into characters | first intermediate structure |
| b10 tokenize | 3 | engine | P12 | characters chopped into token chips | why tokenize |
| b11 dom | 3 | engine | P13 | nodes sprout one-by-one into a tree | the DOM Tree |
| b12 css-fetch | 3 | engine | P14 | spark detours up through the net-port, returns with a CSS parcel; tree stays | why CSS must be fetched |
| b13 cssom | 3 | engine | P15 | CSS parcel unfolds into the CSSOM map beside the DOM | second tree |
| b14 js-pause | 3 | engine | P16 | parser dims; script token flashes; spark leaves for the JS engine | why JS blocks |
| b15 js-run | 3 | engine | P17 | JS engine spins; a text node visibly mutates; parser re-lights; DOM ✓ | mutation observed |
| b16 render-tree | 3 | engine | P18–P19 | DOM × CSSOM fuse into styled tree; non-visible nodes dropped | why intermediate trees |
| b17 layout | 3 | engine | P20 | tree fades; blueprint wireframe measures itself | why Layout |
| b18 paint | 3 | engine | P21 | command receipts stack in order; blueprint stays ghost | why Paint ≠ pixels |
| b19 raster | 3 | engine | P22 | pixel grid floods in from the command list | why Raster |
| b20 composite | 3 | engine | P23 | layers slide together in the GPU; final page snapshot glows | why GPU |
| b21 screen | 3 | → web | P24 | fade back; spark rides GPU → into the screen; final page snaps into the viewport | the question answered visibly |
| b22 recap | 3 | web | — | spark orbits the whole world circuit; narration recites the chain | consolidation + Ch-03 hand-off |

## 4. Protagonist continuity proof (`02 §13`)

- **b0→b8 (web):** spark path is one unbroken polyline (Phase 5, PATH_A, indices 0–23); every beat resumes at the previous beat's terminal point — no index gaps, no jumps.
- **web → engine:** b8 ends at the window-desk seam point; fade-out holds the spark at the same world coordinates (seam rule); PATH_B starts where the narration says the engine receives the bytes. Scene change caused by P10's on-screen hand-off (`02 §14`).
- **b9→b20 (engine):** single polyline PATH_B, indices 0–12 (incl. explicit return points for the CSS detour and the GPU hold).
- **engine → web:** b20 ends holding at the GPU (PATH_B end); PATH_A continues at the GPU analog (index 24) and moves into the screen — symmetric seam.
- **b22:** `effect: 'loop'` — spark orbits the whole world circuit (Ch-01 canonical finale behavior).
- Form metamorphoses (letter → chip → bytes → page) happen only while the spark is inside a station/workbench: **on-screen only**. ✓

## 5. Transition causality audit (`02 §14`)

| Transition | Visible cause established in |
|---|---|
| web → engine (b8→b9) | bytes arrive in RAM (b7), spark carries them into the window (b8), window pulses |
| engine → web (b20→b21) | GPU composite finishes (b20 final page snapshot); spark + image travel to the screen (b21) |

Both scene changes are consequences, not narration declarations. ✓

## 6. Central-question coverage
Opening question (b0–b1 leaves it unresolved deliberately); every beat answers one "how"; b21 visibly answers; b22 recites. PASS — proceed to Phase 5.
