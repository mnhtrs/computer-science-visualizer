# Chapter 03 — UI / Layout Revision v1.0.2

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** `09_FREEZE.md` (v1.0.0) + the running app as seen by the owner in the browser
- **Trigger:** owner feedback after viewing the chapter live (three concrete issues)
- **Scope:** presentation/geometry only — **no** educational, narrative, pipeline, or continuity change. Central question, beat order, narration text, and the Ch-02 continuity contract are untouched.
- **Verification:** `tsc --noEmit` ✓ · `vite build` ✓ (29.69 kB / 11.88 kB gzip) · `npm run smoke` ✓ (Ch-01 59.9 s, Ch-02 71.9 s byte-stable → shared renderers provably untouched; Ch-03 54.4 s; 14 deterministic frames re-rendered and visually audited)

---

## Owner issues → fixes

| # | Owner report | Root cause | Fix |
|---|---|---|---|
| F1 | "The outer Router cable plugs into the Browser window — keep it away from the browser; route it like my red line." | The home cable ran R1 → window right edge (850,520) → straight down the window's edge to the hardware row, reading as "plugged into the Browser." | Introduced a home **drop** at x 880 (in the 50 px gap between the window edge 850 and the case edge 900): R1 → `DROP_TOP`(880,520) → `DROP_BOT`(880,805), then the hardware rail extended NIC→drop. The vertical drop now sits *outside* the window; `PATH_A` anchors 7/8 and the imagined-road ghost line updated to match. The bytes visibly arrive at the machine's door, never at the Browser. |
| F2 | "The sidebar explanation text is gigantic — shrink it." | `.narration` was `clamp(20px, 2.4vw, 27px)` (≈27 px on the owner's window). | `.narration` → `clamp(14px, 1.3vw, 16px)`, weight 600→500, line-height 1.4→1.55. Title `.chapter` 19→17 px; `.gloss-text` 15→13 px; panel padding/gap tightened. |
| F3 | "Narrow the sidebar; and everything in the canvas is tiny — the text is for ants, make it bigger." | Panel fixed at 360 px; the wire world was 1900 wide, so the width-bound camera zoom was ≈0.47 → a 15 px world label rendered ≈7 px. | (a) Panel 360→300 px (wider stage). (b) Compressed the **Ch-3-only** router web horizontally (Server 1840→1650, routers pulled in; world width 1900→1740). (c) Raised `cameraPad` (wire 0.90→0.95, bench 0.94→0.97). (d) Bumped every **chapter-local** world-space size: Router box 96×62→124×80 + name 14→19; chip 54×34→72×46 + `#k` 15→21; file block 120×36→156×48 + text 11→15; Server IP pill 14→17 + name →18; Browser URL 15→19 / "Waiting" 18→24 / name 16→20; NIC & RAM-fill boxes + names →19; port 78×46→96×56 + name →17; bench caption 15→19, slot numbers →20, ACK `have ✓N` 22→28, slot boxes 84→92, strips/ask/`whole ✓` enlarged. |

## Why Chapters 01/02 are unaffected (and verified)
The CPU/GPU hardware labels in Ch-03 use the **shared** renderers (dim bystanders). Enlarging them via a shared `labelSize` generalization was rejected because Chapter 01 already sets `labelSize: 12` on an entity the shared renderers currently *ignore* — honoring it would have visibly changed Chapter 01. So shared renderers were left byte-for-byte untouched; the CPU/GPU labels grow only via the global zoom increase. `npm run smoke` confirms Ch-01 (59.9 s) and Ch-02 (71.9 s) playthroughs are unchanged.

## Environment note (not a repo change)
`node_modules` is excluded from the workspace snapshot, so dependencies (including the `esbuild` the documented smoke tool needs) are reinstalled at the start of each session via `npm install --legacy-peer-deps`; `esbuild` is recorded in `package.json` devDependencies so a single install restores the smoke tooling.

*This revision is presentation-only; the frozen educational artifacts (01–08) stand. The chapter code is now v1.0.2.*
