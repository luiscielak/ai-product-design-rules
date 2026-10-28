---
name: ai-product-design-midfi
description: Converts lo-fi to mid-fi with design tokens, components, states, and accessibility notes; produces a unified ui.html overview. Use when the user says /midfi, wants mid-fi wireframes, design tokens, or component specs for prototyping.
---

# Mid-Fi Wireframes (Product Designer)

Convert lo-fi to mid-fi: tokens, components, states, accessibility notes, and a unified `ui.html` overview.

## Pipeline

Stage in the `ai-product-design` chain:
`scaffold → /prd → /lofi → /midfi → /hifi → /ui-proto`.

- Previous: `/lofi` (ai-product-design-lofi) — read `wireframes/lofi/`
- Next: `/hifi` (ai-product-design-hifi)

To run the whole chain in one pass, use the `ai-product-design-workflow`
orchestrator. If the project uses an existing design system (e.g. Konstrukt),
map tokens to it instead of generic Tailwind/shadcn defaults.

## Inputs

| Input | Notes |
|-------|--------|
| `screens` | From lo-fi |
| `states` | default: default, hover, focus, disabled, loading, error, success |
| `content_examples` | short/long |
| `accessibility_targets` | WCAG AA |

## Artifact root

All deliverables for this product go under a single **`artifact_root`**:

1. **Definition:** `artifact_root` is the directory that contains this product’s `PRD.md` and/or `DESIGN-BRIEF.md` (same folder is ideal). If files are split, prefer the folder the user attached or the one containing `PRD.md`.
2. **Resolve in order:** (a) Parent directory of an attached or @-referenced `PRD.md` / `DESIGN-BRIEF.md`; (b) explicit path the user gives for the product docs folder; (c) **greenfield only** (`/new-project` or PRD with no path): `projects/{project_name}/docs/`.
3. **Do not** default to repo-global `docs/wireframes/`, `docs/ui-design/`, or root `docs/PRD.md` when `artifact_root` is known.

**Inputs path:** Read lo-fi wireframes from `{artifact_root}/wireframes/lofi/` (not repo-global `docs/wireframes/lofi/`).

## Output

**Directory:** `{artifact_root}/wireframes/midfi/`

- `tokens.md` — spacing, typography, color, radius, shadows (map to Tailwind)
- `components.md` — inventory + anatomy, states, props, keyboard/focus
- `screens/<screen>.md` — per screen
- `ui.html` — unified overview with device frames (phone + browser)

## tokens.md

- **Spacing:** 0, 2, 4, 6, 8, 12, 16, 24, 32 (Tailwind)
- **Typography:** text-xs/sm/base/lg/xl/2xl; line-heights; weights
- **Color:** neutrals, brand, semantic (Tailwind + shadcn)
- **Radius:** sm/md/lg/full; **Shadows:** sm/md/lg

## components.md

Inventory: Button, Input, Select, Card, Dialog, Sheet, Toast, Tabs, Pagination, Table, Navbar, Sidebar.  
Per component: anatomy, states, props, interactions, keyboard navigation, focus order.

## Acceptance

- [ ] All interactive elements have defined states and focus styles
- [ ] Accessibility notes for color contrast and keyboard support
- [ ] `ui.html` under `artifact_root` includes device frames: phone (mobile) and browser (desktop)

## Conventions

- Accessibility: include color contrast and keyboard/focus guidance.
