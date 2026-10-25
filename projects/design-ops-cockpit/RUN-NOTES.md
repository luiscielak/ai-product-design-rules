# Run notes — Design Ops Cockpit

Pipeline run on 2026-10-25 against `.cursorrules .yaml` **after** adding `design_system: shadcn | konstrukt` (default `shadcn`). This run used **`konstrukt`**.

Meeting context (not in the rules): Luis has described this pipeline as brief → PRD → lo-fi → mid-fi → design system / hi-fi → prototype, with review at mid-fi and shadcn/Tailwind as the swap-the-config default ([Luis / Nathaniel, 4 Aug 2026](https://notes.granola.ai/d/1c638266-cbbf-4214-ae24-7476ba74d7bf)). No meeting recorded a Konstrukt parameter; that constraint came from this brief.

I followed the **rules file** for output paths (`docs/PRD.md`, `design/wireframes/…`, `design/ui-design/`, `app/`), not the README (`docs/wireframes/…`). Command order was the operator order: `/new-project` → `/prd` → `/lofi` → `/midfi` → `/ui-proto` → `/hifi`.

## Verdicts

| Stage | Verdict | One line |
| --- | --- | --- |
| `/new-project` | **okay** | Tree is usable; paths and “two Next apps” are underspecified. |
| `/prd` | **good** | Outline is complete and produced an actionable MVP PRD. |
| `/lofi` | **good** | ASCII conventions and FR mapping are clear enough to execute. |
| `/midfi` | **okay** | Konstrukt branch works; the required component inventory is still shadcn-shaped. |
| `/ui-proto` | **weak** | Prerequisites, stack commands, and Konstrukt consumption are contradictory. |
| `/hifi` | **okay** | Gallery is specified; default principles still fight Swiss tokens. |

---

## `/new-project` — okay

### Unclear / contradictory

- README says artifacts live under `docs/wireframes/` and `docs/ui-design/`. The rules write `design/wireframes/` and `design/ui-design/`. I used the rules. A later agent will put files in the other tree.
- `/new-project` says scaffold a Next.js + shadcn app **and** `/ui-proto` says scaffold the app if missing. Two stages own the same directory.
- `include_marketing: true` asks for “Basic Next.js setup for marketing pages” plus a waitlist. That is a second app with its own `npm run dev`, but acceptance is written as if there is one app.
- Workflow header says “five sequential stages” and then lists six. `/hifi` is listed before `/ui-proto` here, opposite the README recommended sequence.

### Weak output

- Without the new `design_system` field, this stage would have installed shadcn for a Konstrukt run.
- Empty `docs/PRD.md` template is fine; `app/` was an empty folder until `/ui-proto` because scaffolding twice would fight.

### Suggested rule fix

1. Pick one artifact root (`design/` **or** `docs/`) and make README match the yaml.
2. Say `/new-project` creates folders + README only; `/ui-proto` is the only stage that runs `create-next-app`.
3. If marketing is in scope, specify **static HTML** or a route in the same app — not a second Next.js project.

---

## `/prd` — good

### Unclear / contradictory

- Required inputs (`stakeholders`, `timeline`, `success_metrics`…) are listed but the command says “ask once, then proceed with best assumptions.” In a batch / cockpit run there is no ask. I inferred from the brief.
- “If project_name not provided, infer from current directory” assumes the agent `cd`s into the project. From the repo root that inference is ambiguous.

### Weak output

- None serious. The outline produced a complete MVP PRD with numbered FRs, stories, Gherkin, and metrics that have target / timeframe / method.

### Suggested rule fix

- Add: “If invoked with a free-text brief, extract required fields and **write Assumptions** for anything invented. Do not block.”
- Require `project_name` as an explicit argument so the file always lands in `projects/{name}/docs/PRD.md`.

---

## `/lofi` — good

### Unclear / contradictory

- Prerequisites point at `design/wireframes/lofi/`; README still says `docs/wireframes/lofi/`.
- Required `screens` / `key_content` were not in the brief. I derived six screens from the primary flows. That is the right move, but the rule does not say “derive screens from PRD flows when the list is missing.”
- “Every FR has at least one corresponding screen/section” is good. Empty/loading/error “for core interactions” does not say which interactions are core.

### Weak output

- ASCII cannot show Konstrukt. That is fine — lo-fi should stay chrome-free. The legend mentioning `--sp-*` is extra credit, not required.

### Suggested rule fix

- “If `screens` is omitted, derive them from PRD primary flows and list the mapping in `legend.md`.”
- Name the three core interactions that must show empty/loading/error (for this product: list, intake submit, artifact load).

---

## `/midfi` — okay

### Unclear / contradictory

- Even after the Konstrukt branch, the **inventory is shadcn**: Dialog, Sheet, Toast, Tabs, Pagination, Sidebar. Konstrukt ships `.module`, `.btn-primary`, `.field`, `.badge`, `.data-table`, `.alert`. I mapped the inventory onto those classes. A less careful agent will draw rounded shadcn cards and call it mid-fi.
- Acceptance still says “mappable to Tailwind/shadcn” in spirit unless the agent reads the new sentence.
- `ui.html` “device frames” are unspecified (size, chrome, how to load CSS). Easy to emit a markdown-looking HTML file that ignores tokens.

### Weak output

- Mid-fi screens are structured but prose-heavy. The only visual proof is `ui.html`. If that file does not actually `<link>` `konstrukt.css`, the Konstrukt requirement is theater.
- I vendored `dist/` twice (`vendor/` and `design/vendor/`) because the rules never say where generated CSS lives.

### Suggested rule fix

1. Split the inventory: `shadcn` keeps the current list; `konstrukt` requires `.site-nav`, `.module`, `.btn-primary`, `.portal-quiet-btn`, `.field`, `.input`, `.badge`, `.data-table`, `.alert`, `.index-card`.
2. Require `ui.html` to link the vendored `konstrukt.css` + `base.css` + `theme.js` when `design_system` is konstrukt, and to include a mode toggle.
3. Name a single vendor path: `projects/{name}/vendor/konstrukt-2.0.0/`.

---

## `/ui-proto` — weak

### Unclear / contradictory

- **Prerequisite fight:** this file says mid-fi **and hi-fi** must exist; “ask or proceed.” README says `/ui-proto` and `/hifi` can run in either order after mid-fi. Operator order was proto then hi-fi. I proceeded. Another agent will stop and wait.
- Standard commands always `npx shadcn@latest init` and `add … radio-switch` (not a real shadcn component). The new Konstrukt skip is easy to miss next to a copy-paste block.
- `create-next-app` flags in the rules are stale (`--no-import-alias`; current CLI is interactive without `--yes`). Today’s scaffold is Next 16 + Tailwind 4 + `cacheComponents`.
- Konstrukt’s npm package is **`private`: true**. The rules say consume `dist/` but not *how* (vendor files vs git submodule vs workspace package). I copied generated CSS into the app.
- Output path mix: `src/app/` vs `app/(routes)/` vs `components/ui` at the `app/` root.

### Weak output

- Without extra discipline, `/ui-proto` will install shadcn, use `rounded-xl shadow-lg`, and ignore mid-fi tokens.
- “No TypeScript or ESLint errors” is an acceptance line with no command to run.
- Artifact viewer in this prototype is fixtures, not a file reader — the rules never say how a prototype should *load* the files the other stages wrote.

### Suggested rule fix

1. Change the prerequisite to: “mid-fi required; hi-fi optional. If hi-fi is missing, style from mid-fi tokens.”
2. Replace the shadcn command block with two exclusive setup recipes. For konstrukt: vendor `v2.0.0` `dist/css/{konstrukt.css,base.css,theme.js}`; forbid `rounded-*` / `shadow-*` / gradients; do not run shadcn.
3. Add a smoke check: `npm run build` (not just `npm run dev`) and “screenshot light + dark of the primary flow.”

---

## `/hifi` — okay

### Unclear / contradictory

- Defaults: `theme: dark`, required `brand_color` / `accent_color`. For Konstrukt those inputs are wrong (atelier + `data-mode`). The new “ignored when konstrukt” line helps, but the command example in the README still passes `#5B8DEF`.
- **Design principles** (even scoped to mobile) mandate soft gradients, subtle shadows, refined rounded corners. That is the opposite of Konstrukt. An agent that reads “for mobile UI focus” as “for the product” will paint gradients on the gallery.
- Technical requirements: “Use only black or white text” breaks teal `--accent` / `--on-accent` and the status roles.
- Acceptance: “implementable in Tailwind/shadcn without refactoring” fights a Konstrukt proto that deliberately skipped shadcn.

### Weak output

- The gallery is the only visual hi-fi. Markdown theme docs that list variable names are correct but easy to skip.
- No instruction to reuse mid-fi `ui.html` screens in the gallery, so hi-fi and mid-fi can drift.

### Suggested rule fix

1. When `konstrukt`, replace the principle list entirely (already drafted) and **do not** leave the shadcn principle list in-scope for that run.
2. Drop “black or white text only.” Say “use gated role pairs; teal is the one accent.”
3. Require `component-gallery.html` to load the same vendored CSS as mid-fi and to include the same mode toggle.

---

## Cross-cutting

- Filename `.cursorrules .yaml` (space) is easy to miss in tools and docs. README already warns; keep it, or rename in a later PR.
- Persist `design_system` in the project README (done). A machine-readable `project.json` would be better so later commands do not re-parse prose.
- The cockpit product in `hooman-loop` was **not** edited. This tree is the rules-repo proof only.

## What I would change first (top 3)

1. **One artifact path, one sequence.** Align README and yaml (`design/` vs `docs/`; hi-fi prerequisite vs optional).
2. **Exclusive stack recipes.** shadcn *or* Konstrukt setup commands; Konstrukt vendors `dist/` and bans radius/shadow/gradient.
3. **Konstrukt-native mid-fi/hi-fi inventory and principles.** Stop asking a Swiss system to emit Sheet/Toast/rounded-gradient chrome.
