# Mid-fi components — Design Ops Cockpit

**design_system:** `konstrukt`. Inventory required by the rules, mapped onto Konstrukt portable classes from `base.css`. No rounded corners, shadows, or gradients.

Shared states for interactive controls: default, hover, focus (`:focus-visible` + `--focus`), disabled (opacity 0.45), loading, error (`--danger`), success (`--success`).

Keyboard: Tab moves through controls in DOM order. Enter/Space activate buttons. Esc closes dialog. Focus is never `outline: none` without a `:focus-visible` replacement.

## Button

- **Anatomy:** label only (no icon required). One primary per surface.
- **Classes:** `.btn-primary` (teal fill, `--on-accent` text) · `.portal-quiet-btn` (hairline `--border`)
- **Props:** `type`, `disabled`, `aria-busy` (loading)
- **States:** hover darkens via `color-mix` against `--ink`; disabled not-allowed; loading sets `aria-busy` and disables
- **Keyboard:** Enter / Space. Focus order = DOM order.
- **Usage:** Approve = primary. Request revision / Cancel / Retry = quiet.

## Input

- **Anatomy:** `.field` > `label` + `.input` + optional `.field-hint` / `.field-error`
- **Props:** `name`, `required`, `aria-invalid`, `aria-describedby`
- **States:** placeholder `--text-muted`; invalid border `--danger`; focus-visible `--focus` rule, offset 0
- **Keyboard:** Tab in, type, Tab out.

## Select

- Native `<select class="input">` inside `.field`. Same states as Input.
- Used for `design_system` (read-mostly, value `konstrukt`).

## Card (module / index-card)

- **Anatomy:** `.module` or `.index-card` — hairline `--border-light`, **2px `--ink` top rule**, `--sp-6` padding. Optional `.accent-left` (4px `--accent` rail).
- **Hover (index-card):** left rail appears. No lift, no shadow.
- **Keyboard:** if the card is a link, it is one tab stop.

## Dialog

- Konstrukt does not ship a dialog primitive. Product overlay: `--surface` panel, `--stroke-rule` ink top, no radius/shadow. Backdrop is `--ink` at low opacity (color-mix), not a blur gradient.
- **Roles:** `role="dialog"`, `aria-modal="true"`, labelled by title.
- **Keyboard:** focus trap; Esc closes; initial focus on the first field or primary button.

## Sheet

- Not used in MVP. If needed later: full-height `.module` from the right edge, same tokens as Dialog. No swipe chrome.

## Toast (alert)

- **Class:** `.alert` + `.alert-success|warning|danger|info`
- **Anatomy:** 4px rail in `currentColor`, tinted `*-bg` fill.
- **Keyboard:** if it is an error on submit, attach it to the field with `aria-describedby` rather than a disappearing toast.

## Tabs

- Implemented as `.site-nav .nav-links a` with `.active` (2px `--accent` underline).
- **Keyboard:** Left/Right when the tablist is focused; otherwise ordinary links.

## Pagination

- Quiet buttons. Unused in MVP lists (runs are short). Documented for inventory completeness.

## Table

- **Class:** `.data-table` inside `.table-scroll`
- **Anatomy:** `--type-label` headers, `--stroke-rule` header border, hairline rows.
- **Keyboard:** `.table-scroll` is focusable when it overflows.

## Navbar

- **Class:** `.site-nav`
- **Anatomy:** `.nav-brand` | `.nav-links` | mode toggle | `(O)` Luis
- **Focus order:** brand → links → toggle → avatar (non-interactive in MVP).

## Sidebar (decision rail)

- Desktop stage-review only. `.module.accent-left` containing stage meta + decision buttons.
- **Focus order:** artifact links first, then Approve, then Request revision.

## Product-specific

| Name | Class / pattern | Notes |
| --- | --- | --- |
| Status badge | `.badge` + `.badge-draft\|review\|complete\|in-progress\|launched` | Maps to `status-*` roles |
| Stage stepper | hairline track + `--stroke-rule` current segment | No pills |
| Artifact pane | `.module` + `.mono` / iframe | Empty / loading / error variants |
| Mode toggle | `HLTheme.toggleMode()` | Sets `data-mode` on `<html>` |
