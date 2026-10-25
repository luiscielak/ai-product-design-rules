"use client";

import Link from "next/link";
import { Badge, Shell } from "../components/Shell";
import { useStore } from "../lib/store";
import { STAGES } from "../lib/types";

export default function HomePage() {
  const { runs, ready, loadError, retry } = useStore();

  return (
    <Shell>
      <header className="page-header">
        <p className="micro-label">Single operator · Luis</p>
        <h1>Runs</h1>
        <p className="tagline">
          Review artifacts the agent wrote. Approve a stage before the next one
          starts.
        </p>
      </header>

      {!ready ? (
        <div className="module" aria-busy="true">
          <p className="meta">Fetching runs…</p>
        </div>
      ) : loadError ? (
        <div className="alert alert-danger">
          <strong>{loadError}</strong>
          <div>
            <button className="portal-quiet-btn" type="button" onClick={retry}>
              Retry
            </button>
          </div>
        </div>
      ) : runs.length === 0 ? (
        <div className="module accent-left">
          <p>You have no design runs. Start from a product brief.</p>
          <p>
            <Link className="btn-primary" href="/brief">
              New brief
            </Link>
          </p>
        </div>
      ) : (
        <div className="table-scroll" tabIndex={0}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Current stage</th>
                <th>Revisions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => {
                const current =
                  run.stages.find((s) => s.status === "current") ??
                  run.stages[run.stages.length - 1];
                const revs = run.stages.reduce((sum, s) => sum + s.revisions, 0);
                const href =
                  run.status === "complete"
                    ? `/runs/${run.id}/complete`
                    : `/runs/${run.id}`;
                const label = STAGES.find((s) => s.id === current.id)?.name;
                return (
                  <tr key={run.id}>
                    <td>{run.projectName}</td>
                    <td>
                      <Badge status={run.status} />
                    </td>
                    <td>{label}</td>
                    <td>{revs}</td>
                    <td>
                      <Link href={href}>Open</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
