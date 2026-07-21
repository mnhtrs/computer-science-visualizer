# Chapter 02 — Phase 2: Technical Pipeline (FROZEN)

- **Chapter ID:** `chapter-02-browser-loading`
- **Parent artifacts:** `01_JOURNEY_DEFINITION.md` (FROZEN)
- **Produced artifact:** this numbered, state-change-only pipeline (no narrative, no animation detail)
- **Review status:** Passed (technical correctness verified against established web platform behavior)
- **Frozen status:** FROZEN — this is the factual skeleton; Phase 3 validates it

---

## Pipeline (every row = one observable state change; nothing condensed)

| # | From state | Action (mechanism) | To state |
|---|---|---|---|
| P01 | Search results page displayed; link under cursor | User clicks link; click event carries the link's URL | Browser holds target URL `https://best-cats.example` |
| P02 | Browser holds URL | Parse URL → extract host name | Host `best-cats.example` known; **numeric address unknown** |
| P03 | Host known, address unknown | Browser builds a DNS query ("who is host?"); hands it to the OS → NIC | DNS query bytes leave the machine |
| P04 | Query in flight | DNS service resolves host → IP | Response returns: `93.184.216.34` |
| P05 | IP received | Browser records address of the server holding the site | **Destination known** (DNS exits the story) |
| P06 | Destination known | Browser + server perform HTTPS setup: exchange/agree on shared secret keys | Private encrypted channel established; lock = true |
| P07 | Channel private | Browser composes HTTP request (`GET /`) | Request bytes sent onto channel |
| P08 | Request arrives | Server locates the page resource, composes response (status + HTML body) | Response bytes sent back |
| P09 | Response in flight | NIC receives bytes; OS buffers them into RAM | HTML bytes reside in RAM (Browser-readable) |
| P10 | HTML in RAM | Browser hands byte buffer to its **Browser Engine** subsystem | Engine owns the bytes (control transfer) |
| P11 | Raw bytes | Decode via document encoding (UTF-8): bytes → character stream | Characters available |
| P12 | Character stream | Tokenize: chop into tokens (doctype, start/end tags, text chunks) | Token stream available |
| P13 | Token stream | HTML Parser consumes tokens in order: each element token → node appended to tree per nesting rules | DOM Tree grows: `html → head → link`, `body → h1, p` |
| P14 | `<link>` token processed | Fetch of external CSS dispatched to the network; **parser continues** consuming following tokens | CSS bytes arrive; full token stream consumed except pending script handling |
| P15 | CSS bytes arrived | Parse CSS → rule map (selectors → declarations) | **CSSOM Tree** exists |
| P16 | `<script>` token reached | Parser **must pause**; script (inline JS) handed to the JavaScript Engine | Parser frozen at the script position |
| P17 | Script executing | JS runs to completion NOW: it reads the DOM and mutates it (appends text to `<p>` node) | DOM mutated; parser unfreezes; DOM complete |
| P18 | DOM + CSSOM complete | Style stage: match every node's rules → computed style per node | Styled node set |
| P19 | Styled nodes | Tree filtered to *visible* content (head/link/script excluded) | **Render Tree** (renderable, styled nodes) |
| P20 | Render Tree | Layout: walk tree, compute exact geometry (x, y, width, height) of every box | Boxes fully measured |
| P21 | Measured boxes | Paint: flatten painting into ordered draw command list (back-to-front) | Command list exists; **zero pixels so far** |
| P22 | Command list | Rasterize: execute commands into actual pixel values in a bitmap | Page exists as pixel bitmap in memory |
| P23 | Bitmap(s)/layers | Hand layers to GPU; GPU composites into one final surface | Final image ready |
| P24 | Final image | Image sent to the display path → monitor | **Visible webpage** |

## Entry/Exit verification
- Entry: matches Phase 1 §2 (post-click only; URL/typing an alternative equally valid entry — click chosen for hit-zone continuity with Ch-01's "click the file" start).
- Exit: matches Phase 1 §3; P24 is the final state the central question demands.

## Hardware continuity map (Ch-01 reinforcement, no re-teach)
NIC (P03/P09) → RAM (P09) → CPU (runs the Browser/Engine throughout — shown dim, gloss recalls the fetch-decode-execute loop) → GPU (P23–P24).

## Truth notes (established-knowledge record for Phase 3)
1. P13/P14: external CSS does **not** block the HTML parser (it blocks *render*); the parser's blocking resource is **scripts** (P16). The story must show fetch-in-parallel-with-parsing at the story level. *(Established: WHATWG HTML parsing + render-blocking.)*
2. P16/P17: classic scripts execute synchronously at parse position; DOM mutation by script is the reason for blocking. No async/defer nuance (deferred internal).
3. P11: decoding requires knowing the encoding (UTF-8 assumed/declared) — one sentence, no internals.
4. P19: Render Tree excludes non-rendered nodes (head, link, script, `display:none` as deferred nuance).
5. P21: "no pixels yet" — paint produces painting instructions/records.
6. P22/P23: raster may be tiled/async in real browsers; we present the logical bitmap → composite. Tiling detail = deferred internal.
