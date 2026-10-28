# Command reference

Full inputs, outputs, and acceptance criteria for each command. The rule files in [`.cursor/rules/`](../.cursor/rules/) are the source of truth; this page is a readable summary.

Run the commands in this order. Each one reads what the previous one wrote.

```
/new-project → /prd → /lofi → /midfi → /hifi → /ui-proto
```

Output paths below are relative to `projects/{project_name}/`.

---

## `/new-project` (Project Manager)

**Rule:** [`01-new-project.mdc`](../.cursor/rules/01-new-project.mdc)

**Purpose:** Create an organized project structure for AI product design workflows.

**Inputs:**
- `project_name` (kebab-case, e.g., "foto-sage", "chat-assistant")
- `project_type` (default: "ai-product-design")
- `include_marketing` (default: true)

**Output:**
- `projects/{project_name}/` with:
  - `app/` (Next.js + TypeScript + Tailwind + shadcn/ui)
  - `docs/` (PRD and presentations)
  - `design/` (wireframes and UI design)
  - `marketing/` (if requested)
- README templates and basic setup files

**Acceptance:**
- Structure follows the established pattern
- Generated app runs with `npm install && npm run dev`
- README includes setup and usage instructions

---

## `/prd` (Product Owner)

**Rule:** [`02-prd.mdc`](../.cursor/rules/02-prd.mdc)

**Purpose:** Produce a concise, actionable PRD aligned to measurable success metrics.

**Inputs:**
- `product_name`, `target_users`, `key_problem`, `business_goals`, `success_metrics`
- `primary_flows` (list), `constraints`, `assumptions`, `risks`, `stakeholders`, `timeline`
- Optional: a design brief, e.g. `/prd using docs/design-brief.md`. If you don't name one, the rule looks for a brief in `docs/`.

**Output:** `docs/PRD.md`

**Content includes:**
1. Overview: product_name, elevator_pitch, problem_statement
2. Goals and Non-Goals
3. Target Users and Personas
4. User Stories (INVEST) and Primary Flows
5. Scope (MVP vs. Post-MVP)
6. Functional Requirements (FR-001…)
7. Non-Functional Requirements (NFR-001…)
8. Acceptance Criteria (Gherkin-style where useful)
9. Success Metrics (north star + leading indicators)
10. Dependencies and Constraints
11. Assumptions and Open Questions
12. Risks and Mitigations
13. Release Plan and Milestones

**Acceptance:**
- All FRs map to at least one user story and metric
- Each metric has a target, timeframe, and measurement method

---

## `/lofi` (UX Designer)

**Rule:** [`03-lofi.mdc`](../.cursor/rules/03-lofi.mdc)

**Purpose:** Produce mobile/desktop ASCII wireframes with annotations and flow hooks to explore structure and flow quickly without visual polish.

**Inputs:**
- `screens` (list of screen names)
- `primary_flows`
- `key_content` (per screen)
- `breakpoints` (default: mobile, desktop)

**Output:** `design/wireframes/lofi/`
- Files: `<screen>-mobile.txt`, `<screen>-desktop.txt`, `legend.md`

**ASCII conventions:**
- Containers: `+------+ | content | +------+`
- Images: `[IMG:w×h]`, Avatars: `(O)`, Icon: `[*]`, Button: `[Button: Label]`
- Inputs: `[Input: Placeholder]`, Select: `[Select: Value]`, Checkbox: `[x] Label`
- Sections labeled with `[S1]`, `[S2]` ...; notes as `[A1]`, `[A2]`...

**Acceptance:**
- Every FR in PRD has at least one corresponding screen/section
- Shows empty, loading, and error states for core interactions

---

## `/midfi` (Product Designer)

**Rule:** [`04-midfi.mdc`](../.cursor/rules/04-midfi.mdc)

**Purpose:** Convert lo-fi to mid-fi with tokens, components, states, and accessibility notes; generate a unified `ui.html` overview.

**Inputs:**
- `screens` (from lo-fi)
- `states` (default: default/hover/focus/disabled/loading/error/success)
- `content_examples` (short/long)
- `accessibility_targets` (WCAG AA)

**Output:** `design/wireframes/midfi/`
- Files: `tokens.md`, `components.md`, `screens/<screen>.md`, `ui.html`

**tokens.md includes:**
- Spacing: 0, 2, 4, 6, 8, 12, 16, 24, 32 (map to Tailwind)
- Typography: text-xs/sm/base/lg/xl/2xl; line-heights; weights
- Color: neutrals, brand, semantic (map to Tailwind + shadcn themes)
- Radius: sm/md/lg/full; Shadows: sm/md/lg

**components.md:**
- Inventory: Button, Input, Select, Card, Dialog, Sheet, Toast, Tabs, Pagination, Table, Navbar, Sidebar
- Each: anatomy, states, props, interactions, keyboard navigation, focus order

**Acceptance:**
- All interactive elements have defined states and focus styles
- Accessibility notes for color contrast and keyboard support included
- Each screen preview includes device frames: phone (mobile) and browser (desktop) in `ui.html`

---

## `/hifi` (UI Designer)

**Rule:** [`05-hifi.mdc`](../.cursor/rules/05-hifi.mdc)

**Purpose:** Deliver a hi-fi design kit and component gallery ready for engineering handoff. Runs after `/midfi` and before `/ui-proto`, because the prototype applies this theme.

**Inputs:**
- `theme` (light|dark|both, default: dark)
- `brand_color` (hex/HSL)
- `accent_color` (hex/HSL)
- `components` (list, default: shadcn core used in project)
- `app_concept` (optional: for mobile UI design focus)
- `key_features` (optional: for mobile UI design focus)
- `target_users` (optional: for mobile UI design focus)

**Output:** `design/ui-design/`
- Files: `theme.md`, `color-roles.md`, `component-gallery.html`, `layout-guidelines.md`, `accessibility-checklist.md`, `mobile-ui-design.html` (if mobile focus)

**Design principles (for mobile UI focus):**
- Balance elegant minimalism with functional design
- Use soft, refreshing gradient colors aligned with brand palette
- Well-proportioned white space and clean layouts
- Light and immersive user experience
- Clear hierarchy through subtle shadows and modular cards
- Natural focus on core functionalities
- Refined rounded corners
- Delicate micro-interactions
- Comfortable visual proportions

**Acceptance:**
- Component gallery renders primary variants/states for Button, Input, Select, Checkbox, Card, Tabs, Table; Dialog preview included
- Device frames present for mobile and desktop previews
- Theme variables align with tokens and are implementable in Tailwind/shadcn without refactoring
- If mobile UI focus: horizontal `mobile-ui-design.html` with all app screens, following design principles and technical requirements

---

## `/ui-proto` (UI Engineer)

**Rule:** [`06-ui-proto.mdc`](../.cursor/rules/06-ui-proto.mdc)

**Purpose:** Implement a runnable prototype (shadcn/ui + Tailwind), keyboard/focus-accessible, covering primary flows. Reads both the mid-fi screens and the hi-fi theme.

**Inputs:**
- `framework` (default: Next.js App Router, latest stable)
- `package_manager` (npm|pnpm|yarn)
- `ts` (default: true)
- `pages` (list)
- `components` (from mid-fi)
- `routes/flows`
- `data` (mock or live)
- `theming` (light|dark|both)

**Output:**
- Next.js app in `app/` (if new), Tailwind configured, shadcn components installed
- Routes/pages per screens, mock data and API stubs
- `app/README-proto.md` (setup, components, routes, gaps)

**Standard setup commands:**
```bash
# Create app (if needed). --tailwind sets up Tailwind CSS v4 (configured in CSS, no tailwind.config.js)
npx create-next-app@latest projects/{project_name}/app --ts --eslint --src-dir --app --tailwind --no-import-alias

# shadcn/ui
npx shadcn@latest init -y
npx shadcn@latest add button card input label form select dialog sheet sonner tabs table navigation-menu dropdown-menu tooltip avatar badge skeleton pagination textarea checkbox radio-group switch
```

**Acceptance:**
- `npm run dev` works
- Core flows clickable end-to-end with loading/empty/error states
- No TypeScript or ESLint errors; basic responsiveness for mobile and desktop
- Keyboard navigation works for interactive controls; focus outline visible
- Theme matches hi-fi design specifications
