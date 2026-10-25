"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Shell } from "../../../../../../components/Shell";
import { stageMeta } from "../../../../../../lib/artifacts";
import { useRun, useStore } from "../../../../../../lib/store";
import { type StageId } from "../../../../../../lib/types";

export default function RevisionPage() {
  const params = useParams<{ id: string; stage: string }>();
  const router = useRouter();
  const { run, ready } = useRun(params.id);
  const { requestRevision } = useStore();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const stageId = params.stage as StageId;
  const meta = stageMeta(stageId);
  const stage = run?.stages.find((s) => s.id === stageId);

  if (!ready || !run || !meta || !stage) {
    return (
      <Shell>
        <div className="module" aria-busy="true">
          <p className="meta">Loading…</p>
        </div>
      </Shell>
    );
  }

  const runId = run.id;
  const currentRevisions = stage.revisions;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!note.trim()) {
      setError("A revision note is required.");
      return;
    }
    setPending(true);
    window.setTimeout(() => {
      requestRevision(runId, stageId, note.trim());
      router.push(`/runs/${runId}/stages/${stageId}`);
    }, 200);
  }

  return (
    <Shell trail={`${run.projectName} / ${meta.name} / revision`}>
      <header className="page-header">
        <p className="micro-label">Request revision</p>
        <h1>{meta.name}</h1>
        <p className="tagline">
          The stage stays current. The next stage stays locked. MVP does not spawn
          the agent.
        </p>
      </header>

      <div className="cockpit-split">
        <form className="module" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="note">What should change</label>
            <textarea
              className="input"
              id="note"
              rows={8}
              value={note}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "note-error" : undefined}
              placeholder="Tell the agent what to fix before you review again"
              onChange={(e) => setNote(e.target.value)}
            />
            {error ? (
              <p className="field-error" id="note-error">
                {error}
              </p>
            ) : null}
          </div>
          <button className="btn-primary" type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "Saving note…" : "Send revision"}
          </button>{" "}
          <Link className="portal-quiet-btn" href={`/runs/${run.id}/stages/${stageId}`}>
            Cancel
          </Link>
        </form>
        <aside className="module accent-left">
          <div className="module-header">
            <p className="micro-label">This will</p>
            <h2>Keep the gate</h2>
          </div>
          <ul className="question-list">
            <li>Keep {meta.name} current</li>
            <li>Increment revision count (now {currentRevisions})</li>
            <li>Leave the next stage locked</li>
            <li>Not spawn the agent (MVP)</li>
          </ul>
        </aside>
      </div>
    </Shell>
  );
}
