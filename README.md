# AI Product Design Rules

A reusable set of Cursor rules for an end‑to‑end AI product design workflow. Use these rules to spin up a structured project, move from PRD to wireframes and prototypes, and keep artifacts organized and reviewable.

## Overview

These rules define six collaborative roles and commands that move a product from concept to clickable prototype:

1. **Project Manager** → `/new-project` (organized project bootstrap)
2. **Product Owner** → `/prd` (concise, measurable PRD)
3. **UX Designer** → `/lofi` (ASCII lo‑fi wireframes)
4. **Product Designer** → `/midfi` (mid‑fi tokens, components, screens, UI overview)
5. **UI Engineer** → `/ui-proto` (clickable prototype using shadcn/ui + Tailwind)
6. **UI Designer** → `/hifi` (hi‑fi design kit and component gallery)

## Recommended Sequence

```
/new-project → /prd → /lofi → /midfi → /ui-proto → /hifi
```

## Quick Start

### 1) Create a new project
```
/new-project project_name:"my-product" project_type:"ai-product-design" include_marketing:true
```

### 2) Draft the PRD
```
/prd product_name:"my-product" target_users:... key_problem:... business_goals:... success_metrics:... primary_flows:[...]
```

### 3) Explore UX with ASCII lo‑fi
```
/lofi screens:[home, signup, dashboard] primary_flows:[onboarding, core-task] breakpoints:[mobile, desktop]
```

### 4) Define mid‑fi wireframes
```
/midfi screens:[...] states:[default, hover, focus, disabled, loading, error, success]
```

### 5) Build a clickable prototype
```
/ui-proto framework:"Next.js App Router" package_manager:"npm" ts:true pages:[...] components:[...] theming:"both"
```

### 6) Deliver the hi‑fi UI kit
```
/hifi theme:"dark" brand_color:"#5B8DEF" components:[...]
```

## Folder Structure (generated)

```
projects/{project_name}/
├── app/                      # Next.js application
│   ├── src/app/              # App Router structure
│   └── components/ui/        # shadcn/ui components
├── docs/                     # Design documentation
│   ├── PRD.md
│   ├── wireframes/
│   │   ├── lofi/
│   │   └── midfi/
│   ├── ui-design/
│   └── presentations/
└── marketing/                # (optional) Marketing site
```

## Command Reference

### `/new-project` (Project Manager)
**Purpose:** Create an organized project structure for AI product design workflows.

**Inputs:**
- `project_name` (kebab‑case, e.g., "foto-sage", "chat-assistant")
- `project_type` (default: "ai-product-design")
- `include_marketing` (default: true)

**Output:**
- `projects/{project_name}/` with:
  - `app/` (Next.js + TypeScript + Tailwind + shadcn/ui)
  - `docs/` (PRD, wireframes, UI design docs)
  - `marketing/` (if requested)
- README templates and basic setup files

**Acceptance:**
- Structure follows the established pattern
- Generated app runs with `npm install && npm run dev`
- README includes setup and usage instructions

---

### `/prd` (Product Owner)
**Purpose:** Produce a concise, actionable PRD aligned to measurable success metrics.

**Required Inputs:**
- `product_name`, `target_users`, `key_problem`, `business_goals`, `success_metrics`
- `primary_flows` (list), `constraints`, `assumptions`, `risks`, `stakeholders`, `timeline`

**Output:** `projects/{project_name}/docs/PRD.md`

**Content includes:**
1. Overview: product_name, elevator_pitch, problem_statement
2. Goals and Non‑Goals
3. Target Users and Personas
4. User Stories (INVEST) and Primary Flows
5. Scope (MVP vs. Post‑MVP)
6. Functional Requirements (FR‑001…)
7. Non‑Functional Requirements (NFR‑001…)
8. Acceptance Criteria (Gherkin‑style where useful)
9. Success Metrics (north star + leading indicators)
10. Dependencies and Constraints
11. Assumptions and Open Questions
12. Risks and Mitigations
13. Release Plan and Milestones

**Acceptance:**
- All FRs map to at least one user story and metric
- Each metric has a target, timeframe, and measurement method

---

### `/lofi` (UX Designer)
**Purpose:** Produce mobile/desktop ASCII wireframes with annotations and flow hooks to explore structure and flow quickly without visual polish.

**Required Inputs:**
- `screens` (list of screen names)
- `primary_flows`
- `key_content` (per screen)
- `breakpoints` (default: mobile, desktop)

**Output:** `projects/{project_name}/docs/wireframes/lofi/`
- Files: `<screen>-mobile.txt`, `<screen>-desktop.txt`, `legend.md`

**ASCII Conventions:**
- Containers: `+------+ | content | +------+`
- Images: `[IMG:w×h]`, Avatars: `(O)`, Icon: `[*]`, Button: `[Button: Label]`
- Inputs: `[Input: Placeholder]`, Select: `[Select: Value]`, Checkbox: `[x] Label`
- Sections labeled with `[S1]`, `[S2]` ...; notes as `[A1]`, `[A2]`...

**Acceptance:**
- Every FR in PRD has at least one corresponding screen/section
- Shows empty, loading, and error states for core interactions

---

### `/midfi` (Product Designer)
**Purpose:** Convert lo‑fi to mid‑fi with tokens, components, states, and accessibility notes; generate a unified `ui.html` overview.

**Required Inputs:**
- `screens` (from lo‑fi)
- `states` (default: default/hover/focus/disabled/loading/error/success)
- `content_examples` (short/long)
- `accessibility_targets` (WCAG AA)

**Output:** `projects/{project_name}/docs/wireframes/midfi/`
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

### `/ui-proto` (UI Engineer)
**Purpose:** Implement a runnable prototype (shadcn/ui + Tailwind), keyboard/focus‑accessible, covering primary flows.

**Required Inputs:**
- `framework` (default: Next.js 14+ App Router)
- `package_manager` (npm|pnpm|yarn)
- `ts` (default: true)
- `pages` (list)
- `components` (from mid‑fi)
- `routes/flows`
- `data` (mock or live)
- `theming` (light|dark|both)

**Output:**
- Next.js app (if new), Tailwind configured, shadcn components installed
- Routes/pages per screens, mock data and API stubs
- `projects/{project_name}/app/README-proto.md` (setup, components, routes, gaps)

**Standard Setup Commands:**
```bash
# Create app (if needed)
npx create-next-app@latest projects/{project_name}/app --ts --eslint --src-dir --app --tailwind --no-import-alias

# shadcn/ui
npx shadcn@latest init -y
npx shadcn@latest add button card input label form select dialog sheet toast tabs table navigation-menu dropdown-menu tooltip avatar badge skeleton pagination textarea checkbox radio-switch
```

**Acceptance:**
- `npm run dev` works
- Core flows clickable end‑to‑end with loading/empty/error states
- No TypeScript or ESLint errors; basic responsiveness for mobile and desktop
- Keyboard navigation works for interactive controls; focus outline visible

---

### `/hifi` (UI Designer)
**Purpose:** Deliver a hi‑fi design kit and component gallery ready for engineering handoff.

**Required Inputs:**
- `theme` (light|dark|both, default: dark)
- `brand_color` (hex/HSL)
- `accent_color` (hex/HSL)
- `components` (list, default: shadcn core used in project)
- `app_concept` (optional: for mobile UI design focus)
- `key_features` (optional: for mobile UI design focus)
- `target_users` (optional: for mobile UI design focus)

**Output:** `projects/{project_name}/docs/ui-design/`
- Files: `theme.md`, `color-roles.md`, `component-gallery.html`, `layout-guidelines.md`, `accessibility-checklist.md`, `mobile-ui-design.html` (if mobile focus)

**Design Principles (for mobile UI focus):**
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
- If mobile UI focus: horizontal UI.html with all app screens, following design principles and technical requirements

---

## Conventions

- **Project names:** kebab‑case (e.g., `chat-assistant`)
- **PRDs:** short but complete; each FR maps to at least one user story and metric
- **Accessibility:** include color contrast and keyboard/focus guidance in mid‑fi and hi‑fi
- **Prototypes:** ensure keyboard navigation and visible focus outlines

## Using These Rules in Cursor

1. Keep `.cursorrules .yaml` at the workspace root
2. Start with `/new-project` to establish structure
3. Proceed through the recommended sequence
4. Generate artifacts you can share, review, and iterate quickly

## Contributing

Propose improvements via PRs with clear rationale and acceptance criteria. Keep naming, sequencing, and folder conventions consistent across rules.

