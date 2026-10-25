# Run complete

**FRs:** FR-003, FR-009

## Frame

- Header badge `complete`.
- Desktop stepper all six segments `--accent` track.
- Summary `.data-table`: stage, artifact path, revisions, View.

## Component instances

| Instance | Component | Props |
| --- | --- | --- |
| View | Link | read-only stage-review |
| Back to runs | Quiet button | → home |

## States

| State | Treatment |
| --- | --- |
| default | full summary |
| hover | View underline |
| focus | Back / View |
| disabled | n/a |
| loading | unlikely; skeleton if hydrating |
| error | `.alert-danger` if run missing |
| success | n/a |
| empty | treat as error |

## Transitions

- View → stage-review approved.
- Back → home (run listed as Complete).

## Responsive

- Mobile: stacked complete modules instead of the table.
