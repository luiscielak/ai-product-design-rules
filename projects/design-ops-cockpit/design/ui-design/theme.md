# Theme — Design Ops Cockpit

**design_system:** `konstrukt` v2.0.0
**theme input:** `both` (light default, dark via `data-mode`)
**brand_color / accent_color:** ignored. Atelier is fixed. Do not hand-type hex.

## How to apply

```html
<html data-mode="light" data-palette="atelier">
<link rel="stylesheet" href="../../vendor/konstrukt-2.0.0/konstrukt.css">
<link rel="stylesheet" href="../../vendor/konstrukt-2.0.0/base.css">
<script src="../../vendor/konstrukt-2.0.0/theme.js"></script>
```

```js
HLTheme.setMode("dark"); // or toggleMode()
```

## CSS custom properties (from `dist/css/konstrukt.css`)

Light is `:root`. Dark overrides live under `[data-mode="dark"]`.

Use only these names in product CSS:

- Surfaces: `--bg` `--bg-alt` `--surface`
- Type: `--text` `--text-muted`
- Structure: `--ink` `--border` `--border-light`
- Accent: `--accent` `--accent-soft` `--accent-light` `--on-accent` `--focus`
- Feedback: `--success` `--success-bg` `--warning` `--warning-bg` `--danger` `--danger-bg` `--info` `--info-bg`
- Status / category / selection: see mid-fi `tokens.md`
- Type roles: `--type-display` … `--type-mono`
- Space: `--sp-1` … `--sp-16`
- Stroke: `--stroke-hairline` `--stroke-rule` `--stroke-rail`
- Chrome: `--radius` `--shadow` `--transition`

## Tailwind mapping

If Tailwind is present, alias colors to `var(--*)`. Do **not** use `rounded-*`, `shadow-*`, or gradient utilities. The prototype uses Konstrukt classes and a few layout utilities only.

## Implementable without refactoring

The prototype already imports the generated CSS. Hi-fi does not introduce a second token set.
