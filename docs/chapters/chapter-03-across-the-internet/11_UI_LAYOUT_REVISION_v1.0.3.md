# Chapter 03 — UI / Layout Revision v1.0.3

- **Chapter ID:** `chapter-03-across-the-internet`
- **Parent artifacts:** `10_UI_LAYOUT_REVISION_v1.0.2.md` + the running app as seen by the owner
- **Trigger:** owner feedback (two issues) after viewing v1.0.2 live
- **Scope:** presentation/geometry only — no educational, narrative, pipeline, or continuity change
- **Verification:** `tsc` ✓ · `vite build` ✓ · `npm run smoke` ✓ (Ch-01 59.9 s / Ch-02 71.9 s byte-stable; Ch-03 54.4 s; 14 frames re-audited)

---

## Owner issues → fixes

| # | Owner report | Root cause | Fix |
|---|---|---|---|
| F4 | "The incoming Router cable runs along the NIC‑RAM‑CPU‑GPU line — that reads as data flowing through GPU/CPU/RAM into the NIC, which is wrong. Connect it to the NIC only." | v1.0.2 extended the hardware rail to the drop point (`NIC→drop`), so the external cable shared the internal system bus line and visually passed through every chip. | Restored the hardware rail to the **internal bus only** (`NIC→GPU`, exactly Ch-02). The external cable is now a **dedicated** route painted by `wire-traffic`: R1 → `DROP_TOP`(880,520) → down the right margin → `DROP_MID`(880,905) → **below the case** → `UNDER`(230,905) → up into the NIC at `PLUG`(230,805), left of the NIC label. It terminates at the NIC and never crosses the chips or the bus. `PATH_A` gained the matching anchors (now 14 points); beats `route`/`mess`/`home`/`recap` re-indexed. |
| F5 | "Routers too big; the left one overlaps the Desktop case's outer border. Shrink them." | Router box was 124×80 and R1 sat at x 940, so its left edge (878) fell inside the case (right edge 900). | Router box 124×80 → **104×68** (chevrons, glow, name 19→17 scaled to match); **R1 moved 940 → 975** so its left edge (923) clears the case by ~23 px. `DROP_PARAM` recomputed from the new path (lands exactly on R2). |

*Presentation-only; frozen educational artifacts (01–08) stand. Chapter code is now v1.0.3.*
