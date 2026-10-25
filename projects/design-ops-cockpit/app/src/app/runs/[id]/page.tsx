"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Shell } from "../../../components/Shell";
import { useRun } from "../../../lib/store";
import { STAGES } from "../../../lib/types";

export default function RunOverviewPage() {
  const params = useParams<{ id: string }>();
  const { run, ready, loadError } = useRun(params.id);

  if (!ready) {
    return (
      <Shell>
        <div className="module" aria-busy="true">
          <p className="meta">Fetching run…</p>
        </div>
      </Shell>
    );
  }

  if (loadError || !run) {
    return (
      <Shell>
        <div className="alert alert-danger">
          <strong>{loadError ?? "This run id is not in local state."}</strong>
        </div>
      </Shell>
    );
  }

  if (run.status === "complete") {
    return (
      <Shell trail={run.projectName}>
        <div className="alert alert-success">
          <strong>All six stages are approved.</strong>{" "}
          <Link href={`/runs/${run.id}/complete`}>Open the summary</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell trail={run.projectName}>
      <header className="page-header">
        <p className="micro-label">{run.projectName}</p>
        <h1>Run overview</h1>
        <p className="tagline">{run.brief}</p>
        <div className="meta-row">
          <span>
            Status <strong><Badge status={run.status} /></strong>
          </span>
          <span>
            Design system <strong>{run.designSystem}</strong>
          </span>
        </div>
      </header>

      <div className="step-track" aria-hidden="true">
        {run.stages.map((stage) => (
          <i
            key={stage.id}
            className={
              stage.status === "approved"
                ? "done"
                : stage.status === "current"
                  ? "now"
                  : ""
            }
          />
        ))}
      </div>

      <div className="table-scroll" tabIndex={0}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Revisions</th>
              <th>Artifact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {run.stages.map((stage, index) => {
              const meta = STAGES[index];
              const href = `/runs/${run.id}/stages/${stage.id}`;
              return (
                <tr key={stage.id}>
                  <td>{index + 1}</td>
                  <td>{meta.name}</td>
                  <td>
                    <Badge status={stage.status} />
                  </td>
                  <td>{stage.revisions}</td>
                  <td className="mono">{stage.status === "locked" ? "—" : meta.path}</td>
                  <td>
                    {stage.status === "current" ? (
                      <Link href={href}>Review</Link>
                    ) : stage.status === "approved" ? (
                      <Link href={href}>View</Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
