# Color roles — Design Ops Cockpit

All values come from Konstrukt `dist/tokens.json` / `konstrukt.css`. This file names **roles**, not hex.

| Role | Use | Contrast note |
| --- | --- | --- |
| `--bg` | Page | Text `--text` is a gated pair |
| `--bg-alt` | Recessed artifact pane | |
| `--surface` | Modules, nav, fields | Control outline `--border` must hold 3:1 |
| `--text` | Body | 4.5:1 on `--bg` / `--surface` |
| `--text-muted` | Meta, labels | Gated on surfaces |
| `--ink` | 2px rules, brand | Structural, matches text today |
| `--border` | Interactive outlines | 3:1 vs `--surface` |
| `--border-light` | Decorative hairlines | Exempt from the contrast gate |
| `--accent` | The one primary action, links | Teal. Not a second brand |
| `--on-accent` | Text on solid accent | |
| `--focus` | Focus ring | Teal, never a second ink rule |
| `--success` / `-bg` | Approved, complete | |
| `--warning` / `-bg` | Revision notes, in-progress | |
| `--danger` / `-bg` | Validation / load errors | |
| `--info` / `-bg` | Empty-but-ok messages | |
| `--status-*` | Stage badges | Link to feedback roles |
| `--category-1`…`5` | Unused in MVP; reserved | Do not invent product hues |

No gradients. No extra brand ramp. Dark mode is a second resolved set, not runtime mixing (except the few `color-mix` hover recipes already in `base.css`).
