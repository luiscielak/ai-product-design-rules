# Asset inventory and provenance

## Decision: Finley, not Design Ops Cockpit

Design Ops Cockpit (`projects/design-ops-cockpit/`) is a complete in-repo pipeline run (2026-10-25) with PRD, lo-fi, mid-fi, hi-fi gallery, and a Next.js prototype. It was **not** used as the explainer sample.

| Check | Finley (README example) | Design Ops Cockpit |
|---|---|---|
| Visual evidence of a real product brief | Yes — `DESIGN.md` stills + editorial frames | Brief is the cockpit’s own meta-brief |
| Matches **current** command order (`/hifi` before `/ui-proto`) | Yes (README + rules) | Run used operator order `/ui-proto` then `/hifi`; product `STAGES` still lists prototype before hi-fi |
| Stage quality notes | Editorial stills + existing demo MP4s used in the README | `RUN-NOTES.md`: mid-fi/hi-fi not regenerated after rule fixes; prototype artifact pane is fixtures, not live files; first `/ui-proto` rated **weak**, re-run **okay** |
| Audience fit | One brief → working finance dashboard | A cockpit *about* running the pipeline |

Cockpit remains a valid in-repo proof of the rules. It is the wrong story for a 52-second silent loop.

Finley **source files** (`projects/finley/**`) are not in this repository. Evidence used here is already-published README artwork and the two existing demo recordings of that run.

## Workflow names used (not guessed)

From `.cursor/rules/00-workflow.mdc` and `README.md`:

1. `/new-project` — Project Manager — Project Setup  
2. `/prd` — Product Owner — PRD  
3. `/lofi` — UX Designer — Lo-Fi Wireframes  
4. `/midfi` — Product Designer — Mid-Fi Wireframes  
5. `/hifi` — UI Designer — Hi-Fi Design  
6. `/ui-proto` — UI Engineer — Prototype  

Do not use the cockpit product’s stage order in this video.

## Assets in the composition

| ID | File | Kind | Provenance | Notes |
|---|---|---|---|---|
| A1 | `assets/editorial/hero-brief-to-prototype-dark.png` | still 1760×990 | README hero, commit `ec24552` | Real Finley brief + prototype composite |
| A2 | `assets/editorial/finley-01-design-brief-dark.png` | still 1760×1100 | README § The brief | Real `DESIGN.md` content |
| A3 | `assets/editorial/finley-02-prd-dark.png` | still 1760×1100 | README § `/prd` | Real in-scope table |
| A4 | `assets/editorial/finley-03-lofi-dark.png` | still 1760×1100 | README § `/lofi` | Real `forecast-desktop.txt` |
| A5 | `assets/editorial/finley-06-prototype-dark.png` | still 1760×1100 | README § `/ui-proto` | Real prototype UI |
| A6 | `assets/finley-04-midfi-demo.mp4` | 59.2s 1280×828 silent | README mid-fi walkthrough | Recoded 8s in-point 8.0s → `media/midfi-clip.mp4` |
| A7 | `assets/finley-05-hifi-demo.mp4` | 55.4s 1280×828 silent | README hi-fi walkthrough | Recoded 8s in-point 9.0s → `media/hifi-clip.mp4` |
| A8 | `media/qr.png` / `qr.svg` | generated | payload = repo URL | Not a product screenshot |
| A9 | Typeset folder tree | HTML | README “What you end up with” | **Illustrative of the command output path.** Labeled on-screen as documented layout, not a screenshot of `projects/finley/` |

Unused but available (not weaker — just redundant in 52s): JPEG 4320×2430 masters `assets/finley-0{1–6}-*.jpg`, editorial mid-fi/hi-fi stills, social OG/portrait cards, `projects/design-ops-cockpit/**`.

## Captions

Taken from the README, not invented claims. No user counts, time-to-build, or “tested with N teams.”

## Missing evidence (not fabricated)

- `projects/finley/` source tree (brief, PRD, ASCII, `ui.html`, gallery, prototype HTML)
- A Finder/Cursor screenshot of `/new-project` creating that tree
- A live click-through of the Finley prototype in this environment
- Meeting notes that record this specific 45–60s explainer (Granola search did not return one; the task brief is the source of the concept)

## Design system

Public README/social art: dark `#121212` grid, accent `#2ABFCC` (Konstrukt dark `--accent`), cream type, “the hooman loop” wordmark. Display: Source Serif 4. Labels: Space Grotesk (Konstrukt `--font-display`). Body: Inter. Commands/tree: JetBrains Mono.
