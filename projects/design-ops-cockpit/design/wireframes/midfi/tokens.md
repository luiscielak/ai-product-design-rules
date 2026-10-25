# Mid-fi tokens — Design Ops Cockpit

**design_system:** `konstrukt`
**Source:** Konstrukt v2.0.0 generated build output, vendored at `vendor/konstrukt-2.0.0/`.
**Files:** `dist/css/konstrukt.css`, `dist/css/base.css`, `dist/css/theme.js`, `dist/tokens.json`.
**Rule:** document **CSS custom property names only**. Do not hand-type hex. Values live in the generated CSS.

Light is `:root`. Dark is `[data-mode="dark"]` (legacy alias `[data-theme="dark"]`) set on `<html>` by `HLTheme`. Palette is `atelier` only.

## Spacing

| Token | Role |
| --- | --- |
| `--sp-1` | XS gap |
| `--sp-2` | S control padding |
| `--sp-3` | compact stack |
| `--sp-4` | M stack / page inset |
| `--sp-5` | mid stack |
| `--sp-6` | module padding |
| `--sp-8` | L page padding / nav gap |
| `--sp-12` | page top |
| `--sp-16` | page bottom / footer gap |

Map to Tailwind only as `spacing` aliases of these variables if Tailwind is present. Prefer `var(--sp-*)` directly.

## Typography — 8 roles

Use the font shorthand, then tracking and transform:

```css
h1 { font: var(--type-display); letter-spacing: var(--type-display-tracking); text-transform: var(--type-display-transform); }
```

| Role | Font | Tracking | Transform |
| --- | --- | --- | --- |
| display | `var(--type-display)` | `var(--type-display-tracking)` | `var(--type-display-transform)` |
| heading | `var(--type-heading)` | `var(--type-heading-tracking)` | `var(--type-heading-transform)` |
| subheading | `var(--type-subheading)` | `var(--type-subheading-tracking)` | `var(--type-subheading-transform)` |
| label | `var(--type-label)` | `var(--type-label-tracking)` | `var(--type-label-transform)` |
| badge | `var(--type-badge)` | `var(--type-badge-tracking)` | `var(--type-badge-transform)` |
| body | `var(--type-body)` | `var(--type-body-tracking)` | `var(--type-body-transform)` |
| meta | `var(--type-meta)` | `var(--type-meta-tracking)` | `var(--type-meta-transform)` |
| mono | `var(--type-mono)` | `var(--type-mono-tracking)` | `var(--type-mono-transform)` |

Families: `var(--font-display)` (Space Grotesk), `var(--font-sans)` (Inter), `var(--font-mono)`.
Weights: `var(--type-weight-regular|medium|semibold|bold)`.
Sizes: `var(--type-size-10)` … `var(--type-size-56)`.

## Color — semantic roles

Surfaces: `--bg`, `--bg-alt`, `--surface`
Type: `--text`, `--text-muted`
Structure: `--ink`, `--border`, `--border-light`
Accent (one teal): `--accent`, `--accent-soft`, `--accent-light`, `--on-accent`, `--focus`
Feedback: `--success`, `--success-bg`, `--warning`, `--warning-bg`, `--danger`, `--danger-bg`, `--info`, `--info-bg`
Status: `--status-draft`, `--status-draft-bg`, `--status-review`, `--status-review-bg`, `--status-complete`, `--status-complete-bg`, `--status-in-progress`, `--status-in-progress-bg`, `--status-launched`, `--status-launched-bg`
Category (map product names onto numbers): `--category-1` … `--category-5` and `-bg`
Selection: `--selection-bg`, `--selection-fg`

Do not emit primitive ramps (`color.teal.700`, etc.). They are not CSS custom properties.

## Radius, shadow, stroke

| Token | Meaning |
| --- | --- |
| `--radius` | `0px` — square corners |
| `--shadow` | `none` — no elevation |
| `--stroke-hairline` | card / table hairlines |
| `--stroke-rule` | 2px ink rule (module tops, nav underline, table header) |
| `--stroke-rail` | 4px accent rail |
| `--transition` | motion |

No gradient tokens. Do not add `rounded-*`, `shadow-*`, or gradient utilities.

## Focus and motion

- Focus ring: `outline: var(--stroke-rule) solid var(--focus)` (teal, not a second ink rule).
- Honor `prefers-reduced-motion` (already in `base.css`).

## Contrast

Konstrukt v2.0.0 ships an 80-pair WCAG 2.2 AA gate (`npm run check:contrast`). New text-on-fill pairs must be added there — do not invent unchecked combinations in this product.
