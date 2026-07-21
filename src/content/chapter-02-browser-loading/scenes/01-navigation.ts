// scenes/01-navigation.ts — Act 1: the Browser receives its mission.
// Geometry for the 'web' scene: the browser window, the search page, the URL,
// and the protagonist's starting point (the clicked link).

import type { Vec2 } from '../../../chapter-loader/types'
import type { PartSpec, Rect } from '../types'

// ---- web-scene geometry ---------------------------------------------------
export const BBOX_WEB = { minX: 40, maxX: 1370, minY: 40, maxY: 940 }
export const CASE = { x: 60, y: 80, w: 840, h: 790 }

// The browser window itself
export const WINDOW = { x: 90, y: 130, w: 760, h: 600 } // LAYOUT v1.3.2 (F20): 110 → 130 — 3 px kiss with the Desktop label became 23 px (R02)
export const URLBAR = { x: 190, y: 152, w: 600, h: 36 } as Rect
export const VIEWPORT = { x: 106, y: 212, w: 728, h: 502 } as Rect

// The hit-zone: the first search result inside the viewport
// LAYOUT v1.3.1 (F17): y 246 → 288 — the query pill (V.y+34, h 46 → bottom 272)
// overlapped the card top by 26 px and its border struck the query glyphs (L-16);
// gap is now 16 px (R02) and the spark origin rests on the true card center.
export const LINK_RECT = { x: 130, y: 308, w: 680, h: 80 } as Rect

// Search-page content (context only — Google is never the protagonist)
export const SEARCH_QUERY = 'cats'
export const RESULT = {
  title: 'All About Cats',
  url: 'https://best-cats.example',
  snippet: 'Everything you ever wanted to know about cats.',
}
export const URL_TEXT = 'https://best-cats.example'

// v1.3.11 (F55, owner round 11): more greyed results for SERP realism.
// Measured fit (world px): rows start where the hardcoded 2nd result ends —
// title y = rr2.y + 182 (+64 px pitch), 4 rows → last url baseline 702,
// viewport bottom = 714 → 12 px margin, no border breach (R02).
// Alphas decay with depth; titles stay ASCII (no exotic dashes).
export const EXTRA_RESULTS: { title: string; url: string }[] = [
  { title: 'Cat breeds A-Z: find your match', url: 'https://purr.example/breeds' },
  { title: 'Why do cats sleep 16 hours?', url: 'https://nap-science.example' },
  { title: 'Adopt a cat near you', url: 'https://adopt.example/cats' },
  { title: 'Cats vs. cucumbers: the investigation', url: 'https://science.example/cats' },
]

// ---- protagonist path through the web scene -------------------------------
// 27 points; every beat resumes exactly where the previous one ended.
// (See docs/chapters/chapter-02-browser-loading/05_SCENE_DESIGN.md §3;
//  v1.2 architectural review: the single HTTPS round-trip depicts
//  "open the road, then whisper" — no separate connection trip.)
export const PATH_A: Vec2[] = [
  { x: 470, y: 348 }, // 0  the clicked link (LINK_RECT center)
  { x: 490, y: 170 }, // 1  url bar center
  { x: 850, y: 300 }, // 2  window edge, out toward the world
  { x: 1040, y: 300 }, // 3  dns rail bend
  { x: 1040, y: 175 }, // 4  dns rail bend 2
  { x: 1102, y: 175 }, // 5  dns door
  { x: 1040, y: 175 }, // 6  dns bend 2 (return with the answer)
  { x: 1040, y: 300 }, // 7  dns bend (return)
  { x: 850, y: 300 }, // 8  back at the window edge
  { x: 850, y: 520 }, // 9  server rail bend (down to the road, out)
  { x: 980, y: 520 }, // 10 the HTTPS lock — the knock happens HERE (v1.3.4/F31)
  { x: 980, y: 520 }, // 11 dup — keys agreed AT the lock (hold)
  { x: 980, y: 520 }, // 12 dup — the beat RESTS at the lock (v1.3.5/F36: no round trip)
  { x: 980, y: 520 }, // 13 dup — https beat ends with the spark waiting at the lock
  { x: 980, y: 520 }, // 14 the request starts AT the lock and crosses it
  { x: 1102, y: 520 }, // 15 server door (request delivered)
  { x: 1102, y: 520 }, // 16 dup — delivered
  { x: 1102, y: 520 }, // 17 dup — the server works
  { x: 980, y: 520 }, // 18 rail midpoint (response returns past the lock)
  { x: 850, y: 520 }, // 19 home edge
  { x: 850, y: 805 }, // 20 down to the hardware row
  { x: 260, y: 805 }, // 21 NIC
  { x: 430, y: 805 }, // 22 RAM
  // v1.3.12 (F58, owner round 12 "đi qua RAM xong nhảy lên màn hình loading
  // ... sau đó đi vào CPU"): NEW anchor — after RAM the spark jumps UP into
  // the loading screen ("Waiting for..." spinner center: V.x+V.w/2 = 470,
  // V.y+V.h/2-10 = 453), THEN dives to the CPU.
  { x: 470, y: 453 }, // 23 the loading screen (spinner center)
  // v1.3.13 (F60, owner round 13 "đi tới CPU là mới vào inside browser
  // engine"): THE ROUTE ENDS AT THE CPU — the scene cut into the engine hall
  // happens from the chip, so the old engine-door anchor (470,430) is
  // DELETED: it duplicated the rest point's coordinates and read as a
  // second loading-screen visit after the CPU.
  { x: 590, y: 805 }, // 24 CPU
  { x: 740, y: 805 }, // 25 GPU (finale entry) [was 26]
  { x: 470, y: 430 }, // 26 window center (finale rest) [was 27]
]

// ---- the Browser — the protagonist of this chapter -------------------------
export const browser: PartSpec = {
  id: 'browser',
  kind: 'browser-window',
  pos: { x: 470, y: 410 },
  color: '#22d3ee',
  name: 'Browser',
  gloss: {
    en: 'The main character of this story. It asks, it downloads, it builds, it paints. It never leaves your computer, everything comes to it.',
    vi: 'Nhân vật chính của câu chuyện. Nó hỏi, nó tải, nó dựng, nó vẽ. Nó không bao giờ rời máy tính, mọi thứ tự đến với nó.',
  },
}
