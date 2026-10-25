# Home

**Breakpoints:** mobile (single column) · desktop (table)
**FRs:** FR-008, FR-010, FR-011

## Frame

- Grid: page max 72rem, `--sp-8` horizontal padding (`--sp-4` on mobile).
- `[S1]` `.site-nav` with brand, "New brief" (desktop), mode toggle, avatar.
- `[S2]` `.page-header` — heading "Runs", meta "Single operator · Luis".
- Body: empty `.module` **or** `.data-table` of runs **or** loading **or** `.alert-danger`.

## Component instances

| Instance | Component | Props |
| --- | --- | --- |
| New brief | Button primary | label "New brief" → `/brief` |
| Mode | Quiet button | `aria-pressed` reflects `data-mode` |
| Run row | Table / index-card | project_name, status badge, current stage |
| Open | Quiet button / link | → `/runs/{id}` |
| Retry | Quiet button | re-hydrate fixtures |

## States

| State | Treatment |
| --- | --- |
| default | table or empty module |
| hover | index-card left rail / table link underline |
| focus | `--focus` rule on New brief and Open |
| disabled | n/a |
| loading | 3 hairline placeholder rows, `aria-busy` |
| error | `.alert-danger` + Retry |
| success | n/a (navigation) |
| empty | copy + primary "New brief" |

## Transitions

- New brief → brief-intake.
- Open → run-overview (or run-complete if status is complete).

## Responsive

- Mobile: cards, primary button full-width at the header.
- Desktop: table with Status / Stage / Revisions / Action columns.
