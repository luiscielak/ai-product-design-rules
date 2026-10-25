# Lo-fi legend — Design Ops Cockpit

Shared symbol map for every screen in this folder.

## Symbols

| Symbol | Meaning |
| --- | --- |
| `+------+` / `\| … \|` | Container / region |
| `[IMG:w×h]` | Image |
| `(O)` | Avatar |
| `[*]` | Icon |
| `[Button: Label]` | Button |
| `[Input: Placeholder]` | Text input |
| `[Textarea: Placeholder]` | Multiline input |
| `[Select: Value]` | Select |
| `[x] Label` / `[ ] Label` | Checkbox |
| `[S1]`, `[S2]` | Section labels |
| `[A1]`, `[A2]` | Annotation hooks (see each file) |
| `>>>` | Primary forward action |
| `<<<` | Back |

## Grid and spacing

- **XS** 4px (`--sp-1`) — icon gaps
- **S** 8px (`--sp-2`) — control padding
- **M** 16px (`--sp-4`) — stack gaps
- **L** 32px (`--sp-8`) — page padding
- Desktop content max ~72rem. Mobile is a single column.

Konstrukt is not applied visually at lo-fi (no chrome). Spacing hints match the token names so mid-fi can map 1:1.

## Navigation

- Top bar: product name left, mode toggle + Luis avatar right.
- Home is the run list. A run opens overview. A current/approved stage opens review.
- Locked stages are visible but not actionable.

## States to show on core screens

- **Empty:** no runs; no artifact yet; empty revision note.
- **Loading:** submitting brief; loading artifact.
- **Error:** invalid kebab-case; missing artifact file; empty revision note on submit.
