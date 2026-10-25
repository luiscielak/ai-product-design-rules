"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STAGES, type Run, type StageId, type StageState } from "./types";

const KEY = "design-ops-cockpit-runs";

function freshStages(): StageState[] {
  return STAGES.map((stage, index) => ({
    id: stage.id,
    status: index === 0 ? "current" : "locked",
    revisions: 0,
  }));
}

function seedRuns(): Run[] {
  const now = new Date().toISOString();
  const progressing: Run = {
    id: "run-design-ops-cockpit",
    projectName: "design-ops-cockpit",
    brief:
      "Design Ops Cockpit: a web app where a designer intakes a product brief, launches a design run, and steps through six stages (new project, PRD, lo-fi, mid-fi, UI prototype, hi-fi), reviewing each stage's generated artifact and choosing approve or request revision before the next stage starts. Single user (Luis) for now; artifacts are files written by an AI agent following a rules repo.",
    designSystem: "konstrukt",
    createdAt: now,
    updatedAt: now,
    status: "in-progress",
    stages: STAGES.map((stage, index) => {
      if (index < 3) {
        return {
          id: stage.id,
          status: "approved" as const,
          revisions: stage.id === "lofi" ? 1 : 0,
          lastNote:
            stage.id === "lofi"
              ? "Tighten empty-state copy on Home."
              : undefined,
        };
      }
      if (index === 3) {
        return { id: stage.id, status: "current" as const, revisions: 0 };
      }
      return { id: stage.id, status: "locked" as const, revisions: 0 };
    }),
  };
  const complete: Run = {
    id: "run-foto-sage",
    projectName: "foto-sage",
    brief: "Archived example run used to populate the home list.",
    designSystem: "konstrukt",
    createdAt: now,
    updatedAt: now,
    status: "complete",
    stages: STAGES.map((stage) => ({
      id: stage.id,
      status: "approved",
      revisions: 0,
    })),
  };
  return [progressing, complete];
}

type Store = {
  runs: Run[];
  ready: boolean;
  loadError: string | null;
  retry: () => void;
  createRun: (projectName: string, brief: string) => Run;
  approve: (runId: string, stageId: StageId) => Run;
  requestRevision: (runId: string, stageId: StageId, note: string) => Run;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hydrate = useCallback(() => {
    setLoadError(null);
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        setRuns(JSON.parse(raw) as Run[]);
      } else {
        const seeded = seedRuns();
        window.localStorage.setItem(KEY, JSON.stringify(seeded));
        setRuns(seeded);
      }
      setReady(true);
    } catch {
      setLoadError("Could not read local runs.");
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(hydrate, 280);
    return () => window.clearTimeout(timer);
  }, [hydrate]);

  const persist = useCallback((next: Run[]) => {
    setRuns(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const createRun = useCallback(
    (projectName: string, brief: string) => {
      const now = new Date().toISOString();
      const run: Run = {
        id: `run-${projectName}-${Date.now()}`,
        projectName,
        brief,
        designSystem: "konstrukt",
        createdAt: now,
        updatedAt: now,
        status: "in-progress",
        stages: freshStages(),
      };
      persist([run, ...runs]);
      return run;
    },
    [persist, runs],
  );

  const approve = useCallback(
    (runId: string, stageId: StageId) => {
      const next = runs.map((run) => {
        if (run.id !== runId) return run;
        const index = run.stages.findIndex((s) => s.id === stageId);
        const stages = run.stages.map((stage, i) => {
          if (i === index) return { ...stage, status: "approved" as const };
          if (i === index + 1 && stage.status === "locked") {
            return { ...stage, status: "current" as const };
          }
          return stage;
        });
        const done = stages.every((s) => s.status === "approved");
        const status: Run["status"] = done ? "complete" : "in-progress";
        return {
          ...run,
          stages,
          status,
          updatedAt: new Date().toISOString(),
        };
      });
      persist(next);
      return next.find((r) => r.id === runId)!;
    },
    [persist, runs],
  );

  const requestRevision = useCallback(
    (runId: string, stageId: StageId, note: string) => {
      const next = runs.map((run) => {
        if (run.id !== runId) return run;
        return {
          ...run,
          updatedAt: new Date().toISOString(),
          stages: run.stages.map((stage) =>
            stage.id === stageId
              ? {
                  ...stage,
                  status: "current" as const,
                  revisions: stage.revisions + 1,
                  lastNote: note,
                }
              : stage,
          ),
        };
      });
      persist(next);
      return next.find((r) => r.id === runId)!;
    },
    [persist, runs],
  );

  const value = useMemo(
    () => ({
      runs,
      ready,
      loadError,
      retry: hydrate,
      createRun,
      approve,
      requestRevision,
    }),
    [approve, createRun, hydrate, loadError, ready, requestRevision, runs],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useRun(id: string) {
  const { runs, ready, loadError } = useStore();
  return { run: runs.find((r) => r.id === id), ready, loadError };
}
