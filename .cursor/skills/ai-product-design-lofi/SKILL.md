---
name: ai-product-design-lofi
description: Produces mobile and desktop ASCII lo-fi wireframes with annotations and flow hooks. Use when the user says /lofi, wants lo-fi wireframes, ASCII wireframes, or to explore UX structure and flows before visual design.
---

# Lo-Fi Wireframes (UX Designer)

Produce mobile/desktop ASCII wireframes with annotations and flow hooks. No visual polish—focus on structure and flow.

## Pipeline

Stage in the `ai-product-design` chain:
`scaffold → /prd → /lofi → /midfi → /hifi → /ui-proto`.

- Previous: `/prd` (ai-product-design-prd) — read `PRD.md` for FRs to cover
- Next: `/midfi` (ai-product-design-midfi)

To run the whole chain in one pass, use the `ai-product-design-workflow`
orchestrator.

## Inputs

| Input | Notes |
|-------|--------|
| `screens` | List of screen names |
| `primary_flows` | e.g. onboarding, core-task |
| `key_content` | Per-screen (what appears where) |
| `breakpoints` | default: mobile, desktop |

## Artifact root

All deliverables for this product go under a single **`artifact_root`**:

1. **Definition:** `artifact_root` is the directory that contains this product’s `PRD.md` and/or `DESIGN-BRIEF.md` (same folder is ideal). If files are split, prefer the folder the user attached or the one containing `PRD.md`.
2. **Resolve in order:** (a) Parent directory of an attached or @-referenced `PRD.md` / `DESIGN-BRIEF.md`; (b) explicit path the user gives for the product docs folder; (c) **greenfield only** (`/new-project` or PRD with no path): `projects/{project_name}/docs/`.
3. **Do not** default to repo-global `docs/wireframes/`, `docs/ui-design/`, or root `docs/PRD.md` when `artifact_root` is known.

## Output

**Directory:** `{artifact_root}/wireframes/lofi/`

- `<screen>-mobile.txt`, `<screen>-desktop.txt` per screen
- `legend.md` (symbols and annotations)

## ASCII Conventions

| Element | Notation |
|---------|----------|
| Container | `+------+` `| content |` `+------+` |
| Image | `[IMG:w×h]` |
| Avatar | `(O)` |
| Icon | `[*]` |
| Button | `[Button: Label]` |
| Input | `[Input: Placeholder]` |
| Select | `[Select: Value]` |
| Checkbox | `[x] Label` |
| Sections | `[S1]`, `[S2]` … |
| Annotations | `[A1]`, `[A2]` … |

## Acceptance

- [ ] Every FR in the PRD has at least one corresponding screen/section (under `artifact_root`)
- [ ] Empty, loading, and error states shown for core interactions
- [ ] Legend explains all symbols used

## Conventions

- Match PRD FRs to screens/sections so traceability is clear.
