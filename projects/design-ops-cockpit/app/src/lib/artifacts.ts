import { STAGES, type StageId } from "./types";

export type Artifact = {
  title: string;
  path: string;
  files: string[];
  body: string;
};

const ARTIFACTS: Record<StageId, Artifact> = {
  "new-project": {
    title: "Project bootstrap",
    path: "README.md",
    files: ["README.md", "docs/PRD.md (template)", "design/", "vendor/konstrukt-2.0.0/"],
    body: `design_system: konstrukt (v2.0.0)
project_type: ai-product-design
include_marketing: true

Folders created:
  app/  docs/  design/wireframes/{lofi,midfi}/  design/ui-design/  marketing/

Konstrukt build output vendored. Do not hand-type hex.`,
  },
  prd: {
    title: "PRD.md",
    path: "docs/PRD.md",
    files: ["docs/PRD.md"],
    body: `Product: Design Ops Cockpit
North star: stage-gated completion (M-02)

FR-001 Intake brief
FR-002 Launch run
FR-003 Six stages in fixed order
FR-004 View artifact
FR-005 Approve
FR-006 Request revision
FR-007 Lock until approve
FR-008 Home list
FR-009 Complete on stage 6
FR-010 data-mode light|dark
FR-011 Keyboard + visible focus`,
  },
  lofi: {
    title: "ASCII lo-fi",
    path: "design/wireframes/lofi/",
    files: [
      "legend.md",
      "home-mobile.txt",
      "home-desktop.txt",
      "brief-intake-*.txt",
      "run-overview-*.txt",
      "stage-review-*.txt",
      "revision-request-*.txt",
      "run-complete-*.txt",
    ],
    body: `Home → Brief intake → Run overview
         → Stage review → (Approve | Revision)
         → Run complete

Every FR has a screen. Empty / loading / error on core flows.`,
  },
  midfi: {
    title: "Mid-fi kit",
    path: "design/wireframes/midfi/",
    files: ["tokens.md", "components.md", "screens/*.md", "ui.html"],
    body: `Tokens: CSS variables from konstrukt.css (no hex).
Radius 0. Shadow none. One accent. 8 type roles.
ui.html links vendored konstrukt.css + base.css + theme.js.`,
  },
  "ui-proto": {
    title: "Clickable prototype",
    path: "app/",
    files: ["src/app/", "src/lib/store.tsx", "README-proto.md"],
    body: `Next.js App Router. npm install && npm run dev.
Primary flows clickable. Mock runs in localStorage.
Styled with vendored Konstrukt, not shadcn.`,
  },
  hifi: {
    title: "Hi-fi design kit",
    path: "design/ui-design/",
    files: [
      "theme.md",
      "color-roles.md",
      "component-gallery.html",
      "layout-guidelines.md",
      "accessibility-checklist.md",
    ],
    body: `Theme = generated custom properties.
Principles: Swiss / Bauhaus, no gradient, no radius, no shadow.
Gallery renders Button, Input, Select, Checkbox, Card, Tabs, Table, Dialog.`,
  },
};

export function getArtifact(id: StageId): Artifact {
  return ARTIFACTS[id];
}

export function stageMeta(id: StageId) {
  return STAGES.find((s) => s.id === id);
}
