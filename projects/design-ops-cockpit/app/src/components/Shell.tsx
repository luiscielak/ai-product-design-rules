import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export function Shell({
  children,
  trail,
}: {
  children: React.ReactNode;
  trail?: string;
}) {
  return (
    <>
      <nav className="site-nav" aria-label="Cockpit">
        <Link className="nav-brand" href="/">
          Design Ops Cockpit
        </Link>
        <ul className="nav-links">
          {trail ? (
            <li>
              <span className="meta">{trail}</span>
            </li>
          ) : null}
          <li>
            <Link href="/brief">New brief</Link>
          </li>
          <li>
            <ModeToggle />
          </li>
          <li>
            <span className="meta" aria-label="Signed in as Luis">
              Luis
            </span>
          </li>
        </ul>
      </nav>
      <main className="page">{children}</main>
    </>
  );
}

export function Badge({
  status,
}: {
  status: "locked" | "current" | "approved" | "in-progress" | "complete";
}) {
  const map = {
    locked: { className: "badge badge-draft", label: "locked" },
    current: { className: "badge badge-review", label: "current" },
    approved: { className: "badge badge-complete", label: "approved" },
    "in-progress": { className: "badge badge-in-progress", label: "in progress" },
    complete: { className: "badge badge-complete", label: "complete" },
  } as const;
  const item = map[status];
  return <span className={item.className}>{item.label}</span>;
}
