---
name: ai-product-design-workflow
description: >-
  Orchestrates the full ai-product-design chain — scaffold, /prd, /lofi, /midfi,
  /hifi, /ui-proto — in one piped pass. Use when the user says
  /ai-product-design, "run the design workflow", "chain the ai-product-design
  skills", "piped workflow", "run the whole design process", or asks to take a
  feature/product from PRD through a clickable prototype end to end.
---

# AI Product Design Workflow (Orchestrator)

Runs the six `ai-product-design-*` skills as a single chained pipeline. Each
stage reads the previous stage's output and must clear that skill's acceptance
list before the next stage starts.

The individual skills already know how to do each stage. This skill's job is to
**pick the mode, resolve the artifact_root, run the stages in order, and enforce
the handoffs.** Read each sub-skill's `SKILL.md` before running its stage and
follow it exactly.

## Pipeline

```
scaffold → /prd → /lofi → /midfi → /hifi → /ui-proto
(PM)       (PO)    (UX)     (PD)     (UI)    (UI Eng)
```

Sub-skills:

- `ai-product-design-new-project` — scaffold
- `ai-product-design-prd` — `/prd`
- `ai-product-design-lofi` — `/lofi`
- `ai-product-design-midfi` — `/midfi`
- `ai-product-design-hifi` — `/hifi`
- `ai-product-design-ui-proto` — `/ui-proto`

Order note: the design-ops pipeline lists `/ui-proto` before `/hifi`. When the
prototype should implement the finished visual kit, run **design-then-build**
(`/hifi` before `/ui-proto`) as above. Otherwise keep the sub-skills' default
order. State which order you're using at the start of the run.

## Step 0 — Pick a mode

Decide before scaffolding:

- **Greenfield product** — a brand-new product with no existing app. Use the
  full `ai-product-design-new-project` structure: `projects/{name}/` with
  `app/`, `docs/` (artifact_root), optional `marketing/`.
- **Feature of an existing product** — designing a feature inside a codebase
  that already exists. **Skip** the `app/` and `marketing/` scaffold. Put
  artifacts under `docs/features/{feature-slug}/` and treat that as the
  artifact_root. Do not create a second app at the repo root.

If unsure which mode applies, ask the user one question before scaffolding.

## Step 1 — Resolve the artifact_root

All stages write under one `artifact_root`. Resolve in this order:

1. Parent directory of an attached/@-referenced `PRD.md` or `DESIGN-BRIEF.md`.
2. An explicit path the user gives for the product/feature docs folder.
3. **Feature mode:** `docs/features/{feature-slug}/` (kebab-case).
4. **Greenfield only:** `projects/{project_name}/docs/`.

Never default to repo-global `docs/wireframes/`, `docs/ui-design/`, or root
`docs/PRD.md` once the artifact_root is known. Announce the resolved
artifact_root before writing anything.

## Step 2 — Honor an existing design system

If the project names or clearly uses a design system (e.g. **Konstrukt**,
a Tailwind theme, a shadcn setup, tokens.css), tell the `/midfi`, `/hifi`, and
`/ui-proto` stages to build on it instead of generic defaults:

- Map mid-fi tokens to the existing system's tokens.
- Override any sub-skill styling guidance that conflicts (e.g. the hifi skill's
  "soft gradients / rounded corners" language must yield to a flat/square
  system like Konstrukt).
- Prefer the existing component library / CSS over a fresh shadcn install when
  the system says so; note the deviation in `README-proto.md`.

If no system is named, use the sub-skills' defaults (Tailwind + shadcn).

## Step 3 — Run the stages, gated by acceptance

For each stage: read the sub-skill, produce its output under `artifact_root`,
then verify that skill's acceptance checklist before continuing.

| Stage | Output (under artifact_root) | Gate before next stage |
|-------|------------------------------|------------------------|
| scaffold | folder tree, `WORKFLOW.md`, `DESIGN-BRIEF.md` | tree exists; artifact_root fixed |
| `/prd` | `PRD.md` | every FR maps to a story + a metric |
| `/lofi` | `wireframes/lofi/` | every FR has a screen; empty/loading/error shown; legend complete |
| `/midfi` | `wireframes/midfi/` | states + focus defined; `ui.html` has device frames; tokens mapped |
| `/hifi` | `ui-design/` | gallery variants/states incl. Dialog; theme aligns with midfi tokens |
| `/ui-proto` | `prototype/` | `npm run dev` works; core flows clickable; keyboard + focus; no TS/ESLint errors |

Maintain a stage table with statuses in the feature's `WORKFLOW.md` and update
it as you go.

## Step 4 — Record the run

- Write/refresh `WORKFLOW.md` in the artifact_root: the stage chain, per-stage
  status, handoffs, and an explicit scope boundary (what the design pass does
  NOT ship — live auth, storage, APIs, etc.).
- In `README-proto.md`, note any deliberate deviations from sub-skill defaults
  (design system, faked auth/storage, drag vs keyboard fallback).

## Acceptance (this orchestrator)

- [ ] Mode chosen (greenfield vs feature) and stated.
- [ ] artifact_root resolved by the rules above and announced.
- [ ] All six stages run in order, each honoring its sub-skill.
- [ ] Each stage's acceptance list checked before the next begins.
- [ ] Existing design system honored when one is named.
- [ ] `WORKFLOW.md` records stage status + scope boundary; `README-proto.md`
      records deviations.

## Conventions

- Feature slugs and project names are kebab-case.
- Do not scaffold `app/` or `marketing/` in feature mode.
- Do not ship live plumbing (auth, storage, public read paths) from this chain
  unless the user explicitly extends scope beyond the prototype.
