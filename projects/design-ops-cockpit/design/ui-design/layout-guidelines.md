# Layout guidelines

## Grid

- Page max 72rem, `--sp-8` gutters (`--sp-4` under 640px).
- Review: 1.6fr artifact + 20rem decision rail. Stack under 800px.
- Intake: form + preview rail (desktop only).

## Spacing

Use `--sp-*` only. Module padding `--sp-6`. Header border `--stroke-rule` `--ink`.

## Elevation

None. `--shadow: none`. Hierarchy is the 2px ink rule and the 4px accent rail.

## Motion

`--transition` (150ms ease). Honor `prefers-reduced-motion` (shipped in `base.css`). No decorative animation.

## Density

Comfortable, not compact SaaS. One primary action per surface. Type does the talking (`--type-display` / `--type-heading` / `--type-label`).
