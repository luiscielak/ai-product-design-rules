# Storyboard — silent looping explainer (draft)

**Format:** 16:9 1920×1080 · H.264 MP4 · no audio · 52.0s · loops  
**Audience:** portfolio visitors and Cursor Philly meetup attendees  
**Sample:** Finley (README example run). Not Design Ops Cockpit — see inventory.  
**Workflow names** (current rules, `.cursor/rules/00-workflow.mdc`):

| Step | Command | Role | Stage name |
|---|---|---|---|
| 1 | `/new-project` | Project Manager | Project Setup |
| 2 | `/prd` | Product Owner | PRD |
| 3 | `/lofi` | UX Designer | Lo-Fi Wireframes |
| 4 | `/midfi` | Product Designer | Mid-Fi Wireframes |
| 5 | `/hifi` | UI Designer | Hi-Fi Design |
| 6 | `/ui-proto` | UI Engineer | Prototype |

The brief is an input the operator writes. It is not a seventh command.

Motion: 0.4s crossfades, ~4.5% Ken Burns on stills, no bounce, no fake terminal, no invented metrics.

Loop: QR and “Same brief” fade out by ~49.4s. The last 1.6s is a hold of the opening composition (hero + intro title, no QR). t=0 and t=52 must match.

| Time | Scene | On screen | Caption | Source |
|---|---|---|---|---|
| 0.0–4.8 | Open | Editorial hero: Finley brief left, prototype right, command strip along the bottom of the still | *From a one-page brief to a clickable prototype* · Six commands. Six roles. | `assets/editorial/hero-brief-to-prototype-dark.png` |
| 4.4–9.6 | Brief (input, not numbered) | Rendered `DESIGN.md` with the 60-second test outlined. Editorial “01 · Brief” header cropped — only the six commands are 01–06. | You write this · *Every screen, chart, and number has to answer a decision in under 60 seconds.* | `assets/editorial/finley-01-design-brief-dark.png` (top cropped) |
| 9.2–13.4 | `/new-project` · Project Manager | Typeset `projects/finley/` tree from the rules/README. **Labeled as the documented layout, not a Finder screenshot** — Finley’s folder is not in this repo. | A project folder with app/, docs/, design/ | README + `00-workflow.mdc` |
| 13.0–18.6 | `/prd` · Product Owner | PRD in-scope table of five screens | Five screens, each with a job — and anti-patterns reviewers should reject. | `assets/editorial/finley-02-prd-dark.png` |
| 18.2–23.8 | `/lofi` · UX Designer | `forecast-desktop.txt` ASCII wireframe | One question per screen. ASCII for mobile and desktop. | `assets/editorial/finley-03-lofi-dark.png` |
| 23.4–31.2 | `/midfi` · Product Designer | Crop of the existing silent ui.html walkthrough | Tokens, components, states, and a ui.html overview. | `assets/finley-04-midfi-demo.mp4` @ 8–16s → `media/midfi-clip.mp4` |
| 30.8–38.6 | `/hifi` · UI Designer | Crop of the existing silent component-gallery walkthrough | Every color has exactly one role, next to a live component gallery. | `assets/finley-05-hifi-demo.mp4` @ 9–17s → `media/hifi-clip.mp4` |
| 38.2–44.6 | `/ui-proto` · UI Engineer | Desktop Today + phone Cost-to-operate | Clickable on desktop and phone — the brief, built. | `assets/editorial/finley-06-prototype-dark.png` |
| 44.2–49.4 | Result | Same hero as open. QR + repo URL, then fade those off before the hold. | Same brief. Working prototype. | hero PNG + `media/qr.png` |
| 50.4–52.0 | Loop hold | Identical to t=0: intro title, no QR. | Six commands. Six roles. | same hero |

Chrome (always on): six-cell command/role rail, “Example · Finley” chip, “the hooman loop” wordmark, repo URL.
