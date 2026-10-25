# Revision request

**FRs:** FR-006, FR-007, FR-011

## Frame

- Desktop: note form + "this will" rail (keep stage current, increment rev, leave next locked, do not spawn agent).
- Mobile: form only; consequences as `.alert-info` above the textarea.

## Component instances

| Instance | Component | Props |
| --- | --- | --- |
| note | Textarea.input | required |
| Send revision | Button primary | submit |
| Cancel | Quiet button | back, no save |

## States

| State | Treatment |
| --- | --- |
| default | empty note |
| hover | primary / quiet |
| focus | textarea `--focus` |
| disabled | both buttons while saving |
| loading | "Saving note…" |
| error | `.field-error` if empty |
| success | back to stage-review with note visible |
| empty | default |

## Transitions

- Send → stage-review (same stage, `current`, rev+1).
- Cancel → stage-review unchanged.

## Responsive

- Rail drops below the form on narrow viewports.
