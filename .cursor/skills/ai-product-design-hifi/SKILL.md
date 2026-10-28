---
name: ai-product-design-hifi
description: Delivers a hi-fi design kit and component gallery for engineering handoff. Use when the user says /hifi, wants high-fidelity design specs, component gallery, or design handoff documentation.
---

# Hi-Fi Design Kit (UI Designer)

Deliver a hi-fi design kit and component gallery ready for engineering handoff.

## Pipeline

Stage in the `ai-product-design` chain:
`scaffold → /prd → /lofi → /midfi → /hifi → /ui-proto`.

- Previous: `/midfi` (ai-product-design-midfi) — read `wireframes/midfi/`
- Next: `/ui-proto` (ai-product-design-ui-proto)

To run the whole chain in one pass, use the `ai-product-design-workflow`
orchestrator. When an existing design system is named (e.g. Konstrukt, which is
flat/square with no shadows or gradients), it overrides this skill's default
"soft gradients / rounded corners" guidance.

## Inputs

| Input | Notes |
|-------|--------|
| `theme` | light | dark | both (default: dark) |
| `brand_color` | hex or HSL |
| `accent_color` | hex or HSL |
| `components` | list (default: shadcn core used in project) |
| `app_concept` | optional, for mobile UI focus |
| `key_features` | optional, for mobile UI focus |
| `target_users` | optional, for mobile UI focus |

## Artifact root

All deliverables for this product go under a single **`artifact_root`**:

1. **Definition:** `artifact_root` is the directory that contains this product’s `PRD.md` and/or `DESIGN-BRIEF.md` (same folder is ideal). If files are split, prefer the folder the user attached or the one containing `PRD.md`.
2. **Resolve in order:** (a) Parent directory of an attached or @-referenced `PRD.md` / `DESIGN-BRIEF.md`; (b) explicit path the user gives for the product docs folder; (c) **greenfield only** (`/new-project` or PRD with no path): `projects/{project_name}/docs/`.
3. **Do not** default to repo-global `docs/wireframes/`, `docs/ui-design/`, or root `docs/PRD.md` when `artifact_root` is known.

**Inputs path:** Read mid-fi specs from `{artifact_root}/wireframes/midfi/` (tokens, components, screens, `ui.html`).

## Output

**Directory:** `{artifact_root}/ui-design/`

- `theme.md`
- `color-roles.md`
- `component-gallery.html`
- `layout-guidelines.md`
- `accessibility-checklist.md`
- `mobile-ui-design.html` — if mobile focus

## Component Gallery

Render primary variants/states for: Button, Input, Select, Checkbox, Card, Tabs, Table; include Dialog preview. Use device frames for mobile and desktop.

## Design Principles (mobile UI focus)

- Elegant minimalism with functional design
- Soft, refreshing gradient colors aligned with brand
- Well-proportioned white space and clean layouts
- Light, immersive experience
- Clear hierarchy (subtle shadows, modular cards)
- Refined rounded corners; delicate micro-interactions; comfortable proportions

## Acceptance

- [ ] Component gallery under `artifact_root` shows primary variants/states; Dialog preview included
- [ ] Device frames for mobile and desktop
- [ ] Theme variables align with mid-fi tokens under `artifact_root`; implementable in Tailwind/shadcn
- [ ] If mobile focus: `mobile-ui-design.html` under `artifact_root` covers all app screens per design principles

## Conventions

- Theme variables must align with mid-fi tokens and work in Tailwind/shadcn without refactoring.
