---
name: ai-product-design-new-project
description: Bootstraps a new project with the AI product design folder structure (app, docs, optional marketing). Use when the user says /new-project, wants to create a new product project, bootstrap project structure, or start an ai-product-design workflow.
---

# New Project (Project Manager)

Creates an organized project structure for AI product design workflows.

## Pipeline

Stage 0 (scaffold) of the `ai-product-design` chain:
`scaffold → /prd → /lofi → /midfi → /hifi → /ui-proto`.

- Previous: — (start)
- Next: `/prd` (ai-product-design-prd)

To run the whole chain in one pass, use the `ai-product-design-workflow`
orchestrator. In **feature mode** (a feature of an existing product), skip the
`app/` and `marketing/` scaffold and use `docs/features/{feature-slug}/` as the
artifact_root instead of `projects/{name}/docs/`.

## Artifact root

All deliverables for this product go under a single **`artifact_root`**:

1. **Definition:** `artifact_root` is the directory that contains this product’s `PRD.md` and/or `DESIGN-BRIEF.md` (same folder is ideal). If files are split, prefer the folder the user attached or the one containing `PRD.md`.
2. **Resolve in order:** (a) Parent directory of an attached or @-referenced `PRD.md` / `DESIGN-BRIEF.md`; (b) explicit path the user gives for the product docs folder; (c) **greenfield only** (`/new-project` or PRD with no path): `projects/{project_name}/docs/`.
3. **Do not** default to repo-global `docs/wireframes/`, `docs/ui-design/`, or root `docs/PRD.md` when `artifact_root` is known.

**This skill:** Create **`projects/{project_name}/docs/`** as `artifact_root` so **lofi / midfi / hifi / prd / ui-proto** outputs stay colocated with `PRD.md` and the design brief.

## Inputs

Gather or infer:

| Input | Notes |
|-------|--------|
| `project_name` | kebab-case (e.g. "foto-sage", "chat-assistant") |
| `project_type` | default: "ai-product-design" |
| `include_marketing` | default: true |

## Output Structure

Create `projects/{project_name}/` (or project root if already in repo) with:

```
├── app/                    # Next.js application
│   ├── src/app/            # App Router structure
│   └── components/ui/      # shadcn/ui components
├── docs/                   # artifact_root — PRD, brief, wireframes, ui-design, optional prototype
│   ├── PRD.md
│   ├── wireframes/
│   │   ├── lofi/
│   │   └── midfi/
│   ├── ui-design/
│   ├── prototype/          # optional; ui-proto skill (Next.js) colocated here
│   └── presentations/
└── marketing/              # only if include_marketing
```

- **app/**: Next.js + TypeScript + Tailwind + shadcn/ui scaffold
- **docs/** (`artifact_root`): PRD, design brief, wireframes, UI design docs; optional **prototype/** for ui-proto
- README with setup and usage

## Setup Commands (when creating app from scratch)

```bash
npx create-next-app@latest . --ts --eslint --src-dir --app --tailwind --no-import-alias
npx shadcn@latest init -y
```

## Acceptance

- [ ] Structure matches the pattern above; `docs/` is `artifact_root` for design artifacts
- [ ] `npm install && npm run dev` runs in app
- [ ] README includes setup and usage instructions

## Conventions

- Project names: **kebab-case** (e.g. `chat-assistant`).
