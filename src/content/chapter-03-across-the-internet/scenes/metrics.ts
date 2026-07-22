// scenes/metrics.ts — the Chapter 03 layout *primitives*: every bare number the
// renderers/geometry use, named once and tied to the Layout Constitution
// (docs/chapters/chapter-02-browser-loading/12_LAYOUT_REVIEW.md §4, R01–R19, plus
// R18/R19). PURE — no imports — so both geometry (01/02) and the derived layout
// system (layout.ts) can build on it without cycles.
//
// Doctrine (verbatim from the owner's layout audit): fixes are x/y/w/h/padding/
// margin/spacing/alignment/anchor/container-size only; every clearance is proven
// by arithmetic (R02 ≥ 8 px breathing, R13 ≥ 12 px from clip, R04 measured-fit,
// R06 one spacing scale per family, R07 one alignment family per row, R10
// connectors terminate at boundaries, R18 pills = measured text + padding).

// ---- global spacing scale -----------------------------------------------------
export const BREATH = 8 // R02: min text↔edge / text↔text breathing (world units)
export const CLIP_INSET = 12 // R13: min content inset from a clip / bbox edge
export const LABEL_GAP = 10 // gap between a box edge and its name label

// ---- type scale (world px) — one named size per role, never a literal --------
export const F = {
  chipNum: 21,
  fileTag: 15,
  fileLabel: 15,
  slotNum: 20,
  ackTag: 14,
  ackVal: 28,
  caption: 19,
  benchName: 20,
  portName: 17,
  routerName: 17,
  hwName: 19,
  serverName: 18,
  ipPill: 17,
  url: 19,
  waiting: 24,
  browserName: 20,
  stripNum: 17,
  ask: 17,
  whole: 17,
  ghost: 24,
  bang: 26,
}

// ---- canvas font families (single source) -------------------------------------
export const FONT = "'Quicksand', system-ui, sans-serif"
export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

// ---- element box sizes (one spec each; renderers derive interiors from these) -
export const CHIP = { w: 72, h: 46, headerH: 13, r: 10 }
export const ROUTER = { w: 104, h: 68, r: 12 }
export const SERVER = { w: 156, h: 118, r: 14 }
export const NIC = { w: 88, h: 36, r: 8 }
export const RAM = { w: 72, h: 34, r: 8 }
export const PORT = { w: 96, h: 56, r: 12 }
export const FILE = { w: 156, h: 48, r: 10 }
export const FILE_PAD_X = 13 // R02: text inset from the block's left edge
export const FILE_LINE_GAP = 18 // R05/R07: the two text bands (tag / label)
export const SLOT = { w: 92, r: 12 }
export const SERVER_GLYPH_DY = -17 // vertical placement of the disk glyph within the box
export const LABEL_TEXT_H = 20 // approx cap-height of F.hwName / F.benchName (for bbox math)

// ---- router glyph spec (chevrons + congestion marks, scaled to the box) -------
export const ROUTER_CHEV = { count: 3, pitch: 15, arm: 8, half: 11, width: 3.5 }
export const ROUTER_CONG = { gapX: 13, pitchX: 14, dy0: -7, dy1: 9, r: 4 }

// ---- server interior spec -----------------------------------------------------
export const SERVER_DISK = { half: 22, w: 44, h: 10, r: 3, pitch: 14, topGap: 18 }
export const SERVER_CHURN = { dy: 14, pitch: 10, r: 3 }
// R18: pill width is measured text + 2*padX; these are the paddings/height only
export const SERVER_PILL = { padX: 14, h: 28, r: 14, bottomGap: 8 }

// ---- NIC / RAM interior specs -------------------------------------------------
export const NIC_PAD = { half: 30, w: 15, h: 14, pitch: 24 }
export const RAM_CELL = { padX: 10, padY: 8, w: 9, h: 18, r: 3, pitch: 14 }

// ---- browser-window interior insets (derived onto WINDOW/URLBAR/VIEWPORT) -----
export const CHROME = { insetX: 30, insetY: 34, dotR: 7, dotPitch: 22 }
export const URL = { leftPad: 18, lockGap: 24, lockW: 12, lockH: 11, shackleR: 5 }
export const PROGRESS = { insetX: 24, topGap: 26, h: 9, r: 4 }
export const SPINNER = { r: 22, dy: -12, width: 4 }
export const WAITING = { baselineDy: 44 }
export const WINDOW_NAME_DY = 22

// ---- home-drop route (derived in 01-the-wire from these + the window/case) ----
export const RIGHT_MARGIN_GAP = 30 // window-right → drop line (sits in the case's right margin; R02 from window, R10 a clean boundary)
export const UNDER_GAP = 35 // case-bottom → under-case cable band
// R02: plug line must clear the NIC name label; label half-width for "NIC" at
// F.hwName ≈ 18, so PLUG_DX ≥ 18 + BREATH = 26; 30 gives 12 px margin (R02/R12)
export const PLUG_DX = 30
// R02/R10: R1 centre sits RIGHT_MARGIN-ish past the case so its box never
// overlaps the case border; box half = ROUTER.w/2 = 52, so clearance = 75-52 = 23
export const R1_CLEAR = 75

// ---- tray (derived in layout.ts onto the NIC): one pitch, two rows -----------
export const TRAY_PITCH = CHIP.w + BREATH // R06: one spacing scale for the inbox row

// ---- bench interior -----------------------------------------------------------
export const BENCH_PAD = { x: 22, y: 16 }
export const SLOT_LABEL_GAP = 10
// R11: the ask pill lives in its own reserved top-right band, clear of slots
export const ASK = { w: 104, h: 38, r: 19, bandX: 100, bandY: 66 }
export const ACK = { w: 184, h: 54, r: 12, padX: 14, tagDy: 17, valDy: 33 }
export const WHOLE = { w: 104, h: 32, r: 16, dx: 52, dy: -40 }

// ---- wire-traffic misc (queue / corruption / cut lines), named ----------------
export const QUEUE = { dx: 80, pitch: 30, dy0: -16, dy1: 15, r: 6 }
export const CORRUPT = { dx: 15, dy: -8, size: 16, bangDy: -32 }
export const CUT = { count: 3 } // cut lines at the file's quarter points (derived in layout)
