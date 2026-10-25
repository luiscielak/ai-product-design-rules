"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Shell } from "../../../../components/Shell";
import { useRun } from "../../../../lib/store";
import { STAGES } from "../../../../lib/types";

export default function RunCompletePage() {
  const params = useParams<{ id: string }>();
  const { run, ready } = useRun(params.id);

  if (!ready || !run) {
    return (
      <Shell>
        <div className="module" aria-busy="true">
          <p className="meta">{ready ? "Run not found." : "Loading summary…"}</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell trail={`${run.projectName} · complete`}>
      <header className="page-header">
        <p className="micro-label">{run.projectName}</p>
        <h1>Run complete</h1>
        <p className="tagline">All six stages approved. Artifacts stay readable.</p>
        <Badge status="complete" />
      </header>

      <div className="step-track" aria-hidden="true">
        {run.stages.map((stage) => (
          <i key={stage.id} className="done" />
        ))}
      </div>

      <div className="table-scroll" tabIndex={0}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Stage</th>
              <th>Artifact</th>
              <th>Revisions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {run.stages.map((stage, index) => (
              <tr key={stage.id}>
                <td>{STAGES[index].name}</td>
                <td className="mono">{STAGES[index].path}</td>
                <td>{stage.revisions}</td>
                <td>
                  <Link href={`/runs/${run.id}/stages/${stage.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        <Link className="portal-quiet-btn" href="/">
          Back to runs
        </Link>
      </p>
    </Shell>
  );
}
