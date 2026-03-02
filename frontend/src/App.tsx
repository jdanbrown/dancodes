import { useCallback, useEffect, useRef } from "react";
import { ChatView } from "./components/ChatView";
import { InputArea } from "./components/InputArea";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { initApp, setSidebarOpen, useStore } from "./lib/store";

export function App() {
  const { sidebarOpen, currentSessionId, currentRepo } = useStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initApp();
    }
  }, []);

  // Swipe gesture for sidebar
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;
      // Only trigger if horizontal swipe is dominant and > 60px
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
      if (dx > 0 && !sidebarOpen) setSidebarOpen(true);
      if (dx < 0 && sidebarOpen) setSidebarOpen(false);
    },
    [sidebarOpen],
  );

  return (
    <div className="app-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TopBar />
      <div className="app-body">
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
        <Sidebar />
        <div className="main">
          <ChatView />
          {(currentSessionId || currentRepo) && <InputArea />}
        </div>
      </div>
    </div>
  );
}
