"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Shell } from "../../../../../components/Shell";
import { getArtifact, stageMeta } from "../../../../../lib/artifacts";
import { useRun, useStore } from "../../../../../lib/store";
import { STAGES, type StageId } from "../../../../../lib/types";

export default function StageReviewPage() {
  const params = useParams<{ id: string; stage: string }>();
  const router = useRouter();
  const { run, ready } = useRun(params.id);
  const { approve } = useStore();
  const [pending, setPending] = useState(false);
  const stageId = params.stage as StageId;
  const meta = stageMeta(stageId);
  const artifact = meta ? getArtifact(stageId) : null;
  const stage = run?.stages.find((s) => s.id === stageId);

  if (!ready) {
    return (
      <Shell>
        <div className="module" aria-busy="true">
          <p className="meta">Reading artifact…</p>
        </div>
      </Shell>
    );
  }

  if (!run || !meta || !artifact || !stage) {
    return (
      <Shell>
        <div className="alert alert-danger">
          <strong>Could not load this stage.</strong>
        </div>
      </Shell>
    );
  }

  if (stage.status === "locked") {
    return (
      <Shell trail={run.projectName}>
        <div className="alert alert-warning">
          <strong>This stage is locked.</strong> Approve the current stage first.
        </div>
        <p>
          <Link href={`/runs/${run.id}`}>Back to overview</Link>
        </p>
      </Shell>
    );
  }

  const index = STAGES.findIndex((s) => s.id === stageId);
  const readOnly = stage.status === "approved";
  const runId = run.id;

  function onApprove() {
    setPending(true);
    window.setTimeout(() => {
      const next = approve(runId, stageId);
      if (next.status === "complete") {
        router.push(`/runs/${runId}/complete`);
      } else {
        router.push(`/runs/${runId}`);
      }
    }, 200);
  }

  return (
    <Shell trail={`${run.projectName} / ${index + 1} ${meta.name}`}>
      <header className="page-header">
        <p className="micro-label">
          Stage {index + 1} of 6 · <Badge status={stage.status} />
        </p>
        <h1>{meta.name}</h1>
        <p className="tagline mono">{artifact.path}</p>
      </header>

      <div className="cockpit-split">
        <section className="module">
          <div className="module-header">
            <p className="micro-label">Artifact</p>
            <h2>{artifact.title}</h2>
          </div>
          <p className="meta">{artifact.files.join(" · ")}</p>
          <pre className="artifact-pre">{artifact.body}</pre>
        </section>

        <aside className="module accent-left">
          <div className="module-header">
            <p className="micro-label">Decision</p>
            <h2>{readOnly ? "Approved" : "Review"}</h2>
          </div>
          {stage.lastNote ? (
            <div className="alert alert-warning">
              <strong>Revision r{stage.revisions}.</strong> {stage.lastNote}
            </div>
          ) : null}
          {readOnly ? (
            <p className="meta">Decision row hidden. This stage is already approved.</p>
          ) : (
            <div className="decision-bar">
              <button
                className="btn-primary"
                type="button"
                disabled={pending}
                aria-busy={pending}
                onClick={onApprove}
              >
                {pending ? "Approving…" : "Approve"}
              </button>
              <Link
                className="portal-quiet-btn"
                href={`/runs/${run.id}/stages/${stageId}/revision`}
              >
                Request revision
              </Link>
            </div>
          )}
          <p>
            <Link href={`/runs/${run.id}`}>Back to overview</Link>
          </p>
        </aside>
      </div>
    </Shell>
  );
}
