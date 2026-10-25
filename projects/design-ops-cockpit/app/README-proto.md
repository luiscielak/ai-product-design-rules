# Prototype notes — Design Ops Cockpit

**Command:** `/ui-proto`
**design_system:** `konstrukt` (inherited)
**Framework:** Next.js App Router (16) + TypeScript
**Package manager:** npm
**Theming:** both (`data-mode` via `HLTheme`)
**Data:** mock + `localStorage`

## How to run

```bash
cd app
npm install
npm run dev
```

## What was installed

- Next.js, React, Tailwind v4 (layout utilities only)
- **Not** shadcn/ui
- Vendored Konstrukt v2.0.0: `src/styles/konstrukt/{konstrukt.css,base.css}` and `public/konstrukt/theme.js`

## Routes

| Route | Screen |
| --- | --- |
| `/` | Home / run list |
| `/brief` | Brief intake |
| `/runs/[id]` | Run overview |
| `/runs/[id]/stages/[stage]` | Stage review |
| `/runs/[id]/stages/[stage]/revision` | Revision request |
| `/runs/[id]/complete` | Run complete |

## Components

`.site-nav`, `.btn-primary`, `.portal-quiet-btn`, `.field`, `.input`, `.module`, `.badge`, `.data-table`, `.alert`, `ModeToggle`, `Shell`.

## Known gaps

- Artifacts are fixtures, not live file reads from `design/`.
- Revision stores a note only; it does not re-run the agent.
- `/ui-proto` ran before `/hifi` (operator order). Styling used mid-fi + Konstrukt `dist/`, then hi-fi was aligned after.
- Marketing is a static page, not this Next app.

## Gaps vs rules

- Rules list hi-fi as a `/ui-proto` prerequisite; README says either order after mid-fi.
- Rules inventory includes Sheet / Toast / Pagination; unused in MVP.
