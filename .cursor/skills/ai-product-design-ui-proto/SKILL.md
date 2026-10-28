---
name: ai-product-design-ui-proto
description: Implements a runnable clickable prototype with Next.js, shadcn/ui, and Tailwind; keyboard and focus accessible. Use when the user says /ui-proto, wants a clickable prototype, or to build the UI from mid-fi wireframes.
---

# UI Prototype (UI Engineer)

Implement a runnable prototype (shadcn/ui + Tailwind), keyboard/focus-accessible, covering primary flows.

## Pipeline

Final stage in the `ai-product-design` chain:
`scaffold → /prd → /lofi → /midfi → /hifi → /ui-proto`.

- Previous: `/hifi` (ai-product-design-hifi) — implement the `ui-design/` kit
- Next: — (end)

To run the whole chain in one pass, use the `ai-product-design-workflow`
orchestrator. When an existing design system is named (e.g. Konstrukt), prefer
its CSS/tokens over a fresh shadcn install and record the deviation in
`README-proto.md`.

## Inputs

| Input | Notes |
|-------|--------|
| `framework` | default: Next.js 14+ App Router |
| `package_manager` | npm | pnpm | yarn |
| `ts` | default: true |
| `pages` | List of pages/screens |
| `components` | From mid-fi |
| `routes/flows` | Primary navigation and flows |
| `data` | mock or live |
| `theming` | light | dark | both |

## Artifact root

All deliverables for this product go under a single **`artifact_root`**:

1. **Definition:** `artifact_root` is the directory that contains this product’s `PRD.md` and/or `DESIGN-BRIEF.md` (same folder is ideal). If files are split, prefer the folder the user attached or the one containing `PRD.md`.
2. **Resolve in order:** (a) Parent directory of an attached or @-referenced `PRD.md` / `DESIGN-BRIEF.md`; (b) explicit path the user gives for the product docs folder; (c) **greenfield only** (`/new-project` or PRD with no path): `projects/{project_name}/docs/`.
3. **Do not** default to repo-global `docs/wireframes/`, `docs/ui-design/`, or root `docs/PRD.md` when `artifact_root` is known.

**Inputs path:** Read mid-fi wireframes and specs from `{artifact_root}/wireframes/midfi/` (not repo-global `docs/wireframes/midfi/`).

## Output

- Next.js app under **`{artifact_root}/prototype/`** (create that directory if missing): Tailwind configured, shadcn installed
- Routes/pages per screens; mock data and API stubs as needed
- **`{artifact_root}/prototype/README-proto.md`** — setup, components, routes, known gaps

## Standard Setup

Run all commands from **`{artifact_root}/prototype/`** (empty or new folder):

```bash
npx create-next-app@latest . --ts --eslint --src-dir --app --tailwind --no-import-alias
npx shadcn@latest init -y
npx shadcn@latest add button card input label form select dialog sheet toast tabs table navigation-menu dropdown-menu tooltip avatar badge skeleton pagination textarea checkbox radio-switch
```

## Acceptance

- [ ] From `{artifact_root}/prototype/`, `npm run dev` works
- [ ] Core flows clickable end-to-end with loading/empty/error states
- [ ] No TypeScript or ESLint errors; responsive for mobile and desktop
- [ ] Keyboard navigation works; focus outline visible on interactive controls

## Conventions

- Prototypes: ensure keyboard navigation and visible focus outlines.
