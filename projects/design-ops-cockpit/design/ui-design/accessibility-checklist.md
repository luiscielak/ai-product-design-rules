# Accessibility checklist (WCAG 2.2 AA)

- [x] Text and control pairs rely on Konstrukt's 80-pair contrast gate. No new unchecked combinations.
- [x] `:focus-visible` uses `--focus` (2px teal rule). Never `outline: none` without a replacement.
- [x] Form fields have `<label>`, `aria-invalid`, and `aria-describedby` for errors.
- [x] Buttons expose `aria-busy` while pending; disabled while launching / saving.
- [x] Empty, loading (`aria-busy`), and error states exist on Home, intake, and review.
- [x] Locked stages are not actionable.
- [x] Mode toggle has `aria-pressed`.
- [x] Wide tables sit in `.table-scroll` which is keyboard-focusable.
- [x] Reduced motion is respected via `base.css`.
- [x] Single operator, but the UI is operable by keyboard alone.

## Keyboard map

| Control | Keys |
| --- | --- |
| Links / buttons | Tab, Enter / Space |
| Fields | Tab, type |
| Mode toggle | Enter / Space |
| Dialog (gallery demo) | Esc closes; focus moves to the panel |
