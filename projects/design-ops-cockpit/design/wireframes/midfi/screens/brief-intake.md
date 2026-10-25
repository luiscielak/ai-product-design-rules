# Brief intake

**FRs:** FR-001, FR-002, FR-003, FR-011

## Frame

- Nav + back link.
- Desktop: two columns — form `.module` | preview `.module.accent-left` listing the six stages.
- Mobile: form only; preview omitted.

## Component instances

| Instance | Component | Props |
| --- | --- | --- |
| project_name | Input | required, pattern kebab-case |
| brief | Input (textarea.input) | required, min 1 char |
| design_system | Select | value `konstrukt`, not inventable |
| Launch run | Button primary | submit |
| Stage preview | Table (desktop) | 6 locked rows except #1 current |

## States

| State | Treatment |
| --- | --- |
| default | empty fields, konstrukt selected |
| hover | primary hover mix |
| focus | field `--focus` rule, offset 0 |
| disabled | Launch disabled while `aria-busy` |
| loading | Launch label "Launching…" |
| error | `.field-error` + `aria-invalid` on name/brief |
| success | navigate to run-overview |
| empty | default |

## Transitions

- Valid submit creates a run (FR-002) and routes to run-overview.
- Invalid submit stays; first invalid field takes focus.

## Responsive

- Textarea min-height `--sp-16` mobile, taller on desktop.
- Preview column `minmax(16rem, 20rem)`.
