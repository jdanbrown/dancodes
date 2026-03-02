import { setSidebarOpen, startNewSession, useStore } from "../lib/store";

export function TopBar() {
  const { version, sidebarOpen, currentRepo } = useStore();

  return (
    <div className="top-bar">
      <button className="top-bar-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle sidebar">
        &#9776;
      </button>
      <span className="top-bar-title">dancodes</span>
      <span className="top-bar-spacer" />
      {version && <span className="top-bar-version">{version}</span>}
      <a className="top-bar-link" href="/foo" target="_blank" rel="noreferrer" title="Open opencode web UI">
        oc&nbsp;web&nbsp;&#8599;
      </a>
      {currentRepo && (
        <button className="top-bar-btn" onClick={() => startNewSession()} title="New session">
          +
        </button>
      )}
    </div>
  );
}
