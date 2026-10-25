# Stage review

**FRs:** FR-004, FR-005, FR-006, FR-007, FR-009

## Frame

- Desktop: artifact `.module` (2fr) + decision rail `.module.accent-left` (1fr).
- Mobile: artifact stacked above a sticky decision bar.
- Artifact: markdown `<pre class="mono">`, file list, or iframe (`ui.html`, gallery).

## Component instances

| Instance | Component | Props |
| --- | --- | --- |
| Approve | Button primary | hidden when approved |
| Request revision | Quiet button | → revision-request |
| Retry | Quiet button | error only |
| Last note | Alert warning | shown if rev > 0 |
| Path | meta | rules path, not README path |

## States

| State | Treatment |
| --- | --- |
| default | artifact + decisions |
| hover | primary / quiet |
| focus | Approve first in the rail |
| disabled | Approve disabled while posting |
| loading | "Reading artifact…" in pane, `aria-busy` |
| error | `.alert-danger` in pane |
| success | navigate back to overview |
| empty | `.alert-info` "No files yet" |
| approved | rail shows badge only |

## Transitions

- Approve → overview with next stage current (or run-complete if stage 6).
- Request revision → revision-request.

## Responsive

- Sticky decision bar on mobile uses `--surface` and a top `--stroke-rule`, no shadow.
