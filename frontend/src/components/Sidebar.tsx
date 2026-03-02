import { useEffect, useRef, useState } from "react";
import {
  cloneAndSelectRepo,
  loadRepoPickerData,
  selectRepo,
  selectSession,
  sortedSessions,
  timeAgo,
  useStore,
} from "../lib/store";
import type { Repo } from "../lib/types";

export function Sidebar() {
  const { sidebarOpen, currentRepo, sessions, currentSessionId, generating } = useStore();

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">dancodes</span>
      </div>
      <RepoPicker />
      <SessionList
        sessions={sessions}
        currentSessionId={currentSessionId}
        generating={generating}
        currentRepo={currentRepo}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Repo picker
// ---------------------------------------------------------------------------

function RepoPicker() {
  const { currentRepo, clonedRepos, githubRepos } = useStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      loadRepoPickerData();
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const clonedNames = clonedRepos.map((r) => r.name);
  let repos = githubRepos.map((r) => ({
    ...r,
    cloned: clonedNames.includes(r.full_name),
  }));
  if (query) {
    const q = query.toLowerCase();
    repos = repos.filter(
      (r) => r.full_name.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q),
    );
  }

  function pick(fullName: string) {
    setOpen(false);
    const existing = clonedRepos.find((r) => r.name === fullName);
    if (existing) {
      selectRepo(existing);
    } else {
      cloneAndSelectRepo(fullName);
    }
  }

  const label = currentRepo ? currentRepo.name.split("/").pop() : "Select repo...";

  return (
    <div className="repo-picker">
      <button className="repo-picker-btn" onClick={() => setOpen(!open)}>
        {label}
      </button>
      {open && (
        <div className="repo-picker-dropdown">
          <input
            ref={searchRef}
            className="picker-search"
            placeholder="Search repos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="picker-list">
            {repos.length === 0 && (
              <div className="picker-empty">{githubRepos.length === 0 && !query ? "Loading..." : "No repos found"}</div>
            )}
            {repos.map((r) => (
              <div
                key={r.full_name}
                className={`picker-item ${currentRepo?.name === r.full_name ? "active" : ""}`}
                onClick={() => pick(r.full_name)}
              >
                <span className="picker-item-name">{r.full_name.split("/").pop()}</span>
                {r.cloned && <span className="badge cloned">cloned</span>}
                {r.private && <span className="badge private">private</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Session list
// ---------------------------------------------------------------------------

function SessionList(props: {
  sessions: import("../lib/types").Session[];
  currentSessionId: string | null;
  generating: Record<string, boolean>;
  currentRepo: Repo | null;
}) {
  const { currentSessionId, generating, currentRepo } = props;
  const sorted = sortedSessions();

  if (!currentRepo) {
    return <div className="sidebar-empty">Select a repo to see sessions</div>;
  }
  if (sorted.length === 0) {
    return <div className="sidebar-empty">No sessions yet</div>;
  }

  return (
    <div className="session-list">
      {sorted.map((s) => {
        const title = s.title || s.id?.slice(0, 14) || "untitled";
        const updated = s.time_updated ?? s.timeUpdated ?? 0;
        const ago = updated ? timeAgo(updated) : "";
        const active = s.id === currentSessionId;
        const busy = generating[s.id];

        return (
          <div key={s.id} className={`session-item ${active ? "active" : ""}`} onClick={() => selectSession(s.id)}>
            <div className="session-info">
              <div className="session-title">
                {busy && <span className="spinner" />}
                {title}
              </div>
              {ago && <div className="session-time">{ago}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
