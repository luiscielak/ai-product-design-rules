# Run overview

**FRs:** FR-003, FR-007, FR-008

## Frame

- Header: project_name + status badge (`in-progress` or `complete`).
- Desktop: horizontal stepper (6 segments). Current segment uses `--stroke-rule` `--ink`; completed uses `--accent` fill on a 4px track; locked uses `--border-light`.
- Body: `.data-table` of stages.

## Component instances

| Instance | Component | Props |
| --- | --- | --- |
| Stepper | custom | 6 items, not a tablist |
| Status | Badge | draft / review / complete |
| Review | Button primary | only on `current` |
| View | Link | approved rows |
| Locked | meta text | no control |

## States

| State | Treatment |
| --- | --- |
| default | mixed approved / current / locked |
| hover | Review hover; View underline |
| focus | Review `--focus` |
| disabled | locked rows have no button |
| loading | table skeleton |
| error | `.alert-danger` "Run not found" |
| success | n/a |
| empty | should not happen after intake |

## Transitions

- Review → stage-review.
- View → stage-review (read-only).
- After approving stage 6, this screen is replaced by run-complete.

## Responsive

- Mobile: stepper collapses to "3 of 6" meta; stages are stacked modules.
