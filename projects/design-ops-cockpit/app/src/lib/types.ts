export const STAGES = [
  { id: "new-project", name: "New project", path: "README.md" },
  { id: "prd", name: "PRD", path: "docs/PRD.md" },
  { id: "lofi", name: "Lo-fi", path: "design/wireframes/lofi/" },
  { id: "midfi", name: "Mid-fi", path: "design/wireframes/midfi/" },
  { id: "ui-proto", name: "UI prototype", path: "app/" },
  { id: "hifi", name: "Hi-fi", path: "design/ui-design/" },
] as const;

export type StageId = (typeof STAGES)[number]["id"];
export type StageStatus = "locked" | "current" | "approved";
export type RunStatus = "in-progress" | "complete";

export type StageState = {
  id: StageId;
  status: StageStatus;
  revisions: number;
  lastNote?: string;
};

export type Run = {
  id: string;
  projectName: string;
  brief: string;
  designSystem: "konstrukt";
  createdAt: string;
  updatedAt: string;
  status: RunStatus;
  stages: StageState[];
};

export const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
