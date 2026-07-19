# Cesvi Constitution Index

The Constitution is the supreme law of the Cesvi project.

## Why it is split

Each document has a single, non-overlapping responsibility. Separating them prevents a change in pedagogical theory from requiring a simultaneous change in visual rules.

## Dependency Graph

```
00_VISION
    └── 01_EDUCATIONAL_PHILOSOPHY
            ├── 02_VISUAL_LANGUAGE
            └── 03_NARRATIVE_FRAMING
```

All downstream artifacts (Curriculum, Journeys, Runtime) must derive from this graph and must never contradict it.

## Authoring Status

| Document | Title | Status |
|---|---|---|
| `00_VISION.md` | Vision | ✅ Frozen v1.1.0 |
| `01_EDUCATIONAL_PHILOSOPHY.md` | Educational Philosophy | ✅ Frozen v1.0.0 |
| `02_VISUAL_LANGUAGE.md` | Visual & Sensory Language | ⏳ Pending Authoring |
| `03_NARRATIVE_FRAMING.md` | Narrative Framing | ⏳ Pending Authoring |

## Review & Freeze Process

Every document must pass unanimous multidisciplinary review (Educational Psychologist, CS Professor, Software Architect, Curriculum Designer, Technical Writer) before transitioning from `Approved` to `Frozen`.

## Amendment

See `docs/governance/AMENDMENT.md`. Modifying any frozen document triggers a cascade audit of all downstream documents.
