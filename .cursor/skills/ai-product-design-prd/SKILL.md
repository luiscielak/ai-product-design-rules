---
name: ai-product-design-prd
description: Produces a concise, actionable PRD with measurable success metrics and INVEST user stories. Use when the user says /prd, wants to write a product requirements document, define product scope, or draft requirements for a new product.
---

# PRD (Product Owner)

Produce a concise, actionable PRD aligned to measurable success metrics.

## Pipeline

Stage in the `ai-product-design` chain:
`scaffold → /prd → /lofi → /midfi → /hifi → /ui-proto`.

- Previous: scaffold (ai-product-design-new-project)
- Next: `/lofi` (ai-product-design-lofi)

To run the whole chain in one pass, use the `ai-product-design-workflow`
orchestrator.

## Inputs

Required: `product_name`, `target_users`, `key_problem`, `business_goals`, `success_metrics`, `primary_flows` (list).  
Also: `constraints`, `assumptions`, `risks`, `stakeholders`, `timeline`.

## Artifact root

All deliverables for this product go under a single **`artifact_root`**:

1. **Definition:** `artifact_root` is the directory that contains this product’s `PRD.md` and/or `DESIGN-BRIEF.md` (same folder is ideal). If files are split, prefer the folder the user attached or the one containing `PRD.md`.
2. **Resolve in order:** (a) Parent directory of an attached or @-referenced `PRD.md` / `DESIGN-BRIEF.md`; (b) explicit path the user gives for the product docs folder; (c) **greenfield only** (`/new-project` or PRD with no path): `projects/{project_name}/docs/`.
3. **Do not** default to repo-global `docs/wireframes/`, `docs/ui-design/`, or root `docs/PRD.md` when `artifact_root` is known.

## Output

**File:** `{artifact_root}/PRD.md` — for greenfield with no path yet, use `projects/{project_name}/docs/PRD.md` as `artifact_root`.

## PRD Content Structure

1. **Overview** — product_name, elevator_pitch, problem_statement
2. **Goals and Non-Goals**
3. **Target Users and Personas**
4. **User Stories (INVEST)** and Primary Flows
5. **Scope** — MVP vs Post-MVP
6. **Functional Requirements** — FR-001, FR-002… (each maps to a user story and metric)
7. **Non-Functional Requirements** — NFR-001…
8. **Acceptance Criteria** — Gherkin-style where useful
9. **Success Metrics** — north star + leading indicators (target, timeframe, measurement method each)
10. **Dependencies and Constraints**
11. **Assumptions and Open Questions**
12. **Risks and Mitigations**
13. **Release Plan and Milestones**

## Acceptance

- [ ] Every FR maps to at least one user story and one metric
- [ ] Each metric has: target, timeframe, measurement method
- [ ] `PRD.md` is written under `artifact_root`; short but complete; naming and structure consistent

## Conventions

- PRDs: short but complete; each FR maps to at least one user story and metric.
