# Prototype notes — Design Ops Cockpit

**Command:** `/ui-proto` (re-run after exclusive-stack rule fix)
**design_system:** `konstrukt` (inherited)
**Recipe:** Konstrukt exclusive — **no** Tailwind, **no** shadcn
**Framework:** Next.js App Router (16) + TypeScript
**Package manager:** npm
**Theming:** both (`data-mode` via `HLTheme`)
**Data:** mock + `localStorage`
**Hi-fi:** optional; this project has `design/ui-design/` and mid-fi tokens. Visual source is vendored Konstrukt `v2.0.0` + mid-fi classes.

## How to run

```bash
cd app
npm install
npm run dev
```

Smoke: `npm run build` and `npm run lint`.

## Exclusive recipe used

1. Source of truth: `../vendor/konstrukt-2.0.0/` (copied from [Konstrukt v2.0.0](https://github.com/the-hooman-loop/konstrukt) `dist/` — package is private, not installed from npm).
2. Runtime copies: `public/konstrukt/{konstrukt.css,base.css,theme.js}`.
3. Root layout `<link>`s those stylesheets and loads `theme.js` with `beforeInteractive`.
4. Product CSS (`src/app/globals.css`) only uses `var(--*)` and Konstrukt class names.
5. Banned: `rounded-*`, `shadow-*`, `bg-gradient-*`, `box-shadow`, `border-radius` except `var(--radius)`.

Before this re-run the app imported Tailwind v4 and processed a stripped `konstrukt.css` through that pipeline (see git history at `d9eba6e`). That mix is gone.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Home / run list |
| `/brief` | Brief intake |
| `/runs/[id]` | Run overview |
| `/runs/[id]/stages/[stage]` | Stage review |
| `/runs/[id]/stages/[stage]/revision` | Revision request |
| `/runs/[id]/complete` | Run complete |

## Components (Konstrukt inventory)

`.site-nav`, `.btn-primary`, `.portal-quiet-btn`, `.field`, `.input`, `.module`, `.badge`, `.data-table`, `.alert`, `.question-list`, `ModeToggle`, `Shell`.

## Known gaps

- Artifacts are fixtures, not live file reads from `design/`.
- Revision stores a note only; it does not re-run the agent.
- Marketing is a static page, not this Next app.
