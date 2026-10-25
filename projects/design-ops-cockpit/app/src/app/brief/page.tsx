"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Shell } from "../../components/Shell";
import { useStore } from "../../lib/store";
import { KEBAB, STAGES } from "../../lib/types";

export default function BriefPage() {
  const router = useRouter();
  const { createRun } = useStore();
  const [projectName, setProjectName] = useState("design-ops-cockpit");
  const [brief, setBrief] = useState("");
  const [nameError, setNameError] = useState("");
  const [briefError, setBriefError] = useState("");
  const [pending, setPending] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextName = projectName.trim();
    const nextBrief = brief.trim();
    let valid = true;
    if (!KEBAB.test(nextName)) {
      setNameError("project_name must be kebab-case.");
      valid = false;
    } else {
      setNameError("");
    }
    if (!nextBrief) {
      setBriefError("Brief cannot be empty.");
      valid = false;
    } else {
      setBriefError("");
    }
    if (!valid) return;
    setPending(true);
    window.setTimeout(() => {
      const run = createRun(nextName, nextBrief);
      router.push(`/runs/${run.id}`);
    }, 240);
  }

  return (
    <Shell trail="New brief">
      <header className="page-header">
        <p className="micro-label">Intake</p>
        <h1>New brief</h1>
        <p className="tagline">
          One designer. One brief. Six gated stages. Konstrukt tokens only.
        </p>
      </header>

      <div className="cockpit-split">
        <form className="module" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="project-name">Project name</label>
            <input
              className="input"
              id="project-name"
              name="projectName"
              value={projectName}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "project-name-error" : "project-name-hint"}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <p className="field-hint" id="project-name-hint">
              kebab-case, e.g. design-ops-cockpit
            </p>
            {nameError ? (
              <p className="field-error" id="project-name-error">
                {nameError}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="brief">Brief</label>
            <textarea
              className="input"
              id="brief"
              name="brief"
              rows={8}
              value={brief}
              aria-invalid={Boolean(briefError)}
              aria-describedby={briefError ? "brief-error" : undefined}
              placeholder="Paste the product brief the agent should follow"
              onChange={(e) => setBrief(e.target.value)}
            />
            {briefError ? (
              <p className="field-error" id="brief-error">
                {briefError}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="design-system">Design system</label>
            <select className="input" id="design-system" defaultValue="konstrukt">
              <option value="konstrukt">konstrukt</option>
            </select>
            <p className="field-hint">Inherited. Do not invent hex.</p>
          </div>
          <button className="btn-primary" type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "Launching…" : "Launch run"}
          </button>
        </form>

        <aside className="module accent-left">
          <div className="module-header">
            <p className="micro-label">Preview</p>
            <h2>Stages that will be created</h2>
          </div>
          <ol className="question-list">
            {STAGES.map((stage, index) => (
              <li key={stage.id}>
                <strong>
                  {index + 1} {stage.name}
                </strong>
                {index === 0 ? " — current" : " — locked"}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Shell>
  );
}
