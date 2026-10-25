# PRD: Design Ops Cockpit

**Product:** Design Ops Cockpit
**Author role:** Product Owner (`/prd`)
**Date:** 2026-10-25
**design_system:** `konstrukt` (inherited from `/new-project`)
**Status:** MVP

## 1. Overview

- **product_name:** Design Ops Cockpit
- **elevator_pitch:** A web app where a designer pastes a product brief, launches a design run, and walks six pipeline stages — new project, PRD, lo-fi, mid-fi, UI prototype, hi-fi — reviewing each artifact the agent wrote and choosing approve or request revision before the next stage starts.
- **problem_statement:** Luis has a reusable Cursor rules repo that claims to take a brief to a clickable prototype. Those rules are about to be wired into a cockpit UI. Without a reviewable, stage-gated run on a real brief, it is unclear whether the rules produce usable artifacts or generic filler — and there is no place to approve or send a stage back.

## 2. Goals and Non-Goals

### Goals

- Let one designer (Luis) intake a brief and start a design run in under two minutes.
- Mirror the six commands in the rules repo as explicit, ordered stages.
- Show the artifact each stage produced (files written by an AI agent following the rules).
- Block the next stage until the current stage is approved, or stay on the stage when revision is requested.
- Make the run state obvious: which stage is current, which are approved, which are waiting on a revision.

### Non-Goals

- Multi-user accounts, roles, or comments.
- Running the agent from this UI (the cockpit reviews files; it does not spawn Cursor).
- Editing artifacts in place (approve / revise only).
- Figma export, billing, analytics productization, or a public gallery.
- Changing the `hooman-loop` Design Ops app — this PRD is the rules-repo proof, not that product's source.

## 3. Target Users and Personas

**Primary (only MVP user): Luis — solo product designer / rules author**

- Runs AI design pipelines in Cursor.
- Needs to see whether `/prd` → `/hifi` output is good enough to trust in a future cockpit.
- Cares about contrast, type hierarchy, and whether Konstrukt actually landed (square, flat, one accent) vs a generic shadcn look.

No secondary persona in MVP.

## 4. User Stories (INVEST) and Primary Flows

| ID | Story | Maps to |
| --- | --- | --- |
| US-01 | As Luis, I can paste a product brief and a kebab-case project name so a new design run exists. | FR-001, FR-002, M-01 |
| US-02 | As Luis, I can see the six stages of a run and which one is current so I know where I am. | FR-003, FR-008, M-02 |
| US-03 | As Luis, I can open a stage and read its generated artifact so I can judge quality. | FR-004, M-03 |
| US-04 | As Luis, I can approve a stage so the next stage becomes available. | FR-005, FR-007, M-02 |
| US-05 | As Luis, I can request a revision with a note so the same stage stays current and the note is visible. | FR-006, FR-007, M-04 |
| US-06 | As Luis, I can finish the sixth approved stage and see a completed run summary. | FR-003, FR-009, M-02 |
| US-07 | As Luis, I can switch light and dark mode so I can review Konstrukt in both `data-mode`s. | FR-010, NFR-002 |
| US-08 | As Luis, I can use the keyboard to move through intake and review so the cockpit is usable without a mouse. | NFR-003, FR-011 |

### Primary flows

1. **Start a run:** Home (empty or list) → Brief intake → submit → Run overview (stage 1 current).
2. **Review and approve:** Run overview → Stage review → Approve → Run overview (next stage current).
3. **Request revision:** Stage review → Request revision → note → same stage remains current with the note shown.
4. **Complete a run:** Approve stage 6 → Run complete.

## 5. Scope

### MVP

- Single user, no login.
- One or more design runs stored as mock / local state (files conceptually; local fixtures in the prototype).
- Six stages, fixed order, names matching the rules commands.
- Artifact viewer (markdown / HTML / file list as appropriate for the stage).
- Approve and request-revision actions with a revision note.
- Empty, loading, and error states on intake and review.
- Light and dark via Konstrukt `data-mode`.

### Post-MVP

- Trigger a real agent from the cockpit.
- Persist runs to a backend or git.
- Diff between revision N and N+1.
- Multi-user review.
- Hook into `apps/design-ops` in hooman-loop.

## 6. Functional Requirements

| ID | Requirement | Stories | Metric |
| --- | --- | --- | --- |
| FR-001 | Brief intake captures `project_name` (kebab-case) and a free-text brief. Validation errors if name is missing or not kebab-case, or brief is empty. | US-01 | M-01 |
| FR-002 | Submitting a valid brief creates a design run with six stages; stage 1 is `current`, others `locked`. | US-01 | M-01 |
| FR-003 | Stages are exactly: New project, PRD, Lo-fi, Mid-fi, UI prototype, Hi-fi — in that order. | US-02, US-06 | M-02 |
| FR-004 | A current or approved stage opens a review surface showing the generated artifact (or an empty/error state if the file is missing). | US-03 | M-03 |
| FR-005 | Approve marks the stage `approved` and unlocks the next stage as `current`. | US-04 | M-02 |
| FR-006 | Request revision keeps the stage `current`, records a required note, and increments a revision count. | US-05 | M-04 |
| FR-007 | A locked stage cannot be opened for decisioning; only current (and previously approved, read-only) stages are reachable. | US-04, US-05 | M-02 |
| FR-008 | Home lists existing runs with status (in progress / complete) and last updated stage. Empty state when none exist. | US-02 | M-02 |
| FR-009 | Approving the sixth stage marks the run complete and shows a summary of all artifacts. | US-06 | M-02 |
| FR-010 | User can toggle `data-mode` between `light` and `dark`. Preference persists for the session (and via `HLTheme` localStorage when present). | US-07 | NFR-002 |
| FR-011 | Core forms and decision buttons expose labels, errors, and a visible focus ring (`--focus`). | US-08 | NFR-003 |

## 7. Non-Functional Requirements

| ID | Requirement |
| --- | --- |
| NFR-001 | Prototype starts with `npm install && npm run dev` from `app/`. |
| NFR-002 | Visual language is Konstrukt v2.0.0: square corners, no shadows, no gradients, atelier palette, tokens from generated CSS only. |
| NFR-003 | WCAG 2.2 AA for text and controls. Keyboard operable. Focus visible. |
| NFR-004 | First contentful review screen usable on a 375px phone and a 1280px desktop. |
| NFR-005 | No network dependency after `npm install` for mock data. |
| NFR-006 | No TypeScript or ESLint errors on the prototype. |

## 8. Acceptance Criteria

```
Feature: Intake a brief
  Given I am on the brief intake screen
  When I submit without a project name or with "Design Ops"
  Then I see a validation error and no run is created
  When I submit project_name "design-ops-cockpit" and a non-empty brief
  Then I land on the run overview with stage 1 current
```

```
Feature: Approve a stage
  Given a run with Mid-fi current
  When I open Mid-fi and choose Approve
  Then Mid-fi is approved and UI prototype is current
  And Hi-fi remains locked
```

```
Feature: Request revision
  Given a run with PRD current
  When I choose Request revision and leave the note empty
  Then I see a validation error
  When I submit a note
  Then PRD stays current, the note is visible, and Lo-fi stays locked
```

```
Feature: Complete a run
  Given Hi-fi is current
  When I approve it
  Then the run is complete and I see the run-complete summary
```

## 9. Success Metrics

**North star (M-02): Stage-gated completion**

- **Definition:** Share of started runs that reach all six approvals without skipping a lock.
- **Baseline:** 0 (no cockpit).
- **Target:** 100% of dogfood runs in the first week cannot skip a stage.
- **Timeframe:** first 7 dogfood days.
- **Method:** count `approved` transitions in run state; a locked-stage open is a failure.

**Leading indicators**

| ID | Metric | Target | Timeframe | Method |
| --- | --- | --- | --- | --- |
| M-01 | Time from Home → valid brief submitted | < 2 minutes | first 5 runs | wall clock / self-report |
| M-03 | Artifact visible on stage review without a blank main pane | ≥ 95% of stage opens | first 5 runs | empty-state vs artifact-state |
| M-04 | Revision note recorded when revision is requested | 100% | first 5 runs | revision events with non-empty note |

## 10. Dependencies and Constraints

- Rules repo (`.cursorrules .yaml`) defines stage names, artifact paths, and `design_system`.
- Konstrukt v2.0.0 generated files must be vendored; package is `private` on npm.
- Artifacts are files, not API objects.
- Do not modify `luiscielak/hooman-loop`.
- Single operator; no auth provider.

## 11. Assumptions and Open Questions

### Assumptions

- The agent has already written (or will write) files under `projects/{name}/` as the rules specify.
- Path of record for this run is the **rules file** (`design/wireframes/…`), not the README (`docs/wireframes/…`).
- `/ui-proto` can proceed without `/hifi` if the operator asked for that order (README allows it; the rules file lists hi-fi as a prerequisite).
- Marketing waitlist is out of the product's primary flows.

### Open questions

- Should revision re-run the agent automatically, or only store the note?
- Which artifact is canonical when README and rules disagree on folder names?
- Is stage 1 ("new project") reviewable as a folder tree, or just a README?

## 12. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Rules produce generic or contradictory artifacts | Cockpit reviews noise | RUN-NOTES.md captures per-stage verdicts and rule fixes |
| Agent paints shadcn chrome despite `konstrukt` | Brand miss | Vendor generated CSS; ban radius/shadow/gradient utilities |
| Path mismatch (`docs/` vs `design/`) | Reviewer cannot find files | Cockpit shows the path the rules named; RUN-NOTES flags the conflict |
| No real agent in the prototype | Demo feels fake | Seed one realistic run (this project) as mock data |

## 13. Release Plan and Milestones

1. **M0 — Rules parameter:** `design_system` in `.cursorrules .yaml` (this PR).
2. **M1 — Paper pipeline:** PRD, lo-fi, mid-fi, hi-fi artifacts for this brief.
3. **M2 — Clickable prototype:** `app/` with the four primary flows, mock run seeded.
4. **M3 — Evaluate:** `RUN-NOTES.md` with per-stage verdicts before wiring hooman-loop.

No calendar dates. Sequence is the plan.
